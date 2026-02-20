import * as bitcoin from 'bitcoinjs-lib';
import * as bip32lib from 'bip32';
import * as bip39 from 'bip39';
import * as ecc from '@bitcoinerlab/secp256k1';

// Initialize bitcoinjs-lib with secp256k1
bitcoin.initEccLib(ecc);

// Initialize BIP32 with Vercel-compatible secp256k1
const bip32Factory = bip32lib.BIP32Factory(ecc);

const NETWORK = process.env.BTC_NETWORK === 'mainnet'
  ? bitcoin.networks.bitcoin
  : bitcoin.networks.testnet;

const API_BASE_URL = process.env.BTC_NETWORK === 'mainnet'
  ? 'https://mempool.space/api'
  : 'https://mempool.space/testnet/api';

// How many platform addresses to scan for UTXOs on withdrawal
const ADDRESS_SCAN_DEPTH = 200;

// Minimum fee rate in sat/vbyte
const FEE_RATE_SAT_VBYTE = 5;

export function getXpub(): string {
  const xpub = process.env.BTC_XPUB?.trim();
  if (!xpub) {
    throw new Error('BTC_XPUB environment variable is not set');
  }
  return xpub;
}

export function deriveAddress(index: number): string {
  try {
    const xpub = getXpub();
    const node = bip32Factory.fromBase58(xpub, NETWORK);
    const child = node.derive(0).derive(index);
    const { address } = bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network: NETWORK,
    });
    if (!address) throw new Error('Failed to generate address');
    return address;
  } catch (error) {
    console.error('Error deriving address at index', index, ':', error);
    throw new Error('Failed to derive deposit address');
  }
}

/**
 * Derives a signing key pair for a given index using the platform mnemonic.
 * Requires BTC_MNEMONIC env var (24-word seed phrase).
 */
function derivePrivateKey(index: number): bip32lib.BIP32Interface {
  const mnemonic = process.env.BTC_MNEMONIC?.trim();
  if (!mnemonic) throw new Error('BTC_MNEMONIC environment variable is not set');

  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32Factory.fromSeed(seed, NETWORK);

  // BIP84: m/84'/0'/0'/0/index
  const coinType = NETWORK === bitcoin.networks.bitcoin ? 0 : 1;
  return root
    .derivePath(`m/84'/${coinType}'/0'/0/${index}`);
}

interface Utxo {
  txid: string;
  vout: number;
  value: number; // satoshis
  addressIndex: number;
}

/**
 * Fetches all unspent UTXOs across the first ADDRESS_SCAN_DEPTH platform addresses.
 */
async function collectPlatformUtxos(): Promise<Utxo[]> {
  const allUtxos: Utxo[] = [];

  for (let i = 0; i < ADDRESS_SCAN_DEPTH; i++) {
    const address = deriveAddress(i);
    try {
      const res = await fetch(`${API_BASE_URL}/address/${address}/utxo`);
      if (!res.ok) continue;
      const utxos = await res.json() as { txid: string; vout: number; value: number }[];
      for (const utxo of utxos) {
        allUtxos.push({ ...utxo, addressIndex: i });
      }
    } catch {
      // Continue scanning if one address fails
    }
  }

  return allUtxos;
}

/**
 * Gets the raw transaction hex for a given txid.
 */
async function getRawTx(txid: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/tx/${txid}/hex`);
  if (!res.ok) throw new Error(`Failed to fetch raw tx for ${txid}`);
  return res.text();
}

/**
 * Broadcasts a signed transaction hex to the Bitcoin network via mempool.space.
 * Returns the txid of the broadcast transaction.
 */
async function broadcastTx(txHex: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/tx`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: txHex,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to broadcast transaction: ${err}`);
  }
  return res.text(); // Returns the txid
}

/**
 * Sends BTC from the platform wallet to a destination address.
 * Collects UTXOs from all platform addresses, builds, signs and broadcasts a real transaction.
 *
 * @param toAddress  - Recipient Bitcoin address
 * @param amountBtc  - Amount to send in BTC (after fee deduction)
 * @returns txid of the broadcast transaction
 */
export async function sendBtc(toAddress: string, amountBtc: number): Promise<string> {
  const amountSats = btcToSatoshis(amountBtc);

  // 1. Collect all available UTXOs
  const utxos = await collectPlatformUtxos();
  if (utxos.length === 0) throw new Error('No UTXOs available in platform wallet');

  const totalAvailable = utxos.reduce((acc, u) => acc + u.value, 0);
  if (totalAvailable < amountSats) {
    throw new Error(
      `Insufficient funds: have ${satoshisToBtc(totalAvailable)} BTC, need ${amountBtc} BTC`
    );
  }

  // 2. Build the PSBT
  const psbt = new bitcoin.Psbt({ network: NETWORK });

  // Select UTXOs (simple greedy selection)
  let selected: Utxo[] = [];
  let selectedTotal = 0;
  for (const utxo of utxos) {
    selected.push(utxo);
    selectedTotal += utxo.value;
    if (selectedTotal >= amountSats + 1000) break; // 1000 sat buffer for fees
  }

  // 3. Add inputs
  for (const utxo of selected) {
    const rawTxHex = await getRawTx(utxo.txid);
    const address = deriveAddress(utxo.addressIndex);
    const { output } = bitcoin.payments.p2wpkh({ address, network: NETWORK });

    psbt.addInput({
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        script: output!,
        value: BigInt(utxo.value),
      },
    });
  }

  // 4. Estimate fee (approximate: 1 input = ~68 vbytes, 1 output = ~31 vbytes, overhead ~10)
  const estimatedSize = selected.length * 68 + 2 * 31 + 10;
  const feeSats = estimatedSize * FEE_RATE_SAT_VBYTE;

  const sendSats = amountSats;
  const changeSats = selectedTotal - sendSats - feeSats;

  // 5. Add recipient output
  psbt.addOutput({
    address: toAddress,
    value: BigInt(sendSats),
  });

  // 6. Add change output back to platform (index 0) if meaningful
  if (changeSats > 546) { // 546 is dust limit
    const changeAddress = deriveAddress(0);
    psbt.addOutput({
      address: changeAddress,
      value: BigInt(changeSats),
    });
  }

  // 7. Sign all inputs
  for (let i = 0; i < selected.length; i++) {
    const keyPair = derivePrivateKey(selected[i].addressIndex);
    psbt.signInput(i, keyPair);
  }

  psbt.finalizeAllInputs();

  // 8. Broadcast
  const txHex = psbt.extractTransaction().toHex();
  const txid = await broadcastTx(txHex);

  console.log(`[PAYOUT] Sent ${amountBtc} BTC to ${toAddress}. TxID: ${txid}`);
  return txid;
}

export async function checkPayment(address: string): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/address/${address}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    const data = await response.json();
    const funded = (data.chain_stats.funded_txo_sum || 0) + (data.mempool_stats.funded_txo_sum || 0);
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
