---
title: RNK RPC Methods
sidebar_position: 7
description: Explore Reactive Network's RPC methods used for communication with nodes and ReactVMs.
slug: /rnk-rpc-methods
hide_title: true
---

## Overview

This page provides an overview of the RPC methods specific to the Reactive Network's Geth version, essential for interacting with nodes and ReactVMs within the Reactive Network (RNK). These methods enable transaction retrieval, log access, callback information, and more. Below, you will find a detailed description of each method, including its parameters, usage examples, and responses.

## rnk_getTransactionByHash

Returns the details of a transaction for the specified ReactVM ID and transaction hash.

#### Parameters

1. **rvmId**: `DATA`, 20 Bytes — The ReactVM ID associated with the transaction.
2. **txHash**: `DATA`, 32 Bytes — The hash of the transaction to retrieve.

**Example Parameters:**

```json
[
  "0xc1d48a9173212567bd358e40c50bfe131a9fabf1",
  "0x160f41dc30205679437b161ee1d0789c9c1235874896d47dd16dc8528f43f4dd"
]
```

#### cURL

```bash
curl --location 'https://kopli-rpc.rkt.ink' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getTransactionByHash",
  "params": [
    "0xc1d48a9173212567bd358e40c50bfe131a9fabf1",
    "0x160f41dc30205679437b161ee1d0789c9c1235874896d47dd16dc8528f43f4dd"
  ],
  "id": 1
}'
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "hash": "0x160f41dc30205679437b161ee1d0789c9c1235874896d47dd16dc8528f43f4dd",
    "number": 597,
    "time": 1723813244,
    "root": "0xe1a53e5a4599240181a80822a579e8aafa1ade82267110e4a36b43ecdcbe428b",
    "limit": 900000,
    "used": 30389,
    "type": 2,
    "status": 1,
    "from": "0xc1d48a9173212567bd358e40c50bfe131a9fabf1",
    "to": "0x892d3389a0f2d3f364ef1cd1e97464178a3d5790",
    "createContract": false,
    "sessionId": 223278,
    "refChainId": 11155111,
    "refTx": "0xb019cbec2e613a18cae8808ff7d8a533bc239a5a8afaf450cdf1ee48dc20f60e",
    "refEventIndex": 275,
    "data": "0x4190e48f0000000000000000000000000000000000000000000000000000000000aa36a70000000000000000000000009b9bb25f1a81078c544c829c5eb7822d747cf4348e191feb68ec1876759612d037a111be48d8ec3db7f72e4e7d321c2c8008bd0d0000000000000000000000004ea6a685e0e7ac3f9f81d130b2119ef626ae9de8000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000635aff00000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000",
    "rData": "0x"
  }
}
```

## rnk_getTransactionByNumber

Returns the details of a transaction based on its sequence number within the specified ReactVM.

#### Parameters

1. **rvmId**: `DATA`, 20 Bytes — The ReactVM ID associated with the transaction.
2. **txNumber**: `QUANTITY` — The sequence number of the transaction to retrieve.

**Example Parameters:**

```json
[
  "0x4C820BCD6CB17824488A58F5661D835013ABC9CE",
  15
]
```

#### cURL

```bash
curl --location 'https://kopli-rpc.rkt.ink' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getTransactionByNumber",
  "params": [
    "0xc1d48a9173212567bd358e40c50bfe131a9fabf1",
    15
  ],
  "id": 1
}'
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "hash": "0xa3d28bcc4fc99e1009ad8cfaf2a5b327809d2e6fe42d8691309da1d1817cdd63",
    "number": 15,
    "time": 1722563289,
    "root": "0xd2c84722bfd3a7163440d873bf0563544eec14cc905b8323001fd99dd9da1893",
    "limit": 900000,
    "used": 30389,
    "type": 2,
    "status": 1,
    "from": "0xc1d48a9173212567bd358e40c50bfe131a9fabf1",
    "to": "0x892d3389a0f2d3f364ef1cd1e97464178a3d5790",
    "createContract": false,
    "sessionId": 44721,
    "refChainId": 11155111,
    "refTx": "0x98006c4ece9e35c7ad3ad73ed0c948ac9c379cb18a903b4f81066919707cc51c",
    "refEventIndex": 125,
    "data": "0x4190e48f0000000000000000000000000000000000000000000000000000000000aa36a70000000000000000000000009b9bb25f1a81078c544c829c5eb7822d747cf4348e191feb68ec1876759612d037a111be48d8ec3db7f72e4e7d321c2c8008bd0d000000000000000000000000e3da902072b35b7c14c9fdd29e60aef536f64026000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000061f56a00000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000",
    "rData": "0x"
  }
}
```

## rnk_getTransactionLogs

Returns logs for a transaction based on its sequence number within the specified ReactVM.

#### Parameters

1. **rvmId**: `DATA`, 20 Bytes — The ReactVM ID for which transaction logs are being queried.
2. **txNumber**: `QUANTITY` — The transaction number for which logs are requested.

**Example Parameters:**

```json
[
  "0xc1d48a9173212567bd358e40c50bfe131a9fabf1",
  15
]
```

#### cURL

```bash
curl --location 'https://kopli-rpc.rkt.ink' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getTransactionLogs",
  "params": [
    "0xc1d48a9173212567bd358e40c50bfe131a9fabf1",
    15
  ],
  "id": 1
}'
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "txHash": "0xa3d28bcc4fc99e1009ad8cfaf2a5b327809d2e6fe42d8691309da1d1817cdd63",
      "address": "0x892d3389a0f2d3f364ef1cd1e97464178a3d5790",
      "topics": [
        "0x8dd725fa9d6cd150017ab9e60318d40616439424e2fade9c1c58854950917dfc",
        "0x0000000000000000000000000000000000000000000000000000000000512578",
        "0x000000000000000000000000e3cf3d848557974d3abf8e7c15c3a534187f1c6f",
        "0x00000000000000000000000000000000000000000000000000000000000f4240"
      ],
      "data": "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000064f8893f1c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e3da902072b35b7c14c9fdd29e60aef536f64026000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000"
    }
  ]
}
```

## rnk_getCallbackTransaction

Returns callback transactions associated with a specified ReactVM transaction.

#### Parameters

1. **rvmId**: `DATA`, 20 Bytes — The ReactVM ID for which callback transactions are being queried.
2. **rvmTx**: `DATA`, 32 Bytes — The transaction hash for which callback transactions are requested.

**Example Parameters:**

```json
[
  "0xc1d48a9173212567bd358e40c50bfe131a9fabf1",
  "0xf2c70482044840ea34ccf987f38c85857647d34ffc1d3a81c043a87d0697b436"
]
```

#### cURL

```bash
curl --location 'https://kopli-rpc.rkt.ink' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getCallbackTransaction",
  "params": [
    "0xc1d48a9173212567bd358e40c50bfe131a9fabf1",
    "0xf2c70482044840ea34ccf987f38c85857647d34ffc1d3a81c043a87d0697b436"
  ],
  "id": 1
}'
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "chainId": 5318008,
      "txHash": "0x2b082a42ab94a5d0630a46beddd503536d04ca79b3befd934e12a64f4cb0b381",
      "logIndex": 0,
      "gasLimit": 1000000,
      "rnkBlockNumber": 368839
    }
  ]
}
```

## rnk_getHeadNumber

Returns the latest transaction number for the specified ReactVM.

#### Parameters

1. **rvmId**: `DATA`, 20 Bytes — The ReactVM ID for which the latest transaction number is requested.

**Example Parameter:**

```json
[
  "0xc1d48a9173212567bd358e40c50bfe131a9fabf1"
]
```

#### cURL

```bash
curl --location 'https://kopli-rpc.rkt.ink' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getHeadNumber",
  "params": [
    "0xc1d48a9173212567bd358e40c50bfe131a9fabf1"
  ],
  "id": 1
}'
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": 621
}
```

## rnk_getTransactions

Returns a range of transactions starting from a specified transaction number within the ReactVM.

#### Parameters

1. **rvmId**: `DATA`, 20 Bytes — The ReactVM ID for which transactions are being retrieved.
2. **from**: `QUANTITY` — The starting transaction number.
3. **limit**: `QUANTITY` — The maximum number of transactions to retrieve.

**Example Parameters:**

```json
[
  "0xc1d48a9173212567bd358e40c50bfe131a9fabf1",
  15,
  2
]
```

#### cURL

```bash
curl --location 'https://kopli-rpc.rkt.ink' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getTransactions",
  "params": [
    "0xc1d48a9173212567bd358e40c50bfe131a9fabf1",
    15,
    2
  ],
  "id": 1
}'
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "hash": "0xa3d28bcc4fc99e1009ad8cfaf2a5b327809d2e6fe42d8691309da1d1817cdd63",
      "number": 15,
      "time": 1722563289,
      "root": "0xd2c84722bfd3a7163440d873bf0563544eec14cc905b8323001fd99dd9da1893",
      "limit": 900000,
      "used": 30389,
      "type": 2,
      "status": 1,
      "from": "0xc1d48a9173212567bd358e40c50bfe131a9fabf1",
      "to": "0x892d3389a0f2d3f364ef1cd1e97464178a3d5790",
      "createContract": false,
      "sessionId": 44721,
      "refChainId": 11155111,
      "refTx": "0x98006c4ece9e35c7ad3ad73ed0c948ac9c379cb18a903b4f81066919707cc51c",
      "refEventIndex": 125,
      "data": "0x4190e48f0000000000000000000000000000000000000000000000000000000000aa36a70000000000000000000000009b9bb25f1a81078c544c829c5eb7822d747cf4348e191feb68ec1876759612d037a111be48d8ec3db7f72e4e7d321c2c8008bd0d000000000000000000000000e3da902072b35b7c14c9fdd29e60aef536f64026000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000061f56a00000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000",
      "rData": "0x"
    },
    {
      "hash": "0x16b133befc1b9bec318a4da5d611b53bb45aa0a9d6f985f676d388cf2d250b05",
      "number": 16,
      "time": 1722655549,
      "root": "0xed4b93614630baf55bdcd51a0e53e6d17cb260ac47d419e42f66ff4d7c76e113",
      "limit": 900000,
      "used": 30389,
      "type": 2,
      "status": 1,
      "from": "0xc1d48a9173212567bd358e40c50bfe131a9fabf1",
      "to": "0x892d3389a0f2d3f364ef1cd1e97464178a3d5790",
      "createContract": false,
      "sessionId": 57901,
      "refChainId": 11155111,
      "refTx": "0xf5aeb67ee14182b0fdb2ff99b154a184c322eaecdb7f61b0781c68f8209a2e30",
      "refEventIndex": 44,
      "data": "0x4190e48f0000000000000000000000000000000000000000000000000000000000aa36a70000000000000000000000009b9bb25f1a81078c544c829c5eb7822d747cf4348e191feb68ec1876759612d037a111be48d8ec3db7f72e4e7d321c2c8008bd0d000000000000000000000000e3da902072b35b7c14c9fdd29e60aef536f64026000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000620fe600000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000",
      "rData": "0x"
    },
  ]
}
```

## rnk_getRnkAddressMapping

Returns the RVM ID mapped to the specified Reactive Network contract address.

#### Parameters

1. **reactNetworkContrAddr**: `DATA`, 20 Bytes — The address of the Reactive Network contract for which the RVM ID is being requested.

**Example Parameter:**

```json
[
  "0x892d3389a0f2d3f364ef1cd1e97464178a3d5790"
]
```

#### cURL

```bash
curl --location 'https://kopli-rpc.rkt.ink' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getRnkAddressMapping",
  "params": [
    "0x892d3389a0f2d3f364ef1cd1e97464178a3d5790"
  ],
  "id": 1
}'
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "rvmId": "0xc1d48a9173212567bd358e40c50bfe131a9fabf1"
  }
}
```

## rnk_getStat

Returns and compiles statistics about RVM transactions and origin chain data.

#### Parameters

This method does not require any input parameters.

#### cURL

```bash
curl --location 'https://kopli-rpc.rkt.ink' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getStat",
  "params": [],
  "id": 1
}'
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "origin": {
      "1": {
        "txCount": 255111254,
        "eventCount": 697105252
      },
      "11155111": {
        "txCount": 130248727,
        "eventCount": 288629737
      },
      "56": {
        "txCount": 788373999,
        "eventCount": 3247682921
      }
    },
    "rvmTxCount": 795
  }
}
```

## rnk_getVms

Returns information about all RVMs, including the number of transactions processed and the count of associated contracts.

#### Parameters

This method does not require any input parameters.

#### cURL

```bash
curl --location 'https://kopli-rpc.rkt.ink' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getVms",
  "params": [],
  "id": 1
}'
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "rvmId": "0xfe5a45db052489cbc16d882404bcfa4f6223a55e",
      "lastTxNumber": 79,
      "contracts": 5
    },
    {
      "rvmId": "0xafefa3fec75598e868b8527231db8c431e51c2ae",
      "lastTxNumber": 13,
      "contracts": 5
    },
    {
      "rvmId": "0xe3da902072b35b7c14c9fdd29e60aef536f64026",
      "lastTxNumber": 1,
      "contracts": 1
    },
    {
      "rvmId": "0x5295c69a68ffea82933beff298d83fae83187b7f",
      "lastTxNumber": 2,
      "contracts": 1
    },
    {
      "rvmId": "0x941b727ad8acf020558ce58cd7cb65b48b958db1",
      "lastTxNumber": 15,
      "contracts": 3
    },
    {
      "rvmId": "0xc1d48a9173212567bd358e40c50bfe131a9fabf1",
      "lastTxNumber": 621,
      "contracts": 6
    },
    {
      "rvmId": "0x4ea6a685e0e7ac3f9f81d130b2119ef626ae9de8",
      "lastTxNumber": 63,
      "contracts": 26
    },
    {
      "rvmId": "0x76cbff2ae605ed822cb374544bf6eb44c17b7541",
      "lastTxNumber": 1,
      "contracts": 1
    }
  ]
}
```

## rnk_getVm

Returns detailed information about a specific RVM, including its transaction count and the number of associated contracts.

#### Parameters

1. **rvmId**: `DATA`, 20 Bytes — The unique identifier of the RVM for which information is requested.

**Example Parameter:**

```json
"0xfe5a45db052489cbc16d882404bcfa4f6223a55e"
```

#### cURL

```bash
curl --location 'https://kopli-rpc.rkt.ink' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getVm",
  "params": ["0xfe5a45db052489cbc16d882404bcfa4f6223a55e"],
  "id": 1
}'
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "rvmId": "0xfe5a45db052489cbc16d882404bcfa4f6223a55e",
    "lastTxNumber": 79,
    "contracts": 0
  }
}
```

## rnk_getSubscribers

Returns a list of subscribers for a specified RVM by checking the filters associated with it.

#### Parameters

1. **rvmId**: `DATA`, 20 Bytes — The unique identifier of the RVM for which subscriber information is requested.

**Example Parameter:**

```json
"0xc1d48a9173212567bd358e40c50bfe131a9fabf1"
```

#### cURL

```bash
curl --location 'https://kopli-rpc.rkt.ink' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getSubscribers",
  "params": ["0xfe5a45db052489cbc16d882404bcfa4f6223a55e"],
  "id": 1
}'
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "uid": "699035bf565ee8d00ec45e46b984351e",
      "chainId": 11155111,
      "contract": "0x9b9bb25f1a81078c544c829c5eb7822d747cf434",
      "topics": [
        "0x8e191feb68ec1876759612d037a111be48d8ec3db7f72e4e7d321c2c8008bd0d",
        null,
        null,
        null
      ],
      "rvmId": "0xfe5a45db052489cbc16d882404bcfa4f6223a55e",
      "rvmContract": "0x43cad7a98c05bd105a337b2edef9d4bebcdfefae"
    }
  ]
}
```

## rnk_getCode

Returns the smart contract code at a specific transaction state for a given RVM and contract address.

#### Parameters

1. **rvmId**: `DATA`, 20 bytes — The unique identifier of the RVM.
2. **contract** `DATA`, 20 bytes — The address of the smart contract.
3. **txNumberOrHash** `QUANTITY | TAG` — Specifies the state at which the contract code is retrieved. Accepts either a block number (`QUANTITY`) or a tag (`"latest"`, `"earliest"`, `"pending"`).

**Example Parameters:**

```json
[
  "0xfe5a45db052489cbc16d882404bcfa4f6223a55e",
  "0xda8d201634b2dc1fb18438a1803284daffcf38ee",
  "latest"
]
```

#### cURL

```bash
curl --location 'https://kopli-rpc.rkt.ink' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getCode",
  "params": [
    "0xfe5a45db052489cbc16d882404bcfa4f6223a55e",
    "0xda8d201634b2dc1fb18438a1803284daffcf38ee",
    "latest"
    ],
  "id": 1
}'
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x60806040526004361061007f5760003560e01c80637a90b9901161004e5780637a90b9901461010a5780638456cb591461011f578063c290d69114610134578063f8893f1c1461015457600080fd5b8063046f7da21461008b57806310062470146100a25780634190e48f146100ca57806356b4997f146100ea57600080fd5b3661008657005b600080fd5b34801561009757600080fd5b506100a0610174565b005b3480156100ae57600080fd5b506100b860055481565b60405190815260200160405180910390f35b3480156100d657600080fd5b506100a06100e5366004610b65565b610396565b3480156100f657600080fd5b506100a0610105366004610c2c565b610445565b34801561011657600080fd5b506100a0610474565b34801561012b57600080fd5b506100a0610527565b34801561014057600080fd5b506100a061014f366004610c2c565b61074b565b34801561016057600080fd5b506100a061016f366004610c45565b6107bc565b600054600160a01b900460ff16156101a75760405162461bcd60e51b815260040161019e90610c86565b60405180910390fd5b6002546001600160a01b031633146101d15760405162461bcd60e51b815260040161019e90610cb5565b600254600160a01b900460ff166102175760405162461bcd60e51b815260206004820152600a602482015269139bdd081c185d5cd95960b21b604482015260640161019e565b600061022161093d565b905060005b815181146103855760015482516001600160a01b0390911690635a6aced09084908490811061025757610257610cdb565b60200260200101516000015184848151811061027557610275610cdb565b60200260200101516020015185858151811061029357610293610cdb565b6020026020010151604001518686815181106102b1576102b1610cdb565b6020026020010151606001518787815181106102cf576102cf610cdb565b6020026020010151608001518888815181106102ed576102ed610cdb565b602090810291909101015160a001516040516001600160e01b031960e089901b16815260048101969096526001600160a01b03909416602486015260448501929092526064840152608483015260a482015260c401600060405180830381600087803b15801561035c57600080fd5b505af1158015610370573d6000803e3d6000fd5b505050508061037e90610cf1565b9050610226565b50506002805460ff60a01b19169055565b600080886103a5600a8a610d18565b6040516001600160a01b039384166024820152929091166044830152606482015260840160408051601f198184030181529181526020820180516001600160e01b0316633e224fc760e21b17905251909150620f424090309062512578907f8dd725fa9d6cd150017ab9e60318d40616439424e2fade9c1c58854950917dfc90610430908690610d5e565b60405180910390a45050505050505050505050565b6002546001600160a01b0316331461046f5760405162461bcd60e51b815260040161019e90610cb5565b600555565b600054600160a01b900460ff161561049e5760405162461bcd60e51b815260040161019e90610c86565b6001546040516326db15bb60e21b81523060048201526000916001600160a01b031690639b6c56ec90602401602060405180830381865afa1580156104e7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061050b9190610d91565b600154909150610524906001600160a01b031682610a50565b50565b600054600160a01b900460ff16156105515760405162461bcd60e51b815260040161019e90610c86565b6002546001600160a01b0316331461057b5760405162461bcd60e51b815260040161019e90610cb5565b600254600160a01b900460ff16156105c65760405162461bcd60e51b815260206004820152600e60248201526d105b1c9958591e481c185d5cd95960921b604482015260640161019e565b60006105d061093d565b905060005b815181146107345760015482516001600160a01b0390911690632f8073369084908490811061060657610606610cdb565b60200260200101516000015184848151811061062457610624610cdb565b60200260200101516020015185858151811061064257610642610cdb565b60200260200101516040015186868151811061066057610660610cdb565b60200260200101516060015187878151811061067e5761067e610cdb565b60200260200101516080015188888151811061069c5761069c610cdb565b602090810291909101015160a001516040516001600160e01b031960e089901b16815260048101969096526001600160a01b03909416602486015260448501929092526064840152608483015260a482015260c401600060405180830381600087803b15801561070b57600080fd5b505af115801561071f573d6000803e3d6000fd5b505050508061072d90610cf1565b90506105d5565b50506002805460ff60a01b1916600160a01b179055565b6000546001600160a01b0316158061076d57506000546001600160a01b031633145b6107b25760405162461bcd60e51b8152602060048201526016602482015275417574686f72697a65642073656e646572206f6e6c7960501b604482015260640161019e565b6105243382610a50565b60015483906001600160a01b031633146108185760405162461bcd60e51b815260040161019e90610cb5565b50505050565b6000806000546001600160a01b031633145b90503491905056fea26469706673582212202ffdeab10e1be533b3d8eb07f6ed470f2686d65b48fa06e1b2e3e31f973d72a664736f6c634300080a0033"
}
```

## rnk_getStorageAt

Returns the value stored at a specific key in the storage of a contract for a given RVM at a specified block number or hash.

#### Parameters

1. **rvmId**: `DATA`, 20 bytes — The unique identifier of the RVM.
2. **address**: `DATA`, 20 bytes — The address of the contract from which to retrieve the storage value.
3. **hexKey**: `DATA`, 32 bytes — The hexadecimal key for which the storage value is being queried.
4. **txNumberOrHash**: `QUANTITY | TAG` — Specifies the block number or hash at which the storage value is queried. Accepts either a block number (`QUANTITY`) or a tag (`"latest"`, `"earliest"`, `"pending"`).

**Example Parameters:**

```json
[
  "0xfe5a45db052489cbc16d882404bcfa4f6223a55e",
  "0x02c98d4e2e49b010A3Eb77d36149EB176c734846",
  "0x3717c88d36bf133baf074ae8066d60394bfbe5ca5eb06af8420e3abc6849f099",
  "0x2"
]
```

#### cURL

```bash
curl --location 'https://kopli-rpc.rkt.ink' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getStorageAt",
  "params": [
    "0xfe5a45db052489cbc16d882404bcfa4f6223a55e",
    "0x02c98d4e2e49b010A3Eb77d36149EB176c734846",
    "0x3717c88d36bf133baf074ae8066d60394bfbe5ca5eb06af8420e3abc6849f099",
    "0x2"
  ],
  "id": 1
}'
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
```

## rnk_call

Simulates a contract method call without an actual transaction, using the blockchain state at a specific transaction or block.

#### Parameters

1. **rvmId**: `DATA`, 20 bytes — The unique identifier of the RVM.
2. **args**: `OBJECT` — The transaction arguments, including the contract method and parameters. Should include:
    - `to`: `DATA`, 20 bytes — The address of the contract.
    - `data`: `DATA` — The call data, representing the method and parameters.
    - `from`: `DATA`, 20 bytes, (optional) — The address from which the call is simulated. If omitted, the simulation assumes the call is made from an empty address (0x000...).
    - `gas`: `QUANTITY`, (optional) — The maximum amount of gas allowed for the simulation. If omitted, a default value is used.
    - `gasPrice`: `QUANTITY`, (optional) — The price of gas (in RVM-specific units) for the simulation. 
    - `value`: `QUANTITY`, (optional) — The amount of tokens (e.g., Ether) to send along with the call. For non-payable functions, this should be 0.
3. **txNumberOrHash**: `QUANTITY | TAG` — Specifies the block number or hash to use for simulating the call. Accepts either a block number (`QUANTITY`) or a tag (`"latest"`, `"earliest"`, `"pending"`).

**Example Parameters:**

```json
[
  "0xFe5A45dB052489cbc16d882404bcFa4f6223A55E",
  {
    "to": "0x02c98d4e2e49b010A3Eb77d36149EB176c734846",
    "data": "0x70a082310000000000000000000000006E0d01A76C3Cf4288372a29124A26D4353EE51BE"
  },
  "latest"
]
```

#### cURL

```bash
curl --location 'https://kopli-rpc.rkt.ink' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_call",
  "params": [
    "0xFe5A45dB052489cbc16d882404bcFa4f6223A55E",
    {
      "to": "0x02c98d4e2e49b010A3Eb77d36149EB176c734846",
      "data": "0x70a082310000000000000000000000006E0d01A76C3Cf4288372a29124A26D4353EE51BE"
    },
    "latest"
  ],
  "id": 1
}'
```

#### Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x"
}
```