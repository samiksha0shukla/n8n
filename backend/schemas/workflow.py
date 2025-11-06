from typing import Optional, List, Dict, Any
from pydantic import BaseModel, validator
from schemas.platform import PlatformType
from schema_node.email_val import EmailData
from schema_node.tele_val import TelegramData
from schema_node.trigger_val import TriggerData

class Node(BaseModel):
    id: str
    platform: PlatformType
    name: str
    data: Dict
    credential_id: str

    @validator("data")
    def validate_data(cls, v, values):
        platform = values.get("platform")

        if platform == PlatformType.TELEGRAM:
            return TelegramData(**v).dict()

        elif platform == PlatformType.EMAIL:
            return EmailData(**v).dict()

        elif platform == PlatformType.SLACK:
            return SlackData(**v).dict()

        elif platform == PlatformType.TRIGGER:
            return TriggerData(**v).dict()

        raise ValueError("Unsupported platform")


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

    class Config:
        from_attributes = True

