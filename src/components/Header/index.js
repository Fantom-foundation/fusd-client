import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'
import { ethers } from 'ethers'
import WalletConnectActions from '../../actions/walletconnect.actions'
import './style.css';
import logo from '../../assets/logos/logo.svg';

function Header() {
	let history = useHistory()
	const [connectionTried, setConnectionTried] = useState(false)
	const dispatch = useDispatch()

	// const connectMetamask = async () => {
  //   if (window.ethereum === undefined) {
  //     return;
  //   }
  //   await window.ethereum.enable();
  //   //   handle network change & disconnect here
  //   window.ethereum.on('chainChanged', (_chainId) => {
  //     //   handle chainId change
  //     dispatch(WalletConnectActions.changeChainId(_chainId))
  //     dispatch(WalletConnectActions.setAccount(''))
  //     console.log('chainid is changed to ', _chainId)
  //   })
  //   window.ethereum.on('disconnect', (error) => {
  //     //   handle disconnect
  //     dispatch(WalletConnectActions.disconnectWallet())
  //     dispatch(WalletConnectActions.setAccount(''))
  //     console.log('handler for disconnection', error)
  //   })
  //   window.ethereum.on('accountsChanged', (accounts) => {
  //     if (accounts.length === 0) {
  //       // handle when no account is connected
  //       dispatch(WalletConnectActions.disconnectWallet())
  //       console.log('disconnected')
  //     }
  //   })
  //   let provider = new ethers.providers.Web3Provider(window.ethereum)
  //   let chainId = (await provider.getNetwork()).chainId
  //   let accounts = await provider.listAccounts()
  //   let account = accounts[0]
  //   dispatch(WalletConnectActions.setAccount(account))
  //   return chainId
  // }

	// const handleWalletConnect = async () => {
  //   if (isConnected) {
  //     dispatch(WalletConnectActions.setAccount(''))
  //     dispatch(WalletConnectActions.disconnectWallet())
  //     // handle disconnect here
  //   } else {
  //     // handle connect here
  //     let chainId = await connectMetamask()
  //     if (chainId !== DestNet.ChainID) {
  //       console.log('not connected to Opera Network')
  //       dispatch(WalletConnectActions.connectWallet(chainId))
  //     } else {
  //       console.log('connected')
  //       dispatch(WalletConnectActions.connectWallet(chainId))
  //     }
  //   }
  // }

  // if (!connectionTried) {
  //   setConnectionTried(true)
  //   handleWalletConnect()
  // }

  // const isConnected = useSelector((state) => state.ConnectWallet.isConnected)
  // const account = useSelector((state) => state.ConnectWallet.account)

  return (
    <div className="App-header">
			<button onClick={() => history.push("/connect")} className="btn-connect-wallet">
				Connect wallet
			</button>
    </div>
  );
}

export default Header;
