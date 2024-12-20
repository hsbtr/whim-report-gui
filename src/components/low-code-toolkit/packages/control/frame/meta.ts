import type { MetaCfg, PkgCfg, PkgType } from '../../types';

export type ComponentName = 'Frame';
export interface FrameProp extends PkgCfg {
  type: PkgType.control;
  series: ComponentName;
}
export interface FrameMeta extends MetaCfg {
  name: ComponentName;
  type: PkgType.control;
  templates: Omit<FrameProp, 'type' | 'series'>[];
}

const templates: Omit<FrameProp, 'type' | 'series'>[] = [
  {
    title: '普通边框',
    key: 'frame-1',
  }
];
export default {
  name: 'Frame',
  title: '边框',
  templates: templates,
};
