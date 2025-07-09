from app.utils.logging import logger
import openai
import os




def generate_embedding(text):
    response = openai.Embedding.create(
        input=text,
        model="text-embedding-ada-002"
    )
    logger.info(f"Generated embedding for text: {response['data'][0]['embedding']}")
    return response['data'][0]['embedding']



