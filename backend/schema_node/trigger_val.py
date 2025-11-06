from pydantic import BaseModel

class TriggerData(BaseModel):
    condition: str