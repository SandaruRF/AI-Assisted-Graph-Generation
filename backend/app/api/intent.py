from fastapi import APIRouter
from agents.intent_agent.classifier import IntentClassifier

router = APIRouter()
classifier = IntentClassifier()

@router.post("/classify-intent")
async def classify_intent(query: str):
    return classifier.classify(query)