import { configureStore } from '@reduxjs/toolkit'
import {ConnectWallet} from '../reducers/walletconnect.reducers'
import {Price} from '../reducers/price.reducers'

export default configureStore({
  reducer: {
    ConnectWallet: ConnectWallet,
    Price: Price
  },
})
