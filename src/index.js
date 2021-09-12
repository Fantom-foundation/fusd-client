import React from 'react';
import ReactDOM from 'react-dom';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { Provider } from 'react-redux';
import './index.css';
import App from './components/App';
import Web3ReactManager from './components/Web3ReactManager';
import reportWebVitals from './reportWebVitals';
import store from './stores/reduxStore';

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const NetworkContextName = 'NETWORK';
const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

ReactDOM.render(
  <Provider store={store}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Web3ReactManager>
          <App />
        </Web3ReactManager>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
