import type { MetaCfg, PkgCfg } from '../../types';

export interface LineMeta extends MetaCfg {
  type: 'line';
  props: PkgCfg[];
}

export default {
  title: '折线图',
  type: 'line',
  belong: 'chart',
  props: [
    {
      title: '普通折线图',
      type: 'line-1',
    }
  ]
};
