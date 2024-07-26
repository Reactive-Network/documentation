---
title: ReactVM
sidebar_position: 2
description: Explore ReactVM, a dedicated EVM within the Reactive Network for executing Reactive Smart Contracts. It enables random transactions while maintaining order, serving as a sandbox for contract deployment.
slug: /architecture/react-vm
---

# ReactVM

## Overview

ReactVM is a specialized type of EVM (Ethereum Virtual Machine) within the Reactive Network. Its primary function is to act as an execution sandbox for [Reactive Smart Contracts](./reactive-smart-contracts.md) (RSCs), enabling transactions within blocks to occur in random order and across multiple threads. However, transaction order is maintained within each ReactVM.

![Reactive Network Lifecycle](./img/global-processing-flow.png)

From a technical standpoint, a ReactVM functions as its own EVM subnet within the Reactive Network, booting up whenever an event matches the RSC's subscription. While this approach implies a certain overhead, we've managed to minimize it by separating the EVM from `geth`, resulting in a ReactVM boot time of approximately 100μs. This value is insignificantly small in relation to the Network's processing capabilities.

## My ReactVM

When you deploy a Reactive Smart Contract (RSC), you will receive a ReactVM. The ReactVM address will match the EOA address used for deployment. Every Smart Contract deployed to the Reactive Network will ultimately be deployed in your personal ReactVM. State can be shared within the ReactVM.

:::warning[Word of Caution]

While the architecture allows for the deployment of multiple RSCs into a single ReactVM, we **strongly** advise against excessive use of this ability, as it may negate the advantages of parallelized execution. Instead, consider subscribing to the events of other RSCs in a manner similar to subscribing to `Origin` events.

:::