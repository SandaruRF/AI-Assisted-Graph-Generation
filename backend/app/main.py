from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.agents.sql_agent.sql_query import router as query_router
from app.agents.sql_agent.database_api import router as get_database_router
from app.api.intent import router as intent_router

app = FastAPI(
    title="AI Assisted Graph Generation - VizGen",
    description="An AI-powered system for generating visualizations, insights, and explanations from text data.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(query_router, prefix="/sql", tags=["NL to SQL Query"])
app.include_router(get_database_router, prefix="/sql", tags=["Database Connector"])
app.include_router(intent_router, prefix="/intent", tags=["Intent Classification"])

@app.get("/")
async def root():
    return {"message": "Welcome to VizGen API"}