import { HDKey } from "@scure/bip32";
import { sha256 } from "@noble/hashes/sha2.js";
import { ripemd160 } from "@noble/hashes/legacy.js";
import { bech32 } from "@scure/base";

/** Derive a native segwit (bc1, P2WPKH) Bitcoin address from an xpub at derivation path m/0/{index}. */
export const deriveBtcAddress = (xpub: string, index: number): string => {
  const child = HDKey.fromExtendedKey(xpub).deriveChild(0).deriveChild(index);
  const pubkeyHash = ripemd160(sha256(child.publicKey!));
  const words = bech32.toWords(pubkeyHash);
  words.unshift(0);
  return bech32.encode("bc", words);
};

/** Fetch the current BTC/USD price from CoinGecko. */
export const getBtcPriceUsd = (): Promise<number> =>
  fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
  )
    .then((r) => r.json())
    .then((data: { bitcoin: { usd: number } }) => data.bitcoin.usd);

export type MempoolTx = {
  txid: string;
  vout: { scriptpubkey_address: string; value: number }[];
};

/** Fetch transactions for a Bitcoin address from mempool.space. */
export const getAddressTransactions = (address: string): Promise<MempoolTx[]> =>
  fetch(`https://mempool.space/api/address/${address}/txs`).then((r) =>
    r.json()
  );

/** Sum satoshis received at a specific address in a transaction. */
export const receivedSatoshis = (tx: MempoolTx, address: string): number =>
  tx.vout
    .filter((output) => output.scriptpubkey_address === address)
    .reduce((sum, output) => sum + (output.value ?? 0), 0);
