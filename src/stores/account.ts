import { ref } from 'vue';
import { defineStore } from 'pinia';
interface AccountState {
  name: string;
  id: string;
}
export const useAccountStore = defineStore('account', () => {
  const accountState = ref<AccountState>({ name: '', id: '', });
  const clearAccountState = () => {
    accountState.value = { name: '', id: '' };
  };
  const setAccountState = (state: AccountState) => {
    accountState.value = state;
  };
  return { accountState, setAccountState, clearAccountState };
});
