from sqlalchemy import create_engine, MetaData
import re

from utils.logging import logger

def retrieve_metadata(connection_string: str):
    """Reflect metadata from the database using SQLAlchemy and return a structured format."""
    engine = create_engine(connection_string)
    metadata = MetaData()
    metadata.reflect(bind=engine)

    logger.info("Database connection successful.")

    #format metadata to JSON
    if not metadata.tables:
        return {"metadata": [], "message": "No tables found in the database."}

    tables_info = []
    for table_name, table in metadata.tables.items():
        column_data = [
            {"column_name": column.name, 
            "data_type": re.sub(r' COLLATE ".*"', '', str(column.type))}
            for column in table.columns
        ]

        primary_keys = [
            pk.name for pk in table.primary_key.columns
        ]

        foreign_keys = [
            {"local_column": fk.parent.name, 
            "referenced_table": fk.column.table.name,
            "referenced_column": fk.column.name}
            for fk in table.foreign_keys
        ]

        tables_info.append({
            "table_name": table_name,
            "columns": column_data,
            "primary_keys": primary_keys,
            "foreign_keys": foreign_keys
        })

    logger.info(f"Metadata retrieved for {len(tables_info)} tables.")
    return tables_info