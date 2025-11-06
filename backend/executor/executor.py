import asyncio
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from telegram import Bot
from dotenv import load_dotenv

from sqlalchemy.orm import Session
from sqlalchemy import select
from pathlib import Path
import sys

# Add the backend folder to sys.path
sys.path.append(str(Path(__file__).resolve().parent.parent))
from schema_cred_data.email_cred_val import EmailCredential
from schema_cred_data.tele_cred_val import TelegramCredential
from models.credentials import Credentials
from schemas.workflow import WorkflowResponse

load_dotenv()

# -------- Node Implementations -------- #

async def trigger_node(node_data: dict, context: dict, db: Session = None):
    print(f"Trigger activated: {node_data}")
    return {"triggered": True}


def get_email_credentials(db: Session, id: str) -> EmailCredential:
    stmt = select(Credentials).where(Credentials.id == id)
    result = db.execute(stmt).scalars().first()

    if not result:
        raise ValueError("❌ Email credentials not found in DB")

    return EmailCredential(**result.data)


async def email_node(node_data: dict, context: dict, db: Session):
    credential_id = node_data.get("credential_id")
    if not credential_id:
        raise ValueError("❌ credential_id is required in node_data for email node")

    creds = get_email_credentials(db, credential_id)

    from_email = creds.from_email
    app_password = creds.app_password
    to_email = node_data.get("to_email")
    subject = node_data.get("subject", "No Subject")
    message = node_data.get("body", "")

    def _send_email():  # ✅ regular function now
        smtp_server = "smtp.gmail.com"
        smtp_port = 587

        msg = MIMEMultipart()
        msg["From"] = from_email
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(message, "plain"))

        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(from_email, app_password)
        server.sendmail(from_email, to_email, msg.as_string())
        server.quit()

    try:
        # ✅ offload blocking SMTP work to thread
        await asyncio.to_thread(_send_email)
        print(f"✅ Email sent to {to_email}")
        return {"email_status": "sent", "to": to_email}
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        return {"email_status": "failed", "error": str(e)}


def get_telegram_credentials(db: Session, id: str) -> TelegramCredential:
    stmt = select(Credentials).where(Credentials.id == id)
    result = db.execute(stmt).scalars().first()

    if not result:
        raise ValueError("❌ Telegram credentials not found in DB")

    return TelegramCredential(**result.data)


async def telegram_node(node_data: dict, context: dict, db: Session):
    credential_id = node_data.get("credential_id")
    if not credential_id:
        raise ValueError("❌ credential_id is required in node_data for telegram node")

    creds = get_telegram_credentials(db, credential_id)

    access_token = creds.access_token
    chat_id = int(node_data.get("chat_id"))
    message = node_data.get("message", "")

    try:
        bot = Bot(token=access_token)
        # ✅ Bot.send_message is async → await directly
        await bot.send_message(chat_id=chat_id, text=message)
        print(f"✅ Telegram message sent to chat_id {chat_id}")
        return {"telegram_status": "sent", "chat_id": chat_id}
    except Exception as e:
        print(f"❌ Error sending Telegram message: {e}")
        return {"telegram_status": "failed", "error": str(e)}


# -------- Workflow Executor -------- #

from collections import defaultdict, deque
from sqlalchemy.orm import Session
from schemas.workflow import WorkflowResponse

async def execute_workflow(workflow_data: WorkflowResponse, db: Session):
    node_map = {
        "trigger": trigger_node,
        "email": email_node,
        "telegram": telegram_node,
    }

    nodes = {node.id: node for node in workflow_data.nodes}
    connections = workflow_data.connections

    # Step 1: Build adjacency list (graph)
    graph = defaultdict(list)
    in_degree = {node.id: 0 for node in workflow_data.nodes}

    for conn in connections:
        graph[conn.source].append(conn.target)
        in_degree[conn.target] += 1

    # Step 2: Find start nodes (in-degree = 0, usually trigger)
    queue = deque([nid for nid, deg in in_degree.items() if deg == 0])

    if not queue:
        raise ValueError("❌ No start node found (check workflow connections)")

    context = {}

    # Step 3: Process nodes in topological order
    while queue:
        node_id = queue.popleft()
        node = nodes[node_id]

        node_type = node.platform
        node_data = dict(node.data)

        if getattr(node, "credential_id", None):
            node_data["credential_id"] = node.credential_id

        print(f"\n🚀 Executing node: {node.name} ({node_type})")

        handler = node_map.get(node_type)
        if not handler:
            print(f"⚠️ No handler for node platform: {node_type}")
            continue

        result = await handler(node_data, context, db)
        context.update(result or {})

        # Step 4: Update in-degree of neighbors
        for neighbor in graph[node_id]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return context


if __name__ == "__main__":
    from db.database import SessionLocal
    db = SessionLocal()
    asyncio.run(execute_workflow(workflow_data, db))
