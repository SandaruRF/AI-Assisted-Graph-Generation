from fastapi import  HTTPException
from models.twilio_otp_schema import OTPRequest, OTPVerify, PasswordReset
from utils.sms import send_sms
from passlib.hash import bcrypt
from datetime import datetime, timedelta
import random
from config import settings,db
from fastapi.routing import APIRouter
from models.twilio_otp_schema import EmailRequest
from utils.logging import logger

users = db["user"]
otp_collection = db["otps"]

router = APIRouter()

@router.post("/auth/send-otp")
async def send_otp_by_email(data: EmailRequest):
    user = await users.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
    logger.info(f"User found: {user}")

    phone = user.get("phone_number")
    if not phone:
        raise HTTPException(status_code=400, detail="Phone number not linked with this email")
    logger.info(f"Phone number found: {phone}")

    otp = str(random.randint(100000, 999999))
    try:
        send_sms(phone, f"Your OTP is: {otp}")
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail=f"Failed to send OTP")
        

    otp_collection.update_one(
        {"phone": phone},
        {"$set": {
            "otp": otp,
            "expires": datetime.utcnow() + timedelta(minutes=5)
        }},
        upsert=True
    )
    return {"msg": "OTP sent to the phone linked with the email"}


@router.post("/auth/verify-otp")
def verify_otp(data: OTPVerify):
    record = otp_collection.find_one({"phone_number": data.phone})
    if not record or record['otp'] != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    logger.info(f"OTP record found: {record}")
    if datetime.utcnow() > record['expires']:
        raise HTTPException(status_code=400, detail="OTP expired")
    return {"msg": "OTP verified"}

# Reset Password
@router.post("/auth/reset-password")
def reset_password(data: PasswordReset):
    hashed_pw = bcrypt.hash(data.new_password)
    logger.info(f"Hashed password: {hashed_pw}")
    users.update_one({"phone": data.phone}, {"$set": {"password": hashed_pw}})
    otp_collection.delete_one({"phone": data.phone})  
    return {"msg": "Password reset successful"}