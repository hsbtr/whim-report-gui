import type { MetaCfg, PkgCfg, PkgType } from '../../types';

export type ComponentName = 'List';
export interface ListProp extends PkgCfg {
  type: PkgType.info;
  series: ComponentName;
}
export interface ListMeta extends MetaCfg {
  name: ComponentName;
  type: PkgType.info;
  templates: Omit<ListProp, 'type' | 'series'>[];
}

const templates: Omit<ListProp, 'type' | 'series'>[] = [
  {
    title: '普通列表',
    key: 'list-1',
  }
];
export default {
  name: 'List',
  title: '列表',
  templates: templates,
};
