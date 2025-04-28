from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.graph_recommendation import router as graph_recommendation_router

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

app.include_router(graph_recommendation_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to VizGen API"}
