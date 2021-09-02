import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ethers } from 'ethers'
import styled from 'styled-components'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { ChainId } from '@sushiswap/sdk';
import WalletConnectActions from '../../actions/walletconnect.actions'
import RightArrowIcon from '../../assets/icons/right_arrow.svg'
import fUSDIcon from '../../assets/icons/fusd.svg'
import { injected } from '../../connectors';
import { DestNet } from '../../constants/walletconnection'
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

const ENV = process.env.REACT_APP_ENV;

function Header() {
	let history = useHistory()
  const dispatch = useDispatch()
  const { account, chainId, active, activate } = useWeb3React();

  const shrinkAddress = (str) => {
		if (str === undefined) {
			return '';
		}
		if (str.length > 10) {
			return str.substr(0, 5) + '...' + str.substr(str.length - 4, str.length);
		}
		return str;
	}

  const changeNetwork = async () => {
    if (
      (ENV === 'MAINNET' && chainId === ChainId.FANTOM) ||
      (ENV !== 'MAINNET' && chainId === ChainId.FANTOM_TESTNET)
    )
      return;

    history.push('/');

    const params =
      ENV === 'MAINNET'
        ? {
            chainId: '0xfa',
            chainName: 'Fantom Opera',
            nativeCurrency: {
              name: 'Fantom',
              symbol: 'FTM',
              decimals: 18,
            },
            rpcUrls: ['https://rpc.ftm.tools'],
            blockExplorerUrls: ['https://ftmscan.com'],
          }
        : {
            chainId: '0xfa2',
            chainName: 'Fantom Opera Testnet',
            nativeCurrency: {
              name: 'Fantom',
              symbol: 'FTM',
              decimals: 18,
            },
            rpcUrls: ['https://rpc.ftm.tools'],
            blockExplorerUrls: ['https://testnet.ftmscan.com'],
          };

    const provider = await injected.getProvider();
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [params],
      });
      setTimeout(handleConnectWallet, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const init = () => {
    changeNetwork();
    // login();
  };

  useEffect(() => {
    if (account) {
      init();
    } else {
      handleSignOut();
    }
  }, [account, chainId]);

  const handleConnectWallet = () => {
    activate(injected, undefined, true)
      .then(() => {
        // if (account) login();
      })
      .catch(async error => {
        if (error instanceof UnsupportedChainIdError) {
          await activate(injected);
          // if (account) login();
        }
      });
  };

  const handleSignOut = () => {
    dispatch(WalletConnectActions.disconnectWallet());
    // dispatch(AuthActions.signOut());
    // handleMenuClose();
  };
  
  return (
    <div className="App-header">
      <LogoContainer>
        LOGO
      </LogoContainer>
      {
        active ? 
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
