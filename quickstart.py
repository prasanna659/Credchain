#!/usr/bin/env python3
"""
Credchain Quick Start Script - Automated Testing Setup
This script helps automate the setup and testing of Credchain locally
"""

import os
import subprocess
import sys
import time
import json
from pathlib import Path

def print_header(title):
    """Print a formatted header"""
    print(f"\n{'='*70}")
    print(f"  {title}")
    print(f"{'='*70}\n")

def print_step(step_num, title):
    """Print a step header"""
    print(f"\n[STEP {step_num}] {title}")
    print("-" * 70)

def run_command(cmd, cwd=None, wait=True):
    """Run a shell command"""
    try:
        if wait:
            result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
            if result.returncode != 0:
                print(f"❌ Command failed: {cmd}")
                print(f"Error: {result.stderr}")
                return False
            if result.stdout:
                print(result.stdout)
            return True
        else:
            # Non-blocking (for servers)
            subprocess.Popen(cmd, shell=True, cwd=cwd)
            return True
    except Exception as e:
        print(f"❌ Error running command: {e}")
        return False

def check_prerequisites():
    """Check if required tools are installed"""
    print_header("CHECKING PREREQUISITES")
    
    prerequisites = {
        "node": "node --version",
        "npm": "npm --version",
        "python": "python --version",
        "git": "git --version"
    }
    
    all_ok = True
    for tool, cmd in prerequisites.items():
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {tool}: {result.stdout.strip()}")
        else:
            print(f"❌ {tool}: NOT INSTALLED")
            all_ok = False
    
    return all_ok

def setup_backend_env():
    """Create .env file for backend"""
    print_step(1, "Setting up Backend Environment")
    
    backend_path = Path("backend/.env")
    env_example = Path("backend/.env.example")
    
    if backend_path.exists():
        print(f"✅ .env file already exists at {backend_path}")
        return True
    
    if env_example.exists():
        print("📋 Creating .env from .env.example...")
        # Copy example to actual
        with open(env_example, 'r') as f:
            env_content = f.read()
        with open(backend_path, 'w') as f:
            f.write(env_content)
        print(f"✅ Created {backend_path}")
        print("⚠️  NOTE: Update contract addresses after deployment!")
        return True
    else:
        print(f"❌ .env.example not found")
        return False

def install_dependencies():
    """Install npm and Python dependencies"""
    print_step(2, "Installing Dependencies")
    
    # Contracts
    print("\n📦 Installing contract dependencies...")
    if not run_command("npm install", cwd="contracts"):
        return False
    
    # Frontend
    print("\n📦 Installing frontend dependencies...")
    if not run_command("npm install", cwd="frontend"):
        return False
    
    # Backend
    print("\n📦 Installing Python dependencies...")
    if not run_command("pip install -r requirements.txt", cwd="backend"):
        return False
    
    print("\n✅ All dependencies installed!")
    return True

def start_blockchain():
    """Start local Hardhat node"""
    print_step(3, "Starting Local Blockchain (Hardhat Node)")
    
    print("""
🚀 Starting Hardhat node on http://127.0.0.1:8545
   (Keep this terminal open while testing)
   
   Accounts with 10,000 ETH each:
   - Account #0 (Deployer): 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   - Account #1 (Issuer): 0x70997970C51812e339D9B73b0245ad59E1EB920
   - Account #2 (Employer): 0x3C44CdDdB6a900c2d0adcCa78e36564d404d97a0
   - Account #3-19: Additional accounts available
""")
    
    print("📌 Running: npm run node")
    run_command("npm run node", cwd="contracts", wait=False)
    
    # Wait for node to start
    print("\n⏳ Waiting for Hardhat node to start (10 seconds)...")
    time.sleep(10)
    
    # Test connection
    print("🔗 Testing RPC connection...")
    test_cmd = """powershell.exe -Command "
    try { 
        $result = Invoke-RestMethod -Uri 'http://127.0.0.1:8545' -Method Post `
            -ContentType 'application/json' `
            -Body '{\"jsonrpc\":\"2.0\",\"method\":\"eth_chainId\",\"params\":[],\"id\":1}' 
        Write-Host '✅ Hardhat node is running!'
        exit 0
    } catch { 
        Write-Host '⏳ Still starting... try again in a moment'
        exit 1
    }
    " """
    
    result = run_command(test_cmd)
    return result

def deploy_contracts():
    """Deploy smart contracts"""
    print_step(4, "Deploying Smart Contracts")
    
    print("📋 Running: npm run deploy:local")
    result = run_command("npm run deploy:local", cwd="contracts")
    
    if result:
        print("""
✅ Contracts deployed!
📌 Next: Copy the contract addresses to backend/.env
   Set these at the top of the file:
   - ISSUER_VAULT_ADDRESS
   - ISSUER_REGISTRY_ADDRESS
   - CREDENTIAL_ANCHOR_ADDRESS
   - REQUIREMENT_COMMIT_ADDRESS
   - VERIFIED_ELIGIBILITY_SBT_ADDRESS
   - NEXUS_VERIFIER_ADDRESS
   - GROTH16_VERIFIER_ADDRESS
""")
    
    return result

def start_backend():
    """Start FastAPI backend"""
    print_step(5, "Starting Backend API")
    
    print("""
🚀 Starting FastAPI on http://127.0.0.1:8000
   (Keep this terminal open while testing)
""")
    
    print("📌 Running: python -m uvicorn app.main:app --reload --port 8000")
    run_command(
        "python -m uvicorn app.main:app --reload --port 8000",
        cwd="backend",
        wait=False
    )
    
    time.sleep(5)
    print("✅ Backend should be running at http://127.0.0.1:8000")
    print("📖 View API docs: http://127.0.0.1:8000/docs")
    return True

def start_frontend():
    """Start Vite frontend"""
    print_step(6, "Starting Frontend")
    
    print("""
🚀 Starting Vite dev server on http://127.0.0.1:5173
   (Keep this terminal open while testing)
""")
    
    print("📌 Running: npm run dev")
    run_command("npm run dev", cwd="frontend", wait=False)
    
    time.sleep(5)
    print("✅ Frontend should be running at http://127.0.0.1:5173")
    return True

def show_test_guide():
    """Show testing guide"""
    print_header("NEXT STEPS - TESTING GUIDE")
    
    test_guide = """
You now have a complete Credchain testing environment!

📌 OPEN 3 TERMINAL WINDOWS:

Terminal 1 (already running):
  - Hardhat Node (Blockchain)
  - Location: contracts/
  - Command: npm run node

Terminal 2 (already running):
  - Backend API
  - Location: backend/
  - URL: http://localhost:8000/docs

Terminal 3 (already running):
  - Frontend UI
  - Location: frontend/
  - URL: http://localhost:5173/

---

📋 TEST SCENARIO 1: ISSUER REGISTRATION

1. Open http://localhost:5173 in browser
2. Select "ISSUER" role
3. Click "Register Issuer"
   - Address: 0x70997970C51812e339D9B73b0245ad59E1EB920
   - Name: MIT
   - Stake: 1000
4. You should see:
   ✅ Issuer registered in IssuerRegistry contract
   ✅ Stake locked in IssuerVault

---

📋 TEST SCENARIO 2: CREATE CREDENTIAL BATCH

1. In Issuer dashboard, click "Create Credential Batch"
2. Paste this JSON:
   [
     {"student_id": "alice001", "gpa": 3.8, "cloud_certified": true, "years_experience": 3, "graduation_year": 2021},
     {"student_id": "bob002", "gpa": 3.5, "cloud_certified": false, "years_experience": 2, "graduation_year": 2022}
   ]
3. You should see:
   ✅ Batch created with Merkle root
   ✅ Fraud score calculated
   ✅ Batch ready for anchoring

4. Click "Anchor Merkle Root"
   ✅ Merkle root stored on-chain (immutable)
   ✅ Students can now fetch credentials

---

📋 TEST SCENARIO 3: STUDENT PROOF GENERATION

1. Select "STUDENT" role
2. Enter student ID: alice001
3. Click "Fetch My Credentials"
   ✅ You see credentials from MIT batch
   ✅ Merkle proofs included

4. Click "Browse Requirements"
   ✅ See employers' blind requirement hashes

5. Enter requirement hash and click "Generate Proof"
   ✅ Circom proves: GPA >= 3.0, has cloud cert, etc.
   ✅ Proof generated 100% locally (private)
   ✅ No data leakage

---

📋 TEST SCENARIO 4: EMPLOYER REQUIREMENT

1. Select "EMPLOYER" role
2. Click "Post Requirement"
   - Text: "GPA >= 3.0, cloud-certified, 2+ years"
3. You see requirement hash (secret commitment)
   ✅ Only hash stored on-chain
   ✅ Actual requirements hidden until proof

---

📋 TEST SCENARIO 5: PROOF VERIFICATION

1. In Employer dashboard, paste student's proof
2. Click "Verify Proof"
   ✅ NexusVerifier contract checks proof
   ✅ If valid: ERC-5192 SBT minted
   ✅ Non-transferable token issued

---

📊 WHAT'S HAPPENING ON-CHAIN:

• IssuerRegistry: Tracks issuer stake & reputation
• IssuerVault: Manages collateral & slashing
• CredentialAnchor: Stores Merkle roots (immutable)
• RequirementCommit: Stores requirement hashes
• NexusVerifier: Verifies ZK proofs
• VerifiedEligibilitySBT: Mints non-transferable tokens

---

🔍 DEBUGGING TOOLS:

View contract calls in Terminal 1 (Hardhat node output)

Query backend API:
  curl http://localhost:8000/api/status
  curl http://localhost:8000/api/workflow

View frontend network traffic:
  F12 → Network tab in browser

Hardhat console:
  cd contracts
  npx hardhat console --network localhost
  > const registry = await ethers.getContractAt("IssuerRegistry", "0x...")

---

📖 For detailed testing guide:
   See: TESTING.md

✅ Ready to test! Open http://localhost:5173 now!
"""
    
    print(test_guide)

def main():
    """Main entry point"""
    print_header("🚀 Credchain Quick Start")
    
    # Check prerequisites
    if not check_prerequisites():
        print("\n❌ Please install missing dependencies first")
        return False
    
    # Setup
    if not setup_backend_env():
        return False
    
    if not install_dependencies():
        return False
    
    # Start services asynchronously
    print_header("STARTING SERVICES")
    
    print("""
⚠️  This script will start services in background.
⚠️  You need to manage 3 terminal windows yourself:

   TERMINAL 1: Hardhat Node (Blockchain)
   TERMINAL 2: Backend API
   TERMINAL 3: Frontend UI

Let's set them up now...
""")
    
    input("Press Enter to continue...")
    
    # Deploy contracts
    if not deploy_contracts():
        return False
    
    print("""
✅ Contracts deployed!

⚠️  IMPORTANT: Update contract addresses in backend/.env

Next:
1. Save the contract addresses from deployment output above
2. Open backend/.env and fill in:
   - ISSUER_VAULT_ADDRESS
   - ISSUER_REGISTRY_ADDRESS
   - CREDENTIAL_ANCHOR_ADDRESS
   - REQUIREMENT_COMMIT_ADDRESS
   - VERIFIED_ELIGIBILITY_SBT_ADDRESS
   - NEXUS_VERIFIER_ADDRESS
   - GROTH16_VERIFIER_ADDRESS

3. Then open 3 new terminals and run:
   Terminal 1: cd contracts && npm run node
   Terminal 2: cd backend && python -m uvicorn app.main:app --reload --port 8000
   Terminal 3: cd frontend && npm run dev
""")
    
    show_test_guide()
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
