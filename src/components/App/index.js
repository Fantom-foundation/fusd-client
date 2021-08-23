import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import { Client } from '@bandprotocol/bandchain.js';
import { ethers } from 'ethers';
import { useDispatch, useSelector } from 'react-redux'
import { useWeb3React } from '@web3-react/core';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from '../../pages/Home'
import Connect from '../../pages/Connect'
import Account from '../../pages/Account'
import Vault from '../../pages/Vault'
import { ChainIDs } from '../../constants/wallet.constants'
import PriceActions from '../../actions/price.actions';

import './style.css';

function App() {
	const dispatch = useDispatch();
  const chainId = useSelector((state) => state.ConnectWallet.chainId)

  const [priceInterval, setPriceInterval] = useState(null);

	const getPrice = async () => {
		try {
		  if (chainId === ChainIDs.mainnet) {
				const endpoint = 'https://rpc.bandchain.org';
				const client = new Client(endpoint);
				const [{ rate }] = await client.getReferenceData(['FTM/USD']);
				dispatch(PriceActions.updatePrice(rate));
		  } else if (chainId === ChainIDs.testnet) {
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const oracle = new ethers.Contract(
					'0xe04676B9A9A2973BCb0D1478b5E1E9098BBB7f3D',
					[
					{
						inputs: [],
						name: 'latestAnswer',
						outputs: [{ internalType: 'int256', name: '', type: 'int256' }],
						stateMutability: 'view',
						type: 'function',
					},
					],
					provider
				);
				const _price = await oracle.latestAnswer();
				const price = parseFloat(_price.toString()) / 10 ** 8;
				dispatch(PriceActions.updatePrice(price));
		  }
		} catch (err) {
		  console.log(err);
		}
	};

  useEffect(() => {
    if (priceInterval) {
      clearInterval(priceInterval);
    }

    getPrice();
    setPriceInterval(setInterval(getPrice, 1000 * 10));
  }, []);

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/connect">
            <Connect />
          </Route>
          <Route path="/account">
            <Account />
          </Route>
          <Route path="/vault">
            <Vault />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
