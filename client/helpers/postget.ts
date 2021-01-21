export async function post(url: string, body?: object) {
  return await fetch(url, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: body && JSON.stringify(body),
  });
}

export async function get(url: string, body?: object) {
  return await fetch(url, {
    method: 'get',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: body && JSON.stringify(body),
  });
}
