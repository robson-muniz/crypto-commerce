require('dotenv').config();
const { getAddress } = require('./src/lib/bitcoin');

console.log("XPUB present:", !!process.env.XPUB);
console.log("XPUB value:", process.env.XPUB);

try {
  const address = getAddress(1);
  console.log("Successfully derived address:", address);
} catch (e) {
  console.error("Error deriving address:", e);
}
