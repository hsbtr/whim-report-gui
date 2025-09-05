import type { NodeProps } from './packages';

export interface CanvasOpts {
  offset: number;
  scale: number;
}
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
  // 物料区到画板时的状态
  isAdd: boolean;
  // 画板中移动
  isMove: boolean;
  isSelect: boolean;
}
export interface LowCodeProps extends Pick<LowCodeStateType, 'mode' | 'dark'> {}
