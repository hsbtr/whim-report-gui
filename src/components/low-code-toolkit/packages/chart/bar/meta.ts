import type { MetaCfg, PkgCfg } from '../../types';

export interface BarMeta extends MetaCfg {
  type: 'bar';
  props: BarProp[];
}
export interface BarProp extends PkgCfg {

}

const presetTemplates = [
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
  type: 'bar',
  belong: 'chart',
  presetTemplates: presetTemplates,
};
