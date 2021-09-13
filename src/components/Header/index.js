import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ethers } from 'ethers'
import styled from 'styled-components'
import { Dropdown, Modal, Button } from 'react-bootstrap'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { ChainId } from '@sushiswap/sdk';
import BigNumber from "bignumber.js";

import WalletConnectActions from '../../actions/walletconnect.actions'
import RightArrowIcon from '../../assets/icons/right_arrow.svg'
import fUSDIcon from '../../assets/icons/fusd.svg'
import LogoIcon from '../../assets/icons/logo.svg'
import { injected } from '../../connectors';
import './style.css';
import { useFUSDContract, useWFTMContract } from '../../contracts';
import WalletUtils from '../../utils/wallet';
import { formatBalance } from '../../utils';
import SwapIcon from '../../assets/icons/swap.svg'

const LogoContainer = styled.div`
  color: black;
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  cursor: pointer;

  /* black */

  color: #26283E;
`

const HeaderConnectWalletButton = styled.button`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.015em;

  color: #141D30;

  padding: 15px 30px 15px 40px;
  background: #FFFFFF;
  box-shadow: 2px 15px 40px 2px #EDF0F4;
  border-radius: 60px;
  border: none;
  outline: none;

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
  background: transparent;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  margin-right: 40px;

  &:disabled {
    cursor: not-allowed;
    opacity: .6;
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
`

const WalletInfo = styled(Dropdown.Toggle)`
padding: 0;
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
outline: none;

&::after {
  display: none;
}
&:focus {
  box-shadow: 0px 0px 12px rgba(38, 40, 62, 0.2);
}
`

const BalanceInfo = styled.div`
border: 1px solid #D2D1FF;
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
padding: 6px;
`

const AccountBalanceSpan = styled.span`
margin: 0 8px;
font-family: Inter;
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 17px;

/* identical to box height */
text-align: right;
letter-spacing: -0.015em;

color: #141D30;
`

const FUSDImg = styled.img`
  width: 28px;
  height: 28px;
`

const LogoImg = styled.img`
  width: 40px;
  height: 40px;
`

const WalletAddress = styled.span`
  margin: 0 16px;
  @media screen and (max-width: 360px) {
    display: none;
  }
`

const WrapBoxRow = styled.div`
  display: flex;
  flex-direction: column;
`

const WrapBoxLabel = styled.label`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;

  /* identical to box height */

  color: #141D30;
  margin-left: 10px;
`

const WrapBoxInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid #F3F2FC;
  box-sizing: border-box;
  border-radius: 14px;
  padding: 0 20px;
  margin-top: 10px;
  align-items: center;
`

const WrapBoxBalance = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;

  /* identical to box height */

  color: #9C9BBC;
  display: flex;
  flex-direction: row;
  white-space: nowrap;
`

const WrapBoxBalanceAmount = styled.div`
`

const WrapBoxInputMax = styled.div`
  color: #6764FF;
  cursor: pointer;
`

const WrapBoxAmountInputWrapper = styled.div`
  padding: 20px;
  display: flex;
  flex: 1 1 auto;
  border-right: 1px solid #F3F2FC;
`

const WrapBoxAmountInput = styled.input`
font-family: Inter;
font-style: normal;
font-weight: 500;
font-size: 18px;
line-height: 29px;

/* identical to box height */
letter-spacing: -0.01em;

color: #25273D;
border: none;
outline: none;
text-align: right;
width: 50px;
flex: 1 1 auto;
`

const WrapAmountPrice = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;

  /* identical to box height */

  color: #9C9BBC;
  display: flex;
  flex-direction: row;
  margin-left: 20px;
  flex: 0 0 70px;
  justify-content: center;
`

const WrapConvertButtonRow = styled.div`
  display: flex;
  margin: 20px 0;
`

const WrapConvertButton = styled.div`
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  background: #FFFFFF;
box-shadow: 2px 15px 40px 2px #EDF0F4;
border-radius: 60px;
`

const WrapImg = styled.img`
  width: 18px;
  height: 18px;
`

const WrapButton = styled.button`
  font-family: Inter;
	font-style: normal;
	font-weight: bold;
	font-size: 16px;
	line-height: 19px;
	letter-spacing: -0.005em;

	color: #FFFFFF;

	background: #6764FF;
	border-radius: 60px;
	display: flex;
  justify-content: center;
  padding: 18px 0px;
  margin-top: 36px;
	width: 100%;
  border: none;
  outline: none;

	&:disabled {
		opacity: 0.3;
	}
`

const WrapBoxWrapper = styled.div`
display: flex;
flex-direction: column;
&.reverse-direction {
  flex-direction: column-reverse;
}
`

const HeaderDropdownMenu = styled(Dropdown.Menu)`
  width: 100%;

  a:active, a.active {
    color: inherit;
    background-color: inherit;
  }
`

const ENV = process.env.REACT_APP_ENV;

function Header() {
	let history = useHistory()
  const dispatch = useDispatch()
  const { account, chainId, active, activate } = useWeb3React();
  const { getWFTMBalance, wrapFTM, unwrapFTM } = useWFTMContract();
  const { price } = useSelector(state => state.Price);

  const [fUSDBalance, setFUSDBalance] = useState(0)
  const [ftmBalance, setFTMBalance] = useState(0)
  const [wFTMBalance, setWFTMBalance] = useState(0)
  const [wrapUnwrap, SetWrapUnwrap] = useState(true)
  const [wrapping, setWrapping] = useState(false)
  const [modalShow, setModalShow] = useState(false);
  const [wrapAmount, setWrapAmount] = useState('');
  const { getFUSDBalance } = useFUSDContract();

  const getBalance = async () => {
		let balance = await getFUSDBalance(account)
		setFUSDBalance(balance)
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

  const initData = () => {
    setWrapAmount('')
    getFTMBalances()
  }

  const formatFTMBalance = (balance) => {
    var number = parseFloat(balance)
    number = isNaN(number) ? 0 : number;
    number = Math.trunc(number * 10 ** 2) / 10 ** 2;
    return number.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })
  }

  const roundFTMBalance = (balance) => {
    var number = parseFloat(balance)
    number = isNaN(number) ? 0 : number;
    return Math.trunc(number * 10 ** 2) / 10 ** 2;
  }

  const wrapPrice = () => {
    if (wrapAmount === '') {
      return '0.00'
    }
    var amount = new BigNumber(wrapAmount)
    var priceBN = new BigNumber(price)
    return amount.multipliedBy(priceBN).toFixed(2)
  }

  const getFTMBalances = async () => {
    const ftmBalance = await WalletUtils.checkBalance(account);
    const wFTMBalance = await getWFTMBalance(account)
    setFTMBalance(ftmBalance)
    setWFTMBalance(wFTMBalance)
  }

  const modalShowHandler = async () => {
    getFTMBalances()
    setModalShow(true)
  }

  const changeWrapConertHandler = () => {
    if (wrapUnwrap) {
      SetWrapUnwrap(false)
    } else {
      SetWrapUnwrap(true)
    }
  }

  const wrapButtonClickHandler = async () => {
    setWrapping(true);
    try {
      if (wrapUnwrap) {
        const price = ethers.utils.parseEther(wrapAmount)
        const tx = await wrapFTM(price, account)
        await tx.wait()
      } else {
        const price = ethers.utils.parseEther(wrapAmount)
        const tx = await unwrapFTM(price)
        await tx.wait()
      }
    } catch (error) {
      console.log(error)
      setWrapping(false);
    }
    setWrapping(false);
    initData()
  }

  useEffect(() => {
    if (account) {
      init();
      getBalance();
    } else {
      handleSignOut();
    }
  }, [account, chainId]);

  const handleSignOut = () => {
    dispatch(WalletConnectActions.disconnectWallet());
    // dispatch(AuthActions.signOut());
    // handleMenuClose();
  };
  
  return (
    <div className="App-header">
      <LogoContainer onClick={() => history.push("/")}>
        <LogoImg src={LogoIcon}></LogoImg>
      </LogoContainer>
      {
        active ? 
        <>
          <HeaderButtonsContainer>
            <HeaderButton onClick={e => history.push('/vaults')}>
              My vaults
            </HeaderButton>
            <HeaderButton onClick={e => history.push('/vault')}>
              Open a new vault
            </HeaderButton>
            <Dropdown>
              <WalletInfo variant="none">
                <WalletAddress>
                  {shrinkAddress(account)}
                </WalletAddress>
                <BalanceInfo>
                  <FUSDImg src={fUSDIcon}></FUSDImg>
                  <AccountBalanceSpan>
                  {formatBalance(fUSDBalance)}
                  </AccountBalanceSpan>
                </BalanceInfo>
              </WalletInfo>

              <HeaderDropdownMenu>
                <Dropdown.Item href="#" onClick={() => modalShowHandler()}>FTM/WFTM Station</Dropdown.Item>
                {/* <Dropdown.Divider />
                <Dropdown.Item href="#/action-4">Sign Out</Dropdown.Item> */}
              </HeaderDropdownMenu>
            </Dropdown>
          </HeaderButtonsContainer>
          <Modal
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={modalShow}
            onHide={() => setModalShow(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                FTM / WFTM Station
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <WrapBoxWrapper className={wrapUnwrap ? '' : 'reverse-direction'}>
                <WrapBoxRow>
                  <WrapBoxLabel>
                    FTM
                  </WrapBoxLabel>
                  <WrapBoxInputWrapper>
                    <WrapBoxBalance>
                      <WrapBoxBalanceAmount>Balance: {formatFTMBalance(ftmBalance)}</WrapBoxBalanceAmount>
                      {
                        wrapUnwrap &&
                        <WrapBoxInputMax onClick={() => setWrapAmount(ftmBalance)}>
                          (Max)
                        </WrapBoxInputMax>
                      }
                    </WrapBoxBalance>
                    <WrapBoxAmountInputWrapper>
                      <WrapBoxAmountInput placeholder="0.0" value={wrapAmount} onChange={(e) => setWrapAmount(e.target.value)} />
                    </WrapBoxAmountInputWrapper>
                    <WrapAmountPrice>
                      ${wrapPrice()}
                    </WrapAmountPrice>
                  </WrapBoxInputWrapper>
                </WrapBoxRow>
                <WrapConvertButtonRow>
                  <WrapConvertButton onClick={() => changeWrapConertHandler()}><WrapImg src={SwapIcon}/></WrapConvertButton>
                </WrapConvertButtonRow>
                <WrapBoxRow>
                  <WrapBoxLabel>
                    WFTM
                  </WrapBoxLabel>
                  <WrapBoxInputWrapper>
                    <WrapBoxBalance>
                      <WrapBoxBalanceAmount>Balance: {formatFTMBalance(wFTMBalance)}</WrapBoxBalanceAmount>
                      {
                        !wrapUnwrap &&
                        <WrapBoxInputMax onClick={() => setWrapAmount(wFTMBalance)}>
                          (Max)
                        </WrapBoxInputMax>
                      }
                    </WrapBoxBalance>
                    <WrapBoxAmountInputWrapper>
                      <WrapBoxAmountInput placeholder="0.0" value={wrapAmount} onChange={(e) => setWrapAmount(e.target.value)} />
                    </WrapBoxAmountInputWrapper>
                    <WrapAmountPrice>
                      ${wrapPrice()}
                    </WrapAmountPrice>
                  </WrapBoxInputWrapper>
                </WrapBoxRow>
              </WrapBoxWrapper>
              <WrapBoxRow>
                <WrapButton onClick={() => wrapButtonClickHandler()} disabled={wrapAmount === '' || wrapping || wrapUnwrap && wrapAmount > ftmBalance || !wrapUnwrap && wrapAmount > wFTMBalance}>
                  {wrapUnwrap ? 'Wrap' : 'Unwrap'}
                </WrapButton>
              </WrapBoxRow>
            </Modal.Body>
          </Modal>
          </>
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
