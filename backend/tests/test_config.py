import pytest 
from app.config import settings

def test_required_settings():
    assert settings.GOOGLE_API_KEY, "GOOGLE_API_KEY is required"