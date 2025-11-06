from pydantic import BaseModel
from typing import Optional

class ExecutionBase(BaseModel):
    workflow_id: int
    status: str = "pending"
    task_done: Optional[str] = "0/0"


class ExecutionCreate(ExecutionBase):
    pass


class ExecutionUpdate(ExecutionBase):
    status: Optional[str] = None
    task_done: Optional[str] = None


class ExecutionRead(ExecutionBase):
    id: int

    class Config:
        orm_mode = True