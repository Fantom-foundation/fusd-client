import { ethers } from 'ethers';
import { getAddress } from '@ethersproject/address';
import BigNumber from "bignumber.js";

export function isAddress(value) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export function shortenAddress(address, chars = 4) {
  if (!address) return '';

  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

export const formatBalance = num => {
  var number = num
  number = parseFloat(number)
  number = isNaN(number) ? 0 : number;
  number = Math.round(number * 100) / 100;
  return number.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  })
};

export const formatBigNumber = num => {
  var number = ethers.utils.formatEther(num)
  number = parseFloat(number)
  number = isNaN(number) ? 0 : number;
  return number.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  })
};

export const calculateGasMargin = value => {
  return value
    .mul(ethers.BigNumber.from(10000).add(ethers.BigNumber.from(1000)))
    .div(ethers.BigNumber.from(10000));
};

export const compareBN = (val1, val2) => {
  return new BigNumber(val1).isEqualTo(val2);
}