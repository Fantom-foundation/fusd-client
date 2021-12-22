import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../../components/Header';
import RightArrowIcon from '../../assets/icons/right_arrow.svg'
import FTMIcon from '../../assets/icons/ftm.svg'
import { formatBalance } from '../../utils'
import useAuctionInfo from '../../hooks/useAuctionInfo'

const AuctionListPageWrapper = styled.div`
	margin: 20px 0;
  margin-top: 100px;
  background: #FFFFFF;
  box-shadow: 0px 15px 60px #f2f1fa;
  backdrop-filter: blur(40px);
  border-radius: 36px;
  padding-top: 50px;
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

const OpenAuctionButton = styled.button`
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

const AuctionInfoWrapper = styled('div')`
border-radius: 28px;
margin-top: 48px;
padding-bottom: 24px;
`

const AuctionInfoRow = styled.div`
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
const AuctionDetailsInfoItem = styled.div`
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

const AuctionInfoTitle = styled.div`
font-family: Proxima Nova;
font-style: normal;
font-weight: normal;
font-size: 16px;
line-height: 19px;

/* grey */

color: #787A9B;
`

const AuctionInfo = styled.span`
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

const FTMImg = styled.img`
	width: 24px;
	height: 24px;
	margin-right: 8px;
`

const ManageAuctionButton = styled.button`
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

function AuctionList() {
  let history = useHistory()
  const vaultInfo = useAuctionInfo();
  const collateralRatio = formatBalance(vaultInfo.collateralRatio);
  const collateral = formatBalance(vaultInfo.collateral);
  const liquidationPrice = formatBalance(vaultInfo.liquidationPrice);
  const debt = formatBalance(vaultInfo.debt);

	return (
		<div>
			<Header/>
			<AuctionListPageWrapper>
        {
          collateral !== undefined && collateral !== '0' ?
          <>
            <h1 className="page-title">My Auction</h1>
            <AuctionInfoWrapper>
              <AuctionInfoRow>
                <AuctionDetailsInfoItem>
                  <AuctionInfoTitle>
                    Liquidation Price
                  </AuctionInfoTitle>
                  <AuctionInfo>
                    ${liquidationPrice}
                  </AuctionInfo>
                </AuctionDetailsInfoItem>
                <AuctionDetailsInfoItem>
                  <AuctionInfoTitle>
                    Collateral Ratio
                  </AuctionInfoTitle>
                  <AuctionInfo>
                    {collateralRatio}%
                  </AuctionInfo>
                </AuctionDetailsInfoItem>
                <AuctionDetailsInfoItem>
                  <AuctionInfoTitle>
                    Collateral Locked
                  </AuctionInfoTitle>
                  <AuctionInfo>
                    {formatBalance(collateral)} WFTM
                  </AuctionInfo>
                </AuctionDetailsInfoItem>
                <AuctionDetailsInfoItem>
                  <AuctionInfoTitle>
                    fUSD Debt
                  </AuctionInfoTitle>
                  <AuctionInfo>
                    {debt} FUSD
                  </AuctionInfo>
                </AuctionDetailsInfoItem>
              </AuctionInfoRow>
              <AuctionInfoRow>
                <AssetInfoItem>
                  <FTMImg src={FTMIcon} />
                  <AssetInfo>WFTM</AssetInfo>
                </AssetInfoItem>
              </AuctionInfoRow>
              <ManageAuctionButton onClick={() => history.push("/vault")}>
                Manage Auction
              </ManageAuctionButton>
            </AuctionInfoWrapper>
          </>
          :
          <>
            <h1 className="page-title">You have no open AuctionList</h1>
            <PageBodyText>
              <p>Open a Fantom Auction, deposit your collateral, and generate fUSD against it.</p>
            </PageBodyText>
            <OpenAuctionButton onClick={() => history.push("/vault")}>
              Open a vault
              <RightArrowImg src={RightArrowIcon}></RightArrowImg>
            </OpenAuctionButton>
          </>
        }
			</AuctionListPageWrapper>
		</div>
	);
}
  
export default AuctionList;