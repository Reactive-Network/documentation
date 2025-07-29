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
    "0xc3e185561D2a8b04F0Fcd104A562f460D6cC503c",
    "0x1"
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
  "result": "0x6080604052600436106100385760003560e01c80630d152c2c146100445780637a90b9901461006d578063c290d691146100845761003f565b3661003f57005b600080fd5b34801561005057600080fd5b5061006b60048036038101906100669190610849565b6100ad565b005b34801561007957600080fd5b506100826104ac565b005b34801561009057600080fd5b506100ab60048036038101906100a691906108c8565b610578565b005b600260009054906101000a900460ff166100fc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100f390610952565b60405180910390fd5b600260169054906101000a900460ff161561011a57610119610972565b5b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681602001602081019061016691906109ff565b73ffffffffffffffffffffffffffffffffffffffff16036102a057600260159054906101000a900460ff1680156101c057507f9996f0dd09556ca972123b22cf9f75c3765bc699a1336a85286c7cb8b9889c6b8160400135145b80156102075750600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168160600135145b801561024e5750600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168160800135145b1561029b576001600260166101000a81548160ff0219169083151502179055507f9f9fb434574749b74458e0ddc3cf5fd5bdb1b009c8615e825606b53724576f3560405160405180910390a15b6104a9565b6000818060c001906102b29190610a3b565b8101906102bf9190610bc5565b90506102ca81610611565b80156102e35750600260159054906101000a900460ff16155b156104a7577f52b19d35843f734b8fafec640fa01006d27ffc8b2d7ba72d41de82a3a292a8f860405160405180910390a1600080600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600560149054906101000a900460ff1660065460075460405160240161038896959493929190610c2b565b6040516020818303038152906040527fef201296000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff838183161783525050505090506001600260156101000a81548160ff021916908315150217905550620f424067ffffffffffffffff16600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1684600001357f8dd725fa9d6cd150017ab9e60318d40616439424e2fade9c1c58854950917dfc8460405161049d9190610d0b565b60405180910390a4505b505b50565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16639b6c56ec306040518263ffffffff1660e01b81526004016105089190610d2d565b602060405180830381865afa158015610525573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105499190610d5d565b905061057560008054906101000a900473ffffffffffffffffffffffffffffffffffffffff16826106c3565b50565b600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16610604576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105fb90610dd6565b60405180910390fd5b61060e33826106c3565b50565b6000600560149054906101000a900460ff16156106755760075482600001516dffffffffffffffffffffffffffff1660065484602001516dffffffffffffffffffffffffffff166106629190610e25565b61066c9190610e96565b111590506106be565b60075482602001516dffffffffffffffffffffffffffff1660065484600001516dffffffffffffffffffffffffffff166106af9190610e25565b6106b99190610e96565b111590505b919050565b80471015610706576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106fd90610f13565b60405180910390fd5b600081111561080c5760008273ffffffffffffffffffffffffffffffffffffffff1682600067ffffffffffffffff81111561074457610743610ab4565b5b6040519080825280601f01601f1916602001820160405280156107765781602001600182028036833780820191505090505b506040516107849190610f6f565b60006040518083038185875af1925050503d80600081146107c1576040519150601f19603f3d011682016040523d82523d6000602084013e6107c6565b606091505b505090508061080a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161080190610fd2565b60405180910390fd5b505b5050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600061018082840312156108405761083f610824565b5b81905092915050565b60006020828403121561085f5761085e61081a565b5b600082013567ffffffffffffffff81111561087d5761087c61081f565b5b61088984828501610829565b91505092915050565b6000819050919050565b6108a581610892565b81146108b057600080fd5b50565b6000813590506108c28161089c565b92915050565b6000602082840312156108de576108dd61081a565b5b60006108ec848285016108b3565b91505092915050565b600082825260208201905092915050565b7f564d206f6e6c7900000000000000000000000000000000000000000000000000600082015250565b600061093c6007836108f5565b915061094782610906565b602082019050919050565b6000602082019050818103600083015261096b8161092f565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006109cc826109a1565b9050919050565b6109dc816109c1565b81146109e757600080fd5b50565b6000813590506109f9816109d3565b92915050565b600060208284031215610a1557610a1461081a565b5b6000610a23848285016109ea565b91505092915050565b600080fd5b600080fd5b600080fd5b60008083356001602003843603038112610a5857610a57610a2c565b5b80840192508235915067ffffffffffffffff821115610a7a57610a79610a31565b5b602083019250600182023603831315610a9657610a95610a36565b5b509250929050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b610aec82610aa3565b810181811067ffffffffffffffff82111715610b0b57610b0a610ab4565b5b80604052505050565b6000610b1e610810565b9050610b2a8282610ae3565b919050565b60006dffffffffffffffffffffffffffff82169050919050565b610b5281610b2f565b8114610b5d57600080fd5b50565b600081359050610b6f81610b49565b92915050565b600060408284031215610b8b57610b8a610a9e565b5b610b956040610b14565b90506000610ba584828501610b60565b6000830152506020610bb984828501610b60565b60208301525092915050565b600060408284031215610bdb57610bda61081a565b5b6000610be984828501610b75565b91505092915050565b610bfb816109c1565b82525050565b60008115159050919050565b610c1681610c01565b82525050565b610c2581610892565b82525050565b600060c082019050610c406000830189610bf2565b610c4d6020830188610bf2565b610c5a6040830187610bf2565b610c676060830186610c0d565b610c746080830185610c1c565b610c8160a0830184610c1c565b979650505050505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610cc6578082015181840152602081019050610cab565b60008484015250505050565b6000610cdd82610c8c565b610ce78185610c97565b9350610cf7818560208601610ca8565b610d0081610aa3565b840191505092915050565b60006020820190508181036000830152610d258184610cd2565b905092915050565b6000602082019050610d426000830184610bf2565b92915050565b600081519050610d578161089c565b92915050565b600060208284031215610d7357610d7261081a565b5b6000610d8184828501610d48565b91505092915050565b7f417574686f72697a65642073656e646572206f6e6c7900000000000000000000600082015250565b6000610dc06016836108f5565b9150610dcb82610d8a565b602082019050919050565b60006020820190508181036000830152610def81610db3565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610e3082610892565b9150610e3b83610892565b9250828202610e4981610892565b91508282048414831517610e6057610e5f610df6565b5b5092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6000610ea182610892565b9150610eac83610892565b925082610ebc57610ebb610e67565b5b828204905092915050565b7f496e73756666696369656e742066756e64730000000000000000000000000000600082015250565b6000610efd6012836108f5565b9150610f0882610ec7565b602082019050919050565b60006020820190508181036000830152610f2c81610ef0565b9050919050565b600081905092915050565b6000610f4982610c8c565b610f538185610f33565b9350610f63818560208601610ca8565b80840191505092915050565b6000610f7b8284610f3e565b915081905092915050565b7f5472616e73666572206661696c65640000000000000000000000000000000000600082015250565b6000610fbc600f836108f5565b9150610fc782610f86565b602082019050919050565b60006020820190508181036000830152610feb81610faf565b905091905056fea26469706673582212205dd2d167f8f7f33663420e493d6f607e4216a5d5532c3ac4b16d8fbbfa0532a164736f6c634300081c0033"
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
    "0x6Ba34385D9018CFa3341DB62b68b5a55839fE71F",
    "0x0000000000000000000000000000000000000000000000000000000000000003",
    "0x9"
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
   "result": "0x000000000000000000000000000000000000000000000000000000000000000e"
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