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
  4002: '0x246C834B79ddf47ee8675D44CCf5202d938Bc1Bd'
}

export const FMINT_CONTRACT_ADDRESS = {
  250: '0xBB634cafEf389cDD03bB276c82738726079FcF2E',
  4002: '0xef7cad11ae098d6e3a1503959998d1583b97767d'
}