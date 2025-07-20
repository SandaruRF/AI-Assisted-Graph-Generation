from fastapi import HTTPException
from sqlalchemy import create_engine, MetaData, text
from typing import List, Dict, Any, Optional
import re
from urllib.parse import urlparse

from app.utils.logging import logger

def reflect_sql_metadata(connection_string: str, 
                        database_name: Optional[str] = None,
                        include_sample_data: bool = True) -> Dict[str, Any]:
    """Pure metadata extraction without hardcoded descriptions or domains."""
    
    try:
        engine = create_engine(connection_string)
        metadata = MetaData()
        metadata.reflect(bind=engine)
        
        logger.info("Database connection and reflection successful.")
        
        if not metadata.tables:
            return create_empty_metadata(database_name)
        
        # Extract database name from connection string
        if not database_name:
            database_name = extract_database_name(connection_string)
        
        # Build metadata
        tables_info = {}
        relationships = []
        
        for table_name, table in metadata.tables.items():
            # Process columns
            column_data = []
            numeric_columns = []
            categorical_columns = []
            temporal_columns = []
            text_columns = []
            
            for column in table.columns:
                clean_type = normalize_data_type(str(column.type))
                
                column_info = {
                    "column_name": column.name,
                    "data_type": clean_type,
                    "nullable": column.nullable,
                    "primary_key": column.primary_key
                }
                column_data.append(column_info)
                
                # Categorize columns by data type
                category = categorize_column_type(clean_type, column.name)
                if category == "numeric":
                    numeric_columns.append(column.name)
                elif category == "temporal":
                    temporal_columns.append(column.name)
                elif category == "text":
                    text_columns.append(column.name)
                else:
                    categorical_columns.append(column.name)
            
            # Process foreign keys
            foreign_keys = []
            for fk in table.foreign_keys:
                try:
                    fk_info = {
                        "local_column": fk.parent.name,
                        "referenced_table": fk.column.table.name,
                        "referenced_column": fk.column.name
                    }
                    foreign_keys.append(fk_info)
                    
                    relationships.append({
                        "from_table": table_name,
                        "from_column": fk.parent.name,
                        "to_table": fk.column.table.name,
                        "to_column": fk.column.name,
                        "relationship_type": "foreign_key"
                    })
                except Exception as e:
                    logger.warning(f"Error processing foreign key: {e}")
                    continue
            
            # Get row count
            row_count = get_row_count(engine, table_name)
            
            # Get sample data if requested
            sample_data = None
            if include_sample_data and row_count and row_count > 0:
                column_names = [col["column_name"] for col in column_data]
                sample_data = get_sample_data_row(engine, table_name, column_names)
            
            # Build table info
            tables_info[table_name] = {
                "columns": [col["column_name"] for col in column_data],
                "column_details": column_data,
                "primary_keys": [pk.name for pk in table.primary_key.columns],
                "foreign_keys": foreign_keys,
                "numeric_columns": numeric_columns,
                "categorical_columns": categorical_columns,
                "temporal_columns": temporal_columns,
                "text_columns": text_columns,
                "row_count": row_count,
                "sample_data": sample_data,
                "has_sample_data": sample_data is not None
            }
        
        # Build final metadata structure
        enhanced_metadata = {
            "database_name": database_name,
            "tables": tables_info,
            "relationships": relationships,
            "total_tables": len(tables_info),
            "sample_data_available": include_sample_data,
            "connection_info": {
                "dialect": engine.dialect.name,
                "database_type": engine.dialect.name.title()
            }
        }
        
        logger.info(f"Metadata extracted for {len(tables_info)} tables.")
        return enhanced_metadata
        
    except Exception as e:
        logger.error(f"Error in metadata extraction: {e}")
        raise HTTPException(status_code=500, detail=f"Metadata extraction failed: {e}")

def normalize_data_type(data_type: str) -> str:
    """Normalize data types across different SQL dialects."""
    try:
        data_type_lower = str(data_type).lower()
        clean_type = re.sub(r' collate ".*"', '', data_type_lower)
        clean_type = re.sub(r'\(\d+\)', '', clean_type)
        clean_type = re.sub(r'\(\d+,\d+\)', '', clean_type)
        
        if any(t in clean_type for t in ['int', 'integer', 'bigint', 'smallint', 'tinyint']):
            return 'integer'
        elif any(t in clean_type for t in ['float', 'double', 'real', 'decimal', 'numeric']):
            return 'float'
        elif any(t in clean_type for t in ['varchar', 'char', 'text', 'string', 'clob']):
            return 'text'
        elif any(t in clean_type for t in ['date', 'time', 'timestamp', 'datetime']):
            return 'datetime'
        elif any(t in clean_type for t in ['bool', 'boolean']):
            return 'boolean'
        elif any(t in clean_type for t in ['blob', 'binary', 'varbinary']):
            return 'binary'
        else:
            return 'text'
    except:
        return 'text'

def categorize_column_type(data_type: str, column_name: str) -> str:
    """Categorize column into semantic types based on data type and name patterns."""
    try:
        if data_type in ['integer', 'float']:
            return 'numeric'
        elif data_type == 'datetime':
            return 'temporal'
        elif data_type == 'boolean':
            return 'categorical'
        elif data_type == 'binary':
            return 'binary'
        elif data_type == 'text':
            col_lower = str(column_name).lower()
            if any(keyword in col_lower for keyword in ['id', 'key', 'code', 'status', 'type', 'category']):
                return 'categorical'
            else:
                return 'text'
        else:
            return 'categorical'
    except:
        return 'categorical'

def get_row_count(engine, table_name: str) -> Optional[int]:
    """Get table row count."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
            return result.scalar()
    except Exception as e:
        logger.warning(f"Could not get row count for {table_name}: {e}")
        return None

def get_sample_data_row(engine, table_name: str, columns: List[str]) -> Optional[Dict[str, Any]]:
    """Get a sample data row, preferring rows with fewer null values."""
    try:
        with engine.connect() as conn:
            # Strategy 1: Try to get a row with minimal nulls (first 5 columns)
            non_null_conditions = [f"{col} IS NOT NULL" for col in columns[:5]]
            
            if non_null_conditions:
                query = text(f"""
                    SELECT * FROM {table_name} 
                    WHERE {' AND '.join(non_null_conditions)}
                    LIMIT 1
                """)
                result = conn.execute(query)
                row = result.fetchone()
                
                if row:
                    raw_data = dict(zip(columns, row))
                    return clean_sample_data(raw_data)
            
            # Strategy 2: Get any row
            query = text(f"SELECT * FROM {table_name} LIMIT 1")
            result = conn.execute(query)
            row = result.fetchone()
            
            if row:
                raw_data = dict(zip(columns, row))
                return clean_sample_data(raw_data)
                
    except Exception as e:
        logger.warning(f"Could not get sample data for {table_name}: {e}")
    
    return None

def clean_sample_data(sample_data: Dict[str, Any]) -> Dict[str, Any]:
    """Clean and sanitize sample data for safe inclusion."""
    if not sample_data:
        return {}
    
    cleaned = {}
    for key, value in sample_data.items():
        try:
            if value is None:
                cleaned[key] = None
            elif isinstance(value, str):
                # Truncate very long strings but keep reasonable length
                cleaned[key] = value[:100] + "..." if len(value) > 100 else value
            elif isinstance(value, (int, float)):
                cleaned[key] = value
            elif isinstance(value, bool):
                cleaned[key] = value
            else:
                # Convert other types to string and truncate if needed
                str_value = str(value)
                cleaned[key] = str_value[:100] + "..." if len(str_value) > 100 else str_value
        except Exception as e:
            logger.warning(f"Error cleaning sample data for {key}: {e}")
            cleaned[key] = None
    
    return cleaned

def extract_database_name(connection_string: str) -> str:
    """Extract database name from connection string."""
    try:
        parsed = urlparse(connection_string)
        if parsed.path:
            return parsed.path.lstrip('/')
        elif parsed.hostname:
            return parsed.hostname.split('.')[0]
        else:
            return "unknown"
    except:
        return "unknown"

def create_empty_metadata(database_name: str) -> Dict[str, Any]:
    """Create empty metadata structure."""
    return {
        "database_name": database_name or "empty_database",
        "tables": {},
        "relationships": [],
        "total_tables": 0,
        "sample_data_available": False
    }

def get_cached_metadata(session_id: str = None) -> Dict[str, Any]:
    """Get cached metadata."""
    from app.api.sql_database import session_store
    
    if session_id not in session_store:
        raise HTTPException(status_code=404, detail="Session ID not found")
    
    try:
        # Get basic metadata
        basic_metadata = session_store[session_id]["metadata"]
        sql_dialect = session_store[session_id]["sql_dialect"]
        
        # If it's already in the new format, return it
        if isinstance(basic_metadata, dict) and "tables" in basic_metadata:
            return {
                "metadata": basic_metadata,
                "sql_dialect": sql_dialect
            }
        
        # If it's the old list format, convert it
        if isinstance(basic_metadata, list):
            enhanced_metadata = convert_legacy_metadata(basic_metadata, sql_dialect)
            
            # Cache the converted version
            session_store[session_id]["enhanced_metadata"] = enhanced_metadata
            
            return {
                "metadata": enhanced_metadata,
                "sql_dialect": sql_dialect
            }
        
        # Fallback
        return {
            "metadata": basic_metadata,
            "sql_dialect": sql_dialect
        }
        
    except Exception as e:
        logger.error(f"Error getting cached metadata: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving cached metadata")

def convert_legacy_metadata(basic_metadata: List[Dict[str, Any]], sql_dialect: str) -> Dict[str, Any]:
    """Convert legacy metadata format to new format."""
    try:
        tables_info = {}
        relationships = []
        
        for table_data in basic_metadata:
            if not isinstance(table_data, dict):
                continue
                
            table_name = table_data.get("table_name", "unknown")
            columns = table_data.get("columns", [])
            
            # Process columns
            numeric_columns = []
            categorical_columns = []
            temporal_columns = []
            text_columns = []
            
            column_details = []
            for col in columns:
                if isinstance(col, dict):
                    col_name = col.get("column_name", "")
                    data_type = normalize_data_type(col.get("data_type", ""))
                    
                    # Create detailed column info
                    column_info = {
                        "column_name": col_name,
                        "data_type": data_type,
                        "nullable": True,  # Default since not available in legacy format
                        "primary_key": False  # Will be updated from primary_keys list
                    }
                    column_details.append(column_info)
                    
                    # Categorize
                    category = categorize_column_type(data_type, col_name)
                    if category == "numeric":
                        numeric_columns.append(col_name)
                    elif category == "temporal":
                        temporal_columns.append(col_name)
                    elif category == "text":
                        text_columns.append(col_name)
                    else:
                        categorical_columns.append(col_name)
            
            # Update primary key flags
            primary_keys = table_data.get("primary_keys", [])
            for col_detail in column_details:
                if col_detail["column_name"] in primary_keys:
                    col_detail["primary_key"] = True
            
            # Process foreign key relationships
            foreign_keys = table_data.get("foreign_keys", [])
            for fk in foreign_keys:
                if isinstance(fk, dict):
                    relationships.append({
                        "from_table": table_name,
                        "from_column": fk.get("local_column", ""),
                        "to_table": fk.get("referenced_table", ""),
                        "to_column": fk.get("referenced_column", ""),
                        "relationship_type": "foreign_key"
                    })
            
            tables_info[table_name] = {
                "columns": [col.get("column_name", "") for col in columns if isinstance(col, dict)],
                "column_details": column_details,
                "primary_keys": primary_keys,
                "foreign_keys": foreign_keys,
                "numeric_columns": numeric_columns,
                "categorical_columns": categorical_columns,
                "temporal_columns": temporal_columns,
                "text_columns": text_columns,
                "row_count": None,
                "sample_data": None,
                "has_sample_data": False
            }
        
        return {
            "database_name": "unknown",
            "tables": tables_info,
            "relationships": relationships,
            "total_tables": len(tables_info),
            "sample_data_available": False,
            "connection_info": {
                "dialect": sql_dialect,
                "database_type": sql_dialect.title()
            }
        }
        
    except Exception as e:
        logger.error(f"Error converting legacy metadata: {e}")
        return create_empty_metadata("unknown")
