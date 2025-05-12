from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from api.database import router as database_router
from api.users import router as user_router
from api.passwd_reset import router as passwd_reset_router
from api.sql_database import router as database_connection_router
from api.user_prompt import router as user_prompt_router

app = FastAPI(
    title="AI Assisted Graph Generation - VizGen",
    description="An AI-powered system for generating visualizations, insights, and explanations from text data.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(database_router, prefix="/api", tags=["Database connecton"])
app.include_router(user_router, prefix="/api", tags=["User Management"])
app.include_router(passwd_reset_router, prefix="/api", tags=["Password Reset"])
app.include_router(database_connection_router, prefix="/sql", tags=["Database Connector"])
app.include_router(user_prompt_router, tags=["User Prompt"])

@app.get("/")
async def root():
    return {"message": "Welcome to VizGen API"}





