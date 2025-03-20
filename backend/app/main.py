from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

app.include_router(intent_router, prefix="/api", tags=["Intent Classification"])

@app.get("/")
async def root():
    return {"message": "Welcome to VizGen API"}
