import * as React from 'react';
import { useState } from 'react';
import { post } from '../helpers/post';
import { Transaction } from './my-page';

export function Send() {
  const [points, setPoints] = useState<number>(0);
  const [email, setEmail] = useState<string>('');

  function onClickSend() {
    const transaction: Transaction = {
      to: email,
      points: points,
    };

    post('/send', transaction);
  }

  return (
    <div>
      <label>To whom</label>
      <input
        type="text"
        value={email}
        placeholder="Receiver email"
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <label>How many</label>
      <input
        type="number"
        value={points}
        onChange={({ currentTarget: { value } }) =>
          value && setPoints(Math.abs(Number.parseInt(value)))
        }
      />
      <button onClick={onClickSend}></button>
    </div>
  );
}
