# 🚀 Credchain Quick Reference Guide

## Quick Start (Windows)

### Option 1: Automated (Easiest)
```bash
cd d:\projects\mainprojects\Nexes
start-local.bat
```
This opens 3 terminal windows automatically.

### Option 2: Manual (3 Terminals)

**Terminal 1: Start Blockchain**
```bash
cd contracts
npm install
npm run node
```

**Terminal 2: Deploy & Start Backend**
```bash
cd contracts
npm run deploy:local
# Copy contract addresses to backend\.env

cd ../backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

**Terminal 3: Start Frontend**
```bash
cd frontend
npm install
npm run dev
```

Then open: http://localhost:5173

---

## Quick Start (Mac/Linux)

```bash
make install          # Install dependencies
make setup            # Create .env files
make start-blockchain # Terminal 1
make deploy           # Deploy contracts
make start-backend    # Terminal 2
make start-frontend   # Terminal 3
```

---

## URLs After Startup

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Web dashboard |
| Backend API | http://localhost:8000 | REST API |
| API Docs | http://localhost:8000/docs | Swagger UI |
| Blockchain | http://127.0.0.1:8545 | RPC endpoint |

---

## Test Accounts (From Hardhat)

All have 10,000 ETH:

```
Account #0 (Deployer):
  Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  Private: 0xac0974bec39a17e36ba4a6b4d238ff944bacb476c6b8d6c1f20c9bfb9ccc1abc

Account #1 (Issuer):
  Address: 0x70997970C51812e339D9B73b0245ad59E1EB920
  Private: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

Account #2 (Employer):
  Address: 0x3C44CdDdB6a900c2d0adcCa78e36564d404d97a0
  Private: 0x5de4111afa1a4b94908f83103db1fb50b4e6421c

Account #3-19: Additional accounts available
```

---

## 5-Minute Test Walkthrough

### 1️⃣ Register as Issuer (MIT)
- Role: **Issuer**
- Address: `0x70997970C51812e339D9B73b0245ad59E1EB920`
- Name: `MIT`
- Stake: `1000`
- ✅ Registered on-chain in IssuerRegistry

### 2️⃣ Create Credential Batch
**Paste JSON:**
```json
[
  {"student_id": "alice", "gpa": 3.8, "cloud_certified": true, "years_experience": 3, "graduation_year": 2021},
  {"student_id": "bob", "gpa": 3.5, "cloud_certified": false, "years_experience": 2, "graduation_year": 2022}
]
```
- ✅ Merkle root calculated
- ✅ Fraud score: 0.XX

### 3️⃣ Anchor to Blockchain
- Click "Anchor Merkle Root"
- ✅ Stored in CredentialAnchor contract
- ✅ Students can now verify credentials

### 4️⃣ Student: Fetch Credentials
- Role: **Student**
- Student ID: `alice`
- ✅ See credentials with Merkle proofs

### 5️⃣ Employer: Post Requirement
- Role: **Employer**
- Text: `GPA >= 3.0, cloud cert, 2+ years`
- ✅ Hash commitment on-chain

### 6️⃣ Student: Generate Proof
- Requirement hash: (from employer)
- Click "Generate Proof (Local)"
- ✅ Proof generated **offline** (privacy)
- ✅ Shows what's revealed vs hidden

### 7️⃣ Employer: Verify Proof
- Paste proof + requirement hash
- Click "Verify Proof"
- ✅ NexusVerifier checks proof
- ✅ ERC-5192 SBT minted to student

---

## What's on-Chain vs Off-Chain

✅ **ON-CHAIN (in smart contracts)**
- Merkle roots (credential batches)
- Requirement hashes (employer commitments)
- Proof verification results
- SBT token mints

❌ **OFF-CHAIN (not revealed)**
- Full credentials (GPA, certs, dates)
- Student personal data
- ZK circuit inputs
- Raw employee requirements

---

## Key Files

```
contracts/          Smart contracts & Hardhat
├── contracts/
│   ├── IssuerRegistry.sol      - Issuer registration
│   ├── IssuerVault.sol         - Stake management
│   ├── CredentialAnchor.sol    - Merkle root storage
│   ├── RequirementCommit.sol   - Blind requirements
│   ├── NexusVerifier.sol       - Proof verification
│   └── VerifiedEligibilitySBT.sol - ERC-5192 tokens
├── scripts/
│   └── deploy-local.ts         - Deployment script
└── hardhat.config.ts           - Network config

backend/            FastAPI REST API
├── app/
│   └── main.py                 - 20+ endpoints
├── requirements.txt            - Dependencies
└── .env                        - Configuration

frontend/           Vite web UI
├── src/
│   ├── main.ts                 - Role selector
│   ├── issuer.ts               - Issuer dashboard
│   ├── student.ts              - Student wallet
│   ├── employer.ts             - Employer dashboard
│   ├── api.ts                  - API client
│   └── style.css               - Styling
└── package.json                - Config

zk/                 ZK circuits
├── circuits/
│   ├── main.circom             - Cross-credential circuit
│   └── simple.circom           - Test circuit
├── scripts/
│   ├── generateProof.js        - Proof generation
│   └── verifyProof.js          - Proof verification
└── utils/
    └── merkle.js               - Merkle tree utils

docs/               Documentation
├── ARCHITECTURE.md             - System design
├── THREAT_MODEL.md             - Security analysis
└── TESTING.md                  - Detailed testing guide
```

---

## Common Commands

**Check if services are running:**
```bash
curl http://localhost:8000/api/health           # Backend
curl http://localhost:5173                      # Frontend
curl -s -X POST http://127.0.0.1:8545 -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' # Blockchain
```

**View contract details:**
```bash
cd contracts
npx hardhat console --network localhost
> const reg = await ethers.getContractAt("IssuerRegistry", "0x...")
> await reg.issuers("0x70997970...")
```

**View logs:**
```bash
# Backend requests
curl -v http://localhost:8000/api/status

# Blockchain events (in Terminal 1)
# Watch for transaction confirmations
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Port 8545 already in use" | Kill process: `lsof -ti:8545 \| xargs kill -9` |
| "Cannot connect to RPC" | Check Hardhat node status in Terminal 1 |
| "Contract addresses undefined" | Update backend/.env with deploy output |
| "Frontend can't reach backend" | Check CORS enabled in main.py |
| "Proof generation takes 30s+" | First run is normal; uses Circom compilation cache |
| "SBT not minting" | Ensure NexusVerifier has MINTER_ROLE granted |

---

## Next Steps After Testing

1. **Try different scenarios:**
   - Multiple issuers (MIT, Stanford, Google)
   - Multiple students with varying credentials
   - Complex requirements (GPA, certs, experience)

2. **Inspect blockchain:**
   - Use Hardhat console to query contract state
   - Watch gas usage for different operations
   - Trace fraud detection logic

3. **Scale testing:**
   - Create larger credential batches (100 credentials)
   - Generate multiple proofs simultaneously
   - Test slashing mechanisms

4. **Deploy to testnet:**
   - Update hardhat.config.ts with Sepolia RPC
   - Deploy to public testnet
   - Test with real blockchain explorers

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (Frontend)                      │
│  Issuer / Student / Employer Dashboard                       │
│  http://localhost:5173                                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
              ┌─────────▼──────────┐
              │   Vite + TypeScript   │
              │  (src/main.ts, etc.)  │
              └─────────┬──────────┘
                        │
         ┌──────────────┴──────────────┐
         │                              │
    ┌────▼──────┐            ┌────────▼────┐
    │ Backend    │            │ ZK Circuits │
    │ (FastAPI)  │            │ (Circom)    │
    │ :8000     │            │ Local gen   │
    └────┬──────┘            └────────────┘
         │
    ┌────▼──────────────────────────────────┐
    │      Smart Contracts (Solidity)        │
    │   IssuerRegistry, Vault, Anchor,       │
    │   RequirementCommit, Verifier, SBT    │
    │                                        │
    │  Local Blockchain (Hardhat)            │
    │  http://127.0.0.1:8545                │
    └─────────────────────────────────────┘
```

---

## More Information

- **Full Testing Guide**: See `TESTING.md`
- **Architecture Details**: See `docs/ARCHITECTURE.md`
- **Security Analysis**: See `docs/THREAT_MODEL.md`
- **Backend API**: http://localhost:8000/docs (Swagger UI)

---

**🎉 Happy testing! Open http://localhost:5173 to get started.**
