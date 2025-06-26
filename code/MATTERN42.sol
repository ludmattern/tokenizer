// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title MATTERN42Token
 * @dev ERC20 token with minting, burning, and pausing capabilities
 * @author MATTERN42 Team
 */
contract MATTERN42Token is ERC20, Ownable, Pausable {
    uint256 public constant MAX_SUPPLY = 1000000 * 10 ** 18; // 1 million tokens

    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        require(
            initialSupply <= MAX_SUPPLY,
            "Initial supply exceeds max supply"
        );
        _mint(msg.sender, initialSupply);
    }

    /**
     * @dev Mint new tokens (only owner)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @dev Burn tokens from caller's balance
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    /**
     * @dev Pause all token transfers (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause token transfers (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Override transfer to include pause functionality
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
