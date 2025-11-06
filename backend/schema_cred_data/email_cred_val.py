from pydantic import BaseModel, EmailStr
from typing import Optional


class EmailCredential(BaseModel):
    from_email: EmailStr
    app_password: str
    