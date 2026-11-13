import { request } from '@/http';

export type AccountLoginParams = { account: string; password: string };
export type AccountInfo = {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  role: string[];
};
export interface AccountLoginData {
  expiresAt?: number;
  token: string;
  user: Partial<AccountInfo>;
}

export function logins(params: AccountLoginParams) {
  return request.post<AccountLoginData>('/accoun/login', params);
}

export function outLogins() {
  return request.get<void>('/accoun/logout');
}
