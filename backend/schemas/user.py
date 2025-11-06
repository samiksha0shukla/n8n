from typing import Optional, List
# from pydantic import BaseModel, EmailStr
# from schemas.workflow import WorkflowBase

# class UserBase(BaseModel):
#     email: EmailStr
#     name: Optional[str] = None


# class UserCreate(UserBase):
#     password: str


# class UserResponse(UserBase):
#     id: int
#     workflows: List[WorkflowBase] = []

#     class Config:
#         orm_mode = True




from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str | int
    name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str | int

class UserResponse(BaseModel):
    # id: int
    # email: EmailStr
    # password: str

    user: dict

    class Config:
        orm_mode = True
