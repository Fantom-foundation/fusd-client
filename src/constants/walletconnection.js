export const WalletConnectConstants = {
  WALLETCONNECTED: 'WALLETCONNECTED',
  WALLETDISCONNECTED: 'WALLETDISCONNECTED',
  CHAINIDCHANGED: 'CHAINIDCHANGED',
  ACCOUNTCHANGED: 'ACCOUNTCHANGED',
};

export const ChainIDs = {
  mainnet: 250,
  testnet: 4002,
};

export const DestNet = {
  ChainID: process.env.REACT_APP_DESTNET && process.env.REACT_APP_DESTNET === 'mainnet' ? ChainIDs.mainnet : ChainIDs.testnet,
};

export const WFTM_CONTRACT_ADDRESS = {
  250: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  4002: '0xf1277d1ed8ad466beddf92ef448a132661956621'
}

export const FUSD_CONTRACT_ADDRESS = {
  250: '0xad84341756bf337f5a0164515b1f6f993d194e1f',
  4002: '0x91ea991bd52ee3c40eda2509701d905e1ee54074'
}

export const FMINT_CONTRACT_ADDRESS = {
  250: '0xBB634cafEf389cDD03bB276c82738726079FcF2E',
  4002: '0xD30e12e5D8D4b4411D2eDf2c02A54bdae9e320B5'
}