import React from 'react';
import { useSelector } from 'react-redux'
import { formatBalance, compareBN, formatNumber } from '../../utils';
import styled from 'styled-components'
import FTMIcon from '../../assets/icons/ftm.svg'

const VaultStatusWrapper = styled.div`
background: #FFFFFF;
box-shadow: 0px 15px 60px #F2F1FA;
border-radius: 28px;
padding: 30px;
padding-bottom: 60px;
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

const VerticalSeperator = styled.div`
margin-top: 35px;
border-left: 1px solid #F3F2FC;
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

const Seperator = styled.div`
	border-bottom: 1px solid #F3F2FC;
	margin-left: -30px;
	margin-right: -30px;
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

function VaultOverview(props) {
  const { price } = useSelector(state => state.Price);
  const { actualLiquidationPrice, afterLiquidationPrice, actualCollateralRatio, afterCollateralRatio, actualCollateralLocked, afterCollateralLocked } = props;
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

  const getCollateralLockedPrice = () => {
    return afterCollateralLocked * price
  }

	return (
		<div>
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
		</div>
	);
}
  
export default VaultOverview;
  