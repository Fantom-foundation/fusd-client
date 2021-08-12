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