const fs = require('fs');
const pathModule = require('path');
const bitcoin = require('bitcoinjs-lib');
const bip39 = require('bip39');
const bip32 = require('bip32');
const ecc = require('tiny-secp256k1');

const bip32Factory = bip32.BIP32Factory(ecc);
const network = bitcoin.networks.testnet;

function generateWallet() {
  const mnemonic = bip39.generateMnemonic();
  console.log('✅ Generated New Wallet (TESTNET)');
  console.log('---------------------------------------------------');
  console.log('📝 Mnemonic (KEEP SAFE, DO NOT USE ON MAINNET):');
  console.log(mnemonic);
  console.log('---------------------------------------------------');

  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32Factory.fromSeed(seed, network);

  const derivationPath = "m/84'/1'/0'";
  const account = root.derivePath(derivationPath);
  const xpub = account.neutered().toBase58();

  console.log('🔑 XPUB:', xpub);
  console.log('---------------------------------------------------');

  const envPath = pathModule.join(__dirname, '.env');

  let envContent = '';
  try {
    envContent = fs.readFileSync(envPath, 'utf8');
  } catch (e) {
    // ignore
  }

  if (!envContent.includes('BTC_XPUB')) {
    fs.appendFileSync(envPath, `\nBTC_XPUB=${xpub}\nBTC_NETWORK=testnet\n`);
    console.log('✅ Automatically added BTC_XPUB and BTC_NETWORK to .env');
  } else {
    console.log('⚠️  BTC_XPUB already exists in .env. Skipping auto-add.');
  }

  console.log('ℹ️  PLEASE RESTART YOUR SERVER: npm run dev');
}

generateWallet();
