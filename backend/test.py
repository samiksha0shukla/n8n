# from sqlalchemy.orm import Session
# from sqlalchemy import select
# from models.credentials import Credentials  # your ORM model
# from schema_cred_data.email_cred_val import EmailCredential  # Pydantic schema
# import sys, os
# sys.path.append(os.path.dirname(os.path.abspath(__file__)))



# def get_email_credentials(db: Session, id: str) -> EmailCredential:
#     """
#     Fetch email credentials from DB using the Credentials table.
#     """
#     stmt = select(Credentials).where(
#         Credentials.id == id,
#     )
#     result = db.execute(stmt).scalars().first()

#     if not result:
#         raise ValueError("Email credentials not found in DB")

#     # ✅ validate with Pydantic
#     return EmailCredential(**result.data)


# def email_node(node_data: dict, context: dict, db: Session):
#     credential_id = node_data.get("credential_id")  # 👈 fetch from node_data
    
#     if not credential_id:
#         raise ValueError("❌ credential_id is required in node_data")

#     creds = get_email_credentials(db, credential_id)

#     from_email = creds.from_email
#     app_password = creds.app_password


#     # Debug print
#     print("🔎 Raw DB credential data:", creds.dict())
#     print(f"✅ Extracted from_email: {from_email}")
#     print(f"✅ Extracted app_password: {app_password}")
#     print(f"📧 Using email: {from_email}")
#     print(f"🔑 Using password (masked): {app_password[:3]}***")

# from db.database import SessionLocal

# if __name__ == "__main__":
#     db = SessionLocal()
#     try:
#         node_data = {}
#         context = {}
#         email_node(node_data, context, db)  # <-- call your function
#     finally:
#         db.close()




















from sqlalchemy.orm import Session
from sqlalchemy import select
from models.credentials import Credentials  # your ORM model
from schema_cred_data.tele_cred_val import TelegramCredential  # Pydantic schema
import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))



def get_telegram_credentials(db: Session, id: str) -> TelegramCredential:
    """
    Fetch email credentials from DB using the Credentials table.
    """
    stmt = select(Credentials).where(
        Credentials.id == id,
    )
    result = db.execute(stmt).scalars().first()

    if not result:
        raise ValueError("Email credentials not found in DB")

    # ✅ validate with Pydantic
    return TelegramCredential(**result.data)


def telegram_node(node_data: dict, context: dict, db: Session):
    credential_id = node_data.get("credential_id")  # 👈 fetch from node_data
    
    if not credential_id:
        raise ValueError("❌ credential_id is required in node_data")

    creds = get_email_credentials(db, credential_id)

    access_token = creds.access_token


    # Debug print
    print("🔎 Raw DB credential data:", creds.dict())
    print(f"✅ Extracted access_token: {access_token}")
    
from db.database import SessionLocal

if __name__ == "__main__":
    db = SessionLocal()
    try:
        node_data = {}
        context = {}
        telegram_node(node_data, context, db)  # <-- call your function
    finally:
        db.close()
