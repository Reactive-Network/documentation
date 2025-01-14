---
title: RNK RPC Methods
sidebar_position: 9
description: Explore Reactive Network's Geth version RPC methods used for interaction with nodes and ReactVMs.
slug: /rnk-rpc-methods
hide_title: true
---

![RNK RPC Methods](./img/rnk-rpc-methods.jpg)

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
2. **txNumber**: `HEX` — The sequence number of the transaction to retrieve.

**Example Parameters:**

```json
[
   "0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a",
   "0x3"
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
    "0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a",
    "0x3"
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
      "hash": "0x1f7bd4c7cbbab3614468516da5e082e62bd8f36443f4532344414e098967bf10",
      "number": "0x3",
      "time": 1736302117,
      "root": "0x47771edce088d9db7d2b92072c1b846e9c8944cbc6cd7e26c344db8e2c624356",
      "limit": 900000,
      "used": 31387,
      "type": 2,
      "status": 1,
      "from": "0xa7d9aa89cbcd216900a04cdc13eb5789d643176a",
      "to": "0xc3e185561d2a8b04f0fcd104a562f460d6cc503c",
      "createContract": false,
      "sessionId": 7543,
      "refChainId": 11155111,
      "refTx": "0x25bc4a4350da1a8dcdaa61b9151982911cede465e3d3e3afdd1ed10199effc1c",
      "refEventIndex": 108,
      "data": "0x0d152c2c00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000aa36a70000000000000000000000009b9bb25f1a81078c544c829c5eb7822d747cf4348e191feb68ec1876759612d037a111be48d8ec3db7f72e4e7d321c2c8008bd0d000000000000000000000000256eee316da03f0d662cc6a6a769a838c218c47a0000000000000000000000000000000000000000000000000156c8b6d46b34180000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000007194eb00000000000000000000000000000000000000000000000000000000000000030e1ed7fea578f8a1c814cd1f7540f6388e2ebe23e4febabe3899250ef2a5fa8425bc4a4350da1a8dcdaa61b9151982911cede465e3d3e3afdd1ed10199effc1c000000000000000000000000000000000000000000000000000000000000006c0000000000000000000000000000000000000000000000000000000000000000",
      "rData": "0x"
   }
}
```

## rnk_getTransactionLogs

Returns logs for a transaction based on its sequence number within the specified ReactVM.

#### Parameters

1. **rvmId**: `DATA`, 20 Bytes — The ReactVM ID for which transaction logs are being queried.
2. **txNumber**: `HEX` — The transaction number for which logs are requested.

**Example Parameters:**

```json
[
  "0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a",
  "0x3"
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
    "0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a",
    "0x3"
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
         "txHash": "0x1f7bd4c7cbbab3614468516da5e082e62bd8f36443f4532344414e098967bf10",
         "address": "0xc3e185561d2a8b04f0fcd104a562f460d6cc503c",
         "topics": [
            "0x8dd725fa9d6cd150017ab9e60318d40616439424e2fade9c1c58854950917dfc",
            "0x0000000000000000000000000000000000000000000000000000000000512578",
            "0x000000000000000000000000c3e185561d2a8b04f0fcd104a562f460d6cc503c",
            "0x00000000000000000000000000000000000000000000000000000000000f4240"
         ],
         "data": "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000064f8893f1c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000256eee316da03f0d662cc6a6a769a838c218c47a000000000000000000000000000000000000000000000000002247457ba4520200000000000000000000000000000000000000000000000000000000"
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
  "0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a",
  "0x1f7bd4c7cbbab3614468516da5e082e62bd8f36443f4532344414e098967bf10"
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
    "0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a",
    "0x1f7bd4c7cbbab3614468516da5e082e62bd8f36443f4532344414e098967bf10"
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
         "txHash": "0x23f20c4269248ceb62660ec46798f0aac43ed4929c8f33928db84f0ec3da906d",
         "logIndex": 0,
         "gasLimit": 1000000,
         "rnkBlockNumber": 7543
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
  "0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a"
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
    "0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a"
  ],
  "id": 1
}'
```

#### Response

```json
{
   "jsonrpc": "2.0",
   "id": 1,
   "result": "0x3"
}
```

## rnk_getTransactions

Returns a range of transactions starting from a specified transaction number within the ReactVM.

#### Parameters

1. **rvmId**: `DATA`, 20 Bytes — The ReactVM ID for which transactions are being retrieved.
2. **from**: `HEX` — The starting transaction number.
3. **limit**: `HEX` — The maximum number of transactions to retrieve.

**Example Parameters:**

```json
[
   "0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a",
   "0x2",
   "0x1"
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
    "0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a",
    "0x2",
    "0x1"
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
         "hash": "0x5a1312b5a002c0e00afadf013119d813c520aa467f267caeccc9d764aab0c234",
         "number": "0x2",
         "time": 1736250121,
         "root": "0x61e3657b65f0bb189cf6614bf228fb526b0fa0a1afa3e0f72cad5999dd304f88",
         "limit": 900000,
         "used": 31339,
         "type": 2,
         "status": 1,
         "from": "0xa7d9aa89cbcd216900a04cdc13eb5789d643176a",
         "to": "0xc3e185561d2a8b04f0fcd104a562f460d6cc503c",
         "createContract": false,
         "sessionId": 115,
         "refChainId": 11155111,
         "refTx": "0x6d2dbdac052dedf2e3ad748171b64b74dd973b1cefe32a7adf83461c9678049d",
         "refEventIndex": 175,
         "data": "0x0d152c2c00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000aa36a70000000000000000000000009b9bb25f1a81078c544c829c5eb7822d747cf4348e191feb68ec1876759612d037a111be48d8ec3db7f72e4e7d321c2c8008bd0d000000000000000000000000a7d9aa89cbcd216900a04cdc13eb5789d643176a000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000071854b0000000000000000000000000000000000000000000000000000000000000003aeef3f0a5d1caba6733d3a694f9c6e8e40b7e6e08193d56fd1dce30cee4142c76d2dbdac052dedf2e3ad748171b64b74dd973b1cefe32a7adf83461c9678049d00000000000000000000000000000000000000000000000000000000000000af0000000000000000000000000000000000000000000000000000000000000000",
         "rData": "0x"
      }
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
  "0xc3e185561D2a8b04F0Fcd104A562f460D6cC503c"
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
    "0xc3e185561D2a8b04F0Fcd104A562f460D6cC503c"
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
      "rvmId": "0xa7d9aa89cbcd216900a04cdc13eb5789d643176a"
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
            "txCount": 3761609,
            "eventCount": 9567726
         },
         "11155111": {
            "txCount": 2798738,
            "eventCount": 5664570
         },
         "137": {
            "txCount": 10632828,
            "eventCount": 73443701
         },
         "42161": {
            "txCount": 7165497,
            "eventCount": 22113610
         },
         "43114": {
            "txCount": 1591310,
            "eventCount": 4920126
         },
         "56": {
            "txCount": 15843188,
            "eventCount": 46341049
         },
         "8453": {
            "txCount": 33898584,
            "eventCount": 66943860
         }
      },
      "rvmTxCount": 3
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
         "rvmId": "0xa7d9aa89cbcd216900a04cdc13eb5789d643176a",
         "lastTxNumber": "0x3",
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
"0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a"
```

#### cURL

```bash
curl --location 'https://kopli-rpc.rkt.ink' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getVm",
  "params": ["0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a"],
  "id": 1
}'
```

#### Response

```json
{
   "jsonrpc": "2.0",
   "id": 1,
   "result": {
      "rvmId": "0xa7d9aa89cbcd216900a04cdc13eb5789d643176a",
      "lastTxNumber": "0x3",
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
"0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a"
```

#### cURL

```bash
curl --location 'https://kopli-rpc.rkt.ink' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_getSubscribers",
  "params": ["0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a"],
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
         "rvmId": "0xa7d9aa89cbcd216900a04cdc13eb5789d643176a",
         "rvmContract": "0xc3e185561d2a8b04f0fcd104a562f460d6cc503c"
      }
   ]
}
```

## rnk_getCode

Returns the smart contract code at a specific transaction state for a given RVM and contract address.

#### Parameters

1. **rvmId**: `DATA`, 20 bytes — The unique identifier of the RVM.
2. **contract** `DATA`, 20 bytes — The address of the smart contract.
3. **txNumberOrHash** `HEX | TAG` — Specifies the state at which the contract code is retrieved. Accepts either a block number (`HEX`) or a tag (`"latest"`, `"earliest"`, `"pending"`).

**Example Parameters:**

```json
[
   "0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a",
   "0xc3e185561D2a8b04F0Fcd104A562f460D6cC503c",
   "0x2"
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
    "0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a",
    "0xc3e185561D2a8b04F0Fcd104A562f460D6cC503c",
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
   "result": "0x60806040526004361061007f5760003560e01c80637a90b9901161004e5780637a90b9901461010a5780638456cb591461011f578063c290d69114610134578063f8893f1c1461015457600080fd5b8063046f7da21461008b5780630d152c2c146100a257806310062470146100c257806356b4997f146100ea57600080fd5b3661008657005b600080fd5b34801561009757600080fd5b506100a0610174565b005b3480156100ae57600080fd5b506100a06100bd366004610baf565b6103c0565b3480156100ce57600080fd5b506100d860065481565b60405190815260200160405180910390f35b3480156100f657600080fd5b506100a0610105366004610bf2565b6104aa565b34801561011657600080fd5b506100a06104d9565b34801561012b57600080fd5b506100a0610562565b34801561014057600080fd5b506100a061014f366004610bf2565b6107b4565b34801561016057600080fd5b506100a061016f366004610c20565b610816565b60025460ff16156101c45760405162461bcd60e51b81526020600482015260156024820152745265616374697665204e6574776f726b206f6e6c7960581b60448201526064015b60405180910390fd5b6003546001600160a01b031633146101ee5760405162461bcd60e51b81526004016101bb90610c61565b600354600160a01b900460ff166102345760405162461bcd60e51b815260206004820152600a602482015269139bdd081c185d5cd95960b21b60448201526064016101bb565b600061023e61099c565b905060005b815181146103af57600260019054906101000a90046001600160a01b03166001600160a01b0316635a6aced083838151811061028157610281610c87565b60200260200101516000015184848151811061029f5761029f610c87565b6020026020010151602001518585815181106102bd576102bd610c87565b6020026020010151604001518686815181106102db576102db610c87565b6020026020010151606001518787815181106102f9576102f9610c87565b60200260200101516080015188888151811061031757610317610c87565b602090810291909101015160a001516040516001600160e01b031960e089901b16815260048101969096526001600160a01b03909416602486015260448501929092526064840152608483015260a482015260c401600060405180830381600087803b15801561038657600080fd5b505af115801561039a573d6000803e3d6000fd5b50505050806103a890610c9d565b9050610243565b50506003805460ff60a01b19169055565b60025460ff166103fc5760405162461bcd60e51b8152602060048201526007602482015266564d206f6e6c7960c81b60448201526064016101bb565b6000806060830135610413600a6080860135610cc4565b6040516001600160a01b039384166024820152929091166044830152606482015260840160408051601f198184030181529181526020820180516001600160e01b0316633e224fc760e21b17905251909150620f424090309062512578907f8dd725fa9d6cd150017ab9e60318d40616439424e2fade9c1c58854950917dfc9061049e908690610d0a565b60405180910390a45050565b6003546001600160a01b031633146104d45760405162461bcd60e51b81526004016101bb90610c61565b600655565b600080546040516326db15bb60e21b81523060048201526001600160a01b0390911690639b6c56ec90602401602060405180830381865afa158015610522573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105469190610d3d565b60005490915061055f906001600160a01b031682610aaf565b50565b60025460ff16156105ad5760405162461bcd60e51b81526020600482015260156024820152745265616374697665204e6574776f726b206f6e6c7960581b60448201526064016101bb565b6003546001600160a01b031633146105d75760405162461bcd60e51b81526004016101bb90610c61565b600354600160a01b900460ff16156106225760405162461bcd60e51b815260206004820152600e60248201526d105b1c9958591e481c185d5cd95960921b60448201526064016101bb565b600061062c61099c565b905060005b8151811461079d57600260019054906101000a90046001600160a01b03166001600160a01b0316632f80733683838151811061066f5761066f610c87565b60200260200101516000015184848151811061068d5761068d610c87565b6020026020010151602001518585815181106106ab576106ab610c87565b6020026020010151604001518686815181106106c9576106c9610c87565b6020026020010151606001518787815181106106e7576106e7610c87565b60200260200101516080015188888151811061070557610705610c87565b602090810291909101015160a001516040516001600160e01b031960e089901b16815260048101969096526001600160a01b03909416602486015260448501929092526064840152608483015260a482015260c401600060405180830381600087803b15801561077457600080fd5b505af1158015610788573d6000803e3d6000fd5b505050508061079690610c9d565b9050610631565b50506003805460ff60a01b1916600160a01b179055565b3360009081526001602052604090205460ff1661080c5760405162461bcd60e51b8152602060048201526016602482015275417574686f72697a65642073656e646572206f6e6c7960501b60448201526064016101bb565b61055f3382610aaf565b600254839061010090046001600160a01b031633146108775760405162461bcd60e51b815260206004820181905260248201527f4e6f7420617574686f72697a6564202863616c6c6261636b2073656e6465722960448201526064016101bb565b6003546001600160a01b038281169116146108d45760405162461bcd60e51b815260206004820152601960248201527f4e6f7420617574686f72697a656420287265616374697665290000000000000060448201526064016101bb565b60065482111561091c5760405162461bcd60e51b815260206004820152601360248201527213585e081c185e5bdd5d08195e18d959591959606a1b60448201526064016101bb565b4782111561095f5760405162461bcd60e51b815260206004820152601060248201526f4e6f7420656e6f7567682066756e647360801b60448201526064016101bb565b6040516001600160a01b0384169083156108fc029084906000818181858888f19350505050158015610995573d6000803e3d6000fd5b5050505050565b60408051600180825281830190925260609160009190816020015b6109f96040518060c001604052806000815260200160006001600160a01b03168152602001600081526020016000815260200160008152602001600081525090565b8152602001906001900390816109b75750506040805160c08101825262aa36a781526005546001600160a01b031660208201527f8e191feb68ec1876759612d037a111be48d8ec3db7f72e4e7d321c2c8008bd0d918101919091527fa65f96fc951c35ead38878e0f0b7a3c744a6f5ccc1476b313353ce31712313ad606082018190526080820181905260a08201528151919250908290600090610a9f57610a9f610c87565b6020908102919091010152919050565b80471015610af45760405162461bcd60e51b8152602060048201526012602482015271496e73756666696369656e742066756e647360701b60448201526064016101bb565b8015610bab57604080516000808252602082019092526001600160a01b038416908390604051610b249190610d56565b60006040518083038185875af1925050503d8060008114610b61576040519150601f19603f3d011682016040523d82523d6000602084013e610b66565b606091505b5050905080610ba95760405162461bcd60e51b815260206004820152600f60248201526e151c985b9cd9995c8819985a5b1959608a1b60448201526064016101bb565b505b5050565b600060208284031215610bc157600080fd5b813567ffffffffffffffff811115610bd857600080fd5b82016101808185031215610beb57600080fd5b9392505050565b600060208284031215610c0457600080fd5b5035919050565b6001600160a01b038116811461055f57600080fd5b600080600060608486031215610c3557600080fd5b8335610c4081610c0b565b92506020840135610c5081610c0b565b929592945050506040919091013590565b6020808252600c908201526b155b985d5d1a1bdc9a5e995960a21b604082015260600190565b634e487b7160e01b600052603260045260246000fd5b600060018201610cbd57634e487b7160e01b600052601160045260246000fd5b5060010190565b600082610ce157634e487b7160e01b600052601260045260246000fd5b500490565b60005b83811015610d01578181015183820152602001610ce9565b50506000910152565b6020815260008251806020840152610d29816040850160208701610ce6565b601f01601f19169190910160400192915050565b600060208284031215610d4f57600080fd5b5051919050565b60008251610d68818460208701610ce6565b919091019291505056fea2646970667358221220b22f3c3e8ee71d4e0f8f8c24f30958cb57c1aa1b58e448fe5af049a6f26ebf8b64736f6c634300081c0033"
}
```

## rnk_getStorageAt

Returns the value stored at a specific key in the storage of a contract for a given RVM at a specified block number or hash.

#### Parameters

1. **rvmId**: `DATA`, 20 bytes — The unique identifier of the RVM.
2. **address**: `DATA`, 20 bytes — The address of the contract from which to retrieve the storage value.
3. **hexKey**: `DATA`, 32 bytes — The hexadecimal key for which the storage value is being queried.
4. **txNumberOrHash**: `HEX | TAG` — Specifies the block number or hash at which the storage value is queried. Accepts either a block number (`HEX`) or a tag (`"latest"`, `"earliest"`, `"pending"`).

**Example Parameters:**

```json
[
   "0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a",
   "0xc3e185561D2a8b04F0Fcd104A562f460D6cC503c",
   "0x0000000000000000000000000000000000000000000000000000000000000002",
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
    "0xA7D9AA89cbcd216900a04Cdc13eB5789D643176a",
    "0xc3e185561D2a8b04F0Fcd104A562f460D6cC503c",
    "0x0000000000000000000000000000000000000000000000000000000000000002",
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
   "result": "0x00000000000000000000000000000000000000000000000000000000ffffff01"
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
    - `gas`: `HEX`, (optional) — The maximum amount of gas allowed for the simulation. If omitted, a default value is used.
    - `gasPrice`: `HEX`, (optional) — The price of gas (in RVM-specific units) for the simulation. 
    - `value`: `HEX`, (optional) — The amount of tokens (e.g., Ether) to send along with the call. For non-payable functions, this should be 0.
3. **txNumberOrHash**: `HEX | TAG` — Specifies the block number or hash to use for simulating the call. Accepts either a block number (`HEX`) or a tag (`"latest"`, `"earliest"`, `"pending"`).

**Example Parameters:**

```json
[
  "0xa7d9aa89cbcd216900a04cdc13eb5789d643176a",
  {
    "to": "0xEE94fFc3127f0926bcE2Af5974bA9Ee426345FBB",
    "data": "0x2e64cec1"
  },
  "latest"
]
```

#### cURL

```bash
curl --location 'http://141.94.141.219:38599/' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "method": "rnk_call",
  "params": [
    "0xa7d9aa89cbcd216900a04cdc13eb5789d643176a",
    {
      "to": "0xEE94fFc3127f0926bcE2Af5974bA9Ee426345FBB",
      "data": "0x2e64cec1"
    },
    "latest"
  ],
  "id": 1
}
'
```

#### Response

```json
{
   "jsonrpc": "2.0",
   "id": 1,
   "result": "0x000000000000000000000000000000000000000000000000000000000000000e"
}
```