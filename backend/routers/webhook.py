from fastapi import HTTPException, Depends, APIRouter, Request
from sqlalchemy.orm import Session
from db.database import get_db
from models.workflow import Workflow
from schemas.workflow import WorkflowResponse
from executor.executor import execute_workflow

router = APIRouter(tags=["Webhook"])


@router.api_route("/webhook/handler/{workflow_id}", methods=["GET", "POST"])
async def webhook_handler(workflow_id: int, request: Request, db: Session = Depends(get_db)):
    workflow_data = db.query(Workflow).filter(Workflow.id == workflow_id).first()
    if not workflow_data:
        raise HTTPException(status_code=404, detail="Workflow not found")

    workflow_schema = WorkflowResponse.from_orm(workflow_data)

    try:
        result = await execute_workflow(workflow_schema, db)
    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Workflow execution failed: {str(e)}")

    return {
        "workflow_id": workflow_id,
        "status": "executed",
        "result": result
    }

    # 1. aagai id

    # 2. db call kia data lene k liye with workflow id
         # data aagya pura workflow as a json 

    # 3. send the data to executor
    
    # 4. return the is success bollean
    



    # body = await request.json() if request.method == "POST" else {}
    # return {
    #     "workflow_id": workflow_id,
    #     "method": request.method,
    #     "received": body
    # }