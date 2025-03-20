import mysql.connector
from app.config import DB_CONFIG

def fetch_schema():
    """Fetch schema from MySQL database."""
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()

    schema_info = ""
    cursor.execute("SHOW TABLES;")
    tables = cursor.fetchall()

    for table in tables:
        table_name = table[0]
        schema_info += f"Table: {table_name}\n"
        
        cursor.execute(f"DESCRIBE {table_name};")
        columns = cursor.fetchall()
        for col in columns:
            schema_info += f" - {col[0]} ({col[1]})\n"

    conn.close()
    return schema_info
