import Header from '../../components/Header';
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import FTMIcon from '../../assets/icons/ftm.svg'

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

const PriceCollateralWrapper = styled.div`
display:flex;
flex-direction: row;
`

const CurrentPriceInfo = styled.div`
display:flex;
flex-direction: column;
`

function Vault() {
	const isConnected = useSelector((state) => state.ConnectWallet.isConnected)

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

							</CurrentPriceInfo>
						</PriceInfoWrapper>
					</PriceCollateralWrapper>
				</VaultInfoWrapper>
				<VaultConfigurationWrapper>

				</VaultConfigurationWrapper>
			</VaultPageWrapper>
		</div>
	);
}
  
export default Vault;