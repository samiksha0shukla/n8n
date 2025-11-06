from typing import Optional
from pydantic import BaseModel, EmailStr

class EmailData(BaseModel):
    to_email: EmailStr
    subject: Optional[str]
    body: str



