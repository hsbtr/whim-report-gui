import type { NodeProps } from './packages';

export interface CanvasOpts {
  offset: number;
  scale: number;
}
export type SelectionSource = 'box' | 'drag' | 'zoom' | null;
export type SelectionBox = {
  left: number;
  top: number;
  width: number;
  height: number;
  visible: boolean;
  source: SelectionSource;
};
export type MousePosition = {
  x: number;
  y: number;
  startX: number;
  startY: number;
};
export interface LowCodeStateType {
  // 节点
  nodes: NodeProps[];
  // 选择的节点
  selected: NodeProps[];
  // 模式
  mode: 'edit' | 'view';
  // 黑暗模式
  dark: boolean;
  // 画布属性
  canvas: CanvasOpts;
  width: number;
  height: number;
  // 物料区到画板时的状态
  isAdd: boolean;
  // 画板中移动
  isMove: boolean;
  isSelect: boolean;
  selectionBox: SelectionBox;
  mousePosition: MousePosition;
}
export interface LowCodeProps extends Pick<LowCodeStateType, 'mode' | 'dark'> {}
