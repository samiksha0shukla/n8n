from sqlalchemy import Column, Integer, String, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base

class Workflow(Base):
   __tablename__ = "workflows"

   id = Column(Integer, primary_key=True, index=True)
   title = Column(String, nullable=False)
   enabled = Column(Boolean, default=True)
   nodes = Column(JSON, nullable=True)
   connections = Column(JSON, nullable=True)
    
   user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

   user = relationship("User", back_populates="workflows")