import type { ComponentProp } from './packages';

export type CanvasOpts = {
  offset: number;
  scale: number;
};
export type LowCodeStateType = {
  nodes: ComponentProp[];
  selected: Object;
  mode: 'edit' | 'view';
  canvas: CanvasOpts;
  // 物料区到画板时的状态
  isAdd: boolean;
  // 画板中移动
  isMove: boolean;
  isSelect: boolean;
};
