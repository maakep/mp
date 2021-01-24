import * as React from 'react';
import { useGoogleLogout } from 'react-google-login';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { deleteCookie } from '../helpers/cookie-helper';
import { TokenSessionKey } from '../../shared/constants';

const Wrapper = styled.div`
  background: black;
  height: 70px;
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
`;

export function Header() {
  function logout() {
    deleteCookie(TokenSessionKey);
    location.reload();
  }

  return (
    <Wrapper>
      <div style={{ cursor: 'pointer' }} onClick={logout}>
        <img src="/mp2.png" height={50} />
      </div>
    </Wrapper>
  );
}
