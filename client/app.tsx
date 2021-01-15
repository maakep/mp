import * as React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Login from './login/login';
import ProtectedRoute from './login/protected-route';
import { ProvideAuth } from './login/use-auth';
import MyPage from './my-page';

export default function App() {
  return (
    <ProvideAuth>
      <BrowserRouter>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <ProtectedRoute exact path={'/'}>
            <MyPage />
          </ProtectedRoute>
        </Switch>
      </BrowserRouter>
    </ProvideAuth>
  );
}
