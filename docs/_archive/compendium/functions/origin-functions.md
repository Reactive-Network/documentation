---
sidebar_position: 1
title: Origin Contract Functions
description: Discover how the constructor function in UniswapDemoToken.sol empowers ERC-20 tokens, tailoring them for dApp integration.
slug: /compendium/functions/origin-functions
custom_edit_url: null
---

# Origin Contract Functions

## Overview

This section focuses on the core functions of origin chain contracts.

## Constructor Function

```solidity title="UniswapDemoToken.sol"
contract UniswapDemoToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(tx.origin, 100 ether);
    }
}
```

### Parameters

* `name`: A string representing the name of the token.

* `symbol`: A string representing the symbol of the token.

### Description

The constructor function in the `UniswapDemoToken.sol` contract initializes a custom ERC-20 token. It extends the
functionality of the ERC-20 token standard and is invoked during the deployment of the contract. Upon deployment,
the constructor sets the name and symbol of the token using the provided parameters. Additionally, it mints an initial
supply of 100 ether tokens to the address that deployed the contract (`tx.origin`). This initialization process prepares
the token for use in decentralized applications (dApps), enabling it to be integrated into platforms like Uniswap or other
decentralized exchanges.