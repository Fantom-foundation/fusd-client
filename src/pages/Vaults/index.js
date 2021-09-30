import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ethers } from 'ethers'
import styled from 'styled-components'
import Header from '../../components/Header';
import RightArrowIcon from '../../assets/icons/right_arrow.svg'
import FTMIcon from '../../assets/icons/ftm.svg'
import { useFMintContract } from '../../contracts';
import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { formatBalance, formatBigNumber } from '../../utils'
import BigNumber from "bignumber.js";

const VaultsPageWrapper = styled.div`
	margin: 20px 0;
  margin-top: 100px;
`

const PageBodyText = styled.div`
  font-family: Proxima Nova;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  text-align: center;
  margin-top: 24px;

  /* grey */

  color: #787A9B;
  p {
    margin-bottom: 0;
  }
`

const OpenVaultButton = styled.button`
font-family: Inter;
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 19px;
letter-spacing: -0.015em;

color: #141D30;
background: #FFFFFF;
border-radius: 60px;
padding: 15px 20px 15px 30px;
border: none;
outline: none;
margin-top: 45px;
`

const RightArrowImg = styled.img`
  width: 10px;
  height: 10px;
  margin: 10px;
  fill: white;
`

const VaultInfoWrapper = styled('div')`
background: #FFFFFF;
box-shadow: 0px 15px 60px #F2F1FA;
border-radius: 28px;
margin-top: 48px;
padding-bottom: 24px;
`

const VaultInfoRow = styled.div`
display: grid;
grid-template-columns: repeat(4, 1fr);
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
@media screen and (max-width: 576px) {
	border-bottom: 1px solid #F3F2FC;
	&:not(:last-child) {
		border-right: none;
	}
}
`

const AssetInfoItem = styled.div`
display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: center;
text-align: left;
padding: 30px;
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

const AssetInfo = styled.span`
font-family: Inter;
font-style: normal;
font-weight: bold;
font-size: 16px;
line-height: 19px;

/* black */

color: #26283E;
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

const FTMImg = styled.img`
	width: 24px;
	height: 24px;
	margin-right: 8px;
`

const ManageVaultButton = styled.button`
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
  margin-left: auto;
  margin-right: auto;
	width: 100%;
  max-width: 200px;
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

function Vaults() {
  let history = useHistory()
  const { account } = useWeb3React();
  const { collateral } = useSelector(state => state.Vault);
  const { price } = useSelector(state => state.Price);
  const { getDebtValue, getMinCollateralRatio } = useFMintContract();

  const [collateralRatio, setCollateralRatio] = useState('');
  const [debt, setDebt] = useState('');
  const [liquidationPrice, setLiquidationPrice] = useState('');

  const getValutInfo = async () => {
    const dbt = await getDebtValue(account);
    setDebt(formatBigNumber(dbt));
    const cr = new BigNumber(price * 100).multipliedBy(new BigNumber(collateral)).dividedBy(new BigNumber(ethers.utils.formatEther(dbt)));
    setCollateralRatio(formatBalance(cr.toString()));

    let minCollateralRatio = await getMinCollateralRatio();
    minCollateralRatio = new BigNumber(minCollateralRatio / 100)
    let liquidationPrice = new BigNumber(ethers.utils.formatEther(dbt)).dividedBy(minCollateralRatio).dividedBy(new BigNumber(collateral));
    setLiquidationPrice(formatBalance(liquidationPrice.toString()));
  }

  useEffect(() => {
    getValutInfo();
  }, [price, collateral, debt]);

	return (
		<div>
			<Header/>
			<VaultsPageWrapper>
        {
          collateral !== undefined && collateral !== '0' ?
          <>
            <h1 className="page-title">My Vault</h1>
            <VaultInfoWrapper>
              <VaultInfoRow>
                <VaultDetailsInfoItem>
                  <VaultInfoTitle>
                    Liquidation Price
                  </VaultInfoTitle>
                  <VaultInfo>
                    ${liquidationPrice}
                  </VaultInfo>
                </VaultDetailsInfoItem>
                <VaultDetailsInfoItem>
                  <VaultInfoTitle>
                    Collateral Ratio
                  </VaultInfoTitle>
                  <VaultInfo>
                    {collateralRatio}%
                  </VaultInfo>
                </VaultDetailsInfoItem>
                <VaultDetailsInfoItem>
                  <VaultInfoTitle>
                    Collateral Locked
                  </VaultInfoTitle>
                  <VaultInfo>
                    {formatBalance(collateral)} WFTM
                  </VaultInfo>
                </VaultDetailsInfoItem>
                <VaultDetailsInfoItem>
                  <VaultInfoTitle>
                    fUSD Debt
                  </VaultInfoTitle>
                  <VaultInfo>
                    {debt} FUSD
                  </VaultInfo>
                </VaultDetailsInfoItem>
              </VaultInfoRow>
              <VaultInfoRow>
                <AssetInfoItem>
                  <FTMImg src={FTMIcon} />
                  <AssetInfo>WFTM</AssetInfo>
                </AssetInfoItem>
              </VaultInfoRow>
              <ManageVaultButton onClick={() => history.push("/vault")}>
                Manage Vault
              </ManageVaultButton>
            </VaultInfoWrapper>
          </>
          :
          <>
            <h1 className="page-title">You have no open Vaults</h1>
            <PageBodyText>
              <p>Open a Fantom Vault, deposit your collateral, and generate fUSD against it.</p>
            </PageBodyText>
            <OpenVaultButton onClick={() => history.push("/vault")}>
              Open a vault
              <RightArrowImg src={RightArrowIcon}></RightArrowImg>
            </OpenVaultButton>
          </>
        }
			</VaultsPageWrapper>
		</div>
	);
}
  
export default Vaults;