from fastapi import APIRouter, Depends, HTTPException, status
from datetime import timedelta

from app.utils.logging import logger
from app.config import db
from app.models.user_detail import UserCreatep1,UserCreatep2 , Token, UserLogin
from app.utils.auth import hash_password, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()

users_collection = db["user"]  

#sign up part 1
@router.post("/signup")
async def signup(user: UserCreatep1):
    logger.info(f"Attempting to create user: {user.email}")
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)
    new_user = {
        "email": user.email,
        "hashed_password": hashed_password,
        "auth_provider": "manual",
    }
    await users_collection.insert_one(new_user)

    
    return {"email":user.email, "message": "User created"}

#signup part 2
@router.post("/signup/2", response_model=Token)
async def signup_part2(user: UserCreatep2):
    logger.info(f"Attempting to create user: {user.first_name} {user.last_name}")
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        users_collection.update_one({"email": user.email},    
                              {"$set": {"first_name": user.first_name, "last_name": user.last_name, "phone_number": user.phone_number}})
    else:
        raise HTTPException(status_code=400, detail="User not found. Please complete the first part of signup.")
    access_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}






@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email, "auth_provider": "manual"})
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")  
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        data={"sub": db_user["email"]}, 
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}
