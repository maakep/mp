import * as React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Login from './login/login';
import ProtectedRoute from './login/protected-route';
import { ProvideAuth } from './login/use-auth';
import { Balance } from './dashboard/balance';
import { Header } from './layout/header';
import { Body } from './layout/body';
import { Footer } from './layout/footer';
import { Transaction } from './dashboard/transaction';
import { Top } from './dashboard/top';
import { Settings } from './dashboard/settings';

export default function App() {
  return (
    <ProvideAuth>
      <BrowserRouter>
        <Header />
        <Body>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <ProtectedRoute exact path={'/'}>
              <Balance />
            </ProtectedRoute>
            <ProtectedRoute exact path={'/transfer'}>
              <Transaction />
            </ProtectedRoute>
            <Route exact path={'/top'}>
              <Top />
            </Route>
            <ProtectedRoute exact path={'/settings'}>
              <Settings />
            </ProtectedRoute>
            <Route>
              <div>404 not found :)</div>
            </Route>
          </Switch>
        </Body>
        <Footer />
      </BrowserRouter>
    </ProvideAuth>
  );
}
