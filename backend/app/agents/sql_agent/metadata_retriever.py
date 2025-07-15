from fastapi import HTTPException
from sqlalchemy import create_engine, MetaData, text
from typing import List, Dict, Any, Optional
import re
from urllib.parse import urlparse

from app.utils.logging import logger

def reflect_sql_metadata(connection_string: str, 
                        database_name: Optional[str] = None,
                        include_sample_data: bool = False) -> Dict[str, Any]:
    """Simplified enhanced metadata retriever - bulletproof version."""
    
    try:
        engine = create_engine(connection_string)
        metadata = MetaData()
        metadata.reflect(bind=engine)
        
        logger.info("Database connection and reflection successful.")
        
        if not metadata.tables:
            return create_empty_metadata(database_name)
        
        # Extract database name
        if not database_name:
            database_name = extract_database_name(connection_string)
        
        # Build basic enhanced metadata
        tables_info = {}
        relationships = []
        
        for table_name, table in metadata.tables.items():
            # Process columns safely
            column_data = []
            numeric_cols = []
            categorical_cols = []
            temporal_cols = []
            text_cols = []
            
            for column in table.columns:
                clean_type = safe_normalize_data_type(str(column.type))
                
                column_info = {
                    "column_name": column.name,
                    "data_type": clean_type
                }
                column_data.append(column_info)
                
                # Categorize columns
                category = safe_categorize_column(clean_type, column.name)
                if category == "numeric":
                    numeric_cols.append(column.name)
                elif category == "temporal":
                    temporal_cols.append(column.name)
                elif category == "text":
                    text_cols.append(column.name)
                else:
                    categorical_cols.append(column.name)
            
            # Process foreign keys safely
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
                        "to_table": fk.column.table.name,
                        "relationship_type": "foreign_key"
                    })
                except Exception as e:
                    logger.warning(f"Error processing foreign key: {e}")
                    continue
            
            # Get row count safely
            row_count = safe_get_row_count(engine, table_name)
            
            # Build table info
            tables_info[table_name] = {
                "columns": [col["column_name"] for col in column_data],
                "column_details": column_data,
                "primary_keys": [pk.name for pk in table.primary_key.columns],
                "foreign_keys": foreign_keys,
                "numeric_columns": numeric_cols,
                "categorical_columns": categorical_cols,
                "temporal_columns": temporal_cols,
                "text_columns": text_cols,
                "row_count": row_count,
                "description": f"Data table containing {table_name} information"
            }
        
        # Simple domain detection
        domain = detect_simple_domain(database_name, list(tables_info.keys()))
        
        # Build final metadata
        enhanced_metadata = {
            "database_name": database_name,
            "tables": tables_info,
            "domain_indicators": domain,
            "relationships": relationships,
            "total_tables": len(tables_info),
            "connection_info": {
                "dialect": engine.dialect.name,
                "database_type": engine.dialect.name.title()
            }
        }
        
        logger.info(f"Enhanced metadata retrieved for {len(tables_info)} tables. Domain: {domain}")
        return enhanced_metadata
        
    except Exception as e:
        logger.error(f"Error in metadata reflection: {e}")
        raise HTTPException(status_code=500, detail=f"Metadata reflection failed: {e}")

def safe_normalize_data_type(data_type: str) -> str:
    """Safe data type normalization."""
    try:
        data_type_lower = str(data_type).lower()
        clean_type = re.sub(r' collate ".*"', '', data_type_lower)
        clean_type = re.sub(r'\(\d+\)', '', clean_type)
        
        if any(t in clean_type for t in ['int', 'integer', 'bigint', 'smallint']):
            return 'integer'
        elif any(t in clean_type for t in ['float', 'double', 'real', 'decimal']):
            return 'float'
        elif any(t in clean_type for t in ['varchar', 'char', 'text', 'string']):
            return 'text'
        elif any(t in clean_type for t in ['date', 'time', 'timestamp', 'datetime']):
            return 'datetime'
        else:
            return 'text'
    except:
        return 'text'

def safe_categorize_column(data_type: str, column_name: str) -> str:
    """Safe column categorization."""
    try:
        if data_type in ['integer', 'float']:
            return 'numeric'
        elif data_type == 'datetime':
            return 'temporal'
        elif data_type == 'text':
            col_lower = str(column_name).lower()
            if any(keyword in col_lower for keyword in ['id', 'key', 'code', 'status']):
                return 'categorical'
            else:
                return 'text'
        else:
            return 'categorical'
    except:
        return 'categorical'

def safe_get_row_count(engine, table_name: str) -> Optional[int]:
    """Safely get table row count."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
            return result.scalar()
    except:
        return None

def detect_simple_domain(database_name: str, table_names: List[str]) -> str:
    """Simple domain detection."""
    try:
        db_lower = str(database_name).lower()
        tables_text = " ".join(str(name).lower() for name in table_names)
        
        if "chinook" in db_lower or any(word in tables_text for word in ["track", "album", "artist"]):
            return "media_entertainment"
        elif any(word in tables_text for word in ["customer", "order", "product"]):
            return "e_commerce"
        elif any(word in tables_text for word in ["account", "transaction", "payment"]):
            return "financial_services"
        else:
            return "general_business"
    except:
        return "general_business"

def create_empty_metadata(database_name: str) -> Dict[str, Any]:
    """Create empty metadata structure."""
    return {
        "database_name": database_name or "empty_database",
        "tables": {},
        "domain_indicators": "unknown",
        "relationships": [],
        "total_tables": 0
    }

def extract_database_name(connection_string: str) -> str:
    """Extract database name from connection string."""
    try:
        parsed = urlparse(connection_string)
        return parsed.path.lstrip('/') if parsed.path else "unknown"
    except:
        return "unknown"

def get_cached_metadata(session_id: str = None) -> Dict[str, Any]:
    """Get cached metadata with enhanced processing."""
    from app.api.sql_database import session_store
    
    if session_id not in session_store:
        raise HTTPException(status_code=404, detail="Session ID not found")
    
    try:
        # Get basic metadata
        basic_metadata = session_store[session_id]["metadata"]
        sql_dialect = session_store[session_id]["sql_dialect"]
        
        # If it's already enhanced, return it
        if isinstance(basic_metadata, dict) and "domain_indicators" in basic_metadata:
            return {
                "metadata": basic_metadata,
                "sql_dialect": sql_dialect
            }
        
        # If it's the old format, convert it
        if isinstance(basic_metadata, list):
            enhanced_metadata = convert_basic_to_enhanced(basic_metadata, sql_dialect)
            
            # Cache the enhanced version
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

def convert_basic_to_enhanced(basic_metadata: List[Dict[str, Any]], sql_dialect: str) -> Dict[str, Any]:
    """Convert basic metadata to enhanced format safely."""
    try:
        tables_info = {}
        
        for table_data in basic_metadata:
            if not isinstance(table_data, dict):
                continue
                
            table_name = table_data.get("table_name", "unknown")
            columns = table_data.get("columns", [])
            
            # Process columns safely
            numeric_cols = []
            categorical_cols = []
            temporal_cols = []
            text_cols = []
            
            for col in columns:
                if isinstance(col, dict):
                    col_name = col.get("column_name", "")
                    data_type = safe_normalize_data_type(col.get("data_type", ""))
                    
                    category = safe_categorize_column(data_type, col_name)
                    if category == "numeric":
                        numeric_cols.append(col_name)
                    elif category == "temporal":
                        temporal_cols.append(col_name)
                    elif category == "text":
                        text_cols.append(col_name)
                    else:
                        categorical_cols.append(col_name)
            
            tables_info[table_name] = {
                "columns": [col.get("column_name", "") for col in columns if isinstance(col, dict)],
                "column_details": columns,
                "primary_keys": table_data.get("primary_keys", []),
                "foreign_keys": table_data.get("foreign_keys", []),
                "numeric_columns": numeric_cols,
                "categorical_columns": categorical_cols,
                "temporal_columns": temporal_cols,
                "text_columns": text_cols,
                "description": f"Data table containing {table_name} information"
            }
        
        return {
            "database_name": "unknown",
            "tables": tables_info,
            "domain_indicators": detect_simple_domain("unknown", list(tables_info.keys())),
            "relationships": [],
            "total_tables": len(tables_info),
            "connection_info": {
                "dialect": sql_dialect,
                "database_type": sql_dialect.title()
            }
        }
        
    except Exception as e:
        logger.error(f"Error converting metadata: {e}")
        return create_empty_metadata("unknown")
