import { useCallback } from 'react';
import { ethers } from 'ethers';

import { useWeb3React } from '@web3-react/core';
import { FMint_ABI } from './abi';
import { useWFTMContract } from './wftm'
import { FMINT_CONTRACT_ADDRESS } from '../constants/walletconnection'

export const useFMintContract = () => {
  const { chainId } = useWeb3React();
  const { wftmAddress } = useWFTMContract();

  const fusdAddress = useCallback(() => FMINT_CONTRACT_ADDRESS[chainId], [chainId]);

  const getFMintContract = async () => {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(fusdAddress(), FMint_ABI, signer);

    return contract;
  };

  const getFMintBalance = async address => {
    const contract = await getFMintContract();
    return await contract.balanceOf(address);
  };

  const mustDeposit = async (address, value) => {
    const contract = await getFMintContract();
    const tx = await contract.mustDeposit(address, value);
    await tx.wait();
  };

  const mustMint = async (address, value) => {
    const contract = await getFMintContract();
    const tx = await contract.mustMint(address, value);
    await tx.wait();
  };

  const getCollateralValue = async (address) => {
    const contract = await getFMintContract();
    const balance = await contract.collateralValueOf(address, wftmAddress(), 0);
    return balance;
  }

  return {
    fusdAddress,
    getFMintBalance,
    mustDeposit,
    mustMint,
    getCollateralValue,
  };
};
