import { reactive, toRaw } from 'vue';
import { typeofs } from '@/utils';
import type { Reactive } from 'vue';

type StateUpdater<T extends Record<string, any>> = (prevState: T) => T;
type StateInput<T extends Record<string, any>> = StateUpdater<T> | T;

export const useReactive = <T extends Record<string, any>>(initialState: T) => {
  const state = reactive<T>(initialState);

  const basicTypes = ['boolean', 'string', 'number', 'undefined', 'null'];
  const update = (currentState: Reactive<T>, newState: T): void => {
    for (const newStateKey in newState) {
      const newValue = newState[newStateKey];
      const oldValue = currentState[newStateKey];
      if (newValue === oldValue) continue;
      if (basicTypes.includes(typeofs(newValue))) {
        currentState[newStateKey as any] = newValue;
      } else if (typeofs(newValue) === 'object') {
        update(oldValue, newState);
      } else if (Array.isArray(newValue)) {
        // 调用数组更新

      }
    }
  };
  const setState = (newState: StateInput<T>): void => {
    const updateState = typeof newState === 'function' ? (newState as StateUpdater<T>)(toRaw(state) as T) : newState;
    update(state, updateState);
  };

  return [state, setState] as const;
};
