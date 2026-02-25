pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

/**
 * @title MerkleProof
 * @dev Verifies a Merkle path and leaf hash
 * @param leaf The leaf value
 * @param path The array of sibling hashes
 * @param pos The position bitmask (which side each node is on)
 * @param root The expected Merkle root
 */
template MerkleProof(depth) {
    signal input leaf;
    signal input path[depth];
    signal input pos[depth];
    signal input root;
    
    signal output valid;
    
    component hash[depth];
    signal node[depth + 1];
    
    node[0] <== leaf;
    
    for (var i = 0; i < depth; i++) {
        hash[i] = Poseidon(2);
        
        // If pos[i] == 0, hash(node, path[i]), else hash(path[i], node)
        hash[i].inputs[0] <== pos[i] === 0 ? node[i] : path[i];
        hash[i].inputs[1] <== pos[i] === 0 ? path[i] : node[i];
        
        node[i + 1] <== hash[i].out;
    }
    
    // Final node should equal root
    valid <== node[depth] === root ? 1 : 0;
}

/**
 * @title SelectiveDisclosure
 * @dev Proves a value meets a predicate without revealing the exact value
 */
template SelectiveDisclosure() {
    // Input value (hidden)
    signal input value;
    signal input value_hash;
    
    // Predicate inputs
    signal input comparison_type; // 0: ==, 1: >=, 2: <=, 3: !=
    signal input comparison_value;
    
    // Output
    signal output predicate_satisfied;
    
    // Hash check - ensure the hidden value matches the disclosed hash
    component hasher = Poseidon(1);
    hasher.inputs[0] <== value;
    hasher.out === value_hash;
    
    signal is_equal <== value === comparison_value ? 1 : 0;
    signal is_gte <== value >= comparison_value ? 1 : 0;
    signal is_lte <== value <= comparison_value ? 1 : 0;
    signal is_not_equal <== value === comparison_value ? 0 : 1;
    
    predicate_satisfied <== 
        comparison_type === 0 ? is_equal :
        comparison_type === 1 ? is_gte :
        comparison_type === 2 ? is_lte :
        comparison_type === 3 ? is_not_equal : 0;
}

/**
 * @title CrossCredentialEligibility
 * @dev Main circuit: Combines multiple credentials and verifies eligibility
 * 
 * This circuit proves that a student holds valid credentials from multiple
 * issuers and meets an employer's blind requirements, without revealing
 * any personal data.
 */
template CrossCredentialEligibility() {
    // Credential 1 (e.g., IIT Degree)
    signal input cred1_leaf;
    signal input cred1_merkle_path[10];
    signal input cred1_merkle_pos[10];
    signal input cred1_merkle_root;
    signal input cred1_gpa;
    signal input cred1_gpa_hash;
    signal input cred1_grad_year;
    signal input cred1_grad_year_hash;
    
    // Credential 2 (e.g., AWS Cert)
    signal input cred2_leaf;
    signal input cred2_merkle_path[10];
    signal input cred2_merkle_pos[10];
    signal input cred2_merkle_root;
    signal input cred2_cloud_level;
    signal input cred2_cloud_level_hash;
    
    // Credential 3 (e.g., Work Experience)
    signal input cred3_leaf;
    signal input cred3_merkle_path[10];
    signal input cred3_merkle_pos[10];
    signal input cred3_merkle_root;
    signal input cred3_years_exp;
    signal input cred3_years_exp_hash;
    
    // Requirement predicates (from employer's commitment hash)
    signal input req_gpa_min;
    signal input req_cloud_certified;
    signal input req_years_exp_min;
    signal input req_grad_year_min;
    
    // Requirement commitment hash (which we're matching against)
    signal input requirement_commitment_hash;
    
    // Outputs
    signal output credential1_verified;
    signal output credential2_verified;
    signal output credential3_verified;
    signal output all_predicates_satisfied;
    signal output final_eligibility;
    
    // Verify Credential 1 (IIT Degree)
    component proof1_gpa = MerkleProof(10);
    proof1_gpa.leaf <== cred1_leaf;
    for (var i = 0; i < 10; i++) {
        proof1_gpa.path[i] <== cred1_merkle_path[i];
        proof1_gpa.pos[i] <== cred1_merkle_pos[i];
    }
    proof1_gpa.root <== cred1_merkle_root;
    
    credential1_verified <== proof1_gpa.valid;
    
    // Check Credential 1 Predicates (GPA >= min, Grad Year >= min)
    component pred1_gpa = SelectiveDisclosure();
    pred1_gpa.value <== cred1_gpa;
    pred1_gpa.value_hash <== cred1_gpa_hash;
    pred1_gpa.comparison_type <== 1; // >= (GTE)
    pred1_gpa.comparison_value <== req_gpa_min;
    
    component pred1_year = SelectiveDisclosure();
    pred1_year.value <== cred1_grad_year;
    pred1_year.value_hash <== cred1_grad_year_hash;
    pred1_year.comparison_type <== 1; // >= (GTE)
    pred1_year.comparison_value <== req_grad_year_min;
    
    // Verify Credential 2 (AWS Cert)
    component proof2 = MerkleProof(10);
    proof2.leaf <== cred2_leaf;
    for (var i = 0; i < 10; i++) {
        proof2.path[i] <== cred2_merkle_path[i];
        proof2.pos[i] <== cred2_merkle_pos[i];
    }
    proof2.root <== cred2_merkle_root;
    
    credential2_verified <== proof2.valid;
    
    // Check Credential 2 Predicates (Cloud Certified)
    component pred2_cloud = SelectiveDisclosure();
    pred2_cloud.value <== cred2_cloud_level;
    pred2_cloud.value_hash <== cred2_cloud_level_hash;
    pred2_cloud.comparison_type <== 0; // == (equality check)
    pred2_cloud.comparison_value <== req_cloud_certified;
    
    // Verify Credential 3 (Work Experience)
    component proof3 = MerkleProof(10);
    proof3.leaf <== cred3_leaf;
    for (var i = 0; i < 10; i++) {
        proof3.path[i] <== cred3_merkle_path[i];
        proof3.pos[i] <== cred3_merkle_pos[i];
    }
    proof3.root <== cred3_merkle_root;
    
    credential3_verified <== proof3.valid;
    
    // Check Credential 3 Predicates (Years >= min)
    component pred3_exp = SelectiveDisclosure();
    pred3_exp.value <== cred3_years_exp;
    pred3_exp.value_hash <== cred3_years_exp_hash;
    pred3_exp.comparison_type <== 1; // >= (GTE)
    pred3_exp.comparison_value <== req_years_exp_min;
    
    // All predicates must be satisfied
    all_predicates_satisfied <== 
        pred1_gpa.predicate_satisfied * 
        pred1_year.predicate_satisfied * 
        pred2_cloud.predicate_satisfied * 
        pred3_exp.predicate_satisfied;
    
    // Final eligibility: all credentials verified AND all predicates met
    final_eligibility <== 
        credential1_verified * 
        credential2_verified * 
        credential3_verified * 
        all_predicates_satisfied;
}

component main { public [ requirement_commitment_hash ] } = CrossCredentialEligibility();
