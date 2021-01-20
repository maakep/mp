export function post(url: string, body?: object) {
  fetch(url, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: body && JSON.stringify(body),
  });
}
