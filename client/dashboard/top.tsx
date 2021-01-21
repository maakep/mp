import * as React from 'react';
import { useState } from 'react';
import { Spinner } from '../shared/spinner';

export function Top() {
  const [balance, setBalance] = useState<string>();
  React.useEffect(() => {
    setTimeout(() => {
      setBalance('MAAKEEEP');
    }, 1000);
  }, []);

  return <div>{balance ? balance : <Spinner />}</div>;
}
