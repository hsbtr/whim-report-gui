import type { MetaCfg, PkgCfg, PkgType } from '../../types';

export type ComponentName = 'ChartBar';
export interface BarProp extends PkgCfg {
  type: PkgType.chart;
  series: ComponentName;
}
export interface BarMeta extends MetaCfg {
  name: ComponentName;
  type: PkgType.chart;
  templates: Omit<BarProp, 'type' | 'series'>[];
}

const templates: Omit<BarProp, 'type' | 'series'>[] = [
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
