import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

def send_email(from_email, from_password, to_email, subject, message):
    try:
        # SMTP server setup (Gmail example, you can change as needed)
        smtp_server = "smtp.gmail.com"
        smtp_port = 587

        # Create the email
        msg = MIMEMultipart()
        msg["From"] = from_email
        msg["To"] = to_email
        msg["Subject"] = subject

        # Add body
        msg.attach(MIMEText(message, "plain"))

        # Connect to server
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Upgrade connection to secure
        server.login(from_email, from_password)

        # Send email
        server.sendmail(from_email, to_email, msg.as_string())
        server.quit()

        print("Email sent successfully!")

    except Exception as e:
        print(f"Error sending email: {e}")


# Example usage
if __name__ == "__main__":
    from_email = "samikshasy2908@gmail.com"
    from_password = os.getenv("APP_PASSWORD")
    to_email = "shuklasamiksha03@gmail.com"
    subject = "Test Email from Python"
    message = "Hello! This is an automatic email sent from Python 🚀"

    send_email(from_email, from_password, to_email, subject, message)

