import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Header from '../../components/Header';
import { urls } from '../../constants/urls';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import ClipLoader from 'react-spinners/ClipLoader';

import { ethers } from 'ethers';
import {
  useLiquidationManagerContract,
  useFUSDContract
} from '../../contracts';
import StepBar from '../../components/StepBar';
import { LIQUIDATION_MANAGER_CONTRACT_ADDRESS } from '../../constants/walletconnection';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { formatBigNumber } from '../../utils';

let justBids = [];
let reload = false;

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

const WrapBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  &.reverse-direction {
    flex-direction: column-reverse;
  }
`;

const WrapBoxRow = styled.div`
  display: flex;
  flex-direction: column;
`;

const WrapBoxLabel = styled.label`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;

  /* identical to box height */

  color: #141d30;
  margin-left: 10px;
`;

const WrapBoxInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid #f3f2fc;
  box-sizing: border-box;
  border-radius: 14px;
  padding: 0 20px;
  margin-top: 10px;
  align-items: center;
`;

const WrapBoxAmountInputWrapper = styled.div`
  padding: 20px;
  display: flex;
  flex: 1 1 auto;
  border-right: 1px solid #f3f2fc;
`;

const WrapBoxAmountInput = styled.input`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 29px;

  /* identical to box height */
  letter-spacing: -0.01em;

  color: #25273d;
  border: none;
  outline: none;
  text-align: right;
  width: 50px;
  flex: 1 1 auto;
`;

const WrapBoxInputMax = styled.div`
  color: #6764ff;
  cursor: pointer;
`;

const WrapButton = styled.button`
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
  margin-top: 36px;
  width: 100%;
  border: none;
  outline: none;

  &:disabled {
    opacity: 0.3;
  }
`;

function padZero(number) {
  if (number.toString().length == 1) return '0' + number.toString();
  return number.toString();
}

function AuctionList() {
  const [auctions, setAuctions] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalShow2, setModalShow2] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [progressing, setProgressing] = useState(false);
  const [nonceToBid, setNonceToBid] = useState(0);
  const [maxPercentageToBid, setMaxPercentageToBid] = useState(0);
  const [percentageToBid, setPercentageToBid] = useState(0);
  const [initiatorBonusToBid, setInitiatorBonusToBid] = useState(0);
  const [maxDebtValue, setMaxDebtValue] = useState(0);

  const { account, chainId } = useWeb3React();

  const { bidAuction } = useLiquidationManagerContract();
  const { approve, getFUSDBalance } = useFUSDContract();

  const getAuctions = async () => {
    console.log('Getting auctions...');
    if (reload) {
      reload = false;
      window.location.reload();
    } else {
      axios
        .get(`${urls.auction_api_url}/new-auctions`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(function (response) {
          if (response.data !== null) {
            justBids = [];
            for (const auction of response.data) {
              justBids.push({ nonce: auction.nonce, bid: false });
            }
            setAuctions(response.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const getAuctionsRegularly = () => {
    const interval = 1 * 60 * 1000;
    getAuctions();
    setInterval(getAuctions, interval);
  };

  const openBidDialog = async (
    nonce,
    maxPercentage,
    maxDebtValue,
    initiatorBonus
  ) => {
    const fUSDBalance = await getFUSDBalance(account);
    if (formatBigNumber(fUSDBalance) * 1 === 0) {
      toast.warning(`You don't have enough FUSD to buy the auction.`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined
      });
      return;
    }
    setPercentageToBid(0);
    setNonceToBid(nonce);
    setMaxPercentageToBid(maxPercentage);
    setMaxDebtValue(maxDebtValue);
    setInitiatorBonusToBid(initiatorBonus);
    setModalShow(true);
  };

  const goToNextStep = async (percentage) => {
    setProgressing(true);
    let currentStep = activeStep;
    try {
      if (activeStep === 1) {
        const fUSDBalance = formatBigNumber(await getFUSDBalance(account));
        const amountToApprove =
          (percentage / maxPercentageToBid) * maxDebtValue + 0.01;
        if (fUSDBalance * 1 >= amountToApprove * 1) {
          await approve(
            LIQUIDATION_MANAGER_CONTRACT_ADDRESS[chainId],
            ethers.utils.parseEther(amountToApprove.toString())
          );
          currentStep++;
        } else {
          toast.warning(`You don't have enough FUSD to buy the auction.`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined
          });
        }
        setProgressing(false);
        setActiveStep(currentStep);
      }

      if (activeStep == 2) {
        percentage = BigNumber(percentage.toString()).multipliedBy(
          BigNumber('10').pow(16)
        );
        await bidAuction(
          nonceToBid,
          percentage.toString(),
          initiatorBonusToBid
        );
        var jb = justBids.find((obj) => {
          return obj.nonce == nonceToBid;
        });
        jb.bid = true;
        reload = true;
        setProgressing(false);
        setModalShow2(false);
      }
    } catch (err) {
      console.log(err);
      setProgressing(false);
      setModalShow2(false);
    }
  };
  useEffect(() => {
    getAuctionsRegularly();
  }, []);

  return (
    <div>
      <Header />
      <AuctionListPageWrapper>
        {auctions.length > 0 ? (
          <AuctionInfoWrapper>
            {auctions.map((auction, index) => (
              <AuctionItem
                key={index}
                disabled={true}
                onClick={(e) => {
                  var jb = justBids.find((obj) => {
                    return obj.nonce == auction.nonce;
                  });
                  if (jb.bid) {
                    toast.warning(
                      `You just bid this auction. Please wait a little bit before bidding the same auction again.`,
                      {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined
                      }
                    );
                  } else {
                    openBidDialog(
                      auction.nonce,
                      auction.remainingPercentage.toString() / 10 ** 16,
                      (auction.debtValue[0].toString() / 10 ** 18).toFixed(2),
                      (auction.initiatorBonus.toString() / 10 ** 18).toFixed(2)
                    );
                  }
                }}
              >
                <AuctionItemHeader>Auction Information</AuctionItemHeader>
                <AuctionInfoRow>
                  <AuctionInfoTitle>ID</AuctionInfoTitle>
                  <AuctionInfo>
                    <span style={{ fontSize: '15px', marginLeft: '15px' }}>
                      {auction.nonce}
                    </span>
                  </AuctionInfo>
                </AuctionInfoRow>
                <AuctionInfoRow>
                  <AuctionInfoTitle>Start Time</AuctionInfoTitle>
                  <AuctionInfo>
                    {new Date(auction.startTime).getUTCFullYear()}-
                    {padZero(new Date(auction.startTime).getUTCMonth() + 1)}-
                    {padZero(new Date(auction.startTime).getUTCDate())}&nbsp;
                    {padZero(new Date(auction.startTime).getUTCHours())}:
                    {padZero(new Date(auction.startTime).getUTCMinutes())}:
                    {padZero(new Date(auction.startTime).getUTCSeconds())}
                  </AuctionInfo>
                </AuctionInfoRow>
                <AuctionInfoRow>
                  <AuctionInfoTitle>Remaining Percentage</AuctionInfoTitle>
                  <AuctionInfo>
                    {auction.remainingPercentage.toString() / 10 ** 16}%
                  </AuctionInfo>
                </AuctionInfoRow>
                <AuctionInfoRow>
                  <AuctionInfoTitle>Offering Ratio</AuctionInfoTitle>
                  <AuctionInfo>
                    {(auction.offeringRatio.toString() / 10 ** 16).toFixed(2)}%
                  </AuctionInfo>
                </AuctionInfoRow>
                <AuctionInfoRow>
                  <AuctionInfoTitle>Initiator Bonus (FTM)</AuctionInfoTitle>
                  <AuctionInfo>
                    {(auction.initiatorBonus.toString() / 10 ** 18).toFixed(2)}
                  </AuctionInfo>
                </AuctionInfoRow>
                <AuctionInfoRow>
                  <AuctionInfoTitle>Collateral Value (WFTM)</AuctionInfoTitle>
                  <AuctionInfo>
                    {(auction.collateralValue[0].toString() / 10 ** 18).toFixed(
                      2
                    )}
                  </AuctionInfo>
                </AuctionInfoRow>
                <AuctionInfoRow>
                  <AuctionInfoTitle>Debt Value (FUSD)</AuctionInfoTitle>
                  <AuctionInfo>
                    {(auction.debtValue[0].toString() / 10 ** 18).toFixed(2)}
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
        <Modal
          size='md'
          aria-labelledby='contained-modal-title-vcenter'
          centered
          show={modalShow}
          onHide={() => setModalShow(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              Bid Percentage
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <WrapBoxWrapper className={'reverse-direction'}>
              <WrapBoxRow>
                <WrapBoxLabel>Bid Percentage (%)</WrapBoxLabel>
                <WrapBoxInputWrapper>
                  <WrapBoxAmountInputWrapper>
                    <WrapBoxInputMax
                      onClick={() => {
                        setPercentageToBid(maxPercentageToBid);
                      }}
                    >
                      (Max {maxPercentageToBid}%)
                    </WrapBoxInputMax>
                    <WrapBoxAmountInput
                      placeholder='0'
                      value={percentageToBid}
                      onChange={(e) => setPercentageToBid(e.target.value)}
                    />
                  </WrapBoxAmountInputWrapper>
                  <div style={{ marginLeft: '0.9rem' }}>%</div>
                </WrapBoxInputWrapper>
              </WrapBoxRow>
            </WrapBoxWrapper>
            <WrapBoxRow>
              <WrapButton
                disabled={
                  percentageToBid <= 0 || percentageToBid > maxPercentageToBid
                }
                onClick={(e) => {
                  setActiveStep(1);
                  setModalShow(false);
                  setModalShow2(true);
                }}
              >
                Place Bid
              </WrapButton>
            </WrapBoxRow>
          </Modal.Body>
        </Modal>
        <Modal
          size='md'
          aria-labelledby='contained-modal-title-vcenter'
          centered
          show={modalShow2}
          onHide={() => setModalShow2(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <StepBar step={activeStep} steps={[1, 2]} />
          </Modal.Body>
          <Modal.Footer>
            {!progressing && (
              <Button onClick={() => setModalShow2(false)}>Cancel</Button>
            )}
            <Button
              variant='primary'
              onClick={() => goToNextStep(percentageToBid)}
              disabled={progressing}
            >
              {progressing ? (
                <ClipLoader color='#EFF3FB' loading={progressing} size={24} />
              ) : (
                'Submit'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </AuctionListPageWrapper>
    </div>
  );
}

export default AuctionList;
