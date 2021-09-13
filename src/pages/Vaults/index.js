import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../../components/Header';
import RightArrowIcon from '../../assets/icons/right_arrow.svg'

const VaultsPageWrapper = styled.div`
	margin: 20px 0;
  margin-top: 180px;
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

function Vaults() {
  let history = useHistory()
	return (
		<div>
			<Header/>
			<VaultsPageWrapper>
          <h1 className="page-title">You have no open Vaults</h1>
          <PageBodyText>
            <p>Open a Fantom Vault, deposit your collateral, and generate fUSD against it.</p>
          </PageBodyText>
          <OpenVaultButton onClick={() => history.push("/vault")}>
            Open a vault
            <RightArrowImg src={RightArrowIcon}></RightArrowImg>
          </OpenVaultButton>
			</VaultsPageWrapper>
		</div>
	);
}
  
export default Vaults;