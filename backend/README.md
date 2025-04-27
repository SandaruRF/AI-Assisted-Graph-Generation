# Graph Recommendation API

FastAPI service for recommending visualization graphs based on data characteristics.

## Setup

1. Clone this repository
2. Install dependencies: `pip install -r requirements.txt`
3. Place your training data (`recdataset.csv`) in the `data/` folder

## Running the API

```bash
uvicorn app.main:app --reload