import * as React from 'react';
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import keys from '../../api-keys-etc/keys';

export default () => {
  function succ(res: GoogleLoginResponse | GoogleLoginResponseOffline) {
    console.log(res);
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
};
