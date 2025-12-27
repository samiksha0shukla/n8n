from typing import Optional, List, Dict, Any
from pydantic import BaseModel, validator
from datetime import datetime
from schemas.platform import PlatformType
from schema_node.email_val import EmailData
from schema_node.tele_val import TelegramData
from schema_node.trigger_val import TriggerData

class Node(BaseModel):
    id: str
    platform: PlatformType
    name: str
    data: Dict = {}
    credential_id: Optional[str] = None

    @validator("data")
    def validate_data(cls, v, values):
        platform = values.get("platform")

        if platform == PlatformType.TELEGRAM:
            return TelegramData(**v).dict() if v else {}

        elif platform == PlatformType.EMAIL:
            return EmailData(**v).dict() if v else {}

        elif platform == PlatformType.SLACK:
            return v  # Pass through for now

        elif platform == PlatformType.TRIGGER:
            return TriggerData(**v).dict() if v else {}

        return v  # Allow any data for unknown platforms


class Connection(BaseModel):
    source: str
    target: str

class WorkflowBase(BaseModel):
    title: str
    enabled: Optional[bool] = True
    nodes: Optional[List[Node]] = None
    connections: Optional[List[Connection]] = None

class WorkflowCreate(WorkflowBase):
    pass

class WorkflowUpdate(BaseModel):
    title: Optional[str] = None
    enabled: Optional[bool] = None
    nodes: Optional[List[Node]] = None
    connections: Optional[List[Connection]] = None

class WorkflowResponse(WorkflowBase):
    id: int
    user_id: int
    webhook_path: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    last_executed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
