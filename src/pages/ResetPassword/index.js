import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import ClipLoader from 'react-spinners/ClipLoader';
import axios from 'axios';
import styled from 'styled-components';
import { urls } from '../../constants/urls';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';

const PasswordResetForm = styled.form`
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
`;

const FormLabel = styled.label`
  font-family: Proxima Nova;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 140%;
  /* identical to box height, or 20px */

  /* black */

  color: #26283e;
  text-align: left;
`;

const FormInput = styled.input`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;

  /* grey */

  color: #787a9b;
  padding: 16px;
  /* grey */

  border: 1px solid rgba(120, 122, 155, 0.3);
  box-sizing: border-box;
  border-radius: 8px;

  &:focus {
    outline: none;
  }
`;

const FormSpan = styled.span`
  color: grey;
`;

const FormButton = styled.button`
  background: #26283e;
  border-radius: 60px;
  font-family: Proxima Nova;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  /* identical to box height */

  text-align: center;

  /* white */

  color: #ffffff;
  padding: 0 64px;
  height: 56px;
  min-width: 168px;
  cursor: pointer;
  border: none;
  outline: none;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const GetUrlParam = (name) => {
  var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(
    window.location.href
  );
  if (results == null) {
    return '';
  } else {
    return decodeURI(results[1]) || 0;
  }
};

const email = GetUrlParam('email');
const key = GetUrlParam('key');

function ResetPassword() {
  const { account } = useWeb3React();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    const params = {
      email: email,
      key: key,
      password: password,
      address: account,
    };
    axios
      .post(`${urls.api_url}/reset-password`, JSON.stringify(params), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        setLoading(false);
        const data = response.data;
        if (data.success) {
          toast.info(`Your password has been reset successfully.`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.error(`An error has occured!`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
        }
      });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <div>
      <Header />
      <h1 className='page-title'>Password Reset</h1>
      <PasswordResetForm onSubmit={handleSubmit}>
        <FormRow>
          <FormLabel>New Password</FormLabel>
          <FormInput
            name='password'
            required
            value={password}
            onChange={handlePasswordChange}
            type='password'
          ></FormInput>
          <FormSpan></FormSpan>
        </FormRow>
        <FormRow>
          <FormLabel>Confirm New Password</FormLabel>
          <FormInput
            name='confirmPassword'
            required
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            type='password'
          ></FormInput>
          <FormSpan></FormSpan>
        </FormRow>
        <FormButton
          disabled={
            !password || !confirmPassword || password != confirmPassword
          }
        >
          {loading ? (
            <ClipLoader color='#EFF3FB' loading={loading} size={24} />
          ) : (
            'Save'
          )}
        </FormButton>
      </PasswordResetForm>
    </div>
  );
}

export default ResetPassword;
