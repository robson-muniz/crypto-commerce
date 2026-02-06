const fs = require('fs');
const pathModule = require('path');
const bitcoin = require('bitcoinjs-lib');
const bip39 = require('bip39');
const bip32 = require('bip32');
const ecc = require('tiny-secp256k1');

const bip32Factory = bip32.BIP32Factory(ecc);
const network = bitcoin.networks.bitcoin; // MAINNET

console.log('\n');
console.log('═══════════════════════════════════════════════════════════════');
console.log('🔴 MAINNET BITCOIN WALLET GENERATOR 🔴');
console.log('═══════════════════════════════════════════════════════════════');
console.log('⚠️  WARNING: THIS GENERATES A REAL BITCOIN MAINNET WALLET!');
console.log('⚠️  DO NOT USE THIS FOR TESTING - USE TESTNET INSTEAD!');
console.log('═══════════════════════════════════════════════════════════════');
console.log('\n');

function generateWallet() {
  const mnemonic = bip39.generateMnemonic();

  console.log('✅ Generated New Mainnet Wallet');
  console.log('---------------------------------------------------');
  console.log('📝 24-WORD RECOVERY PHRASE (MNEMONIC):');
  console.log('');
  console.log('🔒 ' + mnemonic);
  console.log('');
  console.log('---------------------------------------------------');
  console.log('');
  console.log('⚠️  CRITICAL SECURITY INSTRUCTIONS:');
  console.log('');
  console.log('1. ✍️  Write this phrase on PAPER (not digital)');
  console.log('2. 🔐 Store it in a SAFE, SECURE location (fireproof safe recommended)');
  console.log('3. ❌ NEVER share this with anyone');
  console.log('4. ❌ NEVER store this in cloud storage, email, or git');
  console.log('5. ⚠️  Loss of this phrase = Loss of ALL funds');
  console.log('6. 🔄 Make 2-3 backup copies in different secure locations');
  console.log('');
  console.log('---------------------------------------------------');
  console.log('');

  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32Factory.fromSeed(seed, network);

  // BIP84 derivation path for native segwit (bc1...) addresses on MAINNET
  const derivationPath = "m/84'/0'/0'"; // 0' for mainnet (1' for testnet)
  const account = root.derivePath(derivationPath);
  const xpub = account.neutered().toBase58();

  console.log('🔑 Extended Public Key (XPUB):');
  console.log('');
  console.log(xpub);
  console.log('');
  console.log('---------------------------------------------------');
  console.log('');
  console.log('📋 NEXT STEPS:');
  console.log('');
  console.log('1. Copy the XPUB above (starts with "xpub")');
  console.log('2. Add it to your Vercel environment variables:');
  console.log('   Variable name: BTC_XPUB');
  console.log('   Value: ' + xpub);
  console.log('');
  console.log('3. Also set in Vercel:');
  console.log('   Variable name: BTC_NETWORK');
  console.log('   Value: mainnet');
  console.log('');
  console.log('4. Deploy to Vercel');
  console.log('');
  console.log('---------------------------------------------------');
  console.log('');
  console.log('ℹ️  For local testing with mainnet (NOT recommended):');
  console.log('   Add to your .env file:');
  console.log('');
  console.log('   BTC_XPUB=' + xpub);
  console.log('   BTC_NETWORK=mainnet');
  console.log('');
  console.log('⚠️  ONLY use mainnet locally if you understand the risks!');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Generate first address as verification
  const child = account.derive(0).derive(0);
  const { address } = bitcoin.payments.p2wpkh({
    pubkey: child.publicKey,
    network: network,
  });

  console.log('🔍 First Deposit Address (for verification):');
  console.log('');
  console.log(address);
  console.log('');
  console.log('This is what your customers will see when they checkout.');
  console.log('(Each order gets a unique address derived from the XPUB)');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
}

generateWallet();
