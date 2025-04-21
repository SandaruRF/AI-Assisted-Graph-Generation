## Intent Classification Flow

1. User query received by IntentAgent
2. Attempt classification using Gemini API
3. Return structured response:

```json
{
  "intent": "visualization_insight",
  "confidence": 0.95
}
```
