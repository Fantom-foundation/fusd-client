import Header from '../../components/Header';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components'
import FTMIcon from '../../assets/icons/ftm.svg'
import SwapIcon from '../../assets/icons/swap.svg'
import PlusIcon from '../../assets/icons/plus.svg'
import { urls } from '../../constants/urls'
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWFTMContract } from '../../contracts';

const VaultPageWrapper = styled.div`
	margin: 20px 0;
	display: flex;
	flex-direction: row;
`

const VaultInfoWrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex: 9;
	margin-right: 120px;
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
margin-bottom: 16px;
`

const FTMImg = styled.img`
	width: 24px;
	height: 24px;
	margin-right: 8px;
`

const Seperator = styled.div`
	width: 100%;
	border-bottom: 1px solid #787A9B;
	opacity: 0.3;
`

const VaultConfigurationWrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex: 5;
`

const LiquidationCollateralWrapper = styled.div`
	display:flex;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 64px;
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
`

const InfoValue = styled.div`
	font-family: Inter;
	font-style: normal;
	font-weight: bold;
	font-size: 48px;
	line-height: 58px;
	/* identical to box height */


	/* black */

	color: #26283E;
	text-align: left;
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
margin-top: 120px;
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
margin-top: 80px;
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
`

const VaultDetails = styled.div`
border: 1px solid rgba(120, 122, 155, 0.3);
box-sizing: border-box;
border-radius: 8px;
padding: 32px;
margin-top: 16px;
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
	width: 100%;
	border-bottom: 1px solid #787A9B;
	opacity: 0.3;
	margin: 32px 0;
`

const VaultConfigurator = styled.div`
background: #FFFFFF;
box-shadow: 0px 4px 8px rgba(38, 40, 62, 0.1);
border-radius: 8px;
padding: 32px;
padding-bottom: 16px;
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
margin-top: 8px;
`

const DepositFTMTitleWrapper = styled.div`
display: flex;
flex-direction: row;
margin-top: 32px;
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
	margin-top: 8px;
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

const GenerateFUSDButton = styled.div`
cursor: pointer;
font-family: Proxima Nova;
font-style: normal;
font-weight: 600;
font-size: 16px;
line-height: 19px;
margin-top: 25px;
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

const SetupProxyButton = styled.button`
  background: #26283E;
  border-radius: 60px;
  font-family: Proxima Nova;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  /* identical to box height */

  text-align: center;
  padding: 14px 60px;
  margin-top: 24px;
	width: 100%;
  border: none;
  outline: none;

  /* white */

  color: #FFFFFF;
	&:disabled {
		opacity: 0.3;
	}
`

const FUSDVaultInfoWrapper = styled.div`
margin-top: 21px;
padding: 16px;
background: rgba(155, 182, 231, 0.1);
border-radius: 8px;
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

function Vault() {
	const { account, chainId, error } = useWeb3React();
	const [collateral, setCollateral] = useState(['', ''])
	const [balance, setBalance] = useState(0)
	const [turnCollateral, setTurnCollateral] = useState(0)
	const cryptoCurrencies = ['wFTM', 'USD']
	const { price } = useSelector(state => state.Price);
	const { getWFTMBalance, wrapFTM, unwrapFTM } = useWFTMContract();

	const getBalance = async () => {
		let balance = await getWFTMBalance(account)
		setBalance(balance)
	}

	const handleCollateralChange = () => {
		setTurnCollateral(oppositeCollateralCurrency())
	}

	const changeCollateralHandler = (value) => {
		const collateralAmounts = collateral
		let amount = parseFloat(value)
		amount = isNaN(amount) ? '' : amount
		collateralAmounts[turnCollateral] = amount
		collateralAmounts[oppositeCollateralCurrency()] = turnCollateral ? (amount / price) : (amount * price)
		setCollateral([...collateralAmounts])
	}

	const oppositeCollateralCurrency = () => {
		return turnCollateral ? 0 : 1
	}

	const formatValue = (value) => {
		let amount = ethers.utils.formatEther(value, 2);
		amount = parseFloat(amount)
		return amount.toLocaleString('en-US', {
			maximumFractionDigits: 2,
			minimumFractionDigits: 2
		})
	}

	const formatNumber = (value) => {
		let amount = parseFloat(value)
		amount = isNaN(amount) ? 0 : amount;
		return amount.toLocaleString('en-US', {
			maximumFractionDigits: 2,
			minimumFractionDigits: 2
		})
	}
	useEffect(() => {
		getBalance();
		// setTimeout(() => getBalance(), 1000)
	}, [chainId])

	return (
		<div>
			<Header/>
			<VaultPageWrapper>
				<VaultInfoWrapper>
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
						<CollateralizationInfo>
							<InfoLabel>
								Collateralization ratio
							</InfoLabel>
							<InfoValue>
								0.00%
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
								<CollateralNumber>{collateral[0] ? collateral[0] : '--'}</CollateralNumber>
							</CollateralNumberInfo>
							<CollateralPrice>
							${collateral[1] ? formatNumber(collateral[1]) : '--'}
							</CollateralPrice>
						</CollateralWrapper>
					</PriceCollateralWrapper>
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
									150%
									</VaultInfo>
								</VaultDetailsInfoItem>
								<VaultDetailsInfoItem>
									<VaultInfoTitle>
									Stability Fee
									</VaultInfoTitle>
									<VaultInfo>
									2.00%
									</VaultInfo>
								</VaultDetailsInfoItem>
								<VaultDetailsInfoItem>
									<VaultInfoTitle>
									Liquidation Penalty
									</VaultInfoTitle>
									<VaultInfo>
									13%
									</VaultInfo>
								</VaultDetailsInfoItem>
							</VaultDetailsRow>
						</VaultDetails>
					</VaultDetailsWrapper>
				</VaultInfoWrapper>
				<VaultConfigurationWrapper>
					<VaultConfigurator>
						<VaultConfiguratorTitle>Configure your Vault</VaultConfiguratorTitle>
						<VaultConfiguratorDescription>
						Simulate your vault by configuring the amount of collateral to deposit, and fUSD to generate.
						</VaultConfiguratorDescription>
						<DepositFTMTitleWrapper>
							<DepositFTMTitle>Deposit wFTM</DepositFTMTitle>
							<DepositFTMBalance>Balance {formatValue(balance)} wFTM</DepositFTMBalance>
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
							<GenerateFUSDButton>
								<GenrateFUSDPlusImg src={PlusIcon} />
								Generate fUSD with this transaction
							</GenerateFUSDButton>
						}
						<SetupProxyButton disabled={collateral[turnCollateral] === ''}>
							{
								collateral[turnCollateral] === '' ? 'Enter an amount' : 'Setup Proxy'
							}
						</SetupProxyButton>
						{
							collateral[turnCollateral] !== '' &&
							<FUSDVaultInfoWrapper>
								<FUSDVaultInfoRow>
									<FUSDVaultInfoLabel>fUSD available</FUSDVaultInfoLabel>
									<FUSDVaultInfo>150.3M fUSD</FUSDVaultInfo>
								</FUSDVaultInfoRow>
								<FUSDVaultInfoRow>
									<FUSDVaultInfoLabel>Min. collateral ratio</FUSDVaultInfoLabel>
									<FUSDVaultInfo>150%</FUSDVaultInfo>
								</FUSDVaultInfoRow>
								<FUSDVaultInfoRow>
									<FUSDVaultInfoLabel>Stability Fee</FUSDVaultInfoLabel>
									<FUSDVaultInfo>2.00%</FUSDVaultInfo>
								</FUSDVaultInfoRow>
								<FUSDVaultInfoRow>
									<FUSDVaultInfoLabel>Liquidation Fee</FUSDVaultInfoLabel>
									<FUSDVaultInfo>13%</FUSDVaultInfo>
								</FUSDVaultInfoRow>
								<FUSDVaultInfoRow>
									<FUSDVaultInfoLabel>Dust Limit</FUSDVaultInfoLabel>
									<FUSDVaultInfo>1,000.00 fUSD</FUSDVaultInfo>
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