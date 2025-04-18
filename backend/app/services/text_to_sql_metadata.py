from sqlalchemy.orm import Session
from api.database import get_metadata
import re
from utils.logging import logger

# table names
# columns
# primary keys
# foreign keys
# column data types
# indexes (for optimization, efficien query generation)
# constraints (optimizaiton and accuracy)
# relationships (for advanced queries) eg: one-to-many, many-to-many
# table comments (for generate contextually accurate queries)
# column comments (for generate contextually accurate queries)

def fetch_db_metadata(db: Session):
    try:
        metadata = get_metadata()

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
        return {"metadata": tables_info}
    
    except Exception as e:
        logger.error(f"Error retrieving metadata: {str(e)}")
        raise RuntimeError("Error retrieving database metadata.")
