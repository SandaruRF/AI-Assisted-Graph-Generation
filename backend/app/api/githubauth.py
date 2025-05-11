from fastapi import APIRouter,HTTPException
from config import settings,db
import httpx
from models.user_detail import Token,TokenModel,GitHubAuthRequest
from utils.auth import ACCESS_TOKEN_EXPIRE_MINUTES,create_access_token
from datetime import timedelta
from utils.logging import logger
import requests

client_id = settings.GITHUB_CLIENT_ID
client_secret = settings.GITHUB_CLIENT_SECRET

users_collection = db["user"]

router = APIRouter()

@router.post("/auth/github")
async def github_auth(data: GitHubAuthRequest):
    # 1. Exchange code for access token
    token_response = requests.post(
        "https://github.com/login/oauth/access_token",
        headers={"Accept": "application/json"},
        data={
            "client_id": client_id,
            "client_secret": client_secret,
            "code": data.code,
        }
    )
    if token_response.status_code != 200:
        raise HTTPException(status_code=400, detail="GitHub token exchange failed")

    access_token = token_response.json().get("access_token")
    if not access_token:
        raise HTTPException(status_code=400, detail="No access token found")

    # 2. Get user info from GitHub
    user_response = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    user_data = user_response.json()
    github_id = user_data.get("id")
    email = user_data.get("email") 

    if not github_id:
        raise HTTPException(status_code=400, detail="GitHub user fetch failed")

    # 3. Upsert user in MongoDB
    user = await users_collection.find_one({"email": email,"auth_provider": "github"})
    if user is None:
        users_collection.insert_one({
            "email": email,
            "auth_provider": "github",
            "github_id": github_id
        })
        return {"email": email, "message": "New User created"}
    else:
        access_token = create_access_token(data={"sub": email}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        return {"access_token": access_token, "token_type": "bearer", "message": "user already exists"}