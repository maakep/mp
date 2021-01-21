import * as React from 'react';
import styled, { StyledFunction } from 'styled-components';

type Props = React.HTMLProps<HTMLInputElement> & { error: boolean };

export function Input(props: Props) {
  const [hasFocusOrText, setHasFocusOrText] = React.useState<boolean>(false);

  function onFocus() {
    if (!hasFocusOrText) {
      setHasFocusOrText(true);
    }
  }

  function onBlur() {
    if (!props.value?.toString().length) {
      setHasFocusOrText(false);
    }
  }

  return (
    <Wrapper>
      <Label error={props.error} hide={hasFocusOrText}>
        {props.label}
      </Label>
      <StyledInput
        onChange={props.onChange}
        type={props.type}
        value={props.value}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 5px;
  width: calc(100% - 10px);
`;
const Label = styled.div`
  position: absolute;
  padding: 1px 4px;
  margin-left: 10px;
  margin-top: ${(p: any) => (p.hide ? '-5px' : '9px')};
  font-size: ${(p: any) => (p.hide ? '90%' : '100%')};
  transition: 200ms linear;
  pointer-events: none;
  color: ${(p: any) => (p.error ? '#ff0000' : '#ffffff99')};
` as any;

const StyledInput = styled.input`
  padding: 10px;
  color: white;
  background: none;
  border: none;
  border-bottom: solid 2px white;
  width: calc(100% - 20px);
`;
