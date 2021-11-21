import * as React from 'react';
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import { useHistory, useLocation } from 'react-router-dom';
import keys from '../../api-keys-etc/keys';
import { TokenSessionKey } from '../../shared/constants';
import { setCookie } from '../helpers/cookie-helper';
import { useAuth } from './use-auth';

export default function Login() {
  const auth = useAuth();
  const history = useHistory();
  const location = useLocation();

  function loginSuccess(res: GoogleLoginResponse | GoogleLoginResponseOffline) {
    res = res as GoogleLoginResponse;
    const token = res.getAuthResponse().id_token;
    auth.signin(token);
    setCookie(TokenSessionKey, token, 60);
    const from = (location.state as any)?.from || { pathname: '/' };
    history.replace(from);
  }

  function loginFailure(error: any) {
    console.error('Something went wrong', error);
  }

  return (
    <GoogleLogin
      clientId={keys.gOauthClientId}
      cookiePolicy={'single_host_origin'}
      responseType='code,token'
      onSuccess={loginSuccess}
      onFailure={loginFailure}
    />
  );
}
