from typing import Optional, Dict, List
from pydantic import BaseModel, validator
from schemas.platform import PlatformType
from schema_cred_data.email_cred_val import EmailCredential
from schema_cred_data.tele_cred_val import TelegramCredential

class CredentialBase(BaseModel):
    title: str 
    platform: PlatformType
    data: Dict  

    @validator("data")
    def validate_data(cls, v, values):
        platform = values.get("platform")

        if platform == PlatformType.TELEGRAM:
            return TelegramCredential(**v).dict()

        elif platform == PlatformType.EMAIL:
            return EmailCredential(**v).dict()

        elif platform == PlatformType.SLACK:
            # Slack credential validation - just pass through for now
            return v

        raise ValueError("Unsupported platform")


class CredentialCreate(CredentialBase):
    """Schema for creating credentials - user_id is extracted from JWT token"""
    pass


class CredentialResponse(CredentialBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

