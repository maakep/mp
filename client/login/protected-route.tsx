import * as React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from './use-auth';

export default function ProtectedRoute({ children, ...rest }: any) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
