import type { MetaCfg, PkgCfg, PkgType } from '../../types';

export type ComponentName = 'List';
export interface ListProp extends PkgCfg {
  name: ComponentName;
  type: PkgType.info;
  series: string;
}
type ListTempProp = Omit<ListProp, 'name' | 'type' | 'series'>;
export interface ListMeta extends MetaCfg {
  name: ComponentName;
  type: PkgType.info;
  templates: ListTempProp[];
}

const templates: ListTempProp[] = [
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
