import jwtDecode from 'jwt-decode';

export function storageToken(token: string): void {
  return localStorage.setItem('token', token);
}

export function destroyToken(): void {
  return localStorage.removeItem('token');
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function getTokenPayload(giveToken?: string): any {
  try {
    if (typeof giveToken === 'undefined') {
      const token: any = getToken();
      return jwtDecode(token);
    }
    return jwtDecode(giveToken);
  } catch (e) {
    return null;
  }
}

export function tokenExpired(token?: string): boolean {
  const payload: any = getTokenPayload(token);

  if (!payload) {
    return true;
  }

  return payload.exp < Date.now() / 1000;
}
