# NexusCred Backend

FastAPI backend for the NexusCred credential verification system.

## Setup

```bash
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

## Endpoints

- `GET /` - Root endpoint with API info
- `GET /api/health` - Health check
- `GET /api/workflow` - Get the NexusCred workflow steps
- `GET /api/issuers` - Get registered issuers (stub)
- `POST /api/credentials/issue` - Issue a batch of credentials (stub)
- `GET /api/credentials/{batch_id}` - Retrieve credentials
- `POST /api/proofs/submit` - Submit a ZK proof for verification

## Features

- CORS enabled for frontend communication
- Verifiable credentials (VCs) API
- Zero-knowledge proof submission endpoint
- Workflow orchestration
