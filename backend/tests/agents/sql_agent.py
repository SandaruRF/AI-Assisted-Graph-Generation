import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from app.main import app


client = TestClient(app)

@pytest.fixture
def mock_generate_sql_query():
    """Mock the SQL generation function"""
    with patch("app.services.text_to_sql_service.generate_sql_query") as mock:
        yield mock

def test_sql_query_conversion(mock_generate_sql_query):
    """Test if NL query correctly converts to an SQL query"""
    mock_generate_sql_query.return_value = "SELECT FirstName, LastName FROM customer;"

    nl_query = "give me all customer names"
    response = client.get(f"/sql_query?nl_query={nl_query}")

    assert response.status_code == 200
    assert "query" in response.json()
    assert response.json()["query"] == "SELECT FirstName, LastName FROM customer;"



def test_sql_query_count_artists(mock_generate_sql_query):
    """Test if NL query correctly converts to a COUNT SQL query"""
    mock_generate_sql_query.return_value = "SELECT COUNT(*) FROM artist;"
    
    nl_query = "give me number of artists"
    response = client.get(f"/sql_query?nl_query={nl_query}")
    
    assert response.status_code == 200
    assert "query" in response.json()
    assert response.json()["query"] == "SELECT COUNT(*) FROM artist;"
    assert "data" in response.json()
    assert isinstance(response.json()["data"], list)