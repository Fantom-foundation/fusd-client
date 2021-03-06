import React, { useState, useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { urls } from '../../constants/urls';
import axios from 'axios';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import './style.css';

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

const validateEmail = (email) => {
  if (!email) return true;
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

function Account() {
  const { account } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [register, setRegister] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    //Runs on the first render and when account changes
    setLoading(true);
    axios
      .get(`${urls.api_url}/account/${account}`)
      .then(function (response) {
        const data = response.data;
        if (data.success) {
          if (data.data) {
            setName(data.data.name);
            setEmail(data.data.email);
            setRegister(false);
          } else {
            setName('');
            setEmail('');
            setRegister(true);
          }
        } else {
        }

        setLoading(false);
      })
      .catch((error) => {
        console.warn(error);
        setLoading(false);
      });
  }, [account]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  const disableButton = () => {
    if (loading) return true;
    if (
      register &&
      (!name ||
        !email ||
        !password ||
        password != confirmPassword ||
        !validateEmail(email))
    ) {
      return true;
    }
    if (
      !register &&
      (!name ||
        !email ||
        !password ||
        newPassword != confirmNewPassword ||
        !validateEmail(email))
    ) {
      return true;
    }
    return false;
  };

  const errorText = () => {
    var text = '';
    if (!name) text = 'Name is required. ';
    if (!email) text += 'Email is required. ';
    if (!validateEmail(email)) text += 'Email is invalid. ';
    if (!password) text += 'Password is required. ';
    if (register && password != confirmPassword)
      text += 'Confirm Password does not match. ';
    if (!register && newPassword != confirmNewPassword)
      text += 'Confirm New Password does not match. ';
    return text;
  };
  const handleForgotPassword = (e) => {
    setLoading(true);
    axios
      .get(`${urls.api_url}/send-reset-link/${account}`)
      .then(function (response) {
        setLoading(false);
        const data = response.data;
        if (data.success) {
          if (data.emailFound) {
            toast.info(`A reset link has been sent to your email address.`, {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
            });
          } else {
            toast.warning(`No email associated with your account.`, {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
            });
          }
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
  const handleSubmit = (e) => {
    let msg = 'An error occured while registring account. Please try again.';
    try {
      const form = e.target;

      if (!validateEmail(email)) {
        e.preventDefault();
        e.stopPropagation();
        toast.error(`The email is not correct`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      if (register && password != confirmPassword) {
        e.preventDefault();
        e.stopPropagation();
        toast.error(`Confirm Password doesn't match`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      if (!register && newPassword.value != confirmNewPassword.value) {
        e.preventDefault();
        e.stopPropagation();
        toast.error(`Confirm Password doesn't match`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      const params = {
        name: name,
        email: email,
        address: account,
        password: password,
        newPassword: register ? '' : newPassword,
      };

      if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      setLoading(true);
      const url = register ? 'register-account' : 'update-account';
      axios
        .post(`${urls.api_url}/${url}`, JSON.stringify(params), {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(function (response) {
          const data = response.data;
          if (data.success === true) {
            toast.success(
              register ? 'Registered successfully!' : 'Updated successfully',
              {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
              }
            );
          } else {
            if (data.message === 'ACCOUNT_ALREADY_EXIST') {
              msg = 'Account with the same address or email already exists';
            }
            if (data.message === `WRONG_PASSWORD`) {
              msg = 'Wrong password!';
            }

            toast.error(msg, {
              position: 'top-right',
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
        position: 'top-right',
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
  };

  return (
    <div>
      <Header />
      <h1 className='page-title'>
        {register ? 'Account Register' : 'Account Update'}
      </h1>
      <AccountSettingsForm onSubmit={handleSubmit}>
        <FormRow>
          <FormLabel>Name</FormLabel>
          <FormInput
            name='name'
            required
            value={name}
            onChange={handleNameChange}
          ></FormInput>
          <FormSpan></FormSpan>
        </FormRow>
        <FormRow>
          <FormLabel>Email</FormLabel>
          <FormInput
            type='email'
            name='email'
            required
            value={email}
            onChange={handleEmailChange}
          ></FormInput>
          <FormSpan></FormSpan>
        </FormRow>
        <FormRow>
          <FormLabel>
            {register ? (
              'Password'
            ) : (
              <div>
                Password{' '}
                <span
                  onClick={handleForgotPassword}
                  style={{ cursor: 'pointer' }}
                >
                  (Forgot Password?)
                </span>
              </div>
            )}
          </FormLabel>
          <FormInput
            type='password'
            name='password'
            value={password}
            onChange={handlePasswordChange}
            required
          ></FormInput>
          <FormSpan></FormSpan>
        </FormRow>
        {register && (
          <FormRow>
            <FormLabel>Confirm Password</FormLabel>
            <FormInput
              type='password'
              name='confirmPassword'
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            ></FormInput>
            <FormSpan></FormSpan>
          </FormRow>
        )}
        {!register && (
          <FormRow>
            <FormLabel>New Password</FormLabel>
            <FormInput
              type='password'
              name='newPassword'
              value={newPassword}
              onChange={handleNewPasswordChange}
            ></FormInput>
            <FormSpan></FormSpan>
          </FormRow>
        )}
        {!register && (
          <FormRow>
            <FormLabel>Confirm New Password</FormLabel>
            <FormInput
              type='password'
              name='confirmNewPassword'
              value={confirmNewPassword}
              onChange={handleConfirmNewPasswordChange}
            ></FormInput>
            <FormSpan></FormSpan>
          </FormRow>
        )}
        {disableButton() && (
          <FormRow>
            <FormLabel>
              <span style={{ color: 'red' }}>{errorText()}</span>
            </FormLabel>
          </FormRow>
        )}
        <FormButton disabled={disableButton()}>
          {loading ? (
            <ClipLoader color='#EFF3FB' loading={loading} size={24} />
          ) : (
            'Save'
          )}
        </FormButton>
      </AccountSettingsForm>
    </div>
  );
}

export default Account;
