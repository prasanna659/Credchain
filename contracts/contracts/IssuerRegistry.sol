// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IssuerVault} from "./IssuerVault.sol";

/**
 * IssuerRegistry:
 * - binds an issuer EOA to a DID hash
 * - grants ISSUER_ROLE if the issuer is bonded in IssuerVault
 */
contract IssuerRegistry is AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    IssuerVault public immutable vault;

    mapping(address issuer => bytes32 didHash) public issuerDidHash;

    event IssuerRegistered(address indexed issuer, bytes32 indexed didHash);

    error NotEnoughStake();
    error AlreadyRegistered();

    constructor(address vaultAddress, address admin) {
        vault = IssuerVault(vaultAddress);
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function register(bytes32 didHash) external {
        if (hasRole(ISSUER_ROLE, msg.sender)) revert AlreadyRegistered();
        if (!vault.canRegister(msg.sender)) revert NotEnoughStake();
        issuerDidHash[msg.sender] = didHash;
        _grantRole(ISSUER_ROLE, msg.sender);
        emit IssuerRegistered(msg.sender, didHash);
    }
}

