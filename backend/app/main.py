from fastapi import FastAPI
#from app.agents.sql_agent.metadata import router as metadata_router
from app.agents.sql_agent.sql_query import router as query_router
from app.agents.sql_agent.databaseApi import router as get_database_router


app = FastAPI()
app.include_router(query_router)
#app.include_router(metadata_router)
app.include_router(get_database_router)



