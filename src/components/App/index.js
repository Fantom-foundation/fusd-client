import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import { Client } from '@bandprotocol/bandchain.js';
import { useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from '../../pages/Home';
import Connect from '../../pages/Connect';
import Account from '../../pages/Account';
import ResetPassword from '../../pages/ResetPassword';
import Vault from '../../pages/Vault';
import Vaults from '../../pages/Vaults';
import { ChainIDs } from '../../constants/walletconnection';
import { useWeb3React } from '@web3-react/core';
import PriceActions from '../../actions/price.actions';
import { useFMintContract } from '../../contracts';
import BigNumber from 'bignumber.js';

import './style.css';

function App() {
  const dispatch = useDispatch();
  const { chainId } = useWeb3React();
  const { getWFTMPrice } = useFMintContract();

  const [priceInterval, setPriceInterval] = useState(null);

  const getPrice = async () => {
    try {
      if (chainId === ChainIDs.mainnet) {
        const endpoint = 'https://rpc.bandchain.org';
        const client = new Client(endpoint);
        const [{ rate }] = await client.getReferenceData(['FTM/USD']);
        dispatch(PriceActions.updatePrice(rate));
      } else if (chainId === ChainIDs.testnet) {
        const _price = await getWFTMPrice();
        let price = new BigNumber(_price.toString()).div(
          new BigNumber(10).pow(18)
        );
        price = parseFloat(price.toString());
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
      <div className='App'>
        <Switch>
          <Route path='/connect'>
            <Connect />
          </Route>
          <Route path='/account'>
            <Account />
          </Route>
          <Route path='/resetpassword'>
            <ResetPassword />
          </Route>
          <Route path='/vault'>
            <Vault />
          </Route>
          <Route path='/vaults'>
            <Vaults />
          </Route>
          <Route path='/'>
            <Home />
          </Route>
        </Switch>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
