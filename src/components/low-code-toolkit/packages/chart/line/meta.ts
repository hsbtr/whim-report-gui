import type { MetaCfg, PkgCfg, PkgType } from '../../types';

export type ComponentName = 'ChartLine';
export interface LineProp extends PkgCfg {
  type: PkgType.chart;
  series: ComponentName;
}
export interface LineMeta extends MetaCfg {
  name: ComponentName;
  type: PkgType.chart;
  templates: Omit<LineProp, 'type' | 'series'>[];
}

const templates: Omit<LineProp, 'type' | 'series'>[] = [
  {
    title: '普通折线图',
    key: 'line-1',
  },
  {
    title: '普通折线图',
    key: 'line-2',
  },
  {
    title: '普通折线图',
    key: 'line-3',
  },
  {
    title: '普通折线图',
    key: 'line-4',
  },
  {
    title: '普通折线图',
    key: 'line-5',
  }
];
export default {
  name: 'ChartLine',
  title: '折线图',
  templates: templates,
};
