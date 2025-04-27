import pytest
from fastapi.testclient import TestClient
from app.main import app  # Changed to absolute import
from app.models.database_model import DatabaseType  # Changed to absolute import

client = TestClient(app)


@pytest.fixture
def sample_db():
    """Returns a sample database connection payload."""
    return {
        "type": [DatabaseType.MYSQL],
        "user": "root",
        "password": "root",
        "host": "localhost",
        "port": "3306",
        "database": "sakila"
    }


def test_connect_database_success(sample_db):
    """Test if database connects successfully"""
    response = client.post("/connect_database/", json=sample_db)
    assert response.status_code == 200
    assert "message" in response.json()
    assert response.json()["message"] == "Database connection successful"


def test_connect_database_invalid():
    """Test with an invalid database type"""
    invalid_db = {
        "type": ["mysql"],
        "user": "sample",
        "password": "root",
        "host": "localhost",
        "port": "3306",
        "database": "test_db"
    }
    response = client.post("/connect_database/", json=invalid_db)
    assert response.status_code == 500
    assert "Error connecting to database" in response.json()["detail"]