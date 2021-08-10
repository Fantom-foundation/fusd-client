import { WalletConnectConstants } from '../constants/wallet.constants';

const WalletConnectActions = {
  connectWallet,
  disconnectWallet,
  changeChainId,
  setAccount,
};

function connectWallet(chainId) {
  return dispatch => {
    dispatch(_connectWallet(chainId));
  };
}

const _connectWallet = chainId => {
  return {
    type: WalletConnectConstants.WALLETCONNECTED,
    chainId: chainId,
  };
};

function disconnectWallet() {
  return dispatch => {
    dispatch(_disconnectWallet());
  };
}

const _disconnectWallet = () => {
  return {
    type: WalletConnectConstants.WALLETDISCONNECTED,
  };
};

function changeChainId(chainId) {
  return dispatch => {
    dispatch(_changeChainId(chainId));
  };
}

const _changeChainId = chainId => {
  return {
    type: WalletConnectConstants.CHAINIDCHANGED,
    chainId: chainId,
  };
};

function setAccount(account) {
  return dispatch => {
    dispatch(_setAccount(account));
  };
}

const _setAccount = account => {
  return {
    type: WalletConnectConstants.ACCOUNTCHANGED,
    account: account,
  };
};

export default WalletConnectActions;
