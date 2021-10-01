import { useEffect, useState } from 'react';
import BigNumber from "bignumber.js";
import { useSelector } from 'react-redux'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core';
import { useFMintContract } from '../contracts';

const useVaultInfo = () => {
  const { getDebtValue, getMinCollateralRatio } = useFMintContract();

  const { account } = useWeb3React();
  const { collateral } = useSelector(state => state.Vault);
  const { price } = useSelector(state => state.Price);

  const [collateralRatio, setCollateralRatio] = useState('');
  const [debt, setDebt] = useState('');
  const [liquidationPrice, setLiquidationPrice] = useState('');
	const [minCollateralRatio, setMinCollateralRatio] = useState('');

	useEffect(async () => {
		const dbt = await getDebtValue(account);
		setDebt(ethers.utils.formatEther(dbt));
		const cr = new BigNumber(price * 100).multipliedBy(new BigNumber(collateral)).dividedBy(new BigNumber(ethers.utils.formatEther(dbt)));
		setCollateralRatio(cr.toString());
	
		let minCollateralRatio = await getMinCollateralRatio();
		setMinCollateralRatio(minCollateralRatio.toString());
		minCollateralRatio = new BigNumber(minCollateralRatio / 100)
		let liquidationPrice = new BigNumber(ethers.utils.formatEther(dbt)).dividedBy(minCollateralRatio).dividedBy(new BigNumber(collateral));
		setLiquidationPrice(liquidationPrice.toString());
	}, [collateral, price, account]);

	return {
		collateral: collateral,
		collateralRatio: collateralRatio,
		liquidationPrice : liquidationPrice,
		debt: debt,
		minCollateralRatio: minCollateralRatio,
	}
}

export default useVaultInfo;