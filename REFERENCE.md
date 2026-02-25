# 📋 NexusCred Testing Reference Card

## Quick Commands

```bash
# Terminal 1: Start Blockchain
cd contracts && npm run node

# Terminal 2: Deploy & Backend
cd contracts && npm run deploy:local
cd ../ && backend && python -m uvicorn app.main:app --reload --port 8000

# Terminal 3: Frontend
cd frontend && npm run dev

# Open Browser
http://localhost:5173
```

---

## Service Status Checks

```bash
# Blockchain (should return chainId)
curl -s -X POST http://127.0.0.1:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' | head -20

# Backend health
curl http://localhost:8000/api/health

# Backend status
curl http://localhost:8000/api/status

# API Documentation
http://localhost:8000/docs
```

---

## Test Accounts (Hardhat)

```
Account #0 (Deployer): 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account #1 (Issuer):   0x70997970C51812e339D9B73b0245ad59E1EB920
Account #2 (Employer): 0x3C44CdDdB6a900c2d0adcCa78e36564d404d97a0
Account #3+: Additional accounts (see Terminal 1 output)

All have 10,000 ETH each
```

---

## 5-Minute Test Flow

### 1. Issuer: Register
- Role: ISSUER
- Address: 0x70997970...
- Name: MIT
- ✅ Click "Register Issuer"

### 2. Issuer: Create Batch
```json
[
  {"student_id": "alice", "gpa": 3.8, "cloud_certified": true, "years_experience": 3, "graduation_year": 2021},
  {"student_id": "bob", "gpa": 3.5, "cloud_certified": false, "years_experience": 2, "graduation_year": 2022}
]
```
- ✅ Click "Create Batch"

### 3. Issuer: Anchor
- ✅ Click "Anchor Merkle Root"
- Note Merkle root: `0x...`

### 4. Student: Fetch Creds
- Role: STUDENT
- Student ID: alice
- ✅ Click "Fetch My Credentials"

### 5. Employer: Post Requirement
- Role: EMPLOYER
- Text: `GPA >= 3.0, cloud cert, 2+ years`
- ✅ Click "Post Requirement"
- Note requirement hash: `0x...`

### 6. Student: Generate Proof
- Requirement hash: `0x...` (from employer)
- ✅ Click "Generate Proof"

### 7. Employer: Verify
- Paste proof + hash
- ✅ Click "Verify Proof"
- ✅ SBT minted!

---

## API Endpoints Quick Reference

```bash
# ISSUER
POST /api/issuer/register
POST /api/issuer/batch/create
GET  /api/issuer/{address}
GET  /api/batch/{batch_id}
POST /api/batch/{batch_id}/anchor

# STUDENT
GET  /api/student/{student_id}/credentials
POST /api/student/{student_id}/proof/generate

# EMPLOYER
POST /api/employer/requirement
GET  /api/employer/{address}/requirements

# VERIFY
POST /api/proof/verify
GET  /api/proof/{proof_id}

# SYSTEM
GET  /api/health
GET  /api/status
GET  /api/workflow
```

---

## Contract Addresses (After Deploy)

Copy from `npm run deploy:local` output and paste into `backend/.env`:

```ini
ISSUER_VAULT_ADDRESS=0x...
ISSUER_REGISTRY_ADDRESS=0x...
CREDENTIAL_ANCHOR_ADDRESS=0x...
REQUIREMENT_COMMIT_ADDRESS=0x...
VERIFIED_ELIGIBILITY_SBT_ADDRESS=0x...
NEXUS_VERIFIER_ADDRESS=0x...
GROTH16_VERIFIER_ADDRESS=0x...
```

---

## What's Happening On-Chain

| Step | Contract | Action |
|------|----------|--------|
| 1 | IssuerRegistry | registerIssuer() |
| 2 | IssuerVault | deposit() stake |
| 3 | CredentialAnchor | anchorMerkleRoot() |
| 4 | RequirementCommit | commitRequirement() |
| 5 | NexusVerifier | verifyEligibility() |
| 6 | VerifiedEligibilitySBT | mint() SBT |

---

## Privacy Guarantees

| Data | Revealed? |
|------|-----------|
| Full GPA | ❌ NO |
| Certificate names | ❌ NO |
| Exact dates | ❌ NO |
| Merkle root | ✅ YES (immutable) |
| Requirement hash | ✅ YES (blind) |
| ZK proof | ✅ YES (verified) |
| Student address | ✅ YES (linked) |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port in use | Kill process: `lsof -ti:8545 \| xargs kill -9` |
| No contracts | `cd contracts && npm run build && npm run deploy:local` |
| Backend error | Check RPC_URL in .env = http://127.0.0.1:8545 |
| Frontend error | Check CORS (already enabled in main.py) |
| Proof too slow | First run compiles circuit (~20s); cached after |

---

## Key Files

```
contracts/           Smart contracts
├── contracts/
│   ├── IssuerRegistry.sol
│   ├── IssuerVault.sol
│   ├── CredentialAnchor.sol
│   ├── RequirementCommit.sol
│   ├── NexusVerifier.sol
│   └── VerifiedEligibilitySBT.sol
└── scripts/
    └── deploy-local.ts

backend/             FastAPI (20+ endpoints)
├── app/
│   └── main.py       (400+ LOC)
├── requirements.txt
└── .env

frontend/            Vite dashboards
├── src/
│   ├── main.ts       (role selector)
│   ├── issuer.ts     (batch creation)
│   ├── student.ts    (credentials)
│   ├── employer.ts   (requirements)
│   ├── api.ts        (API client)
│   └── style.css
└── package.json

zk/                  ZK circuits
├── circuits/
│   ├── main.circom   (cross-credential)
│   └── simple.circom
├── scripts/
│   ├── generateProof.js
│   └── verifyProof.js
└── utils/
    └── merkle.js
```

---

## Documentation Map

| Document | Best For |
|----------|----------|
| **START_HERE.md** | First-time setup |
| **QUICK-START.md** | Quick reference |
| **TESTING.md** | Detailed walkthrough |
| **BLOCKCHAIN_FLOWS.md** | Understanding flows |
| **README.md** | Project overview |
| **http://localhost:8000/docs** | API testing |

---

## Common Timeouts

```
Blockchain startup:     ~1 minute
Deploy contracts:       ~1-2 minutes
Backend startup:        ~30 seconds
Frontend startup:       ~30 seconds
First proof generation: ~10-20 seconds
Proof verification:     ~5 milliseconds
SBT mint:              ~2-3 seconds
```

---

## Next Actions

- [ ] Start blockchain (Terminal 1)
- [ ] Deploy contracts (Terminal 2)
- [ ] Start backend (Terminal 2)
- [ ] Start frontend (Terminal 3)
- [ ] Open http://localhost:5173
- [ ] Test Issuer role
- [ ] Test Student role
- [ ] Test Employer role
- [ ] View contract state via Hardhat console
- [ ] Review TESTING.md for advanced scenarios

---

**Print or bookmark this page for quick reference while testing!** 📌
