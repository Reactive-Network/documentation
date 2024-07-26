---
title: Interfaces
sidebar_position: 1
description: Discover the key interfaces, IReactive and ISubscriptionService, essential for managing blockchain event subscriptions. Learn how these interfaces enable reactive contracts to handle specific events and receive notifications efficiently.
slug: /compendium/interfaces
custom_edit_url: null
---

# Interfaces 

# Overview 

The Interfaces section defines `IReactive` and `ISubscriptionService` interfaces, which work together for handling and
subscribing to specific blockchain events. These interfaces enable reactive contracts to receive notifications and manage
event subscriptions dynamically.

The [IReactive](./ireactive.md) interface includes a single external function, `react`, which processes event notifications.
This function takes parameters such as the source chain ID, originating contract address, event topics, event data, and the block
number where the event is logged.

The [ISubscriptionService](./isubscriptionservice.md) interface provides two external functions, `subscribe` and `unsubscribe`,
for managing event subscriptions. These functions use parameters including the source chain ID, originating contract address,
and event topics to define and remove subscription criteria, enabling contracts to handle events dynamically.