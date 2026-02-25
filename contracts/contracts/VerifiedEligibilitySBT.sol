// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * Minimal ERC-5192 Soulbound Token:
 * - non-transferable ERC721
 * - `locked(tokenId)` always true
 */
contract VerifiedEligibilitySBT is ERC721, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public nextTokenId = 1;
    mapping(uint256 tokenId => uint256 jobId) public tokenJobId;

    event Locked(uint256 tokenId);

    error Soulbound();

    constructor(address admin) ERC721("NexusCred Verified Eligibility", "NXCRED") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, AccessControl)
    returns (bool)
    {
        return ERC721.supportsInterface(interfaceId) || AccessControl.supportsInterface(interfaceId);
    }

    function locked(uint256 tokenId) external view returns (bool) {
        _requireOwned(tokenId);
        return true;
    }

    function mint(address to, uint256 _jobId) external onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
        tokenId = nextTokenId++;
        tokenJobId[tokenId] = _jobId;
        _safeMint(to, tokenId);
        emit Locked(tokenId);
    }

    // Soulbound enforcement
    function approve(address, uint256) public pure override {
        revert Soulbound();
    }

    function setApprovalForAll(address, bool) public pure override {
        revert Soulbound();
    }

    function transferFrom(address, address, uint256) public pure override {
        revert Soulbound();
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert Soulbound();
    }
}

