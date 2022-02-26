import { useCallback } from 'react';
import { ethers } from 'ethers';

import { useWeb3React } from '@web3-react/core';
import { LiquidationManager_ABI } from './abi';
import { LIQUIDATION_MANAGER_CONTRACT_ADDRESS } from '../constants/walletconnection';

export const useLiquidationManagerContract = () => {
  const { chainId } = useWeb3React();

  const liquidationManagerProxyAddress = useCallback(
    () => LIQUIDATION_MANAGER_CONTRACT_ADDRESS[chainId],
    [chainId]
  );

  const getLiquidationManagerContract = async () => {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      liquidationManagerProxyAddress(),
      LiquidationManager_ABI,
      signer
    );

    return contract;
  };

  const bidAuction = async (nonce, percentage, initiatorBonus) => {
    const contract = await getLiquidationManagerContract();
    const tx = await contract.bid(nonce, percentage, {
      value: ethers.utils.parseEther(initiatorBonus.toString()),
    });
    await tx.wait();
  };

  return {
    bidAuction,
  };
};
