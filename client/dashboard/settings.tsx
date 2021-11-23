import * as React from 'react';
import styled from 'styled-components';
import { post } from '../helpers/postget';

export function Settings() {
  const [username, setUsername] = React.useState<string>();
  const [result, setResult] = React.useState<string>("");

  async function submit() {
    setResult("");
    const res = await post('/updateUsername', {username: username});

    const json = await res.json();
    setResult(json.result);
  }

  return (
    <Wrapper>
      <label>Username</label>
      <Input 
        type="text" 
        placeholder="3 - 17 characters, not email"
        onChange={e => setUsername(e.currentTarget.value)} 
      />
      <button onClick={submit}>Change</button>
      <div>{result}</div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
` 

const Input = styled.input`
  padding: 10px;
`