from fastapi import HTTPException, Depends, APIRouter, Request
from sqlalchemy.orm import Session
from db.database import get_db
from models.workflow import Workflow
from schemas.workflow import WorkflowResponse
from executor.executor import execute_workflow
from datetime import datetime
from typing import Optional

router = APIRouter(tags=["Webhook"])


@router.api_route("/webhook/{webhook_path}", methods=["GET", "POST"])
async def webhook_handler_by_path(
    webhook_path: str,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    n8n-style webhook handler that triggers workflows by their unique webhook path.
    Accepts both GET and POST requests, passing request data to the workflow.
    """
    # Find workflow by webhook path
    workflow_data = db.query(Workflow).filter(Workflow.webhook_path == webhook_path).first()
    if not workflow_data:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    if not workflow_data.enabled:
        raise HTTPException(status_code=400, detail="Workflow is disabled")
    
    return await _execute_webhook(workflow_data, request, db)


@router.api_route("/webhook/handler/{workflow_id}", methods=["GET", "POST"])
async def webhook_handler_by_id(
    workflow_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Legacy webhook handler that triggers workflows by their ID.
    Kept for backwards compatibility.
    """
    workflow_data = db.query(Workflow).filter(Workflow.id == workflow_id).first()
    if not workflow_data:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    return await _execute_webhook(workflow_data, request, db)


@router.post("/webhook/test/{workflow_id}")
async def test_webhook(
    workflow_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Test mode for workflow execution - used by frontend to test workflows
    without needing the actual webhook URL.
    """
    workflow_data = db.query(Workflow).filter(Workflow.id == workflow_id).first()
    if not workflow_data:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    return await _execute_webhook(workflow_data, request, db, test_mode=True)


async def _execute_webhook(
    workflow_data: Workflow,
    request: Request,
    db: Session,
    test_mode: bool = False
):
    """
    Internal function to execute a workflow via webhook.
    Passes request body and query params to the workflow context.
    """
    # Parse incoming data
    body = {}
    query_params = dict(request.query_params)
    
    if request.method == "POST":
        try:
            body = await request.json()
        except:
            body = {}
    
    # Build initial context with webhook data (n8n-style)
    initial_context = {
        "webhook": {
            "method": request.method,
            "body": body,
            "query": query_params,
            "headers": dict(request.headers),
            "path": str(request.url.path),
        },
        "test_mode": test_mode,
    }
    
    workflow_schema = WorkflowResponse.from_orm(workflow_data)
    
    execution_start = datetime.utcnow()
    
    try:
        result = await execute_workflow(workflow_schema, db, initial_context)
        
        # Update last executed timestamp
        workflow_data.last_executed_at = datetime.utcnow()
        db.commit()
        
        execution_end = datetime.utcnow()
        execution_time_ms = (execution_end - execution_start).total_seconds() * 1000
        
        return {
            "workflow_id": workflow_data.id,
            "webhook_path": workflow_data.webhook_path,
            "status": "success",
            "test_mode": test_mode,
            "execution_time_ms": round(execution_time_ms, 2),
            "result": result
        }
        
    except Exception as e:
        execution_end = datetime.utcnow()
        execution_time_ms = (execution_end - execution_start).total_seconds() * 1000
        
        raise HTTPException(
            status_code=500,
            detail={
                "workflow_id": workflow_data.id,
                "status": "failed",
                "test_mode": test_mode,
                "execution_time_ms": round(execution_time_ms, 2),
                "error": str(e)
            }
        )