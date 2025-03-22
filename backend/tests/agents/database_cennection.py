import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_path = Path(__file__).resolve().parents[3] / "backend"
sys.path.append(str(backend_path))

# Debugging: Print the Python path to verify
print(f"Python path: {sys.path}")

from app.main import app  # Import your FastAPI app instance
from app.models.database_model import Database, DatabaseType

client = TestClient(app)

def test_database_connection():
    test_db = {
        "type": [DatabaseType.MYSQL],  # Change this based on your test DB type
        "user": "root",
        "password": "root",
        "host": "localhost",
        "port": 3306,
        "database": "chinook"
    }
    
    response = client.post("/connect_database/", json=test_db)
    
    assert response.status_code == 200, f"Unexpected response: {response.json()}"
    assert "message" in response.json()
    assert response.json()["message"] == "Database connection successful"
    assert "connection_string" in response.json()
    assert "tables" in response.json()
