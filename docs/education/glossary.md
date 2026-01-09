---
title: Glossary
sidebar_position: 4
description: A comprehensive blockchain and DeFi glossary for developers, traders, and builders joining Reactive Network. Learn essential Web3, EVM, cross-chain, and Reactive Contract concepts—from Airdrops and Finality to TPS, block time, and automated DeFi execution.
slug: glossary
hide_title: true
---

![Glossary Image](img/glossary.jpg)

## A

**Airdrop** – free tokens sent to eligible wallets. Projects use airdrops to attract users, reward early supporters, or bootstrap a community. Eligibility often depends on actions (e.g., using a protocol) or holding a token.

**APY (Annual Percentage Yield)** – estimated yearly return that includes compounding (earning “interest on interest”). In DeFi, APY can change frequently as rewards and usage fluctuate.

**Atomic Swap** – a trustless trade between two cryptocurrencies where the swap either completes fully or doesn’t happen at all (no partial fills, no counterparty risk), usually enforced by smart contract logic.

**Auto-Compounding** – automatically reinvesting earned rewards back into your position so your balance grows faster over time, without you manually claiming and re-depositing.

**AMMs (Automated Market Makers)** – DEX trading systems that use liquidity pools and a pricing formula instead of an order book. You trade against a pool, and the price adjusts as the pool balance changes.

## B

**Beacon Chain** – Ethereum’s proof-of-stake coordination layer introduced during the Ethereum 2.0 upgrade. It manages validators and consensus for the network.

**Block Time** – how often a chain produces new blocks (e.g., ~7 seconds). Shorter block time usually means faster “first confirmation,” but not always faster finality.

**Bridging** – moving tokens (or messages) from one blockchain to another using a bridge. Bridges are useful but can add risk because they rely on extra infrastructure.

**Burning (Token Burn)** – permanently removing tokens from circulation (sent to an unusable address or destroyed by protocol rules). Burns reduce supply and may affect token economics.

## C

**Cold Wallet** – a wallet whose private keys are stored offline (e.g., hardware wallet). Safer from online attacks, but less convenient for frequent transactions.

**Confirmation** – a transaction has been included in a block. More confirmations means more blocks were added after it, making it harder to reverse on chains with probabilistic finality.

**Consensus Algorithm** – the rules the network uses to agree on the “true” chain and validate blocks/transactions (e.g., PoS, PoW). Consensus is what lets thousands of nodes share one ledger state.

**Cross-chain Copy Trading** – automatically copying another trader’s actions across one or more chains (e.g., their swaps, opens/closes), so your wallet mirrors their strategy.

**Custodial Wallet** – a wallet where someone else (an exchange or provider) controls the private keys for you. Easier to use, but you rely on the custodian for access and security.

## D

**DAO Governance** – community decision-making using on-chain voting. Token holders (or members) vote on proposals like upgrades, spending, or parameter changes.

**dApp (Decentralized Application)** – an app whose core logic runs on smart contracts. The UI may look like a normal website, but actions are executed on-chain.

**DeFi (Decentralized Finance)** – financial services built with smart contracts (trading, lending, borrowing) that run without traditional intermediaries.

**Delegated Proof of Stake (DPoS)** – a PoS variant where token holders elect a smaller set of delegates/validators to produce blocks on behalf of the network.

**Destination Chain** – the chain where a transaction ultimately executes and changes state (where the “final action” happens).

**DEX Swaps** – exchanging one token for another on a decentralized exchange using smart contracts, usually via AMMs or on-chain order books.

## E

**Emitting Events** – smart contracts writing “event logs” that external apps can read. Events are often used for indexing, notifications, and triggering automation (they don’t directly change state by themselves).

**EOA (Externally Owned Account)** – a normal wallet account controlled by a private key (e.g., MetaMask). EOAs can sign transactions; smart contracts cannot sign on their own.

**ERC-20** – the common token standard on Ethereum/EVM chains. Most fungible tokens follow ERC-20 rules (balances, transfers, approvals).

**ERC-721** – the standard for NFTs (unique tokens). Each token ID represents a distinct asset.

**Event-Driven Execution** – contracts/app logic that reacts to events or data changes rather than a user manually clicking “execute”.

**Event Sources** – where events come from (e.g., transactions on an origin chain, specific contracts, or a monitored event stream).

**EVM Events** – event logs produced by EVM smart contracts. Wallets/indexers use them to track activity like transfers, swaps, and state-related notifications.

## F

**Fiat Gateway** – a service that lets you buy/sell crypto using traditional money (bank transfer, card, etc.), bridging fiat ↔ crypto.

**Finality** – the point at which a transaction can no longer be reverted. Some chains reach fast deterministic finality; others rely on “more confirmations” to increase confidence.

**Flash Loan** – a loan that must be borrowed and repaid within the same transaction. If repayment fails, the whole transaction reverts. Used for arbitrage and complex DeFi operations.

**Fork** – a protocol change. A soft fork is backward-compatible; a hard fork creates a split where older nodes can’t follow the new rules.

**Fungibility** – every unit is interchangeable (1 USDC ≈ any other 1 USDC). NFTs are non-fungible because each item is unique.

## G

**Gas** – the fee unit for computation on EVM chains. You pay gas to run transactions; complex actions cost more.

**Gauge Voting** – voting that directs incentives (often reward emissions) to specific pools/strategies, commonly used in DeFi to influence where liquidity goes.

**Genesis Block** – the first block of a blockchain (block 0), from which all later blocks follow.

## H

**Hash** – a “digital fingerprint” of data. A small change in input produces a very different output, which makes hashes useful for integrity and linking blocks.

**Hot Wallet** – a wallet whose keys are on an internet-connected device. Convenient, but higher exposure to phishing/malware than cold storage.

## I

**Initial Coin Offering (ICO)** – fundraising by selling a new token to early backers (historically common; now often replaced by other launch models).

**Interoperability** – the ability for chains/apps to communicate or move assets/messages across networks.

**Inversion-of-Control** – in Reactive Contracts, execution is triggered by the system when relevant events happen, rather than users manually calling functions at the right moment.

**Immutable** – once data is finalized on-chain, it can’t be changed without extraordinary network-level intervention.

## K

**Keypair** – your public key is like an address identifier; your private key is the secret that signs transactions. Whoever controls the private key controls the funds.

**KYC (Know Your Customer)** – identity verification required by many regulated services (exchanges, fiat gateways) to comply with AML laws.

## L

**L1 (Layer One)** – the base blockchain that provides security and final settlement (e.g., Ethereum, Solana).

**L2 (Layer Two)** – a scaling layer that processes transactions off the L1 main path and settles results back to L1 (often cheaper/faster).

**Latency** – how long it takes from submitting an action to seeing it executed/confirmed.

**Liquidation Protection** – features designed to reduce the chance a leveraged/collateralized position gets liquidated (varies by protocol).

**Liquidity Pools** – shared token reserves that enable trading/lending. Liquidity providers deposit assets and earn fees/rewards, but take risks (e.g., price movement).

## M

**Merkle Root** – a single hash that represents a whole set of data (like all transactions in a block). It lets nodes verify inclusion efficiently.

**Merkle Tree** – a structure that organizes hashes so you can prove a piece of data is included without downloading everything.

**Multisig Protocol** – a wallet/control scheme requiring multiple approvals (e.g., 2-of-3 signatures) before funds move.

## N 

**Node** – a computer running blockchain software that helps validate, relay, and store chain data.

**Nonce** – a value used once. In PoW it’s adjusted to find a valid block hash; in accounts it can prevent replay and enforce transaction ordering.

## O

**Oracles** – systems that bring external data (prices, outcomes, timestamps) on-chain so smart contracts can react to real-world information.

**Origin Chain** – the chain where the relevant events are observed/emitted before being processed for Reactive Contract execution.

## P

**Proof of Authority (PoA)** – a consensus model where a known set of validators produces blocks. Efficient, but more centralized than open validator sets.

**Proof of Stake (PoS)** – consensus where validators stake tokens to participate and can be penalized for malicious behavior.

## R

**ReacDeFi** – Reactive Network’s dApp for automated trade management (e.g., stop-loss and take-profit), with upcoming liquidation protection — built to execute strategies via on-chain event-centric logic rather than bots.

**ReactVM** – Reactive Network’s execution environment for Reactive Contracts, designed for high-throughput parallel processing while preserving correct ordering where needed.

**Reactive Network** – a blockchain layer designed for event-centric smart contracts that execute automatically based on on-chain events (including cross-chain), reducing reliance on off-chain bots and centralized automation.

**Reactive Contract** – a smart contract that watches for specified events and executes automatically when conditions are met (e.g., “if price hits X, do Y”).

**Reactivity** – the property of a system where actions are triggered by incoming events/data streams instead of manual user transactions.

**Rollups** – L2 systems that batch many transactions and post compressed proofs/data to an L1 to reduce cost and increase throughput.

## S

**Self-Rebalancing Liquidity Pools** – pools that automatically adjust allocations/weights according to predefined rules, rather than relying on manual rebalancing.

**Sharding** – a scalability technique that splits a blockchain into multiple shards, each handling part of the total workload. It increases throughput and reduces congestion, but adds complexity around security and cross-shard communication.

**Sidechain** – a separate blockchain connected to a main chain, often with different rules or performance characteristics, and a bridge for moving assets between them. Sidechains can offer cheaper or faster transactions, but usually rely on their own security assumptions rather than the main chain’s.

**Stateful** – a contract or system that stores data over time and updates it as transactions/events occur (as opposed to stateless computation).

**Stop Order** – an order that triggers when price reaches a set level, typically to limit losses or enter a position.

**Stop Price** – the price level that triggers the stop order.

## T

**Tokenomics** – how a token’s supply, distribution, incentives, and utility are designed (and how those choices affect behavior and value).

**TPS (Transactions Per Second)** – a rough throughput metric. TPS comparisons can be misleading unless you also consider transaction type, finality, and fees.

**Trading Pools** – pooled liquidity used to enable trading and price discovery on DEXs.

**Trustlessness** – the idea that you don’t need to trust a person or company because rules are enforced by code and consensus (though you still trust assumptions like contract correctness).

## U

**Uniswap** – a leading decentralized exchange (DEX) on Ethereum where users swap tokens directly from their wallets. Instead of matching buyers and sellers in an order book, Uniswap typically uses liquidity pools and AMM pricing.

## V

**Validator** – a network participant that proposes and verifies blocks. In PoS systems, validators lock up (“stake”) tokens to earn rewards and can be penalized (slashed) for malicious behavior or going offline.

## W

**Whale Moves** – very large trades or transfers made by “whales” (wallets with substantial holdings). These transactions can move prices, shift liquidity, or signal market sentiment—though not every large transfer means a trade happened.

**Wrapped Tokens** – tokens that track the value of an asset from another chain so it can be used in a new ecosystem (e.g., BTC represented as WBTC on Ethereum). Wrapped tokens typically rely on custody or protocol mechanisms to keep the “wrapped” token redeemable for the original asset.

## Y

**Yield Farming** – earning rewards by putting tokens to work in DeFi (e.g., providing liquidity, lending, staking). Returns can be high but variable, and strategies carry risks such as smart contract bugs, price volatility, and impermanent loss.

## Z 

**Zero-Knowledge Proof (ZKP)** – a cryptographic proof that lets you demonstrate something is true (e.g., “I meet condition X”) without revealing the underlying data (e.g., the exact balance or identity).