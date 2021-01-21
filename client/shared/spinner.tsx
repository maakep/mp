import * as React from 'react';
import styled, { keyframes } from 'styled-components';

export function Spinner() {
  return <RotatingSpinner>|</RotatingSpinner>;
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const RotatingSpinner = styled.div`
  animation: ${rotate} 1s linear infinite;
`;
