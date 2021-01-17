import * as React from 'react';
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import { useHistory, useLocation } from 'react-router-dom';
import keys from '../../api-keys-etc/keys';
import { useAuth } from './use-auth';

export default function Login() {
  const auth = useAuth();
  const history = useHistory();
  const location = useLocation();

  console.log(auth);

  function succ(res: GoogleLoginResponse | GoogleLoginResponseOffline) {
    auth.signin(res);
    const from = (location.state as any)?.from || { pathname: '/' };
    history.replace(from);
  }
  function fail(error: any) {
    console.error('Something went wrong', error);
  }

  return (
    <GoogleLogin
      clientId={keys.gOauthClientId}
      onSuccess={succ}
      onFailure={fail}
    />
  );
}
