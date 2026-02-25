/**
 * Merkle Tree Utility for Credchain
 * Generates Merkle roots and proofs for credential batches
 */

class MerkleTree {
    constructor(leaves, hash = (a, b) => {
        const crypto = require('crypto');
        return crypto.createHash('sha256').update(a + b).digest('hex');
    }) {
        this.leaves = leaves;
        this.hash = hash;
        this.tree = this.buildTree(leaves);
    }

    buildTree(leaves) {
        if (leaves.length === 0) throw new Error('No leaves provided');
        if (leaves.length === 1) return [leaves];

        let currentLevel = leaves;
        const tree = [currentLevel];

        while (currentLevel.length > 1) {
            const nextLevel = [];
            for (let i = 0; i < currentLevel.length; i += 2) {
                const left = currentLevel[i];
                const right = currentLevel[i + 1] || left;
                nextLevel.push(this.hash(left, right));
            }
            tree.push(nextLevel);
            currentLevel = nextLevel;
        }

        return tree;
    }

    getRoot() {
        return this.tree[this.tree.length - 1][0];
    }

    getProof(leafIndex) {
        const proof = [];
        const positions = [];
        let index = leafIndex;

        for (let i = 0; i < this.tree.length - 1; i++) {
            const levelLen = this.tree[i].length;
            const isRight = index % 2 === 1;
            const sibling = isRight
                ? this.tree[i][index - 1]
                : this.tree[i][index + 1] || this.tree[i][index];

            proof.push(sibling);
            positions.push(isRight ? 1 : 0);
            index = Math.floor(index / 2);
        }

        return { proof, positions };
    }

    verifyProof(leaf, proof, positions, root) {
        let hash = leaf;

        for (let i = 0; i < proof.length; i++) {
            const sibling = proof[i];
            const pos = positions[i];

            if (pos === 0) {
                hash = this.hash(hash, sibling);
            } else {
                hash = this.hash(sibling, hash);
            }
        }

        return hash === root;
    }
}

module.exports = MerkleTree;
