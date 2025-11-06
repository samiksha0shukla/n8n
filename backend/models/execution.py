from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base

class Execution(Base):
    __tablename__ = "executions"

    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(Integer, ForeignKey("workflows.id"))
    status = Column(String, default="pending")
    //task_done = Column(String, default="0/0")

    workflow = relationship("Workflow", backref="executions")