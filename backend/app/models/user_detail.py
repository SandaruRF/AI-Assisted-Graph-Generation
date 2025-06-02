from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserCreatep1(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)

class UserCreatep2(BaseModel):
    email: EmailStr
    first_name: str = Field(..., min_length=2)
    last_name: str = Field(..., min_length=2)
    phone_number: str = Field(..., )


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str



#temporary model for google auth
class TokenModel(BaseModel):
    token: str 

class GitHubAuthRequest(BaseModel):
    code: str
    
class userProfileDeails(BaseModel):
    user_profile_picture: Optional[str] = None
    email: EmailStr
    first_name: str
    last_name: str
    phone_number: str
