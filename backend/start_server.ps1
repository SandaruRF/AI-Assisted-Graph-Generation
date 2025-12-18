# Activate virtual environment
..\venv\Scripts\Activate.ps1

# Set environment variables to disable CUDA
$env:NUMBA_DISABLE_CUDA = "1"
$env:CUDA_VISIBLE_DEVICES = ""

# Start the server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
