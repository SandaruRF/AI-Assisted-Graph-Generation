from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Test server working"}

@app.get("/test")
async def test():
    return {"test": "working"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)