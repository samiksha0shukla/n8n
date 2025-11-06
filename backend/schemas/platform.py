from enum import Enum
from pydantic import BaseModel

class PlatformType(str, Enum): 
    TELEGRAM = "telegram"
    EMAIL = "email"
    SLACK = "slack" 
    TRIGGER = "trigger"