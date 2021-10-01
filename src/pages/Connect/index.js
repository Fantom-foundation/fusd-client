import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import styled from 'styled-components'
import { SUPPORTED_WALLETS } from '../../constants/wallet';
import './style.css'

const ConnectPageContentWrapper = styled.div`
background: rgba(255, 255, 255, 0.4);
backdrop-filter: blur(40px);

/* Note: backdrop-filter has minimal browser support */
border-radius: 36px;
padding: 150px 170px;
margin-top: 100px;
`

const ConnectOption = styled.div`
background-color: white;
  border-radius: 16px;
  border-width: 1px;
  border-style: solid;
  border-color: #D1DEE6;
  cursor: pointer;
  text-align: center;
  display: flex;
  padding: 16px;
  margin: 8px;
`

function Connect() {
  const { activate, active, connector, error, deactivate } = useWeb3React();
  const history = useHistory()

  const Option = ({ onClick = null, header, icon, active = false }) => {
    return (
      <ConnectOption
        onClick={onClick}
      >
        <div>{header}</div>
        <img src={icon}/>
      </ConnectOption>
    );
  };

  const getOptions = () => {
    return Object.keys(SUPPORTED_WALLETS).map(key => {
      const option = SUPPORTED_WALLETS[key];

      return (
        <Option
          onClick={() => {
            return option.connector === connector
              ? null
              : tryActivation(option.connector);
          }}
          key={key}
          active={option.connector === connector}
          header={option.name}
          icon={option.icon}
        />
      );
    });
  };

  const tryActivation = async connector => {
    let conn = typeof connector === 'function' ? await connector() : connector;

    Object.keys(SUPPORTED_WALLETS).map(key => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return SUPPORTED_WALLETS[key].name;
      }
      return true;
    });

    conn &&
      activate(conn).catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(conn); // a little janky...can't use setError because the connector isn't set
        }
      });
      
  };

  useEffect(() => {
    if (active === true) {
      history.push('/')
    }
  }, [active])

	return (
		<div>
      <ConnectPageContentWrapper>
        <h1 className="page-title">Connect a wallet</h1>
        <div className="wallets-container">
          {getOptions()}
        </div>
      </ConnectPageContentWrapper>
		</div>
	);
}
  
export default Connect;
  