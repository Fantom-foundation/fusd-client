import Header from '../../components/Header';
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import RightArrowIcon from '../../assets/icons/right_arrow_white.svg'

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
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 64px;
  border: none;
  outline: none;

  /* white */

  color: #FFFFFF;
`

const RightArrowImg = styled.img`
  width: 10px;
  height: 10px;
  margin: 10px;
  fill: white;
`

function Home() {
  let history = useHistory()
  const isConnected = useSelector((state) => state.ConnectWallet.isConnected)

  return (
      <div>
        <Header/>
        <h1 className="page-title">Generate fUSD using FTM as a collateral</h1>
        <PageBodyText>
          <p>Open a Fantom Vault, deposit your collateral, and generate fUSD against it.</p>
          <p>Connect a wallet to start.</p>
        </PageBodyText>
        {
          isConnected ? 
            <ConnectWalletButton onClick={() => history.push("/vault")}>
              Open a vault
              <RightArrowImg src={RightArrowIcon}></RightArrowImg>
            </ConnectWalletButton> :
            <ConnectWalletButton onClick={() => history.push("/connect")}>
              Connect wallet
              <RightArrowImg src={RightArrowIcon}></RightArrowImg>
            </ConnectWalletButton>
        }
      </div>
  );
}

export default Home;
