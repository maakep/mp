import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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
  return (
    <Wrapper>
      <Link to={'/'}>
        <img src="/mp2.png" height={50} />
      </Link>
    </Wrapper>
  );
}
