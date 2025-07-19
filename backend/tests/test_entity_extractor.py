import pytest
from app.agents.intent_agent.entity_extractor import EntityExtractor

# Initialize the extractor outside of the test functions
extractor = EntityExtractor()

# Queries to test entity extraction
queries = [
    "Change to a bar chart and use red and green",
    "Label the x-axis as 'Month' and y-axis as 'Revenue'",
    "Switch to a pie chart and use blue and yellow",
    "Make the revenue line orange"
]

# Test function for entity extraction
@pytest.mark.parametrize("query", queries)
def test_entity_extraction(query):
    print(f"\n🟡 Query: {query}")
    result = extractor.extract_customization_entities(query)
    print(f"✅ Extracted: {result}")
    # Add assertions based on expected outcomes
    # Example: assert something based on expected result
    assert result is not None  # Example check to ensure output is not None
