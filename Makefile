# NexusCred Makefile - Quick commands for local testing

.PHONY: help install clean setup deploy start-blockchain start-backend start-frontend test docs

help:
	@echo "NexusCred Local Testing Commands"
	@echo "================================="
	@echo ""
	@echo "Setup & Installation:"
	@echo "  make install          - Install all dependencies"
	@echo "  make setup            - Set up environment files"
	@echo "  make clean            - Clean all build artifacts"
	@echo ""
	@echo "Running Services:"
	@echo "  make start-blockchain - Start Hardhat node (http://127.0.0.1:8545)"
	@echo "  make start-backend    - Start FastAPI backend (http://127.0.0.1:8000)"
	@echo "  make start-frontend   - Start Vite frontend (http://127.0.0.1:5173)"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy           - Deploy contracts to localhost"
	@echo ""
	@echo "Quick Test:"
	@echo "  make test             - Run test suite"
	@echo "  make test-api         - Test backend API"
	@echo "  make test-contracts   - Test smart contracts"
	@echo ""
	@echo "Documentation:"
	@echo "  make docs             - View testing documentation"
	@echo ""

install:
	@echo "Installing dependencies..."
	cd contracts && npm install
	cd frontend && npm install
	cd backend && pip install -r requirements.txt
	@echo "✅ Dependencies installed!"

setup:
	@echo "Setting up environment..."
	@if [ ! -f backend/.env ]; then cp backend/.env.example backend/.env; fi
	@echo "✅ Environment configured!"
	@echo "Note: Update contract addresses in backend/.env after deploying"

clean:
	@echo "Cleaning build artifacts..."
	rm -rf contracts/artifacts contracts/cache
	rm -rf backend/__pycache__ backend/.pytest_cache
	rm -rf frontend/dist frontend/node_modules/.vite
	@echo "✅ Clean complete!"

start-blockchain:
	@echo "Starting Hardhat node on http://127.0.0.1:8545"
	cd contracts && npm run node

start-backend:
	@echo "Starting FastAPI backend on http://127.0.0.1:8000"
	cd backend && python -m uvicorn app.main:app --reload --port 8000

start-frontend:
	@echo "Starting Vite frontend on http://127.0.0.1:5173"
	cd frontend && npm run dev

deploy:
	@echo "Deploying contracts to localhost..."
	cd contracts && npm run deploy:local

test:
	@echo "Running tests..."
	cd contracts && npm run test
	cd backend && pytest
	@echo "✅ Tests complete!"

test-api:
	@echo "Testing backend API..."
	@echo "GET /api/status"
	curl http://localhost:8000/api/status
	@echo "\nGET /api/workflow"
	curl http://localhost:8000/api/workflow

test-contracts:
	@echo "Testing smart contracts..."
	cd contracts && npm run test

docs:
	@echo "Opening testing documentation..."
	@cat TESTING.md

.DEFAULT_GOAL := help
