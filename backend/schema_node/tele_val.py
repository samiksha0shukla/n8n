from pydantic import BaseModel
from typing import Optional

class TelegramData(BaseModel):
    chat_id: int
    message: str