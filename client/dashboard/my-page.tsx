import * as React from 'react';
import { Send } from './send';

export type Transaction = {
  to: string;
  points: number;
};

export default function MyPage() {
  React.useEffect(() => {}, []);

  return (
    <div>
      <Send />
    </div>
  );
}
