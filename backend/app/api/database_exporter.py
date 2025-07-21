from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy import create_engine, inspect
import pandas as pd
import os, shutil, zipfile, uuid
from app.config import db
from app.api.sql_database import session_store

router = APIRouter()


connections_collection = db["DatabaseDetails"] 

class ExportRequest(BaseModel):
    session_id: str

@router.post("/export-db")
async def export_external_db(data: ExportRequest):
    

    connection_string = session_store[data.session_id]["connection_string"]

    try:
        engine = create_engine(connection_string)
        inspector = inspect(engine)

        export_dir = f"temp_exports/{uuid.uuid4()}"
        os.makedirs(export_dir, exist_ok=True)

        for table_name in inspector.get_table_names():
            df = pd.read_sql_table(table_name, con=engine)
            csv_path = os.path.join(export_dir, f"{table_name}.csv")
            df.to_csv(csv_path, index=False)

        zip_path = f"{export_dir}.zip"
        shutil.make_archive(export_dir, 'zip', export_dir)

        # Cleanup CSV folder after zipping
        shutil.rmtree(export_dir)

        return FileResponse(zip_path, filename="external_db_export.zip", media_type='application/zip')

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")
