import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ethers } from 'ethers'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import WalletConnectActions from '../../actions/walletconnect.actions'
import { DestNet } from '../../constants/walletconnection'
import { SUPPORTED_WALLETS } from '../../constants/wallet';
import './style.css'


function Connect() {
  const { activate, active, connector, error, deactivate } = useWeb3React();
	const dispatch = useDispatch()
  const history = useHistory()

  const Option = ({ onClick = null, header, icon, active = false }) => {
    return (
      <div
        onClick={onClick}
      >
        <div>{header}</div>
        <img src={icon}/>
      </div>
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
console.log(error)
	return (
		<div>
			<h1 className="page-title">Connect a wallet</h1>
			<div className="wallets-container">
        {getOptions()}
			</div>
		</div>
	);
}
  
export default Connect;
  