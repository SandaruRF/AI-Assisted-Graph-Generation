from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.utils.password_verifier import hash_password # adjust import path as needed
from bson.objectid import ObjectId
from app.config import db
from app.models.otp_schema import ResetPasswordRequest

router = APIRouter()



@router.post("/auth/reset-password")
async def reset_password(data: ResetPasswordRequest):
    users_collection = db["user"]  # adjust collection name as needed

    user = await users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    hashed_pwd = hash_password(data.new_password)
    result = await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"hashed_password": hashed_pwd}}
    )

    if result.modified_count != 1:
        raise HTTPException(status_code=500, detail="Password reset failed")

    return {"message": "Password updated successfully"}