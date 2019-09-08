export function storageRoles(roles: string[]): void {
  return localStorage.setItem('roles', JSON.stringify(roles));
}

export function destroyRoles(): void {
  return localStorage.removeItem('roles');
}

export function getRoles(): string[] {
  const roles = localStorage.getItem('roles') as string;
  return JSON.parse(roles);
}

export function storagePermissions(permissions: string[]): void {
  return localStorage.setItem('permissions', JSON.stringify(permissions));
}

export function getPermissions(str?: string): string[] {
  const authorityString = typeof str === 'undefined' ? localStorage.getItem('permissions') : str;
  let authority;
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    authority = JSON.parse(authorityString!);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    authority = [authority];
  }
  return authority;
}

export function destroyPermissions(): void {
  return localStorage.removeItem('permissions');
}

export function hasPermission(checkPermissions: string[]): boolean {
  const permissions = getPermissions();
  if (!permissions) {
    return false;
  }
  return checkPermissions.filter(permission => permissions.indexOf(permission) !== -1).length > 0;
}

export function hasRole(checkRoles: string[]): boolean {
  const roles = getRoles();
  if (!roles) {
    return false;
  }
  return checkRoles.filter(role => roles.indexOf(role) !== -1).length > 0;
}
