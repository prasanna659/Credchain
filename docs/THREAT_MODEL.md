# Threat model (high-level)

## What this demo protects against

- **Credential tampering**: credentials are represented as Merkle leaves anchored by an issuer on-chain.
- **Issuer fraud deterrence (demo)**: issuers must stake to be considered “registered”; slashing is modeled.
- **Requirement privacy (partial)**: employers commit a hash; the demo UI may still show the plaintext for usability.

## What this demo does NOT fully implement

- **Real DID resolution** (PolygonID / W3C DID methods)
- **Real ZKML proofs** (EZKL) for fraud scoring
- **Production wallet UX** and secure key custody (the demo uses dev accounts / browser wallets)

## Security warnings

- Do not use this code in production without a full audit.
- The “slashing” mechanism is a demo and not an on-chain dispute system.

