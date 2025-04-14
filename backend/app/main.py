from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agents.sql_agent.sql_query import router as query_router
from agents.sql_agent.database_api import router as get_database_router
from api.intent import router as intent_router
from api.user_prompt import router as user_prompt_router

app = FastAPI(
    title="AI Assisted Graph Generation - VizGen",
    description="An AI-powered system for generating visualizations, insights, and explanations from text data.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(query_router, prefix="/sql", tags=["NL to SQL Query"])
app.include_router(get_database_router, prefix="/sql", tags=["Database Connector"])
app.include_router(intent_router, prefix="/intent", tags=["Intent Classification"])
app.include_router(user_prompt_router, tags=["User Prompt"])

@app.get("/")
async def root():
    return {"message": "Welcome to VizGen API"}