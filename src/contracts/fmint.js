import { useCallback } from 'react';
import { ethers } from 'ethers';

import { useWeb3React } from '@web3-react/core';
import { FMint_ABI, POOL_ABI } from './abi';
import { useWFTMContract } from './wftm'
import { useFUSDContract } from './fusd';
import { FMINT_CONTRACT_ADDRESS } from '../constants/walletconnection'

export const useFMintContract = () => {
  const { chainId } = useWeb3React();
  const { wftmAddress } = useWFTMContract();
  const { fusdAddress } = useFUSDContract();

  const fmintAddress = useCallback(() => FMINT_CONTRACT_ADDRESS[chainId], [chainId]);

  const getFMintContract = async () => {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(fmintAddress(), FMint_ABI, signer);

    return contract;
  };

  const getCollateralPoolContract = async () => {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const fmint = await getFMintContract();
    const addr = await fmint.getCollateralPool();
    const contract = new ethers.Contract(addr, POOL_ABI, signer);
    return contract;
  };

  const getDebtPoolContract = async () => {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const fmint = await getFMintContract();
    const addr = await fmint.getDebtPool();
    const contract = new ethers.Contract(addr, POOL_ABI, signer);
    return contract;
  };

  const getFMintReader = async () => {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(fmintAddress(), FMint_ABI, provider);

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
    try {
      const contract = await getFMintContract();
      const collateral = await contract.collateralValueOf(address, wftmAddress(), 0);
      return collateral;
    } catch (e) {
      console.log(e)
      return 0;
    }
  }

  const getCollateralBalance = async (address) => {
    try {
      const contract = await getCollateralPoolContract();
      const collateral = contract.balanceOf(address, wftmAddress());
      return collateral;
    } catch (e) {
      console.log(e)
      return 0;
    }
  }

  const getMinCollateralRatio = async () => {
    const contract = await getFMintContract();
    const collateralRatio = await contract.getCollateralLowestDebtRatio4dec();
    return Math.round(collateralRatio / 100);
  }

  const getDebtValue = async (address) => {
    const contract = await getFMintContract();
    const debt = await contract.debtValueOf(address, wftmAddress(), 0);
    return debt;
  }

  const getDebtBalance = async (address) => {
    try {
      const contract = await getDebtPoolContract();
      const debt = contract.balanceOf(address, fusdAddress());
      return debt;
    } catch (e) {
      console.log(e)
      return 0;
    }
  }

  const getMaxToWithdraw = async (address) => {
    const contract = await getFMintContract();
    const max = await contract.getMaxToWithdraw(address, wftmAddress(), 30000);
    return max;
  }

  const getMaxToWithdrawWithChanges = async (address, collateral, debt) => {
    const contract = await getFMintReader();
    const max = await contract.callStatic.getMaxToWithdrawWithChanges(address, wftmAddress(), 30000, wftmAddress(), collateral, fusdAddress(), debt);
    return max;
  }

  const getMaxToMint = async (address) => {
    try {
      const contract = await getFMintContract();
      const max = await contract.getMaxToMint(address, fusdAddress(), 30000);
      return max;
    } catch (e) {
      console.log(e);
    }
  }

  const getMaxToMintWithChanges = async (address, collateral, debt) => {
    try {
      const contract = await getFMintReader();
      const max = await contract.callStatic.getMaxToMintWithChanges(address, fusdAddress(), 30000, wftmAddress(), collateral, fusdAddress(), debt);
      return max;
    } catch (e) {
      console.log(e);
    }
  }

  const getAddressProvider = async () => {
    const contract = await getFMintContract();
    const addressProvider = await contract.addressProvider();
    return addressProvider;
  }

  const getWFTMPrice = async () => {
    const contract = await getFMintContract();
    const price = await contract.getPrice(wftmAddress());
    return price;
  }

  return {
    fmintAddress,
    getFMintBalance,
    mustDeposit,
    mustMint,
    getCollateralValue,
    getMinCollateralRatio,
    getDebtValue,
    getMaxToWithdraw,
    getMaxToWithdrawWithChanges,
    getMaxToMint,
    getMaxToMintWithChanges,
    getAddressProvider,
    getWFTMPrice,
    getCollateralBalance,
    getDebtBalance
  };
};
