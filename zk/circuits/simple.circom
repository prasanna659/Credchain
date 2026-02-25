pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

/**
 * @title SimpleMerkleVerifier
 * @dev A simpler version for testing without complex imports
 * Verifies that a value is in a Merkle tree
 */
template SimpleMerkleVerifier() {
    signal input value;
    signal input root;
    
    // For testing purposes, just verify the value matches the root
    // In production, this would verify Merkle paths properly
    signal output isValid;
    
    component hash = Poseidon(1);
    hash.inputs[0] <== value;
    
    isValid <== hash.out === root ? 1 : 0;
}

/**
 * @title SimplePredicateChecker
 * @dev Checks if a value satisfies a simple predicate
 */
template SimplePredicateChecker() {
    signal input value;
    signal input min_value;
    signal input required;
    
    signal output satisfied;
    
    // Check if value >= min_value
    satisfied <== value >= min_value ? 1 : 0;
}

/**
 * @title SimpleCrossCredential
 * @dev Simplified version for testing
 */
template SimpleCrossCredential() {
    // Three simple values representing credentials
    signal input cred1_value;
    signal input cred2_value;
    signal input cred3_value;
    
    // Minimum requirements
    signal input min_cred1;
    signal input min_cred2;
    signal input min_cred3;
    
    // Public input (commitment hash)
    signal input commitment_hash;
    
    // Output
    signal output eligible;
    
    // Create component checks
    component check1 = SimplePredicateChecker();
    check1.value <== cred1_value;
    check1.min_value <== min_cred1;
    
    component check2 = SimplePredicateChecker();
    check2.value <== cred2_value;
    check2.min_value <== min_cred2;
    
    component check3 = SimplePredicateChecker();
    check3.value <== cred3_value;
    check3.min_value <== min_cred3;
    
    // All checks must pass
    eligible <== check1.satisfied * check2.satisfied * check3.satisfied;
}

component main { public [ commitment_hash ] } = SimpleCrossCredential();
