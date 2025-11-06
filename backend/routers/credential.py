from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from models.credentials import Credentials
from schemas.credentials import CredentialCreate, CredentialResponse

from routers.auth import SECRET_KEY, ALGORITHM
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(tags=["Credential"])


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="signin")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.get("/credential", response_model=list[CredentialResponse])
def get_all_credentials(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    return db.query(Credentials).filter(Credentials.user_id == user_id).all()


@router.get("/credential/{cred_id}", response_model=CredentialResponse)
def get_credential(cred_id: int, db: Session = Depends(get_db)):
    cred = db.query(Credentials).filter(Credentials.id == cred_id).first()
    if not cred: 
        raise HTTPException(status_code=404, detail="Credentials not found")
    return cred


@router.post("/credential", response_model=CredentialResponse)
def create_credential(
    cred: CredentialCreate, 
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    new_cred = Credentials(**cred.dict(), user_id=user_id)
    db.add(new_cred)
    db.commit()
    db.refresh(new_cred)
    return new_cred


@router.delete("/credential/{cred_id}")
def delete_credential(cred_id: int, db: Session = Depends(get_db)):
    cred = db.query(Credentials).filter(Credentials.id == cred_id).first()
    db.delete(cred)
    db.commit()
    return{"message": "Credentials Deleted"}