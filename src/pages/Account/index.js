import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'
import { ethers } from 'ethers'
import WalletConnectActions from '../../actions/walletconnect.actions'
import './style.css'

function Account() {
	const dispatch = useDispatch()

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
      if (chainId !== 1001) {
        console.log('not connected to Opera Network')
        dispatch(WalletConnectActions.connectWallet(chainId))
      } else {
        console.log('connected')
        dispatch(WalletConnectActions.connectWallet(chainId))
      }
    }
  }

  const isConnected = useSelector((state) => state.ConnectWallet.isConnected)
  const account = useSelector((state) => state.ConnectWallet.account)

	return (
		<div>
			<h1 className="page-title">Account Settings</h1>
			<div className="account-settings">
				
			</div>
		</div>
	);
}
  
export default Account;
  