# from telegram import Bot
# import os
# from dotenv import load_dotenv

# load_dotenv()

# bot_token = os.getenv("BOT_TOKEN")
# chat_ids = os.getenv("CHAT_ID")

# bot = Bot(token=bot_token)

# def send_message(message: str):
#     try:
#         bot.send_message(chat_id=chat_ids, text=message)
#         print("✅ Message sent successfully!")
#     except Exception as e:
#         print(f"❌ Error sending message: {e}")

import asyncio
from telegram import Bot

BOT_TOKEN = "8013361699:AAER8iJepPduSssPCxFMsOElWv1j0UseeuI"
CHAT_ID = 946901792   # must be int, not string

async def send_message(message: str):
    try:
        bot = Bot(token=BOT_TOKEN)
        await bot.send_message(chat_id=CHAT_ID, text=message)
        print("✅ Message sent successfully!")
    except Exception as e:
        print(f"❌ Error sending message: {e}")

if __name__ == "__main__":
    asyncio.run(send_message("Hello! This is an automated Telegram message 🚀"))

