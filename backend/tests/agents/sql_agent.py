import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_path = Path(__file__).resolve().parents[3] / "backend"
sys.path.append(str(backend_path))

from app.main import app

client = TestClient(app)

@pytest.mark.asyncio
async def test_get_sql_query():
    test_cases = [
        ("Get all customers", {"query": "SELECT * FROM customer;"}),  # Successful case
        ("Find Nancy", {"detail": "The query 'Find Nancy' is ambiguous. Specify whether to search in the customer or employee table."}),  # Error case
        ("List active orders", {"query": "SELECT * FROM orders WHERE status = 'active';"})  # Successful case
    ]

    for nl_query, expected_response in test_cases:
        with patch("app.services.text_to_sql_service.generate_sql_query", new=AsyncMock(return_value=expected_response.get("query", ""))):
            response = client.get("/sql_query", params={"nl_query": nl_query})

            assert response.status_code == 200, f"Unexpected response: {response.json()}"

            if "detail" in expected_response:
                # Check for error response
                assert response.json()["detail"] == expected_response["detail"]
            else:
                # Check for successful response
                assert response.json()["query"] == expected_response["query"]
