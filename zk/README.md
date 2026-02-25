# NexusCred ZK Workspace

Zero-knowledge circuits and proof generation for cross-credential eligibility verification.

## Structure

- `circuits/` — Circom circuits for credential verification
  - `main.circom` — Full cross-credential eligibility circuit
  - `simple.circom` — Simplified version for testing
- `scripts/` — Proof generation and verification scripts
- `tests/` — Circuit test cases

## Circuit Overview

### CrossCredentialEligibility

Main circuit that proves:
1. ✅ Credential 1 (IIT Degree) is valid (Merkle proof against issuer's root)
2. ✅ GPA from Credential 1 meets minimum requirement
3. ✅ Graduation year meets minimum requirement
4. ✅ Credential 2 (AWS Cert) is valid
5. ✅ Certification level meets requirement
6. ✅ Credential 3 (Work Experience) is valid
7. ✅ Years of experience meets requirement
8. ✅ All predicates match employer's requirement commitment hash

**Privacy guarantees:**
- GPA never revealed (only that it meets requirement)
- Exact certification level never revealed
- Years of experience never revealed
- Student name, institution details never revealed
- Only reveals: ✅ ELIGIBLE or ❌ NOT ELIGIBLE

## Setup

```bash
npm install
npm run build
npm run setup
npm run compile
```

## Generate Proof

```bash
npm run generate-proof
```

This generates a proof that matches a specific requirement commitment.

## Verify Proof

```bash
npm run verify-proof
```

On-chain verification is done by the `NexusVerifier` smart contract.
