// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {CredentialAnchor} from "./CredentialAnchor.sol";
import {RequirementCommit} from "./RequirementCommit.sol";
import {VerifiedEligibilitySBT} from "./VerifiedEligibilitySBT.sol";
import {IVerifier} from "./interfaces/IVerifier.sol";

/**
 * NexusVerifier:
 * - checks a proof against a verifier contract
 * - binds the proof to a specific job requirement commitment
 * - mints a soulbound token to the prover (msg.sender) on success
 *
 * For the local demo, the verifier is a MockGroth16Verifier (always true).
 */
contract NexusVerifier {
    CredentialAnchor public immutable credentialAnchor;
    RequirementCommit public immutable requirementCommit;
    VerifiedEligibilitySBT public immutable sbt;

    IVerifier public verifier;

    // jobId => student => verified
    mapping(uint256 jobId => mapping(address student => bool)) public verified;

    event ProofAccepted(uint256 indexed jobId, address indexed student, bytes32 nullifier);

    error UnknownJob();
    error AlreadyVerified();
    error InvalidProof();

    constructor(address _anchor, address _requirements, address _sbt, address _verifier) {
        credentialAnchor = CredentialAnchor(_anchor);
        requirementCommit = RequirementCommit(_requirements);
        sbt = VerifiedEligibilitySBT(_sbt);
        verifier = IVerifier(_verifier);
    }

    /**
     * Public signals are circuit-dependent.
     * For this demo, we require the job commitment hash to be present as a public signal at index 0.
     */
    function submitProof(
        uint256 jobId,
        bytes32 nullifier,
        bytes calldata proof,
        uint256[] calldata publicSignals
    ) external {
        (address employer, bytes32 requirementHash, uint64 committedAt) = requirementCommit.commitments(jobId);
        if (committedAt == 0) revert UnknownJob();
        if (verified[jobId][msg.sender]) revert AlreadyVerified();

        // binding: publicSignals[0] == uint256(requirementHash)
        if (publicSignals.length == 0 || publicSignals[0] != uint256(requirementHash)) revert InvalidProof();

        bool ok = verifier.verifyProof(proof, publicSignals);
        if (!ok) revert InvalidProof();

        verified[jobId][msg.sender] = true;
        sbt.mint(msg.sender, jobId);
        emit ProofAccepted(jobId, msg.sender, nullifier);
    }
}

