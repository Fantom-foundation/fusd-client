import Header from '../../components/Header';
import { useHistory } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components'
import RightArrowIcon from '../../assets/icons/right_arrow.svg'

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

const ConnectWalletButton = styled.button`
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

const HomePageContentWrapper = styled.div`
background: rgba(255, 255, 255, 0.4);
backdrop-filter: blur(40px);

/* Note: backdrop-filter has minimal browser support */
border-radius: 36px;
padding: 150px 170px;
margin-top: 100px;

@media screen and (max-width: 768px) {
  padding: 50px 70px;
}
@media screen and (max-width: 576px) {
  padding: 25px 35px;
}
`

function Home() {
  let history = useHistory()
  const { active } = useWeb3React();

  return (
      <div>
        <Header/>
        <HomePageContentWrapper>
          <h1 className="page-title">Generate fUSD using FTM as a collateral</h1>
          <PageBodyText>
            <p>Open a Fantom Vault, deposit your collateral, and generate fUSD against it.</p>
            <p>Connect a wallet to start.</p>
          </PageBodyText>
          {
            active ? 
              <ConnectWalletButton onClick={() => history.push("/vault")}>
                Open a vault
                <RightArrowImg src={RightArrowIcon}></RightArrowImg>
              </ConnectWalletButton> :
              <ConnectWalletButton onClick={() => history.push("/connect")}>
                Connect wallet
                <RightArrowImg src={RightArrowIcon}></RightArrowImg>
              </ConnectWalletButton>
          }
        </HomePageContentWrapper>
      </div>
  );
}

export default Home;
