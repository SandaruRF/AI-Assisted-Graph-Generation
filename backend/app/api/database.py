# from sqlalchemy import create_engine, MetaData
# from sqlalchemy.orm import sessionmaker
# from sqlalchemy.exc import SQLAlchemyError
# from app.utils.logging import logger
# from fastapi import HTTPException


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


# def get_dynamic_session(connection_string: str):
#     """Creates a new SQLAlchemy session factory dynamically."""
#     engine = create_dynamic_engine(connection_string)
#     SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
#     return SessionLocal


# def get_db(connection_string: str):
#     """Yields a database session dynamically based on user input."""
#     SessionLocal = get_dynamic_session(connection_string)
#     db = SessionLocal()
#     try:
#         yield db
#     except SQLAlchemyError as e:
#         logger.error(f"Database session error: {str(e)}")
#         raise HTTPException(status_code=500, detail="Database session error.")
#     finally:
#         db.close()


# def get_metadata(connection_string: str):
#     """Retrieves metadata dynamically based on the provided connection string."""
#     engine = None
#     try:
#         engine = create_dynamic_engine(connection_string)
#         metadata = MetaData()
#         metadata.reflect(bind=engine)
#         logger.info("Metadata retrieved successfully.")
#         return metadata
#     except SQLAlchemyError as e:
#         logger.error(f"Error reflecting metadata: {str(e)}")
#         raise RuntimeError("Error retrieving database metadata.")
#     finally:
#         if engine:
#             engine.dispose()


from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker, close_all_sessions
from sqlalchemy.exc import SQLAlchemyError
from app.config import DATABASE_URL
from app.utils.logging import logger

if DATABASE_URL is None:
    logger.error("DATABASE_URL environment variable is not set!")
    raise ValueError("DATABASE_URL environment variable is not set!")

logger.info(f"Using database URL: {DATABASE_URL}")

# Close all previous database sessions to ensure no lingering connections
close_all_sessions()

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_metadata(*args):
    try:
        # engine = create_dynamic_engine(args)
        metadata = MetaData()
        metadata.reflect(engine)
        logger.info("Metadata retrieved successfully.")
        return metadata
    except SQLAlchemyError as e:
        logger.error(f"Error reflecting metadata: {str(e)}")
        raise RuntimeError("Error retrieving database metadata.")
