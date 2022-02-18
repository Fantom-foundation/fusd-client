import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Header from '../../components/Header';
import { urls } from '../../constants/urls';
import { ethers } from 'ethers';

const AuctionListPageWrapper = styled.div`
  margin: 20px 0;
  margin-top: 100px;

  padding-top: 50px;
`;

const PageBodyText = styled.div`
  font-family: Proxima Nova;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  text-align: center;
  margin-top: 24px;

  /* grey */

  color: #787a9b;
  p {
    margin-bottom: 0;
  }
`;

const OpenAuctionButton = styled.button`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.015em;

  color: #141d30;
  background: #ffffff;
  border-radius: 60px;
  padding: 15px 20px 15px 30px;
  border: none;
  outline: none;
  margin-top: 45px;
`;

const RightArrowImg = styled.img`
  width: 10px;
  height: 10px;
  margin: 10px;
  fill: white;
`;

const AuctionInfoWrapper = styled('ul')`
  border-radius: 28px;
  margin-top: 48px;
  padding-bottom: 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: calc(0.5rem * 3);
  list-style: none;
`;

const AuctionItem = styled.li`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: left;
  padding: 30px;
  box-shadow: 0px 15px 60px #f2f1fa;
  backdrop-filter: blur(40px);
  border-radius: 28px;
  @media screen and (max-width: 576px) {
    border-bottom: 1px solid #F3F2FC;
    &:not(:last-child) {
      border-right: none;
    }
  }
}
`;

const AuctionItemHeader = styled.label`
  cursor: pointer;
  font-weight: bold;
  margin: 10px 0;
`;

const AuctionInfoRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const AuctionInfoTitle = styled.div`
  font-family: Proxima Nova;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;

  /* grey */

  color: #787a9b;
`;

const AuctionInfo = styled.span`
  font-family: Inter;
  font-style: normal;
  font-size: 16px;
  line-height: 19px;

  /* black */

  color: #26283e;
`;

const AssetInfo = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;

  /* black */

  color: #26283e;
`;

const FTMImg = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const ManageAuctionButton = styled.button`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.005em;

  color: #ffffff;

  background: #6764ff;
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
`;

function padZero(number) {
  if (number.toString().length == 1) return '0' + number.toString();
  return number.toString();
}

function AuctionList() {
  //console.log('sdf');
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    axios
      .get(`${urls.auction_api_url}/auctions`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        console.log(response);
        if (response.data !== null) {
          setAuctions(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <Header />
      <AuctionListPageWrapper>
        {auctions.length > 0 ? (
          <AuctionInfoWrapper>
            {auctions.map((auction, index) => (
              <AuctionItem key={index}>
                <AuctionItemHeader>Auction Information</AuctionItemHeader>
                <AuctionInfoRow>
                  <AuctionInfoTitle>Target</AuctionInfoTitle>
                  <AuctionInfo>
                    {/* {auction.blockNumber} */}
                    <span style={{ fontSize: '15px', marginLeft: '15px' }}>
                      {auction.target}
                    </span>
                  </AuctionInfo>
                </AuctionInfoRow>
                <AuctionInfoRow>
                  <AuctionInfoTitle>Remaining Percentage</AuctionInfoTitle>
                  <AuctionInfo>
                    {/* {ethers.utils.parseEther(auction.remainingPercentage)} */}
                    {auction.remainingPercentage.toString() / 10 ** 16}%
                  </AuctionInfo>
                </AuctionInfoRow>
                <AuctionInfoRow>
                  <AuctionInfoTitle>Start Time</AuctionInfoTitle>
                  <AuctionInfo>
                    {/*  {new Date(auction.startTime).getFullYear().toString() +
                      '-' +
                      new Date(auction.startTime).getMonth().toString() +
                      '-' +
                      new Date(auction.startTime).getDate().toString()} */}
                    {new Date(auction.startTime).getUTCFullYear()}-
                    {padZero(new Date(auction.startTime).getUTCMonth() + 1)}-
                    {padZero(new Date(auction.startTime).getUTCDate())}&nbsp;
                    {padZero(new Date(auction.startTime).getUTCHours())}:
                    {padZero(new Date(auction.startTime).getUTCMinutes())}:
                    {padZero(new Date(auction.startTime).getUTCSeconds())}
                  </AuctionInfo>
                </AuctionInfoRow>
              </AuctionItem>
            ))}
          </AuctionInfoWrapper>
        ) : (
          <>
            <h1 className='page-title'>No auctions now.</h1>
            <PageBodyText>
              <p>
                Open a Fantom Auction, deposit your collateral, and generate
                fUSD against it.
              </p>
            </PageBodyText>
          </>
        )}
      </AuctionListPageWrapper>
    </div>
  );
}

export default AuctionList;
