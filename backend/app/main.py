from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware


from app.config import create_conversation_indexes
from app.api.database import router as database_router
from app.api.interactions_router import router as interactions_router
from app.api.users import router as user_router
from app.api.passwd_reset import router as passwd_reset_router
from app.api.sql_database import router as database_connection_router
from app.api.web_socket import router as stream_ws_router
from app.api.googleauth import router as google_auth_router
from app.api.githubauth import router as github_auth_router
from app.api.ranked_graphs_router import router as ranked_graphs_router
from app.api.database_exporter import router as database_exporter
from app.api.conversation import router as conversation_router
from app.state import graph_state_manager
from app.agents.visualization_agent.ui_customizer import parse_customization_prompt


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
    expose_headers=["*"],
)

app.include_router(database_router, prefix="/api", tags=["Database connecton"])
app.include_router(google_auth_router, prefix="/api", tags=["Google Auth"])
app.include_router(github_auth_router, prefix="/api", tags=["GitHub Auth"])
app.include_router(user_router, prefix="/api", tags=["User Management"])
app.include_router(passwd_reset_router, prefix="/api", tags=["Password Reset"])
app.include_router(database_connection_router, prefix="/sql", tags=["Database Connector"])
app.include_router(stream_ws_router, tags=["Stream Web Socket"])
app.include_router(interactions_router, prefix="/api", tags=["Graph Interactions"])
app.include_router(ranked_graphs_router, prefix="/api")
app.include_router(database_exporter, prefix="/api", tags=['Database Exporter'])
app.include_router(conversation_router, prefix="/api/conversations", tags=["conversations"])

@app.on_event("startup")
async def startup_event():
    # Create conversation indexes on startup
    await create_conversation_indexes()
    print("Conversation indexes created successfully")

@app.get("/simple-test")
async def simple_test():
    return {"simple": "test working"}


@app.get("/")
async def root():
    return {"message": "Welcome to VizGen API"}

@app.get("/test")
async def test():
    return {"test": "working"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Backend is running"}

@app.get("/api/graph/state")
def get_graph_state():
    return graph_state_manager.get_state()

@app.post("/api/graph/customize")
async def customize_graph(request: Request):
    data = await request.json()
    prompt = data.get("prompt", "")
    updates = parse_customization_prompt(prompt)
    new_state = graph_state_manager.update_state(updates)
    return new_state
