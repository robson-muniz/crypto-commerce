import * as bitcoin from 'bitcoinjs-lib';
import * as bip32 from 'bip32';
import * as ecc from 'tiny-secp256k1';

// Initialize BIP32
const bip32Factory = bip32.BIP32Factory(ecc);

const NETWORK = process.env.BTC_NETWORK === 'mainnet'
  ? bitcoin.networks.bitcoin
  : bitcoin.networks.testnet;

const API_BASE_URL = process.env.BTC_NETWORK === 'mainnet'
  ? 'https://mempool.space/api'
  : 'https://mempool.space/testnet/api';

export function getXpub(): string {
  const xpub = process.env.BTC_XPUB;
  if (!xpub) {
    throw new Error('BTC_XPUB environment variable is not set');
  }
  return xpub;
}

export function deriveAddress(index: number): string {
  try {
    const xpub = getXpub();
    const node = bip32Factory.fromBase58(xpub, NETWORK);
    // Derive external address at index (0/index)
    // We assume the XPUB is already at the account level (e.g. m/84'/0'/0')
    // So we just derive 0/index for receive addresses
    const child = node.derive(0).derive(index);

    const { address } = bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network: NETWORK,
    });

    if (!address) throw new Error('Failed to generate address');
    return address;
  } catch (error) {
    console.error('Error deriving address:', error);
    throw new Error('Failed to derive deposit address');
  }
}

export async function checkPayment(address: string): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/address/${address}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    // Sum chain stats and mempool stats to detect unconfirmed payments immediately
    const funded = (data.chain_stats.funded_txo_sum || 0) + (data.mempool_stats.funded_txo_sum || 0);
    // You might want to subtract spent if you want "current balance", but for one-time deposit:
    // We just check if they sent enough valid UTXOs to this unique address.
    // If we reuse addresses, we'd need to be more careful.
    return satoshisToBtc(funded);
  } catch (error) {
    console.error('Error checking payment:', error);
    return 0;
  }
}

export function satoshisToBtc(sats: number): number {
  return sats / 100000000;
}

export function btcToSatoshis(btc: number): number {
  return Math.round(btc * 100000000);
}
