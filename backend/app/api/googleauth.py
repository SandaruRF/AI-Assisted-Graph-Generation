from fastapi import APIRouter,HTTPException
from config import settings,db
import httpx
from models.user_detail import Token,TokenModel
from utils.auth import ACCESS_TOKEN_EXPIRE_MINUTES,create_access_token
from datetime import timedelta
from utils.logging import logger


client_id = settings.GOOGLE_CLIENT_ID
client_secret = settings.GOOGLE_CLIENT_SECRET


users_collection = db["user"]

router = APIRouter()

@router.post("/auth/google")
async def google_auth(token_data: TokenModel, response_model=Token):
    token = token_data.token

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
        )
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Invalid token")

    user_info = response.json()
    if user_info["aud"] != client_id:
        raise HTTPException(status_code=400, detail="Invalid client ID")
        
    user = await users_collection.find_one({"email": user_info["email"],"auth_provider": "google"})
    logger.info(f"User info: {user_info}")
    if user is None:
        users_collection.insert_one({
            "email": user_info["email"],
            "auth_provider": "google"
        })
        return {"email": user_info["email"], "message": "New User created"}
    else:
        access_token = create_access_token(data={"sub": user_info["email"]}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        return {"access_token": access_token, "token_type": "bearer", "message": "user already exists"}