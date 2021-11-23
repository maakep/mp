import * as React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { post } from '../helpers/postget';
import { Input } from '../shared/input';
import { sleep } from '../shared/sleep';
import { Spinner } from '../shared/spinner';
import { Transaction } from './balance';

export function Transaction() {
  const [points, setPoints] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<{ field: number; message: string }>();

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [removePoints, setRemovePoints] = useState<boolean>(false);

  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    post('/admin').then((res) => {
      if (res.status == 200) {
        setIsAdmin(true);
      }
    });
  }, []);

  async function onClickSend() {
    if (isNaN(+points)) {
      return setError({ field: 2, message: 'Please enter a number' });
    }

    const transaction: Transaction = {
      to: email,
      points: Number.parseFloat(points),
      dontRemove: removePoints,
    };

    setIsLoading(true);
    const result = await post('/send', transaction);

    await sleep(400); // let animation run

    setIsLoading(false);

    if (!result.ok) {
      if (result.status == 402)
        setError({ field: 0, message: 'Not enough MP' });
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <Wrapper>
        <Success>
          <div style={{ fontSize: '200%', marginBottom: 20 }}>√</div>
          <div>
            Successfully sent {points} MP to {email}
          </div>
        </Success>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Input
        error={error?.field == 1}
        type="text"
        value={email}
        label="Receiver email"
        onChange={(e) => {
          setError(null);
          setEmail(e.currentTarget.value);
        }}
      />
      <Input
        error={error?.field == 2}
        type="text"
        label="Transfer amount"
        value={points}
        onChange={({ currentTarget: { value } }) => {
          setError(null);
          setPoints(value);
        }}
      />
      {isAdmin && (
        <input
          type="checkbox"
          onChange={(e) => setRemovePoints(e.target.checked)}
        />
      )}
      <Error>{error?.message}</Error>
      <button onClick={onClickSend} disabled={isLoading}>
        {!isLoading ? 'Send' : <Spinner />}
      </button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 20px;
  margin: 20px;
  height: 250px;
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background: #00000069;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
`;

const Error = styled.div`
  color: #ff0000;
  height: 18px;
`;

const Success = styled.div`
  color: #00ff00;
  text-align: center;
  font-weight: bold;
`;
