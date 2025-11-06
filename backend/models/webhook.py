from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.sql import func
from db.database import Base

class Webhook(Base):
    __tablename__ = "webhooks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    method = Column(String, nullable=False)
    path = Column(String, nullable=False, unique=True)
    header = Column(String, nullable=True)
    secret = Column(String, nullable=True)



