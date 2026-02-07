/**
 * Generate Bitcoin Addresses Script
 * 
 * Run this locally to generate pre-computed Bitcoin addresses
 * and store them in the database for use during checkout.
 * 
 * Usage: npx ts-node scripts/generate-addresses.ts
 */

import * as bitcoin from 'bitcoinjs-lib';
import { BIP32Factory } from 'bip32';
import * as ecc from '@bitcoinerlab/secp256k1';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize libraries
bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);
const prisma = new PrismaClient();

// Configuration
const XPUB = process.env.BTC_XPUB;
const NETWORK = process.env.BTC_NETWORK === 'mainnet'
  ? bitcoin.networks.bitcoin
  : bitcoin.networks.testnet;
const NUM_ADDRESSES = 100; // Number of addresses to generate

async function generateAddresses() {
  if (!XPUB) {
    console.error('Error: BTC_XPUB environment variable not set');
    console.error('Please set it in your .env file');
    process.exit(1);
  }

  console.log('🔐 Bitcoin Address Generator');
  console.log('============================');
  console.log(`Network: ${process.env.BTC_NETWORK || 'testnet'}`);
  console.log(`XPUB: ${XPUB.substring(0, 20)}...`);
  console.log(`Generating ${NUM_ADDRESSES} addresses...\n`);

  // Get the highest existing index
  const lastAddress = await prisma.bitcoinAddress.findFirst({
    orderBy: { index: 'desc' }
  });
  const startIndex = lastAddress ? lastAddress.index + 1 : 0;
  console.log(`Starting from index: ${startIndex}`);

  // Parse the XPUB
  const node = bip32.fromBase58(XPUB.trim(), NETWORK);

  const addresses: { address: string; index: number }[] = [];

  for (let i = startIndex; i < startIndex + NUM_ADDRESSES; i++) {
    // Derive address at path 0/i (external chain)
    const child = node.derive(0).derive(i);

    const { address } = bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network: NETWORK,
    });

    if (!address) {
      console.error(`Failed to generate address at index ${i}`);
      continue;
    }

    addresses.push({ address, index: i });

    if (i < startIndex + 5 || i === startIndex + NUM_ADDRESSES - 1) {
      console.log(`  [${i}] ${address}`);
    } else if (i === startIndex + 5) {
      console.log('  ...');
    }
  }

  // Store in database
  console.log(`\nStoring ${addresses.length} addresses in database...`);

  let created = 0;
  let skipped = 0;

  for (const addr of addresses) {
    try {
      await prisma.bitcoinAddress.create({
        data: {
          address: addr.address,
          index: addr.index,
          used: false,
        }
      });
      created++;
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Unique constraint violation - address already exists
        skipped++;
      } else {
        console.error(`Error storing address ${addr.index}:`, error.message);
      }
    }
  }

  console.log(`\n✅ Done!`);
  console.log(`   Created: ${created} addresses`);
  console.log(`   Skipped: ${skipped} (already exist)`);

  // Show stats
  const total = await prisma.bitcoinAddress.count();
  const unused = await prisma.bitcoinAddress.count({ where: { used: false } });
  console.log(`\n📊 Database Stats:`);
  console.log(`   Total addresses: ${total}`);
  console.log(`   Available (unused): ${unused}`);

  await prisma.$disconnect();
}

generateAddresses().catch((error) => {
  console.error('Fatal error:', error);
  prisma.$disconnect();
  process.exit(1);
});
