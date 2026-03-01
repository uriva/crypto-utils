# crypto-utils

Bitcoin utilities for Deno/JSR.

- **HD wallet address derivation** — derive native segwit (bc1) addresses from an xpub
- **BTC price lookup** — fetch current BTC/USD from CoinGecko
- **Mempool queries** — fetch transactions and sum received satoshis via mempool.space

## Install

```
deno add jsr:@uri/crypto-utils
```

## Usage

```ts
import {
  deriveBtcAddress,
  getAddressTransactions,
  getBtcPriceUsd,
  receivedSatoshis,
} from "@uri/crypto-utils";

// Derive addresses from an xpub (BIP-32 path m/0/{index})
const address = deriveBtcAddress(xpub, 0);

// Get current BTC price
const priceUsd = await getBtcPriceUsd();

// Check for incoming transactions
const txs = await getAddressTransactions(address);
const sats = receivedSatoshis(txs[0], address);
```
