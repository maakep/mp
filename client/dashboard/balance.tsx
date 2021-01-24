import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { post } from '../helpers/postget';
import { Spinner } from '../shared/spinner';

export type Transaction = {
  to: string;
  points: number;
  dontRemove: boolean;
};

export function Balance() {
  const [balance, setBalance] = useState<string>();
  React.useEffect(() => {
    post('/balance').then((r) => r.text().then((t) => setBalance(t)));
  }, []);

  return (
    <Wrapper>
      <Welcome>Welcome</Welcome>
      <SubWelcome>Your MP balance is...</SubWelcome>
      <Mp>{balance ? balance : <Spinner />}</Mp>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const Welcome = styled.div`
  font-size: 200%;
`;
const SubWelcome = styled.div`
  margin-bottom: 30px;
`;
const Mp = styled.div`
  font-size: 300%;
  color: #ecc464;
`;
