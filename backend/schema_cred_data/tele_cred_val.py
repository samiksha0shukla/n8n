from pydantic import BaseModel
from typing import Optional

class TelegramCredential(BaseModel):
    access_token: str 