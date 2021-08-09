import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import ClipLoader from "react-spinners/ClipLoader";
import { urls } from '../../constants/urls'
import { ethers } from 'ethers'
import axios from 'axios'
import styled from 'styled-components'
import { toast } from 'react-toastify'
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
  padding: 0 64px;
  height: 56px;
  min-width: 168px;
  cursor: pointer;
  border: none;
  outline: none;

  &:disabled {
    cursor: not-allowed;
    opacity: .6;
  }
`

function Account() {
	const dispatch = useDispatch()

  const isConnected = useSelector((state) => state.ConnectWallet.isConnected)
  const [walletAddress, setWalletAddress] = useState('')
  const [loading, setLoading] = useState(false)

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
    setWalletAddress(account)
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
  const handleSubmit = (e) => {
    let msg = 'An error occured while registring account. Please try again.';
    try {
      const form = e.target;
      const params = {
        name: form.name.value,
        email: form.email.value,
        address: walletAddress
      };

      if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      setLoading(true);
      axios.post(`${urls.api_url}/register-account`, JSON.stringify(params), {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        const data = response.data;
        if (data.success === true) {
          toast.success('Registered successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
        } else {
          if (data.message === 'ACCOUNT_ALREADY_EXIST') {
            msg = 'Account with the same address or email already exists';
          }

          toast.error(msg, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
        }
        setLoading(false);
      });
    } catch (error) {
      toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
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
          <FormInput name="name" required></FormInput>
          <FormSpan></FormSpan>
        </FormRow>
        <FormRow>
          <FormLabel>Email</FormLabel>
          <FormInput type="email" name="email" required></FormInput>
          <FormSpan></FormSpan>
        </FormRow>
        <FormButton disabled={loading}>
          {
            loading ? (<ClipLoader color="#EFF3FB" loading={loading} size={24} />) : 'Save'
          }
        </FormButton>
			</AccountSettingsForm>
		</div>
	);
}
  
export default Account;
  