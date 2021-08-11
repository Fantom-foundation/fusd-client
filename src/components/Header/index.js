import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import RightArrowIcon from '../../assets/icons/right_arrow.svg'
import './style.css';

const LogoContainer = styled.div`
  color: black;
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;

  /* black */

  color: #26283E;
`

const HeaderConnectWalletButton = styled.button`
  font-family: Proxima Nova;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;

  /* black */

  color: #26283E;
  background: #FFFFFF;
  border-radius: 60px;
  border: none;
  outline: none;
  display: flex;
  align-items: center;

  &:disabled {
    cursor: not-allowed;
    opacity: .6;
  }
`

const RightArrowImg = styled.img`
  width: 10px;
  height: 10px;
  margin: 10px;
`

function Header() {
	let history = useHistory()

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
      <LogoContainer>
        LOGO
      </LogoContainer>
      <HeaderConnectWalletButton onClick={() => history.push("/connect")}>
				Connect wallet
        <RightArrowImg src={RightArrowIcon}></RightArrowImg>
      </HeaderConnectWalletButton>
    </div>
  );
}

export default Header;
