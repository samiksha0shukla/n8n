from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from models.workflow import Workflow
from models.user import User
from schemas.workflow import WorkflowCreate, WorkflowResponse, WorkflowUpdate

from jose import jwt, JWTError
from routers.auth import SECRET_KEY, ALGORITHM
from fastapi.security import OAuth2PasswordBearer


router = APIRouter(tags=["Workflow"])


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="signin")

# Add authentication dependency
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        print(f"[DEBUG] Token received: {token[:50]}..." if len(token) > 50 else f"[DEBUG] Token: {token}")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"[DEBUG] Payload decoded: {payload}")
        user_id_str = payload.get("sub")
        if user_id_str is None:
            print("[DEBUG] user_id is None!")
            raise HTTPException(status_code=401, detail="Invalid token")
        user_id = int(user_id_str)  # Convert string back to int
        print(f"[DEBUG] User ID extracted: {user_id}")
        return user_id
    except JWTError as e:
        print(f"[DEBUG] JWTError: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

# Create workflow
@router.post("/workflow", response_model=WorkflowResponse)
def create_workflow(
    workflow: WorkflowCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_workflow = Workflow(**workflow.dict(), user_id=user_id)
    # Generate unique webhook path
    new_workflow.webhook_path = new_workflow.generate_webhook_path()
    db.add(new_workflow)
    db.commit()
    db.refresh(new_workflow)
    return new_workflow


# Get all workflows
@router.get("/workflow", response_model=list[WorkflowResponse])
def get_all_workflows(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    return db.query(Workflow).filter(Workflow.user_id == user_id).all()


# Get workflow by ID
@router.get("/workflow/{workflow_id}", response_model=WorkflowResponse)
def get_workflow(workflow_id: int, db: Session = Depends(get_db)):
    wf = db.query(Workflow).filter(Workflow.id == workflow_id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return wf


# Update workflow
@router.put("/workflow/{workflow_id}", response_model=WorkflowResponse)
def update_workflow(
    workflow_id: int,
    workflow: WorkflowUpdate,
    db: Session = Depends(get_db)
):
    db_wf = db.query(Workflow).filter(Workflow.id == workflow_id).first()
    if not db_wf:
        raise HTTPException(status_code=404, detail="Workflow not found")

    for key, value in workflow.dict(exclude_unset=True).items():
        setattr(db_wf, key, value)

    db.commit()
    db.refresh(db_wf)
    return db_wf


# Delete workflow
@router.delete("/workflow/{workflow_id}")
def delete_workflow(workflow_id: int, db: Session = Depends(get_db)):
    wf = db.query(Workflow).filter(Workflow.id == workflow_id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    db.delete(wf)
    db.commit()
    return {"message": "Workflow deleted successfully"}