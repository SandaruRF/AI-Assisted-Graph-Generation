from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.database import router as database_router
from app.api.users import router as user_router
from app.api.passwd_reset import router as passwd_reset_router
from app.api.sql_database import router as database_connection_router
from app.api.web_socket import router as stream_ws_router
from app.api.googleauth import router as google_auth_router
from app.api.githubauth import router as github_auth_router

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
    expose_headers=["*"],
)

app.include_router(database_router, prefix="/api", tags=["Database connecton"])
app.include_router(google_auth_router, prefix="/api", tags=["Google Auth"])
app.include_router(github_auth_router, prefix="/api", tags=["GitHub Auth"])
app.include_router(user_router, prefix="/api", tags=["User Management"])
app.include_router(passwd_reset_router, prefix="/api", tags=["Password Reset"])
app.include_router(database_connection_router, prefix="/sql", tags=["Database Connector"])
app.include_router(stream_ws_router, tags=["Stream Web Socket"])

@app.get("/")
async def root():
    return {"message": "Welcome to VizGen API"}





