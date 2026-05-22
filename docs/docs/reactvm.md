---
title: Reactive Authentication
sidebar_position: 5
description: Reactive Authentication
slug: /reactvm
hide_title: true
unlisted: true
---

## Overview


### Reactive Authentication

When a reactive contract constructs a callback payload, the first argument must be reserved for the RVM ID. Developers pass `address(0)` as a placeholder in this slot, and Reactive Network automatically overwrites the first 160 bits with the deployer's address before the callback reaches the destination chain. This means callbacks always carry an authenticated origin that can't be forged by the contract itself.

The callback must include at least one argument, omitting the first slot entirely will cause the call to fail, since the system has no location to inject the RVM ID. Destination contracts can rely on this first argument to identify which ReactVM originated the callback.

