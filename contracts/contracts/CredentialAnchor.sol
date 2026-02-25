// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IssuerRegistry} from "./IssuerRegistry.sol";

/**
 * Stores anchored credential batches per issuer.
 * Each anchor is a single Merkle root representing a batch of credentials (e.g., 1000 students).
 *
 * Fraud score/proof is a demo stub for a ZKML attestation.
 */
contract CredentialAnchor {
    struct BatchAnchor {
        bytes32 merkleRoot;
        uint32 fraudScoreBps; // 0..10_000
        bytes32 fraudProofHash;
        uint64 anchoredAt;
    }

    IssuerRegistry public immutable registry;
    mapping(address issuer => mapping(uint256 batchId => BatchAnchor)) public anchors;

    event BatchAnchored(
        address indexed issuer,
        uint256 indexed batchId,
        bytes32 merkleRoot,
        uint32 fraudScoreBps,
        bytes32 fraudProofHash
    );

    error NotIssuer();
    error AlreadyAnchored();

    constructor(address issuerRegistry) {
        registry = IssuerRegistry(issuerRegistry);
    }

    function anchorBatch(
        uint256 batchId,
        bytes32 merkleRoot,
        uint32 fraudScoreBps,
        bytes32 fraudProofHash
    ) external {
        if (!registry.hasRole(registry.ISSUER_ROLE(), msg.sender)) revert NotIssuer();

        BatchAnchor storage existing = anchors[msg.sender][batchId];
        if (existing.anchoredAt != 0) revert AlreadyAnchored();

        anchors[msg.sender][batchId] = BatchAnchor({
            merkleRoot: merkleRoot,
            fraudScoreBps: fraudScoreBps,
            fraudProofHash: fraudProofHash,
            anchoredAt: uint64(block.timestamp)
        });

        emit BatchAnchored(msg.sender, batchId, merkleRoot, fraudScoreBps, fraudProofHash);
    }
}

