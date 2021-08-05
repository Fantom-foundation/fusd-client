import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'
import { ethers } from 'ethers'
import styled from 'styled-components'
import WalletConnectActions from '../../actions/walletconnect.actions'
import './style.css'

const AccountSettingsForm = styled.form`
  margin: auto;
  max-width: 600px;

  border: 1px solid rgba(120, 122, 155, 0.3);
  box-sizing: border-box;
  border-radius: 8px;
  padding: 32px;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`

const FormLabel = styled.label`
font-family: Proxima Nova;
font-style: normal;
font-weight: 600;
font-size: 14px;
line-height: 140%;
/* identical to box height, or 20px */


/* black */

color: #26283E;
text-align: left;
`

const FormInput = styled.input`
font-family: Inter;
font-style: normal;
font-weight: 500;
font-size: 20px;
line-height: 24px;

/* grey */

color: #787A9B;
padding: 16px;
/* grey */

border: 1px solid rgba(120, 122, 155, 0.3);
box-sizing: border-box;
border-radius: 8px;

&:focus {
  outline: none;
}
`

const FormSpan = styled.span`
  color: grey;
`

const FormButton = styled.button`
  background: #26283E;
  border-radius: 60px;
  font-family: Proxima Nova;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  /* identical to box height */

  text-align: center;

  /* white */

  color: #FFFFFF;
  padding: 17px 0;
  min-width: 120px;
  cursor: pointer;
  border: none;
  outline: none;
`

function Account() {
	const dispatch = useDispatch()

  const isConnected = useSelector((state) => state.ConnectWallet.isConnected)
  const account = useSelector((state) => state.ConnectWallet.account)

	const connectMetamask = async () => {
    if (window.ethereum === undefined) {
      return;
    }
    await window.ethereum.enable();
    //   handle network change & disconnect here
    window.ethereum.on('chainChanged', (_chainId) => {
      //   handle chainId change
      dispatch(WalletConnectActions.changeChainId(_chainId))
      dispatch(WalletConnectActions.setAccount(''))
      console.log('chainid is changed to ', _chainId)
    })
    window.ethereum.on('disconnect', (error) => {
      //   handle disconnect
      dispatch(WalletConnectActions.disconnectWallet())
      dispatch(WalletConnectActions.setAccount(''))
      console.log('handler for disconnection', error)
    })
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        // handle when no account is connected
        dispatch(WalletConnectActions.disconnectWallet())
        console.log('disconnected')
      }
    })
    let provider = new ethers.providers.Web3Provider(window.ethereum)
    let chainId = (await provider.getNetwork()).chainId
    let accounts = await provider.listAccounts()
    let account = accounts[0]
    dispatch(WalletConnectActions.setAccount(account))
    return chainId
  }

	const handleWalletConnect = async () => {
    if (isConnected) {
      dispatch(WalletConnectActions.setAccount(''))
      dispatch(WalletConnectActions.disconnectWallet())
      // handle disconnect here
    } else {
      // handle connect here
      let chainId = await connectMetamask()
      if (chainId !== 1001) {
        console.log('not connected to Opera Network')
        dispatch(WalletConnectActions.connectWallet(chainId))
      } else {
        console.log('connected')
        dispatch(WalletConnectActions.connectWallet(chainId))
      }
    }
  }
console.log(account)
  const handleSubmit = (e) => {
    try {
      const form = e.target;
      const params = {
        name: form.name.value,
        email: form.email.value
      };

    } catch (error) {
      
    }
    e.preventDefault();
    e.stopPropagation();
  }

  useEffect(() => {
    handleWalletConnect();
  }, [])
	return (
		<div>
			<h1 className="page-title">Account Settings</h1>
			<AccountSettingsForm onSubmit={handleSubmit}>
				<FormRow>
          <FormLabel>Name</FormLabel>
          <FormInput name="name"></FormInput>
          <FormSpan></FormSpan>
        </FormRow>
        <FormRow>
          <FormLabel>Email</FormLabel>
          <FormInput type="email" name="email"></FormInput>
          <FormSpan></FormSpan>
        </FormRow>
        <FormButton>Save</FormButton>
			</AccountSettingsForm>
		</div>
	);
}
  
export default Account;
  