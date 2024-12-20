import { reactive } from 'vue';

type SetStateFn<T extends Record<string, any>> = (newState: T) => T;
export const useReactive = <T extends Record<string, any>>(initialState: T) => {
  const state = reactive<T>(initialState);

  const setState = (newState: SetStateFn<T> | T) => {
    if (typeof newState === 'function') {
      // 如果传入的是一个函数，像 React 的 setState 那样处理
      Object.assign(state, newState({ ...state } as T));
    } else {
      Object.assign(state, newState);
    }
  };

  return [state, setState];
};
