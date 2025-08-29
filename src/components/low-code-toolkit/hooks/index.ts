import { inject } from 'vue';
import { LowCodeShare } from '../common/constant';
import type { LowCodeStateType } from '../types';
export function useLowCodeState() {
  return inject<LowCodeStateType>(LowCodeShare.globalState, { mode: 'view', nodes: [], selected: {} });
}
