from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import hashlib
import json
import uuid
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="NexusCred Backend", version="0.1.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Blockchain Configuration
# ============================================================================

RPC_URL = os.getenv("RPC_URL", "http://127.0.0.1:8545")
NETWORK = os.getenv("NETWORK", "localhost")
CHAIN_ID = int(os.getenv("CHAIN_ID", "31337"))

# Smart Contract Addresses (to be configured)
ISSUER_VAULT_ADDRESS = os.getenv("ISSUER_VAULT_ADDRESS")
ISSUER_REGISTRY_ADDRESS = os.getenv("ISSUER_REGISTRY_ADDRESS")
CREDENTIAL_ANCHOR_ADDRESS = os.getenv("CREDENTIAL_ANCHOR_ADDRESS")
REQUIREMENT_COMMIT_ADDRESS = os.getenv("REQUIREMENT_COMMIT_ADDRESS")
VERIFIED_ELIGIBILITY_SBT_ADDRESS = os.getenv("VERIFIED_ELIGIBILITY_SBT_ADDRESS")
NEXUS_VERIFIER_ADDRESS = os.getenv("NEXUS_VERIFIER_ADDRESS")
GROTH16_VERIFIER_ADDRESS = os.getenv("GROTH16_VERIFIER_ADDRESS")

print(f"[NexusCred Backend] Starting on network: {NETWORK}")
print(f"[NexusCred Backend] RPC URL: {RPC_URL}")
print(f"[NexusCred Backend] Chain ID: {CHAIN_ID}")

# ============================================================================
# Data Models
# ============================================================================

class CredentialField(BaseModel):
    name: str
    value: str
    hashable: bool = True

class StudentCredential(BaseModel):
    student_id: str
    student_name: str
    fields: List[CredentialField]
    issuer: str
    timestamp: int

class CredentialBatch(BaseModel):
    issuer: str
    credentials: List[StudentCredential]

class VerifiableCredential(BaseModel):
    student_id: str
    credential_type: str
    credential_data: Dict
    merkle_path: List[str]
    merkle_root: str
    issuer: str
    issued_at: int

class JobRequirement(BaseModel):
    employer: str
    description: str
    gpa_min: float = 7.0
    cloud_certified: bool = False
    years_experience_min: int = 0
    grad_year_min: int = 2020

class ProofSubmission(BaseModel):
    student_id: str
    requirement_hash: str
    proof_data: Dict
    public_signals: List[str]

# ============================================================================
# In-Memory Storage (in production, use database)
# ============================================================================

ISSUERS = {}  # issuer_address -> {name, stake, credentials_issued}
BATCHES = {}  # batch_id -> {merkle_root, credentials, fraud_score}
CREDENTIALS = {}  # student_id -> [VCs]
REQUIREMENTS = {}  # employer_address -> [requirements]
PROOFS = {}  # proof_id -> {submitted, verified, sbt_token_id}

# ============================================================================
# Utility Functions
# ============================================================================

def hash_field(value: str) -> str:
    """Hash a credential field"""
    return hashlib.sha256(value.encode()).hexdigest()

def calculate_merkle_root(credentials: List[StudentCredential]) -> str:
    """
    Calculate Merkle root for a batch of credentials.
    Simplified implementation - in production use proper Merkle tree library.
    """
    hashes = []
    for cred in credentials:
        cred_hash = ""
        for field in cred.fields:
            if field.hashable:
                cred_hash += hash_field(field.value)
        hashes.append(cred_hash)
    
    # Simple concatenation hash (in prod: proper Merkle tree)
    root_input = "".join(hashes)
    return hashlib.sha256(root_input.encode()).hexdigest()

def generate_merkle_proof(credential_index: int, total_credentials: int) -> List[str]:
    """Generate Merkle proof path (stub for now)"""
    # In production, compute actual Merkle path
    proof = []
    for i in range(10):  # Assume tree depth of 10
        proof.append(hashlib.sha256(f"{credential_index}-{i}".encode()).hexdigest())
    return proof

def generate_requirement_hash(requirement: JobRequirement) -> str:
    """Generate hash of employer's requirements (blind commitment)"""
    req_str = json.dumps({
        "gpa_min": requirement.gpa_min,
        "cloud_certified": requirement.cloud_certified,
        "years_experience_min": requirement.years_experience_min,
        "grad_year_min": requirement.grad_year_min
    }, sort_keys=True)
    return hashlib.sha256(req_str.encode()).hexdigest()

def estimate_fraud_score(batch: CredentialBatch) -> float:
    """
    Simple fraud detection heuristic.
    In production: Use EZKL ZKML framework for real ML model.
    """
    # Check for suspicious patterns
    score = 0.0
    
    if len(batch.credentials) > 500:
        score += 0.05  # Large batch
    
    # Check if all GPAs are identical (suspicious)
    if len(batch.credentials) > 3:
        gpas = []
        for cred in batch.credentials:
            for field in cred.fields:
                if field.name.lower() == "gpa":
                    gpas.append(field.value)
        if len(gpas) > 0 and len(set(gpas)) == 1:
            score += 0.3  # All same GPA
    
    # Additional checks could go here
    return min(score, 1.0)



# ============================================================================
# ISSUER ENDPOINTS
# ============================================================================

@app.post("/api/issuer/register")
async def register_issuer(issuer_address: str, issuer_name: str):
    """Register a new credential issuer"""
    if issuer_address in ISSUERS:
        raise HTTPException(status_code=400, detail="Issuer already registered")
    
    ISSUERS[issuer_address] = {
        "name": issuer_name,
        "address": issuer_address,
        "stake": "1000 MATIC",
        "status": "active",
        "batches_issued": 0,
        "registered_at": datetime.now().isoformat()
    }
    
    return {
        "status": "success",
        "message": f"Issuer {issuer_name} registered successfully",
        "issuer": ISSUERS[issuer_address]
    }

@app.get("/api/issuer/{issuer_address}")
async def get_issuer(issuer_address: str):
    """Get issuer details"""
    if issuer_address not in ISSUERS:
        raise HTTPException(status_code=404, detail="Issuer not found")
    return ISSUERS[issuer_address]

@app.post("/api/issuer/batch/create")
async def create_batch(batch: CredentialBatch):
    """
    Create a batch of credentials and calculate Merkle root.
    Steps:
    1. Hash each credential field
    2. Build Merkle tree
    3. Calculate fraud score
    4. Generate ZK proof of fraud score (EZKL stub)
    """
    batch_id = str(uuid.uuid4())[:8]
    
    # Calculate Merkle root
    merkle_root = calculate_merkle_root(batch.credentials)
    
    # Run fraud detection
    fraud_score = estimate_fraud_score(batch)
    
    # Store batch
    BATCHES[batch_id] = {
        "batch_id": batch_id,
        "issuer": batch.issuer,
        "merkle_root": merkle_root,
        "credentials_count": len(batch.credentials),
        "fraud_score": fraud_score,
        "status": "created",
        "created_at": datetime.now().isoformat(),
        "credentials": [cred.dict() for cred in batch.credentials]
    }
    
    if batch.issuer in ISSUERS:
        ISSUERS[batch.issuer]["batches_issued"] += 1
    
    return {
        "status": "success",
        "batch_id": batch_id,
        "merkle_root": merkle_root,
        "fraud_score": fraud_score,
        "fraud_proof": "0x" + "0" * 64,  # Stub EZKL proof
        "message": f"Batch created with {len(batch.credentials)} credentials"
    }

@app.get("/api/batch/{batch_id}")
async def get_batch(batch_id: str):
    """Get batch details"""
    if batch_id not in BATCHES:
        raise HTTPException(status_code=404, detail="Batch not found")
    return BATCHES[batch_id]

@app.post("/api/batch/{batch_id}/anchor")
async def anchor_batch(batch_id: str):
    """Anchor batch to blockchain (simulate contract call)"""
    if batch_id not in BATCHES:
        raise HTTPException(status_code=404, detail="Batch not found")
    
    batch = BATCHES[batch_id]
    batch["status"] = "anchored"
    batch["anchored_at"] = datetime.now().isoformat()
    batch["tx_hash"] = "0x" + hashlib.sha256(batch_id.encode()).hexdigest()
    
    # Create VCs for each student
    for cred in batch["credentials"]:
        student_id = cred["student_id"]
        proof_index = len(batch["credentials"])
        
        vc = VerifiableCredential(
            student_id=student_id,
            credential_type="degree" if "degree" in str(cred).lower() else "certificate",
            credential_data=cred,
            merkle_path=generate_merkle_proof(proof_index, len(batch["credentials"])),
            merkle_root=batch["merkle_root"],
            issuer=batch["issuer"],
            issued_at=int(datetime.now().timestamp())
        )
        
        if student_id not in CREDENTIALS:
            CREDENTIALS[student_id] = []
        CREDENTIALS[student_id].append(vc.dict())
    
    return {
        "status": "success",
        "message": "Batch anchored to blockchain",
        "tx_hash": batch["tx_hash"],
        "merkle_root": batch["merkle_root"],
        "vcs_created": len(batch["credentials"])
    }


# ============================================================================
# STUDENT ENDPOINTS
# ============================================================================

@app.get("/api/student/{student_id}/credentials")
async def get_student_credentials(student_id: str):
    """Get all VCs for a student"""
    if student_id not in CREDENTIALS:
        return {"student_id": student_id, "credentials": []}
    
    return {
        "student_id": student_id,
        "credentials": CREDENTIALS[student_id],
        "count": len(CREDENTIALS[student_id])
    }

@app.post("/api/student/{student_id}/proof/generate")
async def generate_proof(student_id: str, requirement_hash: str):
    """
    Generate a cross-credential ZK proof.
    Student's VCs + employer's requirement hash → ZK proof
    """
    if student_id not in CREDENTIALS or not CREDENTIALS[student_id]:
        raise HTTPException(status_code=404, detail="Student has no credentials")
    
    creds = CREDENTIALS[student_id]
    
    # Simulate proof generation
    proof_id = str(uuid.uuid4())[:8]
    PROOFS[proof_id] = {
        "proof_id": proof_id,
        "student_id": student_id,
        "requirement_hash": requirement_hash,
        "credentials_used": len(creds),
        "status": "pending",
        "created_at": datetime.now().isoformat(),
        "proof_data": {
            "pi_a": ["0x" + "0" * 64, "0x" + "0" * 64, "1"],
            "pi_b": [
                ["0x" + "0" * 64, "0x" + "0" * 64],
                ["0x" + "0" * 64, "0x" + "0" * 64],
                ["1", "0"]
            ],
            "pi_c": ["0x" + "0" * 64, "0x" + "0" * 64, "1"]
        },
        "public_signals": [requirement_hash]
    }
    
    return {
        "status": "success",
        "proof_id": proof_id,
        "message": "Proof generated successfully",
        "proof": PROOFS[proof_id]["proof_data"],
        "public_signals": [requirement_hash]
    }


# ============================================================================
# EMPLOYER ENDPOINTS  
# ============================================================================

@app.post("/api/employer/requirement")
async def post_requirement(requirement: JobRequirement):
    """
    Post a blind job requirement.
    Returns only the hash - actual requirements are not revealed.
    """
    req_hash = generate_requirement_hash(requirement)
    
    if requirement.employer not in REQUIREMENTS:
        REQUIREMENTS[requirement.employer] = []
    
    req_data = {
        "hash": req_hash,
        "description": requirement.description,
        "gpa_min": requirement.gpa_min,
        "cloud_certified": requirement.cloud_certified,
        "years_experience_min": requirement.years_experience_min,
        "grad_year_min": requirement.grad_year_min,
        "created_at": datetime.now().isoformat(),
        "candidates_applied": 0
    }
    
    REQUIREMENTS[requirement.employer].append(req_data)
    
    return {
        "status": "success",
        "requirement_hash": req_hash,
        "message": "Requirement posted (commitment hash only - requirements hidden)",
        "requirement": req_data
    }

@app.get("/api/employer/{employer_address}/requirements")
async def get_employer_requirements(employer_address: str):
    """Get requirements posted by employer"""
    reqs = REQUIREMENTS.get(employer_address, [])
    return {
        "employer": employer_address,
        "requirements": reqs,
        "count": len(reqs)
    }


# ============================================================================
# PROOF VERIFICATION & RESULT ENDPOINTS
# ============================================================================

@app.post("/api/proof/verify")
async def verify_proof(submission: ProofSubmission):
    """
    Verify a ZK proof on-chain (simulated).
    In production: send to NexusVerifier smart contract.
    """
    if submission.student_id not in CREDENTIALS:
        return {
            "status": "failure",
            "verified": False,
            "reason": "Student credentials not found"
        }
    
    # Simulate proof verification
    proof_id = submission.proof_data.get("id", str(uuid.uuid4())[:8])
    
    PROOFS[proof_id] = {
        "proof_id": proof_id,
        "student_id": submission.student_id,
        "requirement_hash": submission.requirement_hash,
        "status": "verified",
        "verified_at": datetime.now().isoformat(),
        "sbt_token_id": f"sbt_{proof_id}"
    }
    
    return {
        "status": "success",
        "verified": True,
        "proof_id": proof_id,
        "message": "Proof verified successfully",
        "sbt_token_id": f"sbt_{proof_id}",
        "eligible": True
    }

@app.get("/api/proof/{proof_id}")
async def get_proof_status(proof_id: str):
    """Get proof verification status"""
    if proof_id not in PROOFS:
        raise HTTPException(status_code=404, detail="Proof not found")
    return PROOFS[proof_id]


# ============================================================================
# WORKFLOW ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    return {
        "message": "NexusCred Backend API",
        "version": "0.1.0",
        "documentation": "/docs"
    }

@app.get("/api/health")
async def health():
    return {"status": "ok"}

@app.get("/api/workflow")
async def get_workflow():
    """Return the complete NexusCred workflow"""
    steps = [
        {
            "id": 1,
            "title": "Issuer Registration & Staking",
            "detail": "IIT, AWS, Infosys: register, stake MATIC, get ISSUER_ROLE"
        },
        {
            "id": 2,
            "title": "Student DID Generation",
            "detail": "Ravi generates personal Decentralized Identity on Polygon"
        },
        {
            "id": 3,
            "title": "Batch Credential Issuance",
            "detail": "Issuer creates batch, fields hashed, Merkle tree built, fraud score calculated"
        },
        {
            "id": 4,
            "title": "Merkle Root Anchoring",
            "detail": "One TX: Merkle root + EZKL fraud proof anchored on-chain (1000 students = 1 TX)"
        },
        {
            "id": 5,
            "title": "VC Distribution",
            "detail": "Students receive VCs with Merkle paths, stored in wallet"
        },
        {
            "id": 6,
            "title": "Employer Posts Blind Requirements",
            "detail": "Google: types requirements, local AI converts to ZK predicates, hash committed on-chain"
        },
        {
            "id": 7,
            "title": "Cross-Credential ZK Proof Generation",
            "detail": "Ravi: Circom circuit checks all 3 VCs + Merkle paths + predicates → ONE proof (local, private)"
        },
        {
            "id": 8,
            "title": "ZK Proof Verification",
            "detail": "NexusVerifier contract: verify Merkle paths, check predicates, verify requirement hash"
        },
        {
            "id": 9,
            "title": "Soulbound Token (SBT) Issuance",
            "detail": "Upon success: ERC-5192 non-transferable token minted to Ravi's wallet"
        }
    ]

    return {
        "name": "NexusCred End-to-End Workflow",
        "description": "Complete zero-knowledge credential verification system with privacy & fraud detection",
        "steps": steps
    }

@app.get("/api/status")
async def get_system_status():
    """Get overall system statistics"""
    return {
        "issuers_registered": len(ISSUERS),
        "credential_batches": len(BATCHES),
        "students_with_credentials": len(CREDENTIALS),
        "employers": len(REQUIREMENTS),
        "proofs_generated": len(PROOFS),
        "system": "operational"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
