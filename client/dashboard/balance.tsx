import * as React from 'react';
import { useState } from 'react';
import { Spinner } from '../shared/spinner';

export type Transaction = {
  to: string;
  points: number;
};

export function Balance() {
  const [balance, setBalance] = useState<string>();
  React.useEffect(() => {
    setTimeout(() => {
      setBalance('1337');
    }, 1000);
  }, []);

  return <div>{balance ? balance : <Spinner />}</div>;
}
