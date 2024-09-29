import type { MetaCfg, PkgCfg } from '../../types';

export interface ListMeta extends MetaCfg {
  type: 'list';
  props: PkgCfg[];
}
export default {
  title: '列表',
  type: 'list',
  belong: 'view',
  props: [
    {
      title: '普通列表',
      type: 'list-1',
    }
  ]
};
