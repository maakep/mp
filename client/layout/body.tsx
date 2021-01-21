import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 70px;
  width: 100%;
  min-height: calc(100vh - 370px);
  background: url('https://www.paintandpaperlibrary.com/media/catalog/product/cache/8/image/9df78eab33525d08d6e5fb8d27136e95/0/3/03PERSE.jpg');
`;

export function Body({ children }: any) {
  return <Wrapper>{children}</Wrapper>;
}
