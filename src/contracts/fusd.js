import { useCallback } from 'react';
import { ethers } from 'ethers';

import { useWeb3React } from '@web3-react/core';
import { FUSD_ABI } from './abi';
import { FUSD_CONTRACT_ADDRESS } from '../constants/walletconnection'

export const useFUSDContract = () => {
  const { chainId } = useWeb3React();

  const fusdAddress = useCallback(() => FUSD_CONTRACT_ADDRESS[chainId], [chainId]);

  const getFUSDContract = async () => {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(fusdAddress(), FUSD_ABI, signer);

    return contract;
  };

  const getFUSDBalance = async address => {
    const contract = await getFUSDContract();
    return await contract.balanceOf(address);
  };

  const getAllowance = async (owner, spender) => {
    const contract = await getFUSDContract();
    return await contract.allowance(owner, spender);
  };

  const approve = async (address, value) => {
    const contract = await getFUSDContract();
    const tx = await contract.approve(address, value);
    await tx.wait();
  };

  const increaseFUSDAllowance = async (address, value) => {
    const contract = await getFUSDContract();
    const tx = await contract.increaseAllowance(address, value);
    await tx.wait();
    return tx;
  };

  return {
    fusdAddress,
    getFUSDBalance,
    getAllowance,
    approve,
    increaseFUSDAllowance,
  };
};
