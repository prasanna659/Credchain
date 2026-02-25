# NexusCred architecture (demo)

This is a developer-focused description of how this repo maps to the NexusCred spec.

## Players

- **Issuer**: stakes/bonds, issues credential batches, anchors Merkle roots
- **Student**: holds VCs locally and produces an eligibility proof
- **Employer**: posts job requirements as an on-chain commitment (hash)

## On-chain components (in `contracts/`)

- `IssuerVault`: bond/stake + (demo) slashing mechanics
- `CredentialAnchor`: issuer-batch Merkle roots and fraud-score stub anchoring
- `RequirementCommit`: employer requirement commitments
- `NexusVerifier`: verifies the submitted proof and mints an ERC-5192 SBT
- `VerifiedEligibilitySBT`: non-transferable token that represents “passed”

## Off-chain components

- `backend/`: demo issuance APIs and VC storage for development convenience
- `zk/`: circuits + scripts to generate a composite proof (Circom/snarkjs)
- `frontend/`: role dashboards that call contracts + backend

## Notes about the demo

- DID is represented as a string (or hash) bound to an EOA for the local demo.
- “ZKML fraud proof” is represented as a `bytes32` proof hash + numeric fraud score.
- The ZK circuit is included as a workspace so you can run setup and generate proofs locally.

