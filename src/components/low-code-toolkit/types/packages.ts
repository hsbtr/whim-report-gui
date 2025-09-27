import { Pkg, ChartOpts, ControlOpts, ExhibitOpts } from '../common/constant';

/**
 * ECharts 图表类型联合类型
 * 用于 series.type
 */
export type ChartType = keyof typeof ChartOpts;
export type ControlType = keyof typeof ControlOpts;
export type ExhibitType = keyof typeof ExhibitOpts;
export type PkgType = keyof typeof Pkg;
export type PkgComponentType = ChartType | ControlType | ExhibitType;
export type ComponentAttr = {
  w: number;
  h: number;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
};
export type ComponentPropsRaw = {
  title: string;
  key: string;
  icon?: string;
  params?: Record<string, any>;
  request?: (params: Record<string, any>) => Promise<any>;
  dataSource?: any;
  disabled?: boolean;
  attr?: ComponentAttr;
};
// 渲染到画板中 节点的属性
export type NodeProps = Omit<ComponentPropsRaw, 'attr'> & {
  attr: ComponentAttr;
  hide: boolean;
  lock: boolean;
  uuid: string;
  id: string;
};
export type PkgComponentMeta = {
  title: string;
  type: PkgComponentType;
  pkgType: PkgType;
  key: string;
  fieldProps: ComponentPropsRaw[];
};
export type PkgModule = Record<string, { default: PkgComponentMeta }>;
