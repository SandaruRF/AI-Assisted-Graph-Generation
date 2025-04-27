import pytest 
from backend.app.agents.intent_agent.intent_classifier import IntentClassifier

def test_combined_intents():
    classifier = IntentClassifier()
    result = classifier.classify("Plot sales and explain anomalies")
    assert result["intent"] == "visualization_insight_explanation"
    assert result["confidence"] >= 0.8

def test_single_intent():
    classifier = IntentClassifier()
    result = classifier.classify("Show me the top 10 products by revenue")
    assert result["intent"] == "visualization_insight"
    assert result["confidence"] >= 0.8
