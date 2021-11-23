import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 300px;
  background: black;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;

  padding: 30px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

export function Footer() {
  return (
    <Wrapper>
      <InnerWrapper>
        <Column>
          <Link to={'/'}>
            <img src="/wallet.png" height={40} />
          </Link>
          [[ BALANCE ]]
        </Column>
        <Column>
          <Link to={'/transfer'}>
            <img src="/transfer.png" height={40} />
          </Link>
          [[ TRANSFER ]]
        </Column>
        <Column>
          <Link to={'/top'}>
            <img src="/top.png" height={40} />
          </Link>
          [[ TOP ]]
        </Column>
        <Column>
          <Link to={'/settings'}>
            <img src="/top.png" height={40} />
          </Link>
          [[ SETTINGS ]]
        </Column>
      </InnerWrapper>
    </Wrapper>
  );
}
