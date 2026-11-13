import { ref } from 'vue';
import { defineStore } from 'pinia';
import { logins, outLogins } from '@/api/account';
import type { AccountLoginParams, AccountLoginData } from '@/api/account';

export const useAccountStore = defineStore(
  'account',
  () => {
    const accountState = ref<AccountLoginData>({ token: '', user: {} });
    const clearAccountState = () => {
      accountState.value = { token: '', user: {} };
    };
    const setAccountState = (state: AccountLoginData) => {
      accountState.value = state;
    };
    const login = async (params: AccountLoginParams) => {
      try {
        const { success, data } = await logins(params);
        if (!success || !data) return false;
        setAccountState(data);
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    };
    const outLogin = async () => {
      try {
        const { success } = await outLogins();
        if (!success) return false;
        clearAccountState();
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    };

    return { accountState, setAccountState, clearAccountState, login, outLogin };
  },
  { persist: true }
);
