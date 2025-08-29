import type { CustomComponentProps } from './packages';

export type LowCodeStateType = {
  nodes: CustomComponentProps[];
  selected: Object;
  mode: 'edit' | 'view';
};
