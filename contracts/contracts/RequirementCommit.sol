// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * Employers commit to job requirements by posting only a hash on-chain.
 * The plaintext requirements can be shared off-chain with candidates.
 */
contract RequirementCommit {
    struct Commitment {
        address employer;
        bytes32 requirementHash;
        uint64 committedAt;
    }

    mapping(uint256 jobId => Commitment) public commitments;

    event RequirementCommitted(uint256 indexed jobId, address indexed employer, bytes32 requirementHash);

    error AlreadyCommitted();

    function commitRequirement(uint256 jobId, bytes32 requirementHash) external {
        if (commitments[jobId].committedAt != 0) revert AlreadyCommitted();
        commitments[jobId] = Commitment({
            employer: msg.sender,
            requirementHash: requirementHash,
            committedAt: uint64(block.timestamp)
        });
        emit RequirementCommitted(jobId, msg.sender, requirementHash);
    }
}

