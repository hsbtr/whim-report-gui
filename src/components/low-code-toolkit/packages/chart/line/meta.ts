import type { MetaCfg, PkgCfg, PkgType } from '../../types';

export type ComponentName = 'ChartLine';
export interface LineProp extends PkgCfg {
  type: PkgType.chart;
  name: ComponentName;
  series: string;
}
type LineTempProp = Omit<LineProp, 'type' | 'series' | 'name'>;
export interface LineMeta extends MetaCfg {
  name: ComponentName;
  type: PkgType.chart;
  templates: LineTempProp[];
}

const templates: LineTempProp[] = [
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
