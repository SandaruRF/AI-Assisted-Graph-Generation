import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_path = Path(__file__).resolve().parents[3] / "backend"
sys.path.append(str(backend_path))

# Debugging: Print the Python path to verify
print(f"Python path: {sys.path}")

from app.main import app  # Adjusted import

client = TestClient(app)

@pytest.mark.asyncio
async def test_get_sql_query():
    test_cases = [
        ("Get all customers", "SELECT * FROM customer;"),
        ("Find Nancy", {
            "error": "The query 'Find Nancy' is ambiguous. Specify whether to search in the customer or employee table."
        }),
        ("List active orders", "SELECT * FROM orders WHERE status = 'active';")
    ]
    
    for nl_query, expected_response in test_cases:
        with patch("app.services.text_to_sql_service.generate_sql_query", new=AsyncMock(return_value=expected_response)):
            response = client.get("/sql_query", params={"nl_query": nl_query})
            
            assert response.status_code == 200, f"Unexpected response: {response.json()}"
            
            if isinstance(expected_response, dict) and "error" in expected_response:
                assert response.json()["detail"] == expected_response["error"]
            else:
                assert response.json()["query"] == expected_response
