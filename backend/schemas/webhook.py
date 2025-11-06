from typing import Optional, Dict, List
from pydantic import BaseModel

class WebhookBase(BaseModel):
    title: str
    method: str
    path: str
    nodes: Optional[str] = None
    connections: Optional[str] = None


class WebhookCreate(WebhookBase):
    pass


class WebhookUpdate(WebhookBase):
    title: Optional[str] = None
    method: Optional[str] = None
    path: Optional[str] = None


class WebhookRead(WebhookBase):
    id: int

    class Config:
        orm_mode = True

