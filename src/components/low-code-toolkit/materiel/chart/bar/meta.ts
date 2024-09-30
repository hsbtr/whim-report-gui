import type { MetaCfg, PkgCfg } from '../../types';

export interface BarMeta extends MetaCfg {
  type: 'bar';
  props: BarProp[];
}
export interface BarProp extends PkgCfg {

}
export default {
  title: '柱状图',
  type: 'bar',
  belong: 'chart',
  props: [
    {
      title: '普通柱状图',
      type: 'bar-1',
    },
    {
      title: '普通柱状图',
      type: 'bar-2',
    },
  ]
};
