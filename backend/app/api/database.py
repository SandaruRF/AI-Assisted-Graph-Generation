from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker, close_all_sessions
from sqlalchemy.exc import SQLAlchemyError
from app.config import  DATABASE_URL
from app.utils.logging import logger

def create_dynamic_engine(connection_string: str):
    """Creates a new SQLAlchemy engine dynamically based on user input."""
    if not connection_string:
        logger.error("Connection string cannot be empty.")
        raise ValueError("Invalid database connection string.")

    try:
        engine = create_engine(connection_string, pool_pre_ping=True)
        logger.info("Database engine created successfully.")
        return engine
    except SQLAlchemyError as e:
        logger.error(f"Error creating engine: {str(e)}")
        raise RuntimeError("Error initializing database engine.")
    
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_metadata(*args):
    try:
        metadata = MetaData()
        metadata.reflect(engine)
        logger.info("Metadata retrieved successfully.")
        return metadata
    except SQLAlchemyError as e:
        logger.error(f"Error reflecting metadata: {str(e)}")
        raise RuntimeError("Error retrieving database metadata.")

#DATABASE_URL = GLOBAL_CONNECTION_STRING
if DATABASE_URL is None:
    logger.error("DATABASE_URL environment variable is not set!")
    raise ValueError("DATABASE_URL environment variable is not set!")

logger.info(f"Using database URL: {DATABASE_URL}")

# Close all previous database sessions to ensure no lingering connections
close_all_sessions()

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
