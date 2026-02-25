// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * Demo IssuerVault:
 * - Issuers stake native ETH (Hardhat local chain) as a bond.
 * - A slasher can slash stake (demo governance / challenge flow).
 *
 * In production this would likely use an ERC20 (e.g. MATIC on Polygon) and a full dispute system.
 */
contract IssuerVault is AccessControl {
    bytes32 public constant SLASHER_ROLE = keccak256("SLASHER_ROLE");

    uint256 public immutable minStakeWei;
    mapping(address issuer => uint256 bonded) public bondedStake;

    event Staked(address indexed issuer, uint256 amount, uint256 totalBonded);
    event Withdrawn(address indexed issuer, uint256 amount, uint256 remainingBonded);
    event Slashed(address indexed issuer, uint256 burnedAmount, uint256 challengerAmount, address indexed challenger);

    error StakeTooSmall(uint256 sent, uint256 minRequired);
    error InsufficientBonded(uint256 bonded, uint256 requested);
    error ZeroAmount();

    constructor(uint256 _minStakeWei, address admin) {
        minStakeWei = _minStakeWei;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(SLASHER_ROLE, admin);
    }

    function stake() external payable {
        if (msg.value == 0) revert ZeroAmount();
        bondedStake[msg.sender] += msg.value;
        emit Staked(msg.sender, msg.value, bondedStake[msg.sender]);
    }

    function canRegister(address issuer) external view returns (bool) {
        return bondedStake[issuer] >= minStakeWei;
    }

    function withdraw(uint256 amountWei) external {
        if (amountWei == 0) revert ZeroAmount();
        uint256 bonded = bondedStake[msg.sender];
        if (bonded < amountWei) revert InsufficientBonded(bonded, amountWei);
        bondedStake[msg.sender] = bonded - amountWei;
        (bool ok, ) = msg.sender.call{value: amountWei}("");
        require(ok, "WITHDRAW_FAILED");
        emit Withdrawn(msg.sender, amountWei, bondedStake[msg.sender]);
    }

    /**
     * Demo slashing: burns 50% (sent to address(0)) and rewards 50% to challenger.
     */
    function slash(address issuer, uint256 amountWei, address challenger) external onlyRole(SLASHER_ROLE) {
        if (amountWei == 0) revert ZeroAmount();
        uint256 bonded = bondedStake[issuer];
        if (bonded < amountWei) revert InsufficientBonded(bonded, amountWei);

        bondedStake[issuer] = bonded - amountWei;

        uint256 half = amountWei / 2;
        uint256 burned = amountWei - half;

        // burn (best-effort)
        (bool burnOk, ) = address(0).call{value: burned}("");
        burnOk;

        // reward challenger
        (bool rewardOk, ) = challenger.call{value: half}("");
        require(rewardOk, "REWARD_FAILED");

        emit Slashed(issuer, burned, half, challenger);
    }
}

