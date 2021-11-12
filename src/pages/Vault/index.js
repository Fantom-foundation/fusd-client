import Header from '../../components/Header';
import { useSelector } from 'react-redux'
import ClipLoader from "react-spinners/ClipLoader";
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components'
import { Modal, Button } from 'react-bootstrap'
import { ethers } from 'ethers'
import FTMIcon from '../../assets/icons/ftm.svg'
import SwapIcon from '../../assets/icons/swap.svg'
import PlusIcon from '../../assets/icons/plus.svg'
import MinusIcon from '../../assets/icons/minus.svg'
import { useEffect, useState } from 'react';
import { useWFTMContract, useFMintContract } from '../../contracts';
import { FMINT_CONTRACT_ADDRESS, FUSD_CONTRACT_ADDRESS, WFTM_CONTRACT_ADDRESS } from '../../constants/walletconnection'
import BigNumber from "bignumber.js";
import useVaultInfo from '../../hooks/useVaultInfo';
import { formatBalance, compareBN } from '../../utils';
import StepBar from '../../components/StepBar';

const VaultPageWrapper = styled.div`
	margin: 20px 0;
	display: flex;
	flex-direction: row;
	@media screen and (max-width: 1200px) {
		flex-direction: column;
	}
`

const VaultInfoWrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex: 173;
	margin-right: 24px;
	@media screen and (max-width: 1200px) {
		margin-right: 0;
	}
`

const OpenVault = styled.div`
font-family: Proxima Nova;
font-style: normal;
font-weight: 600;
font-size: 18px;
line-height: 22px;
/* identical to box height */


/* black */

color: #26283E;
display: flex;
margin-bottom: 20px;
`

const FTMImg = styled.img`
	width: 24px;
	height: 24px;
	margin-right: 8px;
`

const Seperator = styled.div`
	border-bottom: 1px solid #F3F2FC;
	margin-left: -30px;
	margin-right: -30px;
`

const VerticalSeperator = styled.div`
margin-top: 35px;
border-left: 1px solid #F3F2FC;
`

const VaultConfigurationWrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex: 103;
	
	background: #FFFFFF;
	border: 1px solid #F3F2FC;
	box-sizing: border-box;
	border-radius: 28px;
	padding: 30px 25px;

	@media screen and (max-width: 1200px) {
		margin-top: 24px;
	}
`

const LiquidationCollateralWrapper = styled.div`
	display:flex;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 32px;
	flex-wrap: wrap;
`

const LiquidationPriceInfo = styled.div`
	display:flex;
	flex-direction: column;
`

const CollateralizationInfo = styled.div`
display:flex;
flex-direction: column;
`

const InfoLabel = styled.div`
	font-family: Proxima Nova;
	font-style: normal;
	font-weight: normal;
	font-size: 16px;
	line-height: 19px;

	/* grey */

	color: #787A9B;
	text-align: left;

	&.text-right {
		text-align: right;
	}
`

const InfoValue = styled.div`
	font-family: Inter;
	font-style: normal;
	font-weight: bold;
	font-size: 48px;
	line-height: 58px;

	/* identical to box height */

	color: #141D30;
	text-align: left;
	margin-top: 18px;

&.text-right {
	text-align: right;
}

&.low {
	color: #FF5252;
}

&.mid {
	color: #FF9839;
}

&.high {
	color: #11D0A2;
}
`

const PriceInfoWrapper = styled.div`
	display:flex;
	flex-direction: column;
`

const CollateralWrapper = styled.div`
	display:flex;
	flex-direction: column;
`

const PriceCollateralWrapper = styled.div`
display:flex;
flex-direction: row;
margin-top: 90px;
justify-content: space-between;
`

const CurrentPriceInfo = styled.div`
display:flex;
flex-direction: column;
`

const CollateralNumberInfo = styled.div`
display:flex;
flex-direction: column;
`

const NextPriceInfo = styled.div`
display:flex;
flex-direction: column;
margin-top: 24px;
`

const CurrentPrice = styled.div`
font-family: Inter;
font-style: normal;
font-weight: 600;
font-size: 24px;
line-height: 29px;
/* identical to box height */


/* semiblack */

color: #4A4C67;
text-align: left;
margin-top: 16px;
`

// const NextPrice = styled.div`
// font-family: Proxima Nova;
// font-style: normal;
// font-weight: 600;
// font-size: 16px;
// line-height: 19px;

// /* grey */

// color: #787A9B;
// text-align: left;
// margin-top: 10px;
// `

const CollateralNumber = styled.div`
font-family: Inter;
font-style: normal;
font-weight: 600;
font-size: 24px;
line-height: 29px;
/* identical to box height */

text-align: right;

/* semiblack */

color: #4A4C67;
margin-top: 16px;
`

const CollateralPrice = styled.div`
font-family: Proxima Nova;
font-style: normal;
font-weight: 600;
font-size: 18px;
line-height: 22px;
/* identical to box height */

text-align: right;

/* semiblack */

color: #4A4C67;
margin-top: 24px;
`

const VaultDetailsWrapper = styled.div`
display:flex;
flex-direction: column;
margin-top: 24px;
background: #FFFFFF;
box-shadow: 0px 15px 60px #F2F1FA;
border-radius: 28px;
`

const VaultDetailsTitle = styled.div`
font-family: Inter;
font-style: normal;
font-weight: bold;
font-size: 18px;
line-height: 22px;
/* identical to box height */


/* black */

color: #26283E;
text-align: left;
padding: 30px;
padding-bottom: 25px;
`

const VaultDetails = styled.div`

`

const VaultDetailsRow = styled.div`
display: grid;
grid-template-columns: repeat(3, 1fr);
border-top: 1px solid #F3F2FC;
@media screen and (max-width: 576px) {
	display: flex;
	flex-direction: column;
	&:not(:first-child) {
		border-top: none;
	}
}
`

const VaultDetailsInfoItem = styled.div`
display: flex;
flex-direction: column;
justify-content: flex-start;
text-align: left;
padding: 30px;
&:not(:last-child) {
	border-right: 1px solid #F3F2FC;
}
@media screen and (max-width: 576px) {
	border-bottom: 1px solid #F3F2FC;
	&:not(:last-child) {
		border-right: none;
	}
}
`

const VaultInfoTitle = styled.div`
font-family: Proxima Nova;
font-style: normal;
font-weight: normal;
font-size: 16px;
line-height: 19px;

/* grey */

color: #787A9B;
`

const VaultInfo = styled.span`
font-family: Inter;
font-style: normal;
font-weight: bold;
font-size: 16px;
line-height: 19px;

/* black */

color: #26283E;
margin-top: 8px;
`

const VaultUnit = styled.span`
font-family: Inter;
font-style: normal;
font-weight: 600;
font-size: 12px;
line-height: 15px;
/* identical to box height */


/* black */

margin-left: 4px;
`

const VaultConfigurator = styled.div`
text-align: left;
`

const VaultConfiguratorTitle = styled.label`
font-family: Proxima Nova;
font-style: normal;
font-weight: 600;
font-size: 16px;
line-height: 19px;

/* black */

color: #26283E;
margin-bottom: 20px;
`

const VaultConfiguratorDescription = styled.p`
font-family: Proxima Nova;
font-style: normal;
font-weight: normal;
font-size: 14px;
line-height: 140%;
/* or 20px */


/* grey */

color: #787A9B;
margin-top: 28px;
`

const DepositFTMTitleWrapper = styled.div`
display: flex;
flex-direction: row;
margin-top: 44px;
justify-content: space-between;
`

const DepositFTMTitle = styled.div`
font-family: Proxima Nova;
font-style: normal;
font-weight: 600;
font-size: 14px;
line-height: 140%;
/* identical to box height, or 20px */


/* black */

color: #26283E;

`

const DepositFTMBalance = styled.div`
font-family: Proxima Nova;
font-style: normal;
font-weight: 600;
font-size: 14px;
line-height: 140%;
/* identical to box height, or 20px */

text-align: right;

/* grey */

color: #787A9B;
cursor: pointer;
`

const DepositFTMInputWrapper = styled.div`
	display: flex;
	flex-direction: column;
	border: 1px solid rgba(120, 122, 155, 0.3);
	box-sizing: border-box;
	border-radius: 8px;
	position: relative;
	padding: 8px 16px;
	margin-top: 12px;
`

const DepositFTMInput = styled.input`
font-family: Inter;
font-style: normal;
font-weight: 500;
font-size: 20px;
line-height: 24px;

/* grey */

color: #787A9B;
margin-top: 8px;
border: none;
outline: none;
&:focus {
	color: #4A4C67;
}
`
const DepositUSDInput = styled.div`
font-family: Proxima Nova;
font-style: normal;
font-weight: 600;
font-size: 12px;
line-height: 15px;
/* identical to box height */
margin-top: 8px;

/* grey */

color: #787A9B;
&:focus {
	color: #4A4C67;
}
`

const DepositFTMSwapImg = styled.img`
	width: 18px;
	height: 18px;
	position: absolute;
	right: 24px;
	top: 50%;
	transform: translateY(-50%);
	cursor: pointer;
`

const ShowGenerateFUSDButton = styled.div`
cursor: pointer;
font-family: Proxima Nova;
font-style: normal;
font-weight: 600;
font-size: 16px;
line-height: 19px;
margin-top: 36px;
text-decoration: none;
display: flex;
flex-direction: row;
align-items: center;
/* blue */

color: #1969FF;
`

const GenrateFUSDPlusImg = styled.img`
width: 20px;
height: 20px;
margin-right: 4px;
`

const GenerateFUSDButton = styled.button`
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

	@media screen and (max-width: 1200px) {
		max-width: 360px;
		margin-left: auto;
		margin-right: auto;
	}
`

const FUSDVaultInfoWrapper = styled.div`
margin-top: 39px;
padding: 16px;
background: rgba(228, 228, 242, 0.3);
border-radius: 14px;
`

const FUSDVaultInfoRow = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
margin-top: 12px;
&:first-child {
	margin-top: 0;
}
`

const FUSDVaultInfoLabel = styled.label`
font-family: Proxima Nova;
font-style: normal;
font-weight: normal;
font-size: 14px;
line-height: 17px;
/* identical to box height */


/* grey */

color: #787A9B;
`

const FUSDVaultInfo = styled.div`
font-family: Proxima Nova;
font-style: normal;
font-weight: 600;
font-size: 14px;
line-height: 17px;
/* identical to box height */

text-align: right;

/* black */

color: #26283E;
`

const GenerateFUSDContainer = styled.div`
display: flex;
flex-direction: column;
margin-top: 36px;
`

const GenerateFUSDLabelRow = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
`

const GenerateFUSDLabel = styled.label`
font-family: Inter;
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 17px;

/* identical to box height */

color: #141D30;
`

const GenerateFUSDMax = styled.span`
font-family: Inter;
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 17px;

/* identical to box height */
text-align: right;

color: #9C9BBC;
cursor: pointer;
`

const GenerateFUSDInputWrapper = styled.div`
	display: flex;
	flex-direction: column;
	border: 1px solid rgba(120, 122, 155, 0.3);
	box-sizing: border-box;
	border-radius: 8px;
	position: relative;
	padding: 14px 16px;
	margin-top: 12px;
`

const GenerateFUSDInput = styled.input`
font-family: Inter;
font-style: normal;
font-weight: 500;
font-size: 20px;
line-height: 24px;

/* grey */

color: #787A9B;
margin-top: 5px;
border: none;
outline: none;
&:focus {
	color: #4A4C67;
}
`

const VaultStatusWrapper = styled.div`
background: #FFFFFF;
box-shadow: 0px 15px 60px #F2F1FA;
border-radius: 28px;
padding: 30px;
padding-bottom: 60px;
`

const ValueAfterWrapper = styled.div`
  visibility: hidden;
  text-align: left;
  &.align-right {
    text-align: right;
  }
  &.active {
    visibility: visible;
  }
`

const ValueAfter = styled.div`
  box-sizing: border-box;
  margin: 8px 0px 0px;
  min-width: 0px;
  border-radius: 20px;
  background-color: #E7FCFA;
  color: #1AAB9B;
  font-weight: 700;
  border: none;
  padding: 0px 12px;
  display: inline-block;
  line-height: 2;
  font-size: 12px;
  min-width: 0px;
`

function Vault() {
	const { account, chainId } = useWeb3React();
	const defaultVaultInfo = useVaultInfo();
	const [collateral, setCollateral] = useState(['', '']) // Deposit amount input in the field in wftm and usd
	const [balance, setBalance] = useState([0, 0]) // 
	const [turnCollateral, setTurnCollateral] = useState(0) // deposit in wftm or usd, 0: wftm, 1: fusd
	const [showGenerateFUSD, setShowGenerateFUSD] = useState(false) // Showing GenerateFUSD button
	const [generateFUSD, setGenerateFUSD] = useState('')
	const [generating, setGenerating] = useState(false)
	const [maxToMint, setMaxToMint] = useState(0)
	const [maxToWithdraw, setMaxToWithdraw] = useState(0)
  const [afterMaxToMint, setAfterMaxToMint] = useState(0)
	const [afterMaxToWithdraw, setAfterMaxToWithdraw] = useState(0)
	const cryptoCurrencies = ['wFTM', 'USD']
	const { price } = useSelector(state => state.Price);
	const { getWFTMBalance, increaseAllowance, wftmDecimals, wftmSymbol } = useWFTMContract();
	const { mustDeposit, mustMint, getMaxToWithdraw, getMaxToWithdrawWithChanges, getMaxToMint, getMaxToMintWithChanges } = useFMintContract();
	const minCollateralRatio = defaultVaultInfo.minCollateralRatio;
	const liquidationRatio = defaultVaultInfo.minCollateralRatio;
	const stabilityFee = 0;
	const liquidationFee = 0;
  const [afterLiquidationPrice, setAfterLiquidationPrice] = useState(0);
  const [afterCollateralRatio, setAfterCollateralRatio] = useState(0);
  const [afterCollateralLocked, setAfterCollateralLocked] = useState(0);
  const [afterDebt, setAfterDebt] = useState(0);
  const [actualCollateralLocked, setActualCollateralLocked] = useState(0)
  const [actualDebt, setActualDebt] = useState(0)
  const [actualCollateralRatio, setActualCollateralRatio] = useState(0);
  const [actualLiquidationPrice, setActualLiquidationPrice] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [progressing, setProgressing] = useState(false);

  const getNewVaultInfo = () => {
    let newCollateralLocked = new BigNumber(actualCollateralLocked);
    if (collateral[0]) {
      newCollateralLocked = newCollateralLocked.plus(new BigNumber(collateral[0]))
    }
    const newAfterCollateralLocked = newCollateralLocked.toString()
    setAfterCollateralLocked(newAfterCollateralLocked)

    let newDebt = new BigNumber(actualDebt)
    if (generateFUSD) {
      newDebt = newDebt.plus(new BigNumber(generateFUSD))
    }
    const dbt = newDebt.toString()
    setAfterDebt(dbt)

		let cr = new BigNumber(price * 100)
      .multipliedBy(new BigNumber(newAfterCollateralLocked))
      .dividedBy(new BigNumber(dbt));
		if (cr.isNaN()) {
			cr = new BigNumber(0);
		}
		setAfterCollateralRatio(cr.toString());
	
		let liquidationPrice = new BigNumber(dbt)
      .dividedBy(new BigNumber(minCollateralRatio / 100))
      .dividedBy(new BigNumber(newAfterCollateralLocked));
		if (liquidationPrice.isNaN()) {
			liquidationPrice = new BigNumber(0);
		}
    setAfterLiquidationPrice(liquidationPrice.toString());
  }

  const getDefaultVaultInfo = () => {
    if (actualDebt !== 0) {
      let cr = new BigNumber(price * 100)
        .multipliedBy(new BigNumber(actualCollateralLocked))
        .dividedBy(new BigNumber(actualDebt));
			if (cr.isNaN()) {
				cr = new BigNumber(0);
			}
      setActualCollateralRatio(cr.toString());
    } else {
      setActualCollateralRatio(0);
    }
	
		let liquidationPrice = new BigNumber(actualDebt)
      .dividedBy(new BigNumber(minCollateralRatio / 100))
      .dividedBy(new BigNumber(actualCollateralLocked));
		if (liquidationPrice.isNaN()) {
			liquidationPrice = new BigNumber(0);
		}
    setActualLiquidationPrice(liquidationPrice.toString());
  }

  useEffect(() => {
    setActualCollateralLocked(defaultVaultInfo.collateral)
    setActualDebt(defaultVaultInfo.debt)
    getDefaultVaultInfo();
    getNewVaultInfo();
		getAvailableToGenerate();
    getAvailableToWithdraw();
  }, [defaultVaultInfo])

  useEffect(() => {
    getNewVaultInfo();
    getAvailableToGenerateWithChanges();
    getAvailableToWithdrawWithChanges();
  }, [collateral, generateFUSD])

	const getBalance = async () => {
		let ftmBalance = await getWFTMBalance(account)
		ftmBalance = BigNumber(ftmBalance)
		const priceBN = BigNumber(price)
		let usdBalance = ftmBalance.multipliedBy(priceBN);
		const balance = [ftmBalance, usdBalance]
		setBalance(balance)
	}

	const handleCollateralChange = () => {
		setTurnCollateral(oppositeCollateralCurrency())
	}

	const changeCollateralHandler = (value) => {
		const collateralAmounts = collateral
		let amount = parseFloat(value)
		amount = isNaN(amount) ? '' : amount
		collateralAmounts[turnCollateral] = amount + (value[value.length - 1] === '.' ? '.' : '')
		collateralAmounts[oppositeCollateralCurrency()] = (turnCollateral ? (amount / price) : (amount * price))
		if (amount === '' || amount === 0) {
			setShowGenerateFUSD(false);
			setGenerateFUSD('');
		}
		setCollateral([...collateralAmounts])
	}

  const getCollateralLockedPrice = () => {
    return afterCollateralLocked * price
  }

	const oppositeCollateralCurrency = () => {
		return turnCollateral ? 0 : 1
	}

	const formatNumber = (value) => {
		let amount = parseFloat(value)
		amount = isNaN(amount) ? 0 : amount;
		return amount.toLocaleString('en-US', {
			maximumFractionDigits: 2,
			minimumFractionDigits: 2
		})
	}

	const handleShowGenerateFUSD = (e) => {
		const show = showGenerateFUSD;
		setShowGenerateFUSD(!show)
	}

	const handleGenerateFUSDChange = (e) => {
		setGenerateFUSD(e.target.value)
	}

	const collateralStyleClass = (collateralRatio) => {
		if (collateralRatio === '' || collateralRatio === 0) {
			return ''
		} else if (collateralRatio < 200) {
			return 'low'
		} else if (collateralRatio < 500) {
			return 'mid'
		} else {
			return 'high'
		}
	}

	const handleGenerateFUSD = async () => {
    setModalShow(true)
		setGenerating(true)
		
	}

  const goToNextStep = async () => {
    const decimals = BigNumber('10').pow(18)
		const depositAmount = BigNumber(collateral[0]).multipliedBy(decimals)
    
    setProgressing(true);
		try {
      if (activeStep === 1) {
        if (!depositAmount.isEqualTo(new BigNumber(0))) {
          await increaseAllowance(FMINT_CONTRACT_ADDRESS[chainId], depositAmount.toString());
        }
      } else if (activeStep === 2) {
        if (!depositAmount.isEqualTo(new BigNumber(0))) {
          await mustDeposit(WFTM_CONTRACT_ADDRESS[chainId], depositAmount.toString());
        }
      } else if (activeStep === 3) {
        const fusdAmount = new BigNumber(generateFUSD).multipliedBy(decimals)
        await mustMint(FUSD_CONTRACT_ADDRESS[chainId], fusdAmount.toString());
        initialize()
      }
		} catch (error) {
      setGenerating(false)
      setActiveStep(1)
			console.log(error)
		}
    setProgressing(false);
    const currentStep = activeStep + 1;
    setActiveStep(currentStep)
  }

	const initialize = () => {
		setCollateral(['', ''])
		setTurnCollateral(0)
		setShowGenerateFUSD(false)
		setGenerateFUSD('')
		setGenerating(false)
		getBalance();
    setModalShow(false);
    setActiveStep(1);
	}

  const getAvailableToGenerate = async () => {
    try {
      let available = await getMaxToMint(account);
			available = available === undefined ? 0 : available;
      available = ethers.utils.formatEther(available)
      setMaxToMint(available)
    } catch (e) {
      console.log(e);
      setMaxToMint(0)
    }
  }

  const getAvailableToGenerateWithChanges = async () => {
    try {
      let decimalM = new BigNumber(10).pow(18);
      let collateralDiff = new BigNumber(collateral[0] === '' ? 0 : collateral[0]).multipliedBy(decimalM);
      let debtDiff = new BigNumber(generateFUSD === '' ? 0 : generateFUSD).multipliedBy(decimalM);
      let available = await getMaxToMintWithChanges(account, collateralDiff.toString(), debtDiff.toString());
			available = available === undefined ? 0 : available;
      available = ethers.utils.formatEther(available)
      setAfterMaxToMint(available)
    } catch (e) {
      console.log(e);
      setAfterMaxToMint(0)
    }
  }

  const getAvailableToWithdraw = async () => {
    try {
      let available = await getMaxToWithdraw(account);
      available = ethers.utils.formatEther(available)
      setMaxToWithdraw(available)
    } catch (e) {
      console.log(e);
      setMaxToWithdraw(0)
    }
  }

  const getAvailableToWithdrawWithChanges = async () => {
    try {
      let decimalM = new BigNumber(10).pow(18);
      let collateralDiff = new BigNumber(collateral[0] === '' ? 0 : collateral[0]).multipliedBy(decimalM);
      let debtDiff = new BigNumber(generateFUSD === '' ? 0 : generateFUSD).multipliedBy(decimalM);
      let available = await getMaxToWithdrawWithChanges(account, collateralDiff.toString(), debtDiff.toString());
      available = ethers.utils.formatEther(available)
      setAfterMaxToWithdraw(available)
    } catch (e) {
      console.log(e);
      setAfterMaxToWithdraw(0)
    }
  }

	const addWFTMToken = async () => {
    const tokenAddress = WFTM_CONTRACT_ADDRESS[chainId];
		const tokenSymbol = await wftmSymbol();
		const tokenDecimals = await wftmDecimals();
		const tokenImage = '';

		try {
			// wasAdded is a boolean. Like any RPC method, an error may be thrown.
			const { ethereum } = window
			const wasAdded = await ethereum.request({
				method: 'wallet_watchAsset',
				params: {
					type: 'ERC20', // Initially only supports ERC20, but eventually more!
					options: {
						address: tokenAddress, // The address that the token is at.
						symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
						decimals: tokenDecimals, // The number of decimals in the token
						image: tokenImage, // A string url of the token logo
					},
				},
			});

			if (wasAdded) {
				console.log('WFTM token added!');
			} else {
				console.log('Not added!');
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		try {
			getBalance();
		} catch (error) {
			console.log(error)
		}
	}, [chainId, price])

  const handleClose = () => {
    setModalShow(false)
    setGenerating(false)
  }

	return (
		<div>
			<Header/>
			<VaultPageWrapper>
				<VaultInfoWrapper>
					<VaultStatusWrapper>
						<OpenVault>
							<FTMImg src={FTMIcon} />
							Open FTM Vault
						</OpenVault>
						<Seperator />
						<LiquidationCollateralWrapper>
							<LiquidationPriceInfo>
								<InfoLabel>
									Liquidation price
								</InfoLabel>
								<InfoValue>
									${formatBalance(actualLiquidationPrice)}
								</InfoValue>
                <ValueAfterWrapper className={`${!compareBN(actualLiquidationPrice, afterLiquidationPrice) ? 'active' : ''}`}>
                  <ValueAfter>
                    ${formatBalance(afterLiquidationPrice)} after
                  </ValueAfter>
                </ValueAfterWrapper>
							</LiquidationPriceInfo>
							<VerticalSeperator/>
							<CollateralizationInfo>
								<InfoLabel className="text-right">
									Collateralization ratio
								</InfoLabel>
								<InfoValue className={"text-right " + `${collateralStyleClass(actualCollateralRatio)}`}>
									{formatNumber(actualCollateralRatio)}%
								</InfoValue>
                <ValueAfterWrapper className={`align-right ${!compareBN(actualCollateralRatio, afterCollateralRatio) ? 'active' : ''}`}>
                  <ValueAfter>
                    {formatNumber(afterCollateralRatio)}% after
                  </ValueAfter>
                </ValueAfterWrapper>
							</CollateralizationInfo>
						</LiquidationCollateralWrapper>
						<PriceCollateralWrapper>
							<PriceInfoWrapper>
								<CurrentPriceInfo>
									<InfoLabel>Current FTM/USD price</InfoLabel>
									<CurrentPrice>${formatNumber(price)}</CurrentPrice>
								</CurrentPriceInfo>
								<NextPriceInfo>
									{/* <InfoLabel>Next price in 10 minutes</InfoLabel>
									<NextPrice>$0.24  (0.00%)</NextPrice> */}
								</NextPriceInfo>
							</PriceInfoWrapper>
							<CollateralWrapper>
								<CollateralNumberInfo>
									<InfoLabel>Collateral locked</InfoLabel>
									<CollateralNumber>${afterCollateralLocked ? formatNumber(actualCollateralLocked * price) : '--'}</CollateralNumber>
                  <ValueAfterWrapper className={`align-right ${!compareBN(actualCollateralLocked, afterCollateralLocked) ? 'active' : ''}`}>
                    <ValueAfter>
                      ${afterCollateralLocked ? formatNumber(getCollateralLockedPrice()) : '--'} after
                    </ValueAfter>
                  </ValueAfterWrapper>
								</CollateralNumberInfo>
								<CollateralPrice>
								{actualCollateralLocked ? formatNumber(actualCollateralLocked) : '--'}
								</CollateralPrice>
							</CollateralWrapper>
						</PriceCollateralWrapper>
					</VaultStatusWrapper>
					<VaultDetailsWrapper>
						<VaultDetailsTitle>
							Vault details
						</VaultDetailsTitle>
						<VaultDetails>
							<VaultDetailsRow>
								<VaultDetailsInfoItem>
									<VaultInfoTitle>
										Vault fUSD Debt
									</VaultInfoTitle>
									<VaultInfo>
										{formatBalance(actualDebt)}
										<VaultUnit>
										fUSD
										</VaultUnit>
									</VaultInfo>
                  <ValueAfterWrapper className={`${!compareBN(actualDebt,afterDebt) ? 'active' : ''}`}>
                    <ValueAfter>
                      {formatBalance(afterDebt)}
                      <VaultUnit>
                      fUSD
                      </VaultUnit>
                      &nbsp;after
                    </ValueAfter>
                  </ValueAfterWrapper>
								</VaultDetailsInfoItem>
								<VaultDetailsInfoItem>
									<VaultInfoTitle>
									Available to withdraw
									</VaultInfoTitle>
									<VaultInfo>
                    {formatNumber(maxToWithdraw)}
                    <VaultUnit>
                    wFTM
                    </VaultUnit>
									</VaultInfo>
                  <ValueAfterWrapper className={`${!compareBN(maxToWithdraw, afterMaxToWithdraw) ? 'active' : ''}`}>
                    <ValueAfter>
                      {formatNumber(afterMaxToWithdraw)}
                      <VaultUnit>
                      wFTM
                      </VaultUnit>
                      &nbsp;after
                    </ValueAfter>
                  </ValueAfterWrapper>
								</VaultDetailsInfoItem>
								<VaultDetailsInfoItem>
									<VaultInfoTitle>
									Available to Generate
									</VaultInfoTitle>
                  <VaultInfo>
                    {formatNumber(maxToMint)}
                    <VaultUnit>
                    USD
                    </VaultUnit>
									</VaultInfo>
                  <ValueAfterWrapper className={`${!compareBN(maxToMint, afterMaxToMint) ? 'active' : ''}`}>
                    <ValueAfter>
                      {formatNumber(afterMaxToMint)}
                      <VaultUnit>
                      USD
                      </VaultUnit>
                      &nbsp;after
                    </ValueAfter>
                  </ValueAfterWrapper>
								</VaultDetailsInfoItem>
							</VaultDetailsRow>
							
							<VaultDetailsRow>
								<VaultDetailsInfoItem>
									<VaultInfoTitle>
									Liquidation Ratio
									</VaultInfoTitle>
									<VaultInfo>
									{formatNumber(liquidationRatio)}%
									</VaultInfo>
								</VaultDetailsInfoItem>
								<VaultDetailsInfoItem>
									<VaultInfoTitle>
									Stability Fee
									</VaultInfoTitle>
									<VaultInfo>
									{formatNumber(stabilityFee)}%
									</VaultInfo>
								</VaultDetailsInfoItem>
								<VaultDetailsInfoItem>
									<VaultInfoTitle>
									Liquidation Penalty
									</VaultInfoTitle>
									<VaultInfo>
									{formatNumber(liquidationFee)}%
									</VaultInfo>
								</VaultDetailsInfoItem>
							</VaultDetailsRow>
						</VaultDetails>
					</VaultDetailsWrapper>
				</VaultInfoWrapper>
				<VaultConfigurationWrapper>
					<VaultConfigurator>
						<VaultConfiguratorTitle>Configure your Vault</VaultConfiguratorTitle>
						<Seperator/>
						<VaultConfiguratorDescription>
						Simulate your vault by configuring the amount of collateral to deposit, and fUSD to generate.
						</VaultConfiguratorDescription>
						<DepositFTMTitleWrapper>
							<DepositFTMTitle>Deposit wFTM</DepositFTMTitle>
							<DepositFTMBalance onClick={() => addWFTMToken()}>Balance {formatNumber(balance[turnCollateral])} {cryptoCurrencies[turnCollateral]}</DepositFTMBalance>
						</DepositFTMTitleWrapper>
						<DepositFTMInputWrapper>
							<DepositFTMInput value={collateral[turnCollateral]} placeholder={'0 ' + cryptoCurrencies[turnCollateral]} onChange={(e) => changeCollateralHandler(e.target.value)}>
							</DepositFTMInput>
							<DepositUSDInput>
							~ {formatNumber(collateral[oppositeCollateralCurrency()])} {cryptoCurrencies[oppositeCollateralCurrency()]}
							</DepositUSDInput>
							<DepositFTMSwapImg src={SwapIcon} onClick={handleCollateralChange}/>
						</DepositFTMInputWrapper>
						{
							collateral[turnCollateral] !== '' &&
							<ShowGenerateFUSDButton onClick={handleShowGenerateFUSD}>
								<GenrateFUSDPlusImg src={showGenerateFUSD ? MinusIcon : PlusIcon} />
								Generate fUSD with this transaction
							</ShowGenerateFUSDButton>
						}
						{
							showGenerateFUSD &&
							<GenerateFUSDContainer>
								<GenerateFUSDLabelRow>
									<GenerateFUSDLabel>Generate fUSD</GenerateFUSDLabel>
									<GenerateFUSDMax onClick={() => setGenerateFUSD(afterMaxToMint)}>Max {formatNumber(afterMaxToMint)} fUSD</GenerateFUSDMax>
								</GenerateFUSDLabelRow>
								<GenerateFUSDInputWrapper>
									<GenerateFUSDInput value={generateFUSD} placeholder={formatNumber(maxToMint) + ' fUSD'} onChange={(e) => handleGenerateFUSDChange(e)}>
									</GenerateFUSDInput>
								</GenerateFUSDInputWrapper>
							</GenerateFUSDContainer>
						}
						<GenerateFUSDButton disabled={generateFUSD === '' || generating || parseFloat(generateFUSD) === 0 || parseFloat(generateFUSD) > parseFloat(afterMaxToMint)} onClick={() => handleGenerateFUSD()}>
							{
								generateFUSD === '' ? 'Enter an amount' : 'Generate fUSD'
							}
						</GenerateFUSDButton>
						{
							collateral[turnCollateral] !== '' &&
							<FUSDVaultInfoWrapper>
								<FUSDVaultInfoRow>
									<FUSDVaultInfoLabel>fUSD available</FUSDVaultInfoLabel>
									<FUSDVaultInfo>150.3M fUSD</FUSDVaultInfo>
								</FUSDVaultInfoRow>
								<FUSDVaultInfoRow>
									<FUSDVaultInfoLabel>Min. collateral ratio</FUSDVaultInfoLabel>
									<FUSDVaultInfo>{formatNumber(minCollateralRatio)}%</FUSDVaultInfo>
								</FUSDVaultInfoRow>
								<FUSDVaultInfoRow>
									<FUSDVaultInfoLabel>Stability Fee</FUSDVaultInfoLabel>
									<FUSDVaultInfo>{formatNumber(stabilityFee)}%</FUSDVaultInfo>
								</FUSDVaultInfoRow>
								<FUSDVaultInfoRow>
									<FUSDVaultInfoLabel>Liquidation Fee</FUSDVaultInfoLabel>
									<FUSDVaultInfo>{formatNumber(liquidationFee)}%</FUSDVaultInfo>
								</FUSDVaultInfoRow>
								<FUSDVaultInfoRow>
									<FUSDVaultInfoLabel>Dust Limit</FUSDVaultInfoLabel>
									<FUSDVaultInfo>--</FUSDVaultInfo>
								</FUSDVaultInfoRow>
							</FUSDVaultInfoWrapper>
						}
					</VaultConfigurator>
				</VaultConfigurationWrapper>
			</VaultPageWrapper>

      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modalShow}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StepBar step={activeStep} />
        </Modal.Body>
        <Modal.Footer>
          {
            !progressing && 
            <Button onClick={() => setModalShow(false)}>Cancel</Button>
          }
          <Button variant="primary" onClick={() => goToNextStep()} disabled={progressing}>
            { progressing ? (<ClipLoader color="#EFF3FB" loading={progressing} size={24} />) : 'Submit' }
          </Button>
        </Modal.Footer>
      </Modal>
		</div>
	);
}
  
export default Vault;