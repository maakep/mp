export function setCookie(
  cookieName: string,
  cookieValue: string,
  expireMinutes: number
) {
  var d = new Date();
  d.setTime(d.getTime() + expireMinutes * 60 * 1000);
  var expiresAndSameSite = 'expires=' + d.toUTCString();
  document.cookie = cookieName + '=' + cookieValue + ';' + expiresAndSameSite + ';path=/';
}

export function getCookie(cookieName: string): string {
  var name = cookieName + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export function deleteCookie(cookieName: string) {
  setCookie(cookieName, '', -10);
}
