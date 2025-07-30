---
title: RNK RPC Methods
sidebar_position: 11
description: Explore Reactive Network's Geth version RPC methods used for interaction with reactive nodes and ReactVMs.
slug: /rnk-rpc-methods
hide_title: true
---

![RNK RPC Methods](./img/rnk-rpc-methods.jpg)

## Overview

This page provides an overview of the RPC methods specific to the Reactive Network's Geth version, essential for interacting with nodes and ReactVMs within the Reactive Network (RNK). These methods enable transaction retrieval, log access, callback information, etc. Below, you will find a detailed description of each method, including its parameters, cURLs, and responses.

## rnk_getTransactionByHash

Returns the details of a transaction for the specified ReactVM ID and transaction hash.

#### Parameters

1. **rvmId**: `DATA`, 20 Bytes — The ReactVM ID associated with the transaction.
2. **txHash**: `DATA`, 32 Bytes — The hash of the transaction to retrieve.

#### cURL

```bash
curl --location 'https://lasna-rpc.rnk.dev/' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getTransactionByHash",
  "params": [
    "0xa7d9aa89cbcd216900a04cdc13eb5789d643176a",
    "0xe32b9f60321f7a83ef9dda5daf8cf5b2f5cd523156ee484f417d62d84d1e3044"
  ],
  "id": 1
}' | jq
```

#### Response

Returns an object with the following fields:

- **hash** (`string`): The transaction hash.
- **number** (`string`): The transaction number (hex-encoded).
- **time** (`uint64`): The timestamp of when the transaction occurred.
- **root** (`string`): The Merkle root associated with the transaction.
- **limit** (`uint32`): The maximum gas limit set for the transaction.
- **used** (`uint32`): The gas used by the transaction.
- **type** (`uint8`): The transaction type (0 for `Legacy`, 1 for `AccessList`, 2 for `DynamicFee`, 3 for `Blob`, 4 for `SetCode`).
- **status** (`uint8`): The status of the transaction (1 for `Success`, 0 for `Failure`).
- **from** (`string`): The transaction initiator.
- **to** (`string`): The recipient address.
- **createContract** (`bool`): Indicates whether a contract was created during this transaction.
- **sessionId** (`uint64`): The block number where the transaction is located (hex-encoded).
- **refChainId** (`uint32`): The origin chain ID.
- **refTx** (`string`): The hash of the origin chain transaction that triggered this one.
- **refEventIndex** (`uint32`): The origin chain event opcode (0 for `LOG0`, 1 for `LOG1`, 2 for `LOG2`, 3 for `LOG3`, 4 for `LOG4`).
- **data** (`string`): The encoded transaction data in hexadecimal format.
- **rData** (`string`): Additional response data in hexadecimal format (if any).

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "hash": "0xe32b9f60321f7a83ef9dda5daf8cf5b2f5cd523156ee484f417d62d84d1e3044",
    "number": "0x9",
    "time": 1753427529,
    "root": "0x8df166bb5c9843696457dbdc5ab20ca1ab9acdd8703b6f1fd1f51766f34fad7d",
    "limit": 900000,
    "used": 47429,
    "type": 2,
    "status": 1,
    "from": "0xa7d9aa89cbcd216900a04cdc13eb5789d643176a",
    "to": "0x6ba34385d9018cfa3341db62b68b5a55839fe71f",
    "createContract": false,
    "sessionId": 109252,
    "refChainId": 11155111,
    "refTx": "0x52daf0ff44c50da56024f02530ba70fcf653ad11dadb1788b24b20fc824520f5",
    "refEventIndex": 328,
    "data": "0x0d152c2c00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000aa36a7000000000000000000000000c156ad2846d093e0ce4d31cf6d780357e9675dce8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925000000000000000000000000a7d9aa89cbcd216900a04cdc13eb5789d643176a00000000000000000000000065a9b8b03a2ef50356104cb594ba2c91223973de00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000086da6000000000000000000000000000000000000000000000000000000000000000034570ac2a3bbfa2809982e69218a745aa83e1bff79b54e2a2ce10e5d6d4c5c00a52daf0ff44c50da56024f02530ba70fcf653ad11dadb1788b24b20fc824520f50000000000000000000000000000000000000000000000000000000000000148000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000003e8",
    "rData": "0x"
  }
}
```

## rnk_getTransactionByNumber

Returns the details of a transaction based on its sequence number within the specified ReactVM.

#### Parameters

1. **rvmId**: `DATA`, 20 Bytes — The ReactVM ID associated with the transaction.
2. **txNumber**: `HEX` — The sequence number of the transaction to retrieve.

#### cURL

```bash
curl --location 'https://lasna-rpc.rnk.dev/' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getTransactionByNumber",
  "params": [
    "0xa7d9aa89cbcd216900a04cdc13eb5789d643176a",
    "0x9"
  ],
  "id": 1
}' | jq
```

#### Response

Returns an object with the following fields:

- **hash** (`string`): The transaction hash.
- **number** (`string`): The transaction number (hex-encoded).
- **time** (`uint64`): The timestamp of when the transaction occurred.
- **root** (`string`): The Merkle root associated with the transaction.
- **limit** (`uint32`): The maximum gas limit set for the transaction.
- **used** (`uint32`): The gas used by the transaction.
- **type** (`uint8`): The transaction type (0 for `Legacy`, 1 for `AccessList`, 2 for `DynamicFee`, 3 for `Blob`, 4 for `SetCode`).
- **status** (`uint8`): The status of the transaction (1 for `Success`, 0 for `Failure`).
- **from** (`string`): The transaction initiator.
- **to** (`string`): The recipient address.
- **createContract** (`bool`): Indicates whether a contract was created during this transaction.
- **sessionId** (`uint64`): The block number where the transaction is located (hex-encoded).
- **refChainId** (`uint32`): The origin chain ID.
- **refTx** (`string`): The hash of the origin chain transaction that triggered this one.
- **refEventIndex** (`uint32`): The origin chain event opcode (0 for `LOG0`, 1 for `LOG1`, 2 for `LOG2`, 3 for `LOG3`, 4 for `LOG4`).
- **data** (`string`): The encoded transaction data in hexadecimal format.
- **rData** (`string`): Additional response data in hexadecimal format (if any).

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "hash": "0xe32b9f60321f7a83ef9dda5daf8cf5b2f5cd523156ee484f417d62d84d1e3044",
    "number": "0x9",
    "time": 1753427529,
    "root": "0x8df166bb5c9843696457dbdc5ab20ca1ab9acdd8703b6f1fd1f51766f34fad7d",
    "limit": 900000,
    "used": 47429,
    "type": 2,
    "status": 1,
    "from": "0xa7d9aa89cbcd216900a04cdc13eb5789d643176a",
    "to": "0x6ba34385d9018cfa3341db62b68b5a55839fe71f",
    "createContract": false,
    "sessionId": 109252,
    "refChainId": 11155111,
    "refTx": "0x52daf0ff44c50da56024f02530ba70fcf653ad11dadb1788b24b20fc824520f5",
    "refEventIndex": 328,
    "data": "0x0d152c2c00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000aa36a7000000000000000000000000c156ad2846d093e0ce4d31cf6d780357e9675dce8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925000000000000000000000000a7d9aa89cbcd216900a04cdc13eb5789d643176a00000000000000000000000065a9b8b03a2ef50356104cb594ba2c91223973de00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000086da6000000000000000000000000000000000000000000000000000000000000000034570ac2a3bbfa2809982e69218a745aa83e1bff79b54e2a2ce10e5d6d4c5c00a52daf0ff44c50da56024f02530ba70fcf653ad11dadb1788b24b20fc824520f50000000000000000000000000000000000000000000000000000000000000148000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000003e8",
    "rData": "0x"
  }
}
```

## rnk_getTransactionLogs

Returns logs for a transaction based on its sequence number within the specified ReactVM.

#### Parameters

1. **rvmId**: `DATA`, 20 Bytes — The ReactVM ID for which transaction logs are being queried.
2. **txNumber**: `HEX` — The transaction number for which logs are requested.

#### cURL

```bash
curl --location 'https://lasna-rpc.rnk.dev/' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getTransactionLogs",
  "params": [
    "0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a",
    "0x9"
  ],
  "id": 1
}' | jq
```

#### Response

Returns an array of objects with the following fields:

- **txHash** (`string`): The transaction hash.
- **address** (`string`): The contract address that generated the transaction.
- **topics** (`string[]`): An array of indexed event topics.
   - **topics[0]**: The event signature hash.
   - **topics[1]**: The first indexed parameter (if applicable).
   - **topics[2]**: The second indexed parameter (if applicable).
   - **topics[3]**: The third indexed parameter (if applicable).
- **data** (`string`): The non-indexed event data in hexadecimal format.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "txHash": "0xe32b9f60321f7a83ef9dda5daf8cf5b2f5cd523156ee484f417d62d84d1e3044",
      "address": "0x6ba34385d9018cfa3341db62b68b5a55839fe71f",
      "topics": [
        "0x8dd725fa9d6cd150017ab9e60318d40616439424e2fade9c1c58854950917dfc",
        "0x0000000000000000000000000000000000000000000000000000000000aa36a7",
        "0x000000000000000000000000fc2236a0d3421473676c4c422046fbc4f1afdffe",
        "0x00000000000000000000000000000000000000000000000000000000000f4240"
      ],
      "data": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a42f90252d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000065a9b8b03a2ef50356104cb594ba2c91223973de000000000000000000000000a7d9aa89cbcd216900a04cdc13eb5789d643176a000000000000000000000000c156ad2846d093e0ce4d31cf6d780357e9675dce00000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000"
    }
  ]
}
```

## rnk_getHeadNumber

Returns the latest transaction number for the specified ReactVM.

#### Parameters

1. **rvmId**: `DATA`, 20 Bytes — The ReactVM ID for which the latest transaction number is requested.

#### cURL

```bash
curl --location 'https://lasna-rpc.rnk.dev/' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getHeadNumber",
  "params": [
    "0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a"
  ],
  "id": 1
}' | jq
```

#### Response

Returns an object with the following field:

- **result** (`string`): the latest transaction number (hex-encoded).

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x9"
}
```

## rnk_getTransactions

Returns a range of transactions starting from a specified transaction number within the ReactVM.

#### Parameters

1. **rvmId**: `DATA`, 20 Bytes — The ReactVM ID for which transactions are being retrieved.
2. **from**: `HEX` — The starting transaction number.
3. **limit**: `HEX` — The maximum number of transactions to retrieve.

#### cURL

```bash
curl --location 'https://lasna-rpc.rnk.dev/' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getTransactions",
  "params": [
    "0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a",
    "0x9",
    "0x1"
  ],
  "id": 1
}' | jq
```

#### Response

Returns an object with the following fields:

- **hash** (`string`): The transaction hash.
- **number** (`string`): The transaction number (hex-encoded).
- **time** (`uint64`): The timestamp of when the transaction occurred.
- **root** (`string`): The Merkle root associated with the transaction.
- **limit** (`uint32`): The maximum gas limit set for the transaction.
- **used** (`uint32`): The gas used by the transaction.
- **type** (`uint8`): The transaction type (0 for `Legacy`, 1 for `AccessList`, 2 for `DynamicFee`, 3 for `Blob`, 4 for `SetCode`).
- **status** (`uint8`): The status of the transaction (1 for `Success`, 0 for `Failure`).
- **from** (`string`): The transaction initiator.
- **to** (`string`): The recipient address.
- **createContract** (`bool`): Indicates whether a contract was created during this transaction.
- **sessionId** (`uint64`): The block number where the transaction is located (hex-encoded).
- **refChainId** (`uint32`): The origin chain ID.
- **refTx** (`string`): The hash of the origin chain transaction that triggered this one.
- **refEventIndex** (`uint32`): The origin chain event opcode (0 for `LOG0`, 1 for `LOG1`, 2 for `LOG2`, 3 for `LOG3`, 4 for `LOG4`).
- **data** (`string`): The encoded transaction data in hexadecimal format.
- **rData** (`string`): Additional response data in hexadecimal format (if any).

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "hash": "0xe32b9f60321f7a83ef9dda5daf8cf5b2f5cd523156ee484f417d62d84d1e3044",
      "number": "0x9",
      "time": 1753427529,
      "root": "0x8df166bb5c9843696457dbdc5ab20ca1ab9acdd8703b6f1fd1f51766f34fad7d",
      "limit": 900000,
      "used": 47429,
      "type": 2,
      "status": 1,
      "from": "0xa7d9aa89cbcd216900a04cdc13eb5789d643176a",
      "to": "0x6ba34385d9018cfa3341db62b68b5a55839fe71f",
      "createContract": false,
      "sessionId": 109252,
      "refChainId": 11155111,
      "refTx": "0x52daf0ff44c50da56024f02530ba70fcf653ad11dadb1788b24b20fc824520f5",
      "refEventIndex": 328,
      "data": "0x0d152c2c00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000aa36a7000000000000000000000000c156ad2846d093e0ce4d31cf6d780357e9675dce8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925000000000000000000000000a7d9aa89cbcd216900a04cdc13eb5789d643176a00000000000000000000000065a9b8b03a2ef50356104cb594ba2c91223973de00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000086da6000000000000000000000000000000000000000000000000000000000000000034570ac2a3bbfa2809982e69218a745aa83e1bff79b54e2a2ce10e5d6d4c5c00a52daf0ff44c50da56024f02530ba70fcf653ad11dadb1788b24b20fc824520f50000000000000000000000000000000000000000000000000000000000000148000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000003e8",
      "rData": "0x"
    }
  ]
}
```

## rnk_getRnkAddressMapping

Returns the RVM ID mapped to the specified reactive contract address.

#### Parameters

1. **reactNetworkContrAddr**: `DATA`, 20 Bytes — The address of the Reactive Network contract for which the RVM ID is being requested.

#### cURL

```bash
curl --location 'https://lasna-rpc.rnk.dev/' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getRnkAddressMapping",
  "params": [
    "0xc3e185561D2a8b04F0Fcd104A562f460D6cC503c"
  ],
  "id": 1
}' | jq
```

#### Response

Returns an object with the following field:

- **rvmId** (`string`): The unique identifier of the RVM associated with the given contract.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "rvmId": "0xa7d9aa89cbcd216900a04cdc13eb5789d643176a"
  }
}
```

## rnk_getStat

Returns and compiles statistics about origin chain data.

#### Parameters

This method does not require any input parameters.

#### cURL

```bash
curl --location 'https://lasna-rpc.rnk.dev/' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getStat",
  "params": [],
  "id": 1
}' | jq
```

#### Response

Returns an object with the following fields:

- **chainId** (`object`): The statistics for a specific origin chain.
  - **txCount** (`uint64`): The total number of transactions processed from this origin chain.
  - **eventCount** (`uint64`): The total number of events emitted from this origin chain.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "origin": {
      "11155111": {
        "txCount": 20807136,
        "eventCount": 60122691
      },
      "43113": {
        "txCount": 1244787,
        "eventCount": 4929280
      },
      "5318007": {
        "txCount": 160035,
        "eventCount": 169908
      },
      "80002": {
        "txCount": 450072,
        "eventCount": 1786648
      },
      "84532": {
        "txCount": 14266438,
        "eventCount": 122218657
      },
      "97": {
        "txCount": 3787433,
        "eventCount": 9384761
      }
    }
  }
}
```

## rnk_getVms

Returns information about all RVMs, including the number of transactions processed and the count of associated contracts.

#### Parameters

This method does not require any input parameters.

#### cURL

```bash
curl --location 'https://lasna-rpc.rnk.dev/' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getVms",
  "params": [],
  "id": 1
}' | jq
```

#### Response

Returns a list of active RVMs with the following fields:

- **rvmId** (`string`): The unique identifier of the RVM.
- **lastTxNumber** (`string`): The last transaction number executed by this RVM (hex-encoded).
- **contracts** (`uint32`): The number of contracts associated with this RVM.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "rvmId": "0xa7d9aa89cbcd216900a04cdc13eb5789d643176a",
      "lastTxNumber": "0x9",
      "contracts": 4
    },
    {
      "rvmId": "0xfe5a45db052489cbc16d882404bcfa4f6223a55e",
      "lastTxNumber": "0x2",
      "contracts": 1
    },
    {
      "rvmId": "0x49abe186a9b24f73e34ccae3d179299440c352ac",
      "lastTxNumber": "0x2d6",
      "contracts": 1
    },
    {
      "rvmId": "0x941b727ad8acf020558ce58cd7cb65b48b958db1",
      "lastTxNumber": "0x7",
      "contracts": 3
    },
    {
      "rvmId": "0xc1d48a9173212567bd358e40c50bfe131a9fabf1",
      "lastTxNumber": "0x3c",
      "contracts": 28
    }
  ]
}
```

## rnk_getVm

Returns detailed information about a specific RVM, including the latest transaction number and the number of contracts deployed within it.

#### Parameters

1. **rvmId**: `DATA`, 20 Bytes — The unique identifier of the RVM for which information is requested.

#### cURL

```bash
curl --location 'https://lasna-rpc.rnk.dev/' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getVm",
  "params": ["0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a"],
  "id": 1
}' | jq
```

#### Response

Returns an object with the following fields:

- **rvmId** (`string`): The unique identifier of the RVM.
- **lastTxNumber** (`string`): The last transaction number executed by this RVM (hex-encoded).
- **contracts** (`uint32`): The number of contracts created by this RVM.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "rvmId": "0xa7d9aa89cbcd216900a04cdc13eb5789d643176a",
    "lastTxNumber": "0x9",
    "contracts": 4
  }
}
```

## rnk_getSubscribers

Returns a list of contracts that have subscribed to events from a specified RVM, along with their filter topics.

#### Parameters

1. **rvmId**: `DATA`, 20 Bytes — The unique identifier of the RVM for which subscriber information is requested.

#### cURL

```bash
curl --location 'https://lasna-rpc.rnk.dev/' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getSubscribers",
  "params": ["0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a"],
  "id": 1
}' | jq
```

#### Response

Returns a list of RVM-related contract events with the following fields:

- **uid** (`string`): The unique identifier of the subscription.
- **chainId** (`uint32`): The blockchain ID of the subscribed contract.
- **contract** (`string`): The address of the subscribed contract on the origin chain.
- **topics** (`array`): An array of event topics (some may be `null` if not indexed).
- **rvmId** (`string`): The unique identifier of the RVM.
- **rvmContract** (`string`): The address of the RVM contract handling this subscription.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "uid": "7d45d863e45da3a7e60d2cc5bdd7088f",
      "chainId": 11155111,
      "contract": "0xe1bac3039ea58fee2abce7a8cbcc4b0c8ad030c5",
      "topics": [
        "0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1",
        null,
        null,
        null
      ],
      "rvmId": "0xa7d9aa89cbcd216900a04cdc13eb5789d643176a",
      "rvmContract": "0xc3e185561d2a8b04f0fcd104a562f460d6cc503c"
    },
    {
      "uid": "d979ded638e32915f59ae9bfb3b70e6c",
      "chainId": 11155111,
      "contract": "0x7acbd40c79da73b671d47618135486eef39ec6e3",
      "topics": [
        "0x9996f0dd09556ca972123b22cf9f75c3765bc699a1336a85286c7cb8b9889c6b",
        null,
        null,
        null
      ],
      "rvmId": "0xa7d9aa89cbcd216900a04cdc13eb5789d643176a",
      "rvmContract": "0xc3e185561d2a8b04f0fcd104a562f460d6cc503c"
    },
    {
      "uid": "62968b91e4122e0c03a08f38b31a1ae4",
      "chainId": 11155111,
      "contract": "0x16102fe2caa2610a99beaa5f4fb6e230825b1096",
      "topics": [
        "0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1",
        null,
        null,
        null
      ],
      "rvmId": "0xa7d9aa89cbcd216900a04cdc13eb5789d643176a",
      "rvmContract": "0x2afafd298b23b62760711756088f75b7409f5967"
    }
  ]
}
```

## rnk_getCode

Retrieves the bytecode of a deployed contract at a specific transaction or block state for a given RVM.

#### Parameters

1. **rvmId**: `DATA`, 20 bytes — The unique identifier of the RVM.
2. **contract** `DATA`, 20 bytes — The address of the smart contract.
3. **txNumberOrHash** `HEX | TAG` — Specifies the state at which the contract code is retrieved. Accepts either a block number (`HEX`) or a tag (`"latest"`, `"earliest"`, `"pending"`).

#### cURL

```bash
curl --location 'https://lasna-rpc.rnk.dev/' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getCode",
  "params": [
    "0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a",
    "0xA79933a054c8Ad29ae55bEe769Cd9d8228F03520",
    "0x22"
    ],
  "id": 1
}' | jq
```

#### Response

Returns the bytecode of a contract:

- **bytecode** (`string`) — The contract bytecode in hexadecimal format. 

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x60806040526004361061007e575f3560e01c80638456cb591161004d5780638456cb591461010757806396f90b451461011d578063995e4b9814610147578063c290d6911461017157610085565b806303ac52b314610089578063046f7da2146100b35780630d152c2c146100c95780637a90b990146100f157610085565b3661008557005b5f5ffd5b348015610094575f5ffd5b5061009d610199565b6040516100aa9190610cb0565b60405180910390f35b3480156100be575f5ffd5b506100c761019f565b005b3480156100d4575f5ffd5b506100ef60048036038101906100ea9190610cf4565b610458565b005b3480156100fc575f5ffd5b5061010561059d565b005b348015610112575f5ffd5b5061011b610665565b005b348015610128575f5ffd5b50610131610920565b60405161013e9190610cb0565b60405180910390f35b348015610152575f5ffd5b5061015b610929565b6040516101689190610cb0565b60405180910390f35b34801561017c575f5ffd5b5061019760048036038101906101929190610d65565b61092f565b005b60055481565b60025f9054906101000a900460ff16156101ee576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101e590610dea565b60405180910390fd5b60035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461027d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161027490610e52565b60405180910390fd5b600360149054906101000a900460ff166102cc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102c390610eba565b60405180910390fd5b5f6102d56109c5565b90505f5f90505b8151811461043a57600260019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16635a6aced083838151811061033557610334610ed8565b5b60200260200101515f015184848151811061035357610352610ed8565b5b60200260200101516020015185858151811061037257610371610ed8565b5b60200260200101516040015186868151811061039157610390610ed8565b5b6020026020010151606001518787815181106103b0576103af610ed8565b5b6020026020010151608001518888815181106103cf576103ce610ed8565b5b602002602001015160a001516040518763ffffffff1660e01b81526004016103fc96959493929190610f44565b5f604051808303815f87803b158015610413575f5ffd5b505af1158015610425573d5f5f3e3d5ffd5b505050508061043390610fd0565b90506102dc565b505f600360146101000a81548160ff02191690831515021790555050565b60025f9054906101000a900460ff166104a6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161049d90611061565b60405180910390fd5b60045481604001350361059a5743600581905550620f424067ffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff16467f8dd725fa9d6cd150017ab9e60318d40616439424e2fade9c1c58854950917dfc6040516024016040516020818303038152906040527f083b2732000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff838183161783525050505060405161059191906110ef565b60405180910390a45b50565b5f5f5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16639b6c56ec306040518263ffffffff1660e01b81526004016105f7919061110f565b602060405180830381865afa158015610612573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610636919061113c565b90506106625f5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1682610b0b565b50565b60025f9054906101000a900460ff16156106b4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106ab90610dea565b60405180910390fd5b60035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610743576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161073a90610e52565b60405180910390fd5b600360149054906101000a900460ff1615610793576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161078a906111b1565b60405180910390fd5b5f61079c6109c5565b90505f5f90505b8151811461090157600260019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632f8073368383815181106107fc576107fb610ed8565b5b60200260200101515f015184848151811061081a57610819610ed8565b5b60200260200101516020015185858151811061083957610838610ed8565b5b60200260200101516040015186868151811061085857610857610ed8565b5b60200260200101516060015187878151811061087757610876610ed8565b5b60200260200101516080015188888151811061089657610895610ed8565b5b602002602001015160a001516040518763ffffffff1660e01b81526004016108c396959493929190610f44565b5f604051808303815f87803b1580156108da575f5ffd5b505af11580156108ec573d5f5f3e3d5ffd5b50505050806108fa90610fd0565b90506107a3565b506001600360146101000a81548160ff02191690831515021790555050565b5f600554905090565b60045481565b60015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff166109b8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109af90611219565b60405180910390fd5b6109c23382610b0b565b50565b60605f600167ffffffffffffffff8111156109e3576109e2611237565b5b604051908082528060200260200182016040528015610a1c57816020015b610a09610c52565b815260200190600190039081610a015790505b5090506040518060c00160405280468152602001600260019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160045481526020017fa65f96fc951c35ead38878e0f0b7a3c744a6f5ccc1476b313353ce31712313ad81526020017fa65f96fc951c35ead38878e0f0b7a3c744a6f5ccc1476b313353ce31712313ad81526020017fa65f96fc951c35ead38878e0f0b7a3c744a6f5ccc1476b313353ce31712313ad815250815f81518110610af957610af8610ed8565b5b60200260200101819052508091505090565b80471015610b4e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b45906112ae565b60405180910390fd5b5f811115610c4e575f8273ffffffffffffffffffffffffffffffffffffffff16825f67ffffffffffffffff811115610b8957610b88611237565b5b6040519080825280601f01601f191660200182016040528015610bbb5781602001600182028036833780820191505090505b50604051610bc99190611306565b5f6040518083038185875af1925050503d805f8114610c03576040519150601f19603f3d011682016040523d82523d5f602084013e610c08565b606091505b5050905080610c4c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c4390611366565b60405180910390fd5b505b5050565b6040518060c001604052805f81526020015f73ffffffffffffffffffffffffffffffffffffffff1681526020015f81526020015f81526020015f81526020015f81525090565b5f819050919050565b610caa81610c98565b82525050565b5f602082019050610cc35f830184610ca1565b92915050565b5f5ffd5b5f5ffd5b5f5ffd5b5f6101808284031215610ceb57610cea610cd1565b5b81905092915050565b5f60208284031215610d0957610d08610cc9565b5b5f82013567ffffffffffffffff811115610d2657610d25610ccd565b5b610d3284828501610cd5565b91505092915050565b610d4481610c98565b8114610d4e575f5ffd5b50565b5f81359050610d5f81610d3b565b92915050565b5f60208284031215610d7a57610d79610cc9565b5b5f610d8784828501610d51565b91505092915050565b5f82825260208201905092915050565b7f5265616374697665204e6574776f726b206f6e6c7900000000000000000000005f82015250565b5f610dd4601583610d90565b9150610ddf82610da0565b602082019050919050565b5f6020820190508181035f830152610e0181610dc8565b9050919050565b7f556e617574686f72697a656400000000000000000000000000000000000000005f82015250565b5f610e3c600c83610d90565b9150610e4782610e08565b602082019050919050565b5f6020820190508181035f830152610e6981610e30565b9050919050565b7f4e6f7420706175736564000000000000000000000000000000000000000000005f82015250565b5f610ea4600a83610d90565b9150610eaf82610e70565b602082019050919050565b5f6020820190508181035f830152610ed181610e98565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610f2e82610f05565b9050919050565b610f3e81610f24565b82525050565b5f60c082019050610f575f830189610ca1565b610f646020830188610f35565b610f716040830187610ca1565b610f7e6060830186610ca1565b610f8b6080830185610ca1565b610f9860a0830184610ca1565b979650505050505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f610fda82610c98565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361100c5761100b610fa3565b5b600182019050919050565b7f564d206f6e6c79000000000000000000000000000000000000000000000000005f82015250565b5f61104b600783610d90565b915061105682611017565b602082019050919050565b5f6020820190508181035f8301526110788161103f565b9050919050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f6110c18261107f565b6110cb8185611089565b93506110db818560208601611099565b6110e4816110a7565b840191505092915050565b5f6020820190508181035f83015261110781846110b7565b905092915050565b5f6020820190506111225f830184610f35565b92915050565b5f8151905061113681610d3b565b92915050565b5f6020828403121561115157611150610cc9565b5b5f61115e84828501611128565b91505092915050565b7f416c7265616479207061757365640000000000000000000000000000000000005f82015250565b5f61119b600e83610d90565b91506111a682611167565b602082019050919050565b5f6020820190508181035f8301526111c88161118f565b9050919050565b7f417574686f72697a65642073656e646572206f6e6c79000000000000000000005f82015250565b5f611203601683610d90565b915061120e826111cf565b602082019050919050565b5f6020820190508181035f830152611230816111f7565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b7f496e73756666696369656e742066756e647300000000000000000000000000005f82015250565b5f611298601283610d90565b91506112a382611264565b602082019050919050565b5f6020820190508181035f8301526112c58161128c565b9050919050565b5f81905092915050565b5f6112e08261107f565b6112ea81856112cc565b93506112fa818560208601611099565b80840191505092915050565b5f61131182846112d6565b915081905092915050565b7f5472616e73666572206661696c656400000000000000000000000000000000005f82015250565b5f611350600f83610d90565b915061135b8261131c565b602082019050919050565b5f6020820190508181035f83015261137d81611344565b905091905056fea264697066735822122034fc1c6a89fb4e371bf625c4ac368d40ce079d62f9661894e35ec6c69efb147864736f6c634300081c0033"
}
```

## rnk_getStorageAt

Retrieves the storage value at a specified key for a contract on a given RVM at a specific transaction or block state.

#### Parameters

1. **rvmId**: `DATA`, 20 bytes — The unique identifier of the RVM.
2. **address**: `DATA`, 20 bytes — The address of the contract from which to retrieve the storage value.
3. **hexKey**: `DATA`, 32 bytes — The hexadecimal key for which the storage value is being queried.
4. **txNumberOrHash**: `HEX | TAG` — Specifies the block number or hash at which the storage value is queried. Accepts either a block number (`HEX`) or a tag (`"latest"`, `"earliest"`, `"pending"`).

#### cURL

```bash
curl --location 'https://lasna-rpc.rnk.dev/' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getStorageAt",
  "params": [
    "0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a",
    "0xA79933a054c8Ad29ae55bEe769Cd9d8228F03520",
    "0x0000000000000000000000000000000000000000000000000000000000000002",
    "0xb707d1ddcea3fce0a966fde10f412b4c9cdedf99c67a470a7bbcb2407e1c8bcc"
  ],
  "id": 1
}' | jq
```

#### Response

Returns the storage value:

**result** (`string`): A hexadecimal string representing the storage data.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x000000000000000000000000a7d9aa89cbcd216900a04cdc13eb5789d643176a"
}
```

## rnk_call

Performs a read-only simulation of a smart contract function call on a given RVM, without creating a transaction.

#### Parameters

1. **rvmId**: `DATA`, 20 bytes — The unique identifier of the RVM.
2. **args**: `OBJECT` — The transaction arguments, including the contract method and parameters. Should include:
    - `to`: `DATA`, 20 bytes — The address of the contract.
    - `data`: `DATA` — The call data, representing the method and parameters.
    - `from`: `DATA`, 20 bytes, (optional) — The address from which the call is simulated. If omitted, the simulation assumes the call is made from an empty address (0x000...).
    - `gas`: `HEX`, (optional) — The maximum amount of gas allowed for the simulation. If omitted, a default value is used.
    - `gasPrice`: `HEX`, (optional) — The price of gas (in RVM-specific units) for the simulation. 
    - `value`: `HEX`, (optional) — The amount of tokens (e.g., Ether) to send along with the call. For non-payable functions, this should be 0.
3. **txNumberOrHash**: `HEX | TAG` — Specifies the block number or hash to use for simulating the call. Accepts either a block number (`HEX`) or a tag (`"latest"`, `"earliest"`, `"pending"`).

#### cURL

```bash
curl --location 'https://lasna-rpc.rnk.dev/' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_call",
  "params": [
    "0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a",
    {
      "to": "0xA79933a054c8Ad29ae55bEe769Cd9d8228F03520",
      "data": "0x96f90b45"
    },
    "latest"
  ],
  "id": 1
}' | jq
```

#### Response

Returns the result of the simulated call:

**result** (`string`): The simulated result of the contract call, returned as a hexadecimal string.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x0000000000000000000000000000000000000000000000000000000000027a94"
}
```

## rnk_getBlockRvms

Retrieves the history of RVMs for a given block number, specifically those RVMs that have generated an RVM transaction.

#### Parameters

1. **blockN**: `uint64` – The block number for which to retrieve the RVM history.

#### cURL

```bash
curl --location 'https://lasna-rpc.rnk.dev/' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getBlockRvms",
  "params": [
    109252
  ],
  "id": 1
}' | jq
```

#### Response

Returns an array of objects representing RVMs that were active in the given block. Each object contains:

- **rvmId** (`string`): The unique identifier of each RVM.
- **headTxNumber** (`string`): The transaction with the greatest number in the session (hex-encoded).
- **prevRnkBlockId** (`uint64`): The previous block number in which the RVM session was active.
- **txCount** (`uint32`): The total number of transactions in the current RVM session.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "rvmId": "0xa7d9aa89cbcd216900a04cdc13eb5789d643176a",
      "headTxNumber": "0x9",
      "prevRnkBlockId": 109244,
      "txCount": 1
    }
  ]
}
```

## rnk_getFilters

Returns all the active log filters registered on the Reactive Network, along with their configurations and target contracts.

#### Parameters

This method does not require any input parameters.

#### cURL

```bash
curl --location 'https://lasna-rpc.rnk.dev/' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getFilters",
  "params": [],
  "id": 1
}' | jq
```

#### Response

Returns an array of filter objects. Each filter object contains the following fields:

- **uid** (`string`): The unique identifier for the filter.
- **chainId** (`uint32`): The chain ID on which the filter is active.
- **contract** (`string`): The address of the contract the filter is listening to.
- **topics** (`array[string | null]`): An array of up to 4 log topics (from `topic_0` to `topic_3`) used for event filtering. Unused topics are null.
- **configs** (`array[object]`): An array of configuration objects for reactive contracts and their associated ReactVMs.
- **contract** (`string`): The reactive contract address.
- **rvmId** (`string`): The ReactVM ID where the reactive contract resides.
- **active** (`bool`): Indicates whether the subscription/filter is active.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "Uid": "4603da7efc5d1b77f7fa5b0bfd949d6c",
      "ChainId": 11155111,
      "Contract": "0x1e8db093a0cc38302f5822a451809bfd692ff695",
      "Topics": [
        "0x8cabf31d2b1b11ba52dbb302817a3c9c83e4b2a5194d35121ab1354d69f6a4cb",
        null,
        null,
        null
      ],
      "Configs": [
        {
          "Contract": "0xac9163487ca9c5189766706595cbef9b75c1c8e9",
          "RvmId": "0xc1d48a9173212567bd358e40c50bfe131a9fabf1",
          "Active": true
        }
      ]
    },
    {
      "Uid": "b91cf2f05464d578896164d4e6c0c854",
      "ChainId": 11155111,
      "Contract": "0x5e3eeda090eea783af9ee8d81147d9417bb97b38",
      "Topics": [
        "0x8cabf31d2b1b11ba52dbb302817a3c9c83e4b2a5194d35121ab1354d69f6a4cb",
        null,
        null,
        null
      ],
      "Configs": [
        {
          "Contract": "0xe3cf3d848557974d3abf8e7c15c3a534187f1c6f",
          "RvmId": "0xc1d48a9173212567bd358e40c50bfe131a9fabf1",
          "Active": true
        }
      ]
    },
    {
      "Uid": "0fce746e0305e2fc2e425735ea71a52f",
      "ChainId": 11155111,
      "Contract": "0x0102e0a1792b8805f16b6ec27978f6898b865475",
      "Topics": [
        "0x9bffe4738606691ddfa5e5d28208b6ef74537676b39ddb9854b7854a62df0692",
        null,
        null,
        null
      ],
      "Configs": [
        {
          "Contract": "0xe4d4b0c2f8502a98e68c6f0ef2483214c106fd82",
          "RvmId": "0x941b727ad8acf020558ce58cd7cb65b48b958db1",
          "Active": true
        }
      ]
    }
  ]
}
```