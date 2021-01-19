import * as React from 'react';

export default function MyPage() {
  return (
    <div
      onClick={() => {
        fetch('/send', {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            to: 'ayy@gmail.com',
            points: 5,
          }),
        });
      }}
    >
      my pages
    </div>
  );
}
