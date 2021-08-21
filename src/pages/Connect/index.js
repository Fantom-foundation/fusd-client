import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ethers } from 'ethers'
import WalletConnectActions from '../../actions/walletconnect.actions'
import { DestNet } from '../../constants/wallet.constants'
import './style.css'

function Connect() {
	const dispatch = useDispatch()
  const history = useHistory()

	const connectMetamask = async () => {
    if (window.ethereum === undefined) {
      return;
    }
    await window.ethereum.enable();
    //   handle network change & disconnect here
    window.ethereum.on('chainChanged', (_chainId) => {
      //   handle chainId change
      dispatch(WalletConnectActions.changeChainId(_chainId))
      dispatch(WalletConnectActions.setAccount(''))
      console.log('chainid is changed to ', _chainId)
    })
    window.ethereum.on('disconnect', (error) => {
      //   handle disconnect
      dispatch(WalletConnectActions.disconnectWallet())
      dispatch(WalletConnectActions.setAccount(''))
      console.log('handler for disconnection', error)
    })
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        // handle when no account is connected
        dispatch(WalletConnectActions.disconnectWallet())
        console.log('disconnected')
      }
    })
    let provider = new ethers.providers.Web3Provider(window.ethereum)
    let chainId = (await provider.getNetwork()).chainId
    let accounts = await provider.listAccounts()
    let account = accounts[0]
    dispatch(WalletConnectActions.setAccount(account))
    return chainId
  }

	const handleWalletConnect = async () => {
    if (isConnected) {
      dispatch(WalletConnectActions.setAccount(''))
      dispatch(WalletConnectActions.disconnectWallet())
      // handle disconnect here
    } else {
      // handle connect here
      let chainId = await connectMetamask()
      if (chainId !== DestNet.ChainID) {
        console.log('not connected to Opera Network')
        dispatch(WalletConnectActions.connectWallet(chainId))
      } else {
        console.log('connected')
        dispatch(WalletConnectActions.connectWallet(chainId))
        history.push('/');
      }
    }
  }

  const isConnected = useSelector((state) => state.ConnectWallet.isConnected)

	return (
		<div>
			<h1 className="page-title">Connect a wallet</h1>
			<div className="wallets-container">
				<button className="wallet-title" onClick={handleWalletConnect}>MetaMask</button>
				<button className="wallet-title">WalletConnect</button>
				<button className="wallet-title">Coinbase wallet</button>
				<button className="wallet-title">Portis wallet</button>
				<button className="wallet-title">My Ether Wallet</button>
				<button className="wallet-title">Trezor</button>
				<button className="wallet-title">Gnosis Safe</button>
				<button className="wallet-title">Ledger</button>
			</div>
		</div>
	);
}
  
export default Connect;
  