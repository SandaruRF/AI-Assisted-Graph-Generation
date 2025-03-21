import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock
import sys
from pathlib import Path

# Add the backend directory to the Python path
sys.path.append(str(Path(__file__).resolve().parents[3] / "backend"))

from app.main import app  # Adjusted import
from app.services.text_to_sql_service import generate_sql_query

client = TestClient(app)

@pytest.mark.asyncio
async def test_get_sql_query():
    test_cases = [
        ("Get all actors", "SELECT * FROM actors;"),
        ("Find Nancy", "SELECT * FROM employee WHERE name = 'Nancy';"),
        ("List active orders", "SELECT * FROM orders WHERE status = 'active';")
    ]
    
    for nl_query, expected_sql in test_cases:
        async_mock_generate_sql_query = AsyncMock(return_value=expected_sql)
        global generate_sql_query
        generate_sql_query = async_mock_generate_sql_query
        
        response = client.get("/sql_query", params={"nl_query": nl_query})
        
        assert response.status_code == 200
        assert response.json()["query"] == expected_sql
