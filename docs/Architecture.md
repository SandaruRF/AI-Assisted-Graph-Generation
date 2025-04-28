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

## NL to SQL Query Flow

1. User query received by SQL agent
2. Metadata Retrieval from the database
3. Construct an LLM-friendly prompt
4. The LLM generates SQL based on the metadata and structured prompt.
5. Run SQL query in the external database.

```json
{
  "query": "SELECT COUNT(*) FROM customer;",
  "data": [
    {
      "COUNT(*)": 59
    }
  ]
}
```