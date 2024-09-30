import type { MetaCfg, PkgCfg } from '../../types';

export interface LineMeta extends MetaCfg {
  type: 'line';
  props: LineProp[];
}
export interface LineProp extends PkgCfg {

}
export default {
  title: '折线图',
  type: 'line',
  belong: 'chart',
  props: [
    {
      title: '普通折线图',
      type: 'line-1',
    },
    {
      title: '普通折线图',
      type: 'line-2',
    },
    {
      title: '普通折线图',
      type: 'line-3',
    },
    {
      title: '普通折线图',
      type: 'line-4',
    },
    {
      title: '普通折线图',
      type: 'line-5',
    }
  ]
};
