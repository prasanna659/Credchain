// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IVerifier} from "./interfaces/IVerifier.sol";

/**
 * Demo verifier that always returns true.
 * Replace this with a real snarkjs-generated Groth16 verifier when you build the circuit.
 */
contract MockGroth16Verifier is IVerifier {
    function verifyProof(bytes calldata, uint256[] calldata) external pure returns (bool) {
        return true;
    }
}

