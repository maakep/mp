export function setCookie(
  cname: string,
  cvalue: string,
  expireMinutes: number
) {
  var d = new Date();
  d.setTime(d.getTime() + expireMinutes * 60 * 1000);
  var expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}
