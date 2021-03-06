import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { NetworkContextName } from '../../constants';
import { network } from '../../connectors';
import useEagerConnect from '../../hooks/useEagerConnect';
import useInactiveListener from '../../hooks/useInactiveListener';
import { DestNet } from '../../constants/walletconnection'

export default function Web3ReactManager({ children }) {
  const { active, chainId } = useWeb3React();
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React(NetworkContextName);

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network);
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active]);

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager);

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null;
  }

  if (chainId !== undefined && chainId !== DestNet.ChainID) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-blue">
          {`Please connect to the fantom testnet`}
        </div>
      </div>
    );
  }

  return children;
}
