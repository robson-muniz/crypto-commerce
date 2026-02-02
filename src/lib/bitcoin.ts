import * as bitcoin from 'bitcoinjs-lib';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';

const bip32 = BIP32Factory(ecc);
const network = process.env.BITCOIN_NETWORK === 'mainnet' ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;

export function getAddress(index: number): string {
  const xpub = process.env.XPUB;
  if (!xpub) throw new Error("XPUB not defined");

  // Derive node from xpub
  const node = bip32.fromBase58(xpub, network);

  // BIP84: m/84'/0'/0'/0/index (Native Segwit)
  // Since we have an xpub at account level (usually), we derive 0/index
  const child = node.derive(0).derive(index);

  const { address } = bitcoin.payments.p2wpkh({
    pubkey: child.publicKey,
    network
  });

  return address as string;
}

export async function checkAddressBalance(address: string): Promise<number> {
  const baseUrl = network === bitcoin.networks.bitcoin
    ? "https://mempool.space/api"
    : "https://mempool.space/testnet/api";

  try {
    const res = await fetch(`${baseUrl}/address/${address}/utxo`);
    if (!res.ok) return 0;

    const utxos = await res.json() as any[];
    return utxos.reduce((acc, utxo) => acc + utxo.value, 0); // Value in satoshis
  } catch (e) {
    console.error("Error checking balance:", e);
    return 0;
  }
}

export function satoshisToBtc(sats: number): number {
  return sats / 100000000;
}
