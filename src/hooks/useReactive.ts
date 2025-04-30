import { reactive, toRaw } from 'vue';
import { typeofs } from '@/utils';
import type { Reactive } from 'vue';

type SetStateFn<T extends Record<string, any>> = (newState: T) => T;
export const useReactive = <T extends Record<string, any>>(initialState: T) => {
  const state = reactive<T>(initialState);

  const basicTypes = ['boolean', 'string', 'number', 'undefined', 'null'];
  const update = (currentState: Reactive<T>, newState: T) => {
    for (const newStateKey in newState) {
      const newValue = newState[newStateKey];
      const oldValue = currentState[newStateKey];
      if (oldValue !== newValue) {
        if (basicTypes.includes(typeofs(newValue))) {
          currentState[newStateKey as any] = newValue;
        } else if (typeofs(newValue) === 'object') {
          update(oldValue, newState);
        } else if (Array.isArray(newValue)) {
          // 调用数组更新

        }
      }
    }
  };
  const setState = (newState: SetStateFn<T> | T) => {
    if (typeof newState === 'function') {
      // 如果传入的是一个函数，像 React 的 setState 那样处理
      // Object.assign(state, newState({ ...state } as T));
      update(state, newState(toRaw(state) as T));
    } else {
      // Object.assign(state, newState);
      update(state, newState);
    }
  };

  return [state, setState];
};
