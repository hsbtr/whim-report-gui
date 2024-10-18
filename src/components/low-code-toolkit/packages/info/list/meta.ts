import type { MetaCfg, PkgCfg } from '../../types';

export interface ListMeta extends MetaCfg {
  type: 'list';
  props: PkgCfg[];
}
export interface ListProp extends PkgCfg {}

const presetTemplates = [
  {
    title: '普通列表',
    type: 'list-1',
  }
];
export default {
  title: '列表',
  type: 'list',
  belong: 'view',
  presetTemplates: presetTemplates,
};
