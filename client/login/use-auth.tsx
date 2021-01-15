import * as React from 'react';
import { createContext, useContext, useState } from 'react';

const authContext = createContext(null);

export function ProvideAuth({ children }: any) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState<any>(null);

  const signin = (user: any) => {
    setUser(user);
  };

  const signout = () => {
    setUser(false);
  };

  return { user, signin, signout };
}
