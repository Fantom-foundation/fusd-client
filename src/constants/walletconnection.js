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
  [250]: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  [4002]: '0xf1277d1ed8ad466beddf92ef448a132661956621'
}