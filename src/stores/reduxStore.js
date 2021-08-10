import { configureStore } from '@reduxjs/toolkit'
import {ConnectWallet} from '../reducers/walletconnect.reducers'

export default configureStore({
  reducer: {
    ConnectWallet: ConnectWallet
  },
})
