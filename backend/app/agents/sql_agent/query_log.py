import datetime
from app.config import db

query_logs_collection = db["sql_query_log"]

def log_query(session_id, prompt, sql_query, date_run=None):
    """
    Logs SQL query metadata to the MongoDB collection 'query_logs'.
    Args:
        user_email (str): The user's email.
        prompt (str): The user's prompt.
        sql_query (str): The generated SQL query.
        date_run (str, optional): Date the query was run. Defaults to today.
    """
    now = datetime.datetime.now()
    if date_run is None:
        date_run = now.strftime("%Y-%m-%d")
    time_run = now.strftime("%H:%M:%S")
    log_entry = {
        "session_id": session_id,
        "prompt": prompt,
        "date_run": date_run,
        "time_run": time_run,
        "query": sql_query,
    }
    query_logs_collection.insert_one(log_entry)


