// Node 18+ has global fetch
async function testApi() {
  const validAddress = 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx';
  const url = `https://mempool.space/testnet/api/address/${validAddress}`;

  console.log(`Checking ${url}...`);

  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      console.log('✅ API Connection Successful');
      console.log('Chain Stats:', data.chain_stats);
    } else {
      console.error('❌ API Error:', res.status, res.statusText);
      const text = await res.text();
      console.error(text);
    }
  } catch (e) {
    console.error('❌ Network Error:', e.message);
  }
}

testApi();
