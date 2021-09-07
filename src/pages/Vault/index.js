import Header from '../../components/Header';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components'
import FTMIcon from '../../assets/icons/ftm.svg'
import SwapIcon from '../../assets/icons/swap.svg'
import PlusIcon from '../../assets/icons/plus.svg'
import MinusIcon from '../../assets/icons/minus.svg'
import { urls } from '../../constants/urls'
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWFTMContract, useFMintContract } from '../../contracts';
import { FMINT_CONTRACT_ADDRESS, FUSD_CONTRACT_ADDRESS, WFTM_CONTRACT_ADDRESS } from '../../constants/walletconnection'
import BigNumber from "bignumber.js";

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
		margin-top: 36px;
	}
`

const LiquidationCollateralWrapper = styled.div`
	display:flex;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 32px;
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

const NextPrice = styled.div`
font-family: Proxima Nova;
font-style: normal;
font-weight: 600;
font-size: 16px;
line-height: 19px;

/* grey */

color: #787A9B;
text-align: left;
margin-top: 10px;
`

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

color: #26283E;
margin-left: 4px;
`

const VaultRowSeperator = styled.div`
	border-bottom: 1px solid #F3F2FC;
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
text-align: center;
  padding: 18px 0px;
  margin-top: 36px;
	width: 100%;
  border: none;
  outline: none;

	&:disabled {
		opacity: 0.3;
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

function Vault() {
	const { account, chainId, error } = useWeb3React();
	const [collateral, setCollateral] = useState(['', ''])
	const [balance, setBalance] = useState([0, 0])
	const [turnCollateral, setTurnCollateral] = useState(0)
	const [showGenerateFUSD, setShowGenerateFUSD] = useState(false)
	const [generateFUSD, setGenerateFUSD] = useState('')
	const [generating, setGenerating] = useState(false)
	const cryptoCurrencies = ['wFTM', 'USD']
	const { price } = useSelector(state => state.Price);
	const { getWFTMBalance, increaseAllowance } = useWFTMContract();
	const { mustDeposit, mustMint } = useFMintContract();
	const minCollateralRatio = 300;
	const liquidationRatio = 300;
	const stabilityFee = 0;
	const liquidationFee = 0;

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

	const collateralRatio = () => {
		return generateFUSD === '' ? 0 : collateral[1] * 100 / generateFUSD;
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
		setGenerating(true)
		const decimals = BigNumber('10').pow(18)
		const depositAmount = BigNumber(collateral[0]).multipliedBy(decimals)
		try {
			await increaseAllowance(FMINT_CONTRACT_ADDRESS[chainId], depositAmount.toString());
			await mustDeposit(WFTM_CONTRACT_ADDRESS[chainId], depositAmount.toString());
			const fusdAmount = BigNumber(generateFUSD).multipliedBy(decimals)
			await mustMint(FUSD_CONTRACT_ADDRESS[chainId], fusdAmount.toString());
			initialize()
		} catch (error) {
			setGenerating(false)
			console.log(error)
		}
	}

	const initialize = () => {
		setCollateral(['', ''])
		setTurnCollateral(0)
		setShowGenerateFUSD(false)
		setGenerateFUSD('')
		setGenerating(false)
		getBalance();
	}

	useEffect(() => {
		try {
			getBalance();
		} catch (error) {
			console.log(error)
		}
		// setTimeout(() => getBalance(), 1000)
	}, [chainId, price])

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
									$0.00
								</InfoValue>
							</LiquidationPriceInfo>
							<VerticalSeperator/>
							<CollateralizationInfo>
								<InfoLabel className="text-right">
									Collateralization ratio
								</InfoLabel>
								<InfoValue className={"text-right " + `${collateralStyleClass(collateralRatio())}`}>
									{formatNumber(collateralRatio())}%
								</InfoValue>
							</CollateralizationInfo>
						</LiquidationCollateralWrapper>
						<PriceCollateralWrapper>
							<PriceInfoWrapper>
								<CurrentPriceInfo>
									<InfoLabel>Current FTM/USD price</InfoLabel>
									<CurrentPrice>${formatNumber(price)}</CurrentPrice>
								</CurrentPriceInfo>
								<NextPriceInfo>
									<InfoLabel>Next price in 10 minutes</InfoLabel>
									<NextPrice>$0.24  (0.00%)</NextPrice>
								</NextPriceInfo>
							</PriceInfoWrapper>
							<CollateralWrapper>
								<CollateralNumberInfo>
									<InfoLabel>Collateral locked</InfoLabel>
									<CollateralNumber>{collateral[0] ? formatNumber(collateral[0]) : '--'}</CollateralNumber>
								</CollateralNumberInfo>
								<CollateralPrice>
								${collateral[1] ? formatNumber(collateral[1]) : '--'}
								</CollateralPrice>
							</CollateralWrapper>
						</PriceCollateralWrapper>
					</VaultStatusWrapper>
					<VaultDetailsWrapper>
						<VaultDetailsTitle>
							Vault details
						</VaultDetailsTitle>
						<VaultDetails>
							<VaultRowSeperator/>
							<VaultDetailsRow>
								<VaultDetailsInfoItem>
									<VaultInfoTitle>
										Vault fUSD Debt
									</VaultInfoTitle>
									<VaultInfo>
										0.00
										<VaultUnit>
										fUSD
										</VaultUnit>
									</VaultInfo>
								</VaultDetailsInfoItem>
								<VaultDetailsInfoItem>
									<VaultInfoTitle>
									Available to withdraw
									</VaultInfoTitle>
									<VaultInfo>
									{formatNumber(collateral[0])}
									<VaultUnit>
									wFTM
									</VaultUnit>
									</VaultInfo>
								</VaultDetailsInfoItem>
								<VaultDetailsInfoItem>
									<VaultInfoTitle>
									Available to Generate
									</VaultInfoTitle>
									<VaultInfo>
									{formatNumber(collateral[1] / 1.5)}
									<VaultUnit>
									USD
									</VaultUnit>
									</VaultInfo>
								</VaultDetailsInfoItem>
							</VaultDetailsRow>
							<VaultRowSeperator/>
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
							<DepositFTMBalance>Balance {formatNumber(balance[turnCollateral])} {cryptoCurrencies[turnCollateral]}</DepositFTMBalance>
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
									<GenerateFUSDMax>Max {formatNumber(collateral[1] * 100 / minCollateralRatio)} fUSD</GenerateFUSDMax>
								</GenerateFUSDLabelRow>
								<GenerateFUSDInputWrapper>
									<GenerateFUSDInput value={generateFUSD} placeholder={formatNumber(collateral[1] * 100 / minCollateralRatio) + ' fUSD'} onChange={(e) => handleGenerateFUSDChange(e)}>
									</GenerateFUSDInput>
								</GenerateFUSDInputWrapper>
							</GenerateFUSDContainer>
						}
						<GenerateFUSDButton disabled={generateFUSD === '' || generating} onClick={() => handleGenerateFUSD()}>
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
		</div>
	);
}
  
export default Vault;