from .api_client import GeminiClient

class IntentClassifier:
    def __init__(self):
        self.api_client = GeminiClient()
        
    def classify(self, query: str) -> str:
        api_result = self.api_client.classify_intent(query)
        if api_result:
            return api_result
        else:
            return "Unknown Intent"