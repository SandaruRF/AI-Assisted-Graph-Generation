from pydantic import BaseModel,EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    new_password: str
