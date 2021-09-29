import { configureStore } from '@reduxjs/toolkit'
import {ConnectWallet} from '../reducers/walletconnect.reducers'
import {Price} from '../reducers/price.reducers'
import {Vault} from '../reducers/vault.reducers'

export default configureStore({
  reducer: {
    ConnectWallet: ConnectWallet,
    Price: Price,
    Vault: Vault
  },
})
