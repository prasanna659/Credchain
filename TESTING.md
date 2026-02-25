# 🧪 Credchain — Local Testing Guide

This guide walks you through testing the complete Credchain system end-to-end, including blockchain interactions, smart contracts, backend API, and frontend dashboards.

---

## Prerequisites

Ensure you have installed:
- **Node.js** (v18+)
- **Python** (3.8+)
- **Git**

```bash
node --version    # Should be v18+
python --version  # Should be 3.8+
```

---

## Setup: 3 Terminals Required

You'll need **3 terminal windows** running simultaneously:
1. **Terminal 1**: Local blockchain (Hardhat node)
2. **Terminal 2**: Backend (FastAPI server)
3. **Terminal 3**: Frontend (Vite dev server)

---

## Step 2: Deploy Smart Contracts (Terminal 1 - New Tab)

```bash
cd d:\projects\mainprojects\Nexes\contracts
node scripts/deploy-standalone.js
```

**Expected output**:
```
🚀 Starting standalone contract deployment...
👤 Deploying with account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
💰 Account balance: 10000.0 ETH
🎉 Mock contract addresses generated!
📍 Contract Addresses:
{
  "network": "localhost",
  "IssuerVault": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  "IssuerRegistry": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  ...
}
✅ Setup complete!
```

This creates mock contract addresses for testing. The contracts are now ready for interaction.

---

## Step 3: Start Backend API (Terminal 2)

```bash
# Install Python dependencies (if needed)
cd d:\projects\mainprojects\Nexes\backend
pip install fastapi uvicorn pydantic web3 python-dotenv

# Start the API server
py -m uvicorn app.main:app --reload --port 8000
```

**Expected output**:
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**API Documentation**: Visit http://localhost:8000/docs

---

## Step 4: Start Frontend (Terminal 3)

```bash
cd d:\projects\mainprojects\Nexes\frontend
npm install
npm run dev
```

**Expected output**:
```
VITE v7.3.1  ready in 476 ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Frontend URL**: http://localhost:5173

---

## Step 2: Deploy Contracts (Terminal 2, New Tab)

Open a **new terminal** and run:

```bash
cd d:\projects\mainprojects\Nexes\contracts
npm run deploy:local
```

**Expected output**:
```json
{
  "network": "localhost",
  "IssuerVault": "0x...",
  "IssuerRegistry": "0x...",
  "CredentialAnchor": "0x...",
  "RequirementCommit": "0x...",
  "VerifiedEligibilitySBT": "0x...",
  "Groth16Verifier": "0x...",
  "NexusVerifier": "0x..."
}
```

**Save these addresses** — you'll use them to connect the backend.

---

## Step 3: Configure Backend (Terminal 2)

Create a `.env` file in the `backend/` directory:

```bash
cd d:\projects\mainprojects\Nexes\backend
```

Create `backend/.env`:

```ini
# Blockchain Network
RPC_URL=http://127.0.0.1:8545
NETWORK=localhost
CHAIN_ID=31337

# Smart Contract Addresses (from deploy output above)
ISSUER_VAULT_ADDRESS=0x[copy-from-deploy]
ISSUER_REGISTRY_ADDRESS=0x[copy-from-deploy]
CREDENTIAL_ANCHOR_ADDRESS=0x[copy-from-deploy]
REQUIREMENT_COMMIT_ADDRESS=0x[copy-from-deploy]
VERIFIED_ELIGIBILITY_SBT_ADDRESS=0x[copy-from-deploy]
NEXUS_VERIFIER_ADDRESS=0x[copy-from-deploy]
GROTH16_VERIFIER_ADDRESS=0x[copy-from-deploy]

# Issuer Account (from Hardhat accounts)
ISSUER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb476c6b8d6c1f20c9bfb9ccc1abc

# API Config
API_PORT=8000
API_HOST=0.0.0.0
```

> **Note**: The private key above is a default Hardhat account. Never use real private keys in development.

---

## Step 4: Start Backend (Terminal 2)

```bash
cd d:\projects\mainprojects\Nexes\backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

**Expected output**:
```
Uvicorn running on http://127.0.0.1:8000
```

Visit http://localhost:8000/docs to see the interactive API documentation (Swagger UI).

---

## Step 5: Start Frontend (Terminal 3)

Open a **third terminal** and run:

```bash
cd d:\projects\mainprojects\Nexes\frontend
npm install
npm run dev
```

**Expected output**:
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:5173/
```

Visit http://localhost:5173 in your browser.

---

## Testing Scenarios

### Scenario 1: Issuer Registration & Batch Creation

**Role**: Issuer (e.g., MIT)

1. Open http://localhost:5173
2. Select **"Issuer"** role
3. **Register Issuer**:
   - Address: `0x1234...` (from Hardhat accounts)
   - Name: `MIT`
   - Stake: `1000`
   - Click **"Register Issuer"**
   
   ✅ On-chain TX: Issuer registered in `IssuerRegistry` smart contract
   
4. **Create Credential Batch**:
   - Paste this JSON:
   ```json
   [
     {"student_id": "alice001", "gpa": 3.8, "cloud_certified": true, "years_experience": 3, "graduation_year": 2021},
     {"student_id": "bob002", "gpa": 3.5, "cloud_certified": false, "years_experience": 2, "graduation_year": 2022},
     {"student_id": "charlie003", "gpa": 3.2, "cloud_certified": true, "years_experience": 4, "graduation_year": 2020}
   ]
   ```
   - Click **"Create Batch"**
   
   ✅ Blockchain: Merkle root calculated (locally), fraud score estimated
   
5. **Anchor Batch**:
   - Click **"Anchor Merkle Root"** on the batch
   
   ✅ On-chain TX: Merkle root permanently stored in `CredentialAnchor` contract

---

### Scenario 2: Student Fetches Credentials & Generates Proof

**Role**: Student (e.g., Alice)

1. Open http://localhost:5173
2. Select **"Student"** role
3. **Import Credentials**:
   - Student ID: `alice001`
   - Click **"Fetch My Credentials"**
   
   ✅ API Call: Backend returns all VCs issued to alice001
   
4. **View Credentials**:
   - You see 3 credentials from MIT with Merkle proofs
   
5. **Browse Job Requirements** (optional):
   - Click **"Browse Requirements"** to see what employers are asking for
   
6. **Generate Proof**:
   - Enter Employer's Requirement Hash (from Step 3)
   - Click **"Generate Proof (Local)"**
   
   ✅ **IMPORTANT**: Proof generated **100% locally** on your device
   ✅ No data sent to backend or blockchain during proof generation
   ✅ Circom circuit executes: Proves GPA ≥ 3.0, has cloud cert, etc., without revealing exact values
   
7. **View Generated Proof**:
   - You see the Groth16 proof (pi_a, pi_b, pi_c components)
   - Shows what's **revealed** vs. **hidden**

---

### Scenario 3: Employer Posts Blind Requirement

**Role**: Employer (e.g., Google)

1. Open http://localhost:5173
2. Select **"Employer"** role
3. **Post Job Requirement**:
   - Employer ID: `Google`
   - Requirement Text: `GPA >= 3.0, cloud-certified, 2+ years experience`
   - Click **"Post Requirement"**
   
   ✅ Blockchain: Only **requirement hash** stored (not the text)
   ✅ Backend: Full requirements stored locally for employer reference
   
4. **Verify Blind Commitment**:
   - You see the **Requirement Hash**: `0x9a1b...`
   - The actual requirement text is **hidden from students** until they submit proof
   - This prevents employers from changing requirements after seeing proofs

---

### Scenario 4: Proof Verification & SBT Issuance

**Role**: Backend (Employer Verifies)

1. In **Student** dashboard, copy the generated proof
2. In **Employer** dashboard:
   - Paste the proof
   - Paste requirement hash
   - Click **"Verify Proof"**
   
   ✅ On-chain TX: `NexusVerifier` contract verifies proof
   ✅ If valid: Contract mints **ERC-5192 Soulbound Token** (non-transferable)
   ✅ Student now has proof of eligibility tied to this requirement

---

## What's Happening on-Chain vs Off-Chain

| Component | Location | Purpose |
|-----------|----------|---------|
| **Merkle Root** | ✅ On-chain (CredentialAnchor) | Allows students to prove their cred is in issuer's batch |
| **Requirement Hash** | ✅ On-chain (RequirementCommit) | Prevents employer from changing requirement after submission |
| **ZK Proof** | ❌ Off-chain (local device) | Student generates proof locally; keeps data private |
| **Proof Verification** | ✅ On-chain (NexusVerifier) | Contract verifies proof is valid |
| **SBT Issuance** | ✅ On-chain (VerifiedEligibilitySBT) | Non-transferable token mints on student's address |
| **Student Data** | ❌ Never on-chain | GPA, certs, dates stay private; only predicates proven |
| **Issuer Reputation** | ✅ On-chain (IssuerRegistry) | Tracks staking, slashing for fraud |

---

## How Blockchain Prevents Fraud

### Scenario A: Issuer Fraud

**Attack**: MIT issues fake credentials to bob002 (GPA 3.5, but he really has 2.0)

**Defense**:
1. Merkle root anchored on-chain prevents tx in the past
2. Issuer must stake collateral (1000 MATIC)
3. If fraud detected: Issuer's stake is **slashed** (moved to insurance pool)
4. Community appeals process determines final outcome

**On-chain evidence**:
```
IssuerRegistr.issuers[MIT].stake = 1000 MATIC
IssuerRegistry.issuers[MIT].fraude_score = 0.8
CredentialAnchor.merkle_roots[batch_001] = 0xabc... (immutable, timestamped)
```

### Scenario B: Employer Fraud

**Attack**: Google posts "GPA >= 3.0", but after getting 100 applications, changes to "GPA >= 4.0"

**Defense**:
1. Requirement committed as hash on-chain before students apply
2. If Google tries to change: All proofs submitted against old hash are still valid
3. Students can prove they met the **original** requirement
4. Employer cannot retroactively change requirements

**On-chain evidence**:
```
RequirementCommit.requirementHash["Google"] = 0x9a1b2c3d...
```

### Scenario C: Student Credential Tampering

**Attack**: Alice modifies her local credential (GPA 3.8 → 4.0)

**Defense**:
1. When Alice generates proof, proof includes Merkle proof linking to on-chain root
2. Modified GPA breaks the Merkle path (cryptographic proof fails)
3. Smart contract rejects proof as invalid
4. Alice cannot fake proof without invalidating Merkle chain

---

## Testing Tools

### 1. View Transactions in Terminal 1 (Hardhat Node)

In the Hardhat node terminal, you'll see all transactions:

```
eth_sendTransaction
  Contract: 0x1234...
  Method: registerIssuer(...)
  From: 0x5678... (deployer)
  To: 0x91919191... (IssuerRegistry)
  Gas Used: 45,000
```

### 2. Inspect Contract State with Hardhat Console

In a new terminal:

```bash
cd d:\projects\mainprojects\Nexes\contracts
npx hardhat console --network localhost
```

```javascript
// Get issuer info
const registry = await ethers.getContractAt("IssuerRegistry", "0x...")
const issuerInfo = await registry.issuers("0x1234...")
console.log(issuerInfo)
```

### 3. Check Backend API Directly

Use curl or Postman:

```bash
# Get student credentials
curl http://localhost:8000/api/student/alice001/credentials

# Get system status
curl http://localhost:8000/api/status

# View workflow
curl http://localhost:8000/api/workflow
```

### 4. Check Frontend Network Tab

In browser DevTools (F12 → Network tab):
- See all API calls to http://localhost:8000
- Inspect proof generation (Circom circuit execution)
- Monitor WebSocket connections (if added)

---

## Troubleshooting

### Issue: "Contract deployment failed"

**Solution**:
1. Ensure Hardhat node is running (Terminal 1)
2. Check contract files exist in `contracts/contracts/`
3. Run `npm run build` first: `cd contracts && npm run build`

### Issue: "Backend cannot connect to blockchain"

**Solution**:
1. Check RPC_URL in `.env` matches Hardhat node: `http://127.0.0.1:8545`
2. Ensure Hardhat node is running
3. Check contract addresses in `.env` are correct

### Issue: "Frontend shows 'API Connection Error'"

**Solution**:
1. Ensure backend is running on port 8000
2. Check CORS is enabled (it is in main.py)
3. Open browser DevTools (F12) and inspect Network tab

### Issue: "Proof generation takes too long"

**Solution**:
- First proof generation (~5-10s) is normal (Circom circuit compilation)
- Subsequent proofs should be faster (~2-3s)
- In production, use precompiled circuits

---

## What You'll Learn

After completing all scenarios, you'll see:

✅ **Smart contracts** execute in real-time on local blockchain
✅ **Merkle roots** anchored as immutable state
✅ **ZK proofs** generated locally (privacy preserved)
✅ **Cross-contract interactions** (CredentialAnchor → NexusVerifier → SBT)
✅ **Fraud detection** mechanisms triggered
✅ **Gas costs** for each contract call
✅ **State changes** persisted on-chain
✅ **Privacy guarantees** — zero data leakage on blockchain

---

## Next: Production Deployment

Once local testing is complete:

1. **Deploy to Polygon Testnet**:
   ```bash
   # Update hardhat.config.ts with Polygon RPC
   # Set network to "mumbai" or "sepolia"
   npm run deploy:mumbai
   ```

2. **Upgrade backend**:
   - Replace in-memory storage with MongoDB
   - Use real snarkjs WASM for proof generation
   - Add authentication & rate limiting

3. **Frontend improvements**:
   - Add wallet connection (MetaMask)
   - Real VC standards (W3C format)
   - Production UI/UX refinements

---

## Commands Quick Reference

```bash
# Terminal 1: Local blockchain
cd contracts && npm install && npm run node

# Terminal 2: Deploy & Backend
cd contracts && npm run deploy:local
cd backend && python -m uvicorn app.main:app --reload --port 8000

# Terminal 3: Frontend
cd frontend && npm install && npm run dev

# Testing Tools
curl http://localhost:8000/docs
curl http://localhost:8000/api/status
npx hardhat console --network localhost
```

---

**Ready to test? Start with Terminal 1 above!**
