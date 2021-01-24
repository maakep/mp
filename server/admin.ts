import { admins } from '../api-keys-etc/admins';

export function isAdministrator(email: string): boolean {
  return admins.includes(email);
}
