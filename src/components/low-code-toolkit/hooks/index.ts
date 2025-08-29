import { inject } from 'vue';
import { LowCodeShare, LowCodeEvent } from '../common/constant';
import type { LowCodeStateType, ComponentPropRaw } from '../types';
export function useLowCodeState() {
  return inject<LowCodeStateType>(LowCodeShare.globalState, { mode: 'view', nodes: [], selected: {} });
}

type LowCodeContext = {
  addNode?: (node) => void;
  selected?: (node) => void;
};
export function useLowCodeContext(): LowCodeContext {
  const addNode = inject(LowCodeEvent.addNode);
  const selected = inject(LowCodeEvent.selected);
  return {
    addNode,
    selected,
  };
}
