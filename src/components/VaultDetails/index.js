import React from 'react';
import styled from 'styled-components'
import { formatBalance, compareBN, formatNumber } from '../../utils';

const VaultDetailsWrapper = styled.div`
display:flex;
flex-direction: column;
margin-top: 24px;
background: #FFFFFF;
box-shadow: 0px 15px 60px #F2F1FA;
border-radius: 28px;
`

const VaultDetailsInfoWrapper = styled.div``

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

function VaultDetails(props) {
  const { actualDebt, afterDebt, maxToWithdraw, afterMaxToWithdraw, maxToMint, afterMaxToMint, liquidationRatio, stabilityFee, liquidationFee } = props;
  
  return (
    <VaultDetailsWrapper>
      <VaultDetailsTitle>
        Vault details
      </VaultDetailsTitle>
      <VaultDetailsInfoWrapper>
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
      </VaultDetailsInfoWrapper>
    </VaultDetailsWrapper>
  );
}

export default VaultDetails;
