import { inject } from 'vue';
import { LowCodeShare } from '../types';

export function useLowCodeStore() {
  return inject(LowCodeShare.LowCodeStore);
}
