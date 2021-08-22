import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ethers } from 'ethers'
import styled from 'styled-components'
import WalletConnectActions from '../../actions/walletconnect.actions'
import RightArrowIcon from '../../assets/icons/right_arrow.svg'
import fUSDIcon from '../../assets/icons/fusd.svg'
import { DestNet } from '../../constants/wallet.constants'
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

const HeaderButtonsContainer = styled.div`
  display: flex;
`

const HeaderButton = styled.button`
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
  margin: 0 20px;

  &:disabled {
    cursor: not-allowed;
    opacity: .6;
  }
`

const WalletInfo = styled.div`
height: 48px;
background: #FFFFFF;
box-shadow: 0px 0px 12px rgba(38, 40, 62, 0.2);
border-radius: 60px;
font-family: Proxima Nova;
font-style: normal;
font-weight: 600;
font-size: 14px;
line-height: 17px;
/* identical to box height */

display: flex;
align-items: center;

/* black */

color: #26283E;
`

const BalanceInfo = styled.div`
background: rgba(27, 118, 255, 0.2);
border-radius: 60px;
font-family: Proxima Nova;
font-style: normal;
font-weight: 600;
font-size: 16px;
line-height: 19px;
display: flex;
align-items: center;
height: 40px;
margin: 0 4px;

color: #0649AC;
padding: 8px;
`

const AccountBalanceSpan = styled.span`
margin: 0 8px;
`

const FUSDImg = styled.img`
  width: 28px;
  height: 28px;
`

const WalletAddress = styled.span`
  margin: 0 16px;
`

function Header() {
	let history = useHistory()
  const dispatch = useDispatch()
  const [connectionTried, setConnectionTried] = useState(false)

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
      }
    }
  }

  const shrinkAddress = (str) => {
		if (str === undefined) {
			return '';
		}
		if (str.length > 10) {
			return str.substr(0, 5) + '...' + str.substr(str.length - 4, str.length);
		}
		return str;
	}
  
  const isConnected = useSelector((state) => state.ConnectWallet.isConnected)
  const account = useSelector((state) => state.ConnectWallet.account)

  if (!connectionTried) {
    handleWalletConnect();
    setConnectionTried(true)
  }
  
  return (
    <div className="App-header">
      <LogoContainer>
        LOGO
      </LogoContainer>
      {
        isConnected ? 
        <HeaderButtonsContainer>
          <HeaderButton>
            My Vault
          </HeaderButton>
          <HeaderButton>
            Open a new vault
          </HeaderButton>
          <WalletInfo>
            <WalletAddress>
              {shrinkAddress(account)}
            </WalletAddress>
            <BalanceInfo>
              <FUSDImg src={fUSDIcon}></FUSDImg>
              <AccountBalanceSpan>
              3.4k
              </AccountBalanceSpan>
            </BalanceInfo>
          </WalletInfo>
        </HeaderButtonsContainer>
        :
        <HeaderConnectWalletButton onClick={() => history.push("/connect")}>
          Connect wallet
          <RightArrowImg src={RightArrowIcon}></RightArrowImg>
        </HeaderConnectWalletButton>
      }
    </div>
  );
}

export default Header;
