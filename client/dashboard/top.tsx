import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { post } from '../helpers/postget';
import { Spinner } from '../shared/spinner';

type Toplist = { email: string, points: string }[];

export function Top() {
  const [top, setTop] = useState<Toplist>();
  React.useEffect(() => {
    post('/top').then((r) => r.json().then((t) => setTop(t)));
  }, []);

  return (
    <Wrapper>
      <Row>
        <Key>Name</Key>
        <Value>MP</Value>
      </Row>
      {top ? (
        top.map((row, i) => {
          return (
            <Row key={row.email} even={i % 2 == 0}>
              <Key>{row.email.replace('@gmail.com', '')}</Key>
              <Value>{row.points}</Value>
            </Row>
          );
        })
      ) : (
        <Spinner />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding-top: 50px;
  margin-bottom: 15px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 150%;
  padding: 5px;
  background: ${(p: any) => (p.even ? '#d5d5d511' : '#00000000')};
` as any;

const Key = styled.div``;
const Value = styled.div``;
