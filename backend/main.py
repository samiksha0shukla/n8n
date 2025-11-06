from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db.database import create_table
from core.config import settings
from routers import auth, credential, webhook, workflow

create_table()


app = FastAPI(
    title="n8n-clone",
    description="Implementing automations and workflows",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(credential.router, prefix="/credential")
app.include_router(webhook.router, prefix="/webh")
app.include_router(workflow.router, prefix="/workf")


@app.get("/")
def root():
    return {"message":"Welcome to n8n Clone API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)