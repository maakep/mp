import { admins } from '../api-keys-etc/admins';

export function isAdmin(email: string): boolean {
  return admins.includes(email);
}
