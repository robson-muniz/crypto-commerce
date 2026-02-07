/**
 * Quick script to clear and regenerate mainnet addresses
 */

import * as bitcoin from 'bitcoinjs-lib';
import { BIP32Factory } from 'bip32';
import * as ecc from '@bitcoinerlab/secp256k1';
import { PrismaClient } from '@prisma/client';

// Initialize
bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);
const prisma = new PrismaClient();

// Mainnet configuration
const XPUB = 'xpub6BkXvTNSRyCdjswzrQfFC5QvmfjKCT1C8s62qiuphaJiKcq2nHcykdDfHiZuUBC7dL7bQbTEkRyXM1JqmFjY1Hhkbu61yHoXyDsc5BU5LtN';
const NETWORK = bitcoin.networks.bitcoin;
const NUM_ADDRESSES = 100;

async function main() {
  console.log('🗑️ Clearing existing addresses...');
  await prisma.bitcoinAddress.deleteMany({});
  console.log('✅ Cleared!');

  console.log('🔐 Generating 100 mainnet addresses...');
  const node = bip32.fromBase58(XPUB, NETWORK);

  for (let i = 0; i < NUM_ADDRESSES; i++) {
    const child = node.derive(0).derive(i);
    const { address } = bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network: NETWORK,
    });

    if (!address) continue;

    await prisma.bitcoinAddress.create({
      data: {
        address,
        index: i,
        used: false,
      }
    });

    if (i < 5 || i === 99) console.log(`  [${i}] ${address}`);
    else if (i === 5) console.log('  ...');
  }

  const total = await prisma.bitcoinAddress.count();
  console.log(`\n✅ Done! ${total} mainnet addresses stored.`);

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
