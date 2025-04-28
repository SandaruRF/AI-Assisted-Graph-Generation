from pydantic import BaseModel,EmailStr

class OTPRequest(BaseModel):
    phone: str

class OTPVerify(BaseModel):
    phone: str
    otp: str

class PasswordReset(BaseModel):
    phone: str
    new_password: str

class EmailRequest(BaseModel):
    email: EmailStr
