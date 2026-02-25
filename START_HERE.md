# 🎯 Credchain Local Testing — START HERE

## You're Ready to Test the Full Project! 

Your Credchain implementation is **complete and ready** to see how the blockchain works in real-time.

---

## 🚀 Choose Your Method to Start

### **EASIEST: Windows Batch Script (1 Click)**

```bash
cd d:\projects\mainprojects\Nexes
start-local.bat
```

✅ Opens 3 terminal windows automatically
✅ Starts blockchain, backend, and frontend
✅ ~2 minutes to full system running

**What you'll see:**
- Terminal 1: Hardhat node with account listings
- Terminal 2: Backend API starting
- Terminal 3: Frontend dev server
- Browser: Opens http://localhost:5173

---

### **FOR MAC/LINUX: Makefile Commands**

```bash
cd d:\projects\mainprojects\Nexes
make help          # See all commands
make install       # Install dependencies
make setup         # Create .env files

# Then open 3 terminals:
make start-blockchain  # Terminal 1
make deploy            # Deploy contracts (after blockchain starts)
make start-backend     # Terminal 2
make start-frontend    # Terminal 3
```

---

### **MANUAL: Full Control (3 Terminals)**

**Terminal 1 - Blockchain:**
```bash
cd contracts
npm install
npm run node
```
Wait for: `Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/`

**Terminal 2 - Deploy & Backend:**
```bash
# In contracts folder
npm run deploy:local
# COPY the contract addresses shown

# Go to backend folder and create .env file
cd ../backend
# Paste into .env file all the contract addresses
# (use backend/.env.example as template)

# Then start backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
Wait for: `Uvicorn running on http://127.0.0.1:8000`

**Terminal 3 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Wait for: `Local:   http://localhost:5173/`

---

## ⏱️ Timeline for First Test Run

| Step | Time | What's Happening |
|------|------|------------------|
| 1. Start blockchain (npm run node) | 1 min | Hardhat node boots, accounts created |
| 2. Deploy contracts (npm run deploy:local) | 1-2 min | 7 smart contracts deploy, addresses printed |
| 3. Start backend (uvicorn) | 30 sec | FastAPI server ready |
| 4. Start frontend (npm run dev) | 30 sec | Vite dev server ready |
| **Total** | **~3-4 minutes** | **Full system running** |

---

## ✅ Verify Everything is Working

### Check Blockchain
```bash
curl http://127.0.0.1:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```
Should return: `"result":"0x0"` (genesis block)

### Check Backend
```bash
curl http://localhost:8000/api/health
```
Should return: `{"status":"ok"}`

### Check API Docs
Visit: http://localhost:8000/docs
Shows all 20+ endpoints with interactive Swagger UI

### Check Frontend
Visit: http://localhost:5173
You see: Role selector (Issuer / Student / Employer)

---

## 🎮 5-Minute Quick Test

### Role #1: ISSUER (MIT)

**Step 1:** Select "ISSUER"
- Address: `0x70997970C51812e339D9B73b0245ad59E1EB920` (Account #1)
- Click "Register Issuer"

**Step 2:** Create Batch
- Paste this JSON:
```json
[
  {"student_id": "alice", "gpa": 3.8, "cloud_certified": true, "years_experience": 3, "graduation_year": 2021},
  {"student_id": "bob", "gpa": 3.5, "cloud_certified": false, "years_experience": 2, "graduation_year": 2022}
]
```
- Click "Create Batch"
- See Merkle root ✅

**Step 3:** Anchor
- Click "Anchor Merkle Root"
- See confirmation ✅

### Role #2: STUDENT (Alice)

**Step 1:** Select "STUDENT"
- Student ID: `alice`
- Click "Fetch My Credentials"
- See 2 credentials ✅

**Step 2:** Generate Proof
- Requirement hash: (from employer, below)
- Click "Generate Proof (Local)"
- See Groth16 proof ✅

### Role #3: EMPLOYER (Google)

**Step 1:** Select "EMPLOYER"
- Text: `GPA >= 3.0, cloud cert, 2+ years`
- Click "Post Requirement"
- See requirement hash ✅

**Step 2:** Verify Proof
- Paste Alice's proof
- Click "Verify Proof"
- See SBT minted ✅

---

## 🔍 What's Actually Happening on the Blockchain

Watch **Terminal 1** (Hardhat node) output:

```
eth_call
  Contract: 0x...
  Data: 0x...

eth_sendTransaction
  To: 0x9fac... (CredentialAnchor)
  Data: anchor(bytes32 merkleRoot...)
  From: 0xf39F... (Issuer)
  Value: 0
  Gas: 45000

eth_getTransactionReceipt
  TransactionHash: 0x...
  Status: 1 (success)
  GasUsed: 32456
  CumulativeGasUsed: 32456
```

Each action = a blockchain transaction! ✅

---

## 🔐 Key Privacy Features You'll See

As a **Student**, when you generate a proof:

**Your Device (Private):**
❌ Full GPA: 3.8
❌ Full certs: [AWS, Azure, etc.]
❌ Start/end dates

**On-Chain (Zero Knowledge Proof):**
✅ Proves: GPA >= 3.0
✅ Proves: Has cloud cert
✅ Proves: 2+ years experience
✅ Circalicitor computation: 100% local

**What Blockchain Sees:**
✅ Proof is valid (yes/no)
✅ Merkle root matches
✅ Requirement hash matches
❌ Never sees raw data

---

## 📚 Documentation Available

After starting, explore:

| Document | Purpose | Read When |
|----------|---------|-----------|
| [QUICK-START.md](QUICK-START.md) | Cheat sheet | Need quick reference |
| [TESTING.md](TESTING.md) | Detailed guide | Want step-by-step testing |
| [BLOCKCHAIN_FLOWS.md](BLOCKCHAIN_FLOWS.md) | Architecture diagrams | Want to understand flows |
| [README.md](README.md) | Overview | Need system overview |
| **http://localhost:8000/docs** | API reference | Want to test endpoints |

---

## 🛠️ Troubleshooting

### "Port 8545 already in use"
```bash
# Kill the process using port 8545
lsof -ti:8545 | xargs kill -9   # Mac/Linux
netstat -ano | findstr :8545    # Windows (find PID, then taskkill /PID <number>)
```

### "Cannot find smart contracts"
```bash
cd contracts
npm run build
npm run deploy:local
```

### "Backend can't connect to blockchain"
1. Check RPC_URL in `backend/.env` = `http://127.0.0.1:8545`
2. Ensure blockchain is running (Terminal 1)
3. Check contract addresses in `.env`

### "Proof takes 30+ seconds"
- First run: ~10-20s (Circom compilation)
- Subsequent runs: ~2-5s (cached)
- This is normal! ✅

---

## 🎓 What You'll Learn

After completing the 5-minute test:

✅ **Smart contracts execute in real-time**
- See Merkle roots anchored on-chain
- Watch transactions get mined
- See gas costs for each operation

✅ **Zero-knowledge proofs work locally**
- Generate proof on your device (100% private)
- No personal data leaves your machine
- Blockchain only sees the proof (not the data)

✅ **Blockchain prevents fraud**
- Merkle root prevents credential tampering
- Requirement hash prevents employer fraud
- Issuer stake prevents issuing fake credentials

✅ **Cross-contract interactions**
- CredentialAnchor → NexusVerifier → SBT
- Each contract checks the previous one
- Immutable on-chain verification

✅ **Privacy in practice**
- See exactly what's revealed vs. hidden
- Understand why blockchain needs ZK proofs
- Learn why on-chain ≠ everyone can see

---

## 🚀 Next Steps After First Test

1. **Try multiple scenarios:**
   - Register 3 issuers
   - Generate 10 credentials per issuer
   - Test multiple employers

2. **Inspect contract state:**
   ```bash
   cd contracts
   npx hardhat console --network localhost
   > const { ethers } = require("hardhat")
   > const reg = await ethers.getContractAt("IssuerRegistry", "0x...")
   > await reg.issuers("0x70997970...")
   ```

3. **Test fraud detection:**
   - Create batch with suspicious patterns
   - Watch fraud score calculate
   - See slashing logic in IssuerVault

4. **Deploy to testnet:**
   - Use Sepolia or Mumbai testnet
   - Update hardhat.config.ts with RPC
   - Use faucet for test ETH
   - Same code, real blockchain! 🌍

---

## 🎯 Success Checklist

After you see all these, you've got a working system:

- [x] Terminal 1: Blockchain running (`npm run node`)
- [x] Terminal 2: Backend running (`uvicorn`)
- [x] Terminal 3: Frontend running (`npm run dev`)
- [x] http://localhost:5173 loads without errors
- [x] http://localhost:8000/docs shows API documentation
- [x] Issuer can register on-chain
- [x] Batch creates with Merkle root
- [x] Student can fetch credentials
- [x] Proof generates locally (~5 seconds)
- [x] Employer can verify proof on-chain
- [x] SBT mints if proof is valid

**If all checked: System is fully working!** 🎉

---

## 💬 Questions While Testing?

**Q: Why does proof generation take so long?**
A: First run compiles Circom circuit (~10-20s). Subsequent runs use cache (~2-5s).

**Q: Is my data really private?**
A: Yes! Proof generates 100% locally. Only the proof (not data) hits the blockchain.

**Q: Can employer see my GPA?**
A: No! They see "GPA ≥ 3.0" as a boolean in the proof. Exact value never revealed.

**Q: What if I modify my local credential?**
A: Proof fails. Modified credential breaks Merkle path. Your fraud attempt is recorded on-chain.

**Q: Can proof be reused?**
A: No. Each requirement generates different requirement hash. One proof per job.

---

## 🏁 Ready?

### **Start here right now:**

<img alt="Start here" />

✅ Open Terminal 1 and run:  
```bash
cd d:\projects\mainprojects\Nexes\contracts && npm run node
```

✅ Then Terminal 2:  
```bash
cd d:\projects\mainprojects\Nexes\contracts && npm run deploy:local
```

✅ Then Terminal 3:  
```bash
cd d:\projects\mainprojects\Nexes\backend && python -m uvicorn app.main:app --reload --port 8000
```

✅ Then Terminal 4:  
```bash
cd d:\projects\mainprojects\Nexes\frontend && npm run dev
```

✅ Open browser:  
**http://localhost:5173**

---

**Happy testing! Welcome to Credchain.** 🚀
