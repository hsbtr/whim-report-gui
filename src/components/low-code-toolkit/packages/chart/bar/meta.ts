import type { MetaCfg, PkgCfg, PkgType } from '../../types';

export type ComponentName = 'ChartBar';
export interface BarProp extends PkgCfg {
  name: ComponentName,
  type: PkgType.chart;
  series: string;
}
type BarTempProp = Omit<BarProp, 'name' | 'type' | 'series'>;
export interface BarMeta extends MetaCfg {
  name: ComponentName;
  type: PkgType.chart;
  templates: BarTempProp[];
}

const templates: BarTempProp[] = [
  {
    title: '普通柱状图',
    key: 'bar-1',
  },
  {
    title: '普通柱状图',
    key: 'bar-2',
  },
];

export default {
  name: 'ChartBar',
  title: '柱状图',
  templates: templates,
};
