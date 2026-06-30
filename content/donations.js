// content/donations.js — donation addresses + the two on-chain wallets watched at the
// top of the walkthrough. All endpoints used by the engine are FREE + keyless + CORS-enabled
// (verified): esplora (blockstream/mempool), publicnode RPCs, xrplcluster, Blockscout, CoinGecko.
//
// IMPORTANT: these are Hosterjack's own donation addresses (the site's author, @DaneelOlivaw on
// Telegram). Donations go directly to the author; no third-party / other-repo donation address
// appears anywhere in this project.

// ---- public RPC / API pools (primary first, rest are fallbacks) ----
// Every endpoint below was verified to return Access-Control-Allow-Origin:* (browser-usable).
export const ESPLORA   = ['https://blockstream.info/api', 'https://mempool.space/api'];
export const ETH_RPC   = ['https://ethereum-rpc.publicnode.com', 'https://cloudflare-eth.com', 'https://ethereum.publicnode.com'];
export const BSC_RPC   = ['https://bsc-rpc.publicnode.com', 'https://bsc-dataseed.bnbchain.org'];
export const SOL_RPC   = ['https://solana-rpc.publicnode.com'];
export const XRP_RPC   = ['https://xrplcluster.com/', 'https://xrpl.ws/'];
export const BLOCKSCOUT_ETH = 'https://eth.blockscout.com';
export const USDT_ERC20 = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // Tether USD (Ethereum)

// ---- the 6 donation addresses ----
export const DONATIONS = [
  {
    id: 'btc', kind: 'btc', chain: 'Bitcoin', symbol: 'BTC', priceId: 'bitcoin', decimals: 8,
    address: 'bc1qh065fgqmxwt5d65g4r07dvlntryjdnxwkaws87',
    explorer: 'https://mempool.space/address/',
    uri: a => `bitcoin:${a}`,
    wallets: 'Any BTC wallet — Electrum, BlueWallet, Sparrow, Coinbase Wallet, Trust',
  },
  {
    id: 'eth', kind: 'evm', chain: 'Ethereum', symbol: 'ETH', priceId: 'ethereum', decimals: 18,
    rpc: ETH_RPC, chainId: 1, blockscout: BLOCKSCOUT_ETH,
    address: '0x1619F7501746EA5A130f74701E5ec725361756e2',
    explorer: 'https://etherscan.io/address/',
    uri: a => `ethereum:${a}@1`,
    wallets: 'MetaMask, Rabby, Coinbase Wallet, Trust, Ledger Live',
  },
  {
    id: 'usdt', kind: 'evm-token', chain: 'Ethereum · ERC-20', symbol: 'USDT', priceId: 'tether', decimals: 6,
    rpc: ETH_RPC, chainId: 1, blockscout: BLOCKSCOUT_ETH, token: USDT_ERC20,
    address: '0x1619F7501746EA5A130f74701E5ec725361756e2',
    explorer: 'https://etherscan.io/address/',
    uri: a => `ethereum:${USDT_ERC20}@1/transfer?address=${a}`,
    wallets: 'MetaMask, Rabby, Coinbase Wallet, Trust — send USDT on the Ethereum network',
    note: 'Send only USDT on the <b>Ethereum (ERC-20)</b> network to this address.',
  },
  {
    id: 'bnb', kind: 'evm', chain: 'BNB Smart Chain', symbol: 'BNB', priceId: 'binancecoin', decimals: 18,
    rpc: BSC_RPC, chainId: 56,
    address: '0x1619F7501746EA5A130f74701E5ec725361756e2',
    explorer: 'https://bscscan.com/address/',
    uri: a => `ethereum:${a}@56`,
    wallets: 'MetaMask, Trust, Binance Web3 — BNB Smart Chain (BEP-20)',
    note: 'Send only on the <b>BNB Smart Chain (BEP-20)</b> network.',
    // No free, keyless transaction indexer exists for BSC — the live balance is exact, but the
    // per-transaction donation feed below falls back to the explorer for this chain.
    feedDegraded: true,
  },
  {
    id: 'xrp', kind: 'xrp', chain: 'XRP Ledger', symbol: 'XRP', priceId: 'ripple', decimals: 6,
    rpc: XRP_RPC,
    address: 'rJ3ToceRkjTEsGVuPUy1dWWdZMH9xcoWzR',
    explorer: 'https://xrpscan.com/account/',
    uri: a => `https://xaman.app/detect/request:${a}`,
    wallets: 'Xaman (XUMM), Ledger Live, Trust — XRP Ledger',
    note: 'A new XRP account needs a small reserve (~1 XRP) before it activates on-ledger.',
  },
  {
    id: 'sol', kind: 'sol', chain: 'Solana', symbol: 'SOL', priceId: 'solana', decimals: 9,
    rpc: SOL_RPC,
    address: 'AhorbV4BPLwPP61zArMR6t6k7wnWpfqHt97mqVsHp27E',
    explorer: 'https://solscan.io/account/',
    uri: a => `solana:${a}`,
    wallets: 'Phantom, Solflare, Backpack, Trust — Solana',
  },
];

// ---- the two BTC wallets shown live at the top of the walkthrough ----
export const WATCHED = [
  {
    id: 'prize', kind: 'btc', label: 'Prize wallet', symbol: 'BTC', priceId: 'bitcoin', decimals: 8,
    address: '1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe',
    explorer: 'https://mempool.space/address/',
    blurb: 'Holds the unclaimed bounty.',
  },
  {
    id: 'halving', kind: 'btc', label: 'Halving wallet', symbol: 'BTC', priceId: 'bitcoin', decimals: 8,
    address: '17ucy1K9ZUAaoY6JVtM932W9jUp5LXfyHa',
    explorer: 'https://mempool.space/address/',
    blurb: 'Holds the peeled-off halves (3.75 BTC) the creators moved at each Bitcoin halving.',
  },
];
