import * as React from 'react';
import { createContext, useContext, useState } from 'react';
import { GoogleLoginResponse } from 'react-google-login';

const authContext = createContext(null);

export function ProvideAuth({ children }: any) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState<GoogleLoginResponse>(null);

  const signin = (user: GoogleLoginResponse) => {
    setUser(user);
  };

  const signout = () => {
    setUser(null);
  };

  return { user, signin, signout };
}
