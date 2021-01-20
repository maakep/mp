import * as React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Login from './login/login';
import ProtectedRoute from './login/protected-route';
import { ProvideAuth } from './login/use-auth';
import MyPage from './dashboard/my-page';
import styled from 'styled-components';

const Body = styled.div`
  display: flex;
  margin: 0;
  width: 100%;
  height: 100%;
  background: grey;
`;

export default function App() {
  return (
    <Body>
      <ProvideAuth>
        <BrowserRouter>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <ProtectedRoute exact path={'/'}>
              <MyPage />
            </ProtectedRoute>
            <Route>
              <div>404 not found :)</div>
            </Route>
          </Switch>
        </BrowserRouter>
      </ProvideAuth>
    </Body>
  );
}
