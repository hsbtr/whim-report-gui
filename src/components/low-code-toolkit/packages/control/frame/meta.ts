import type { MetaCfg, PkgCfg, PkgType } from '../../types';

export type ComponentName = 'Frame';
export interface FrameProp extends PkgCfg {
  name: ComponentName;
  type: PkgType.control;
  series: string;
}
type FrameTempProp = Omit<FrameProp, 'name' | 'type' | 'series'>;
export interface FrameMeta extends MetaCfg {
  name: ComponentName;
  type: PkgType.control;
  templates: FrameTempProp[];
}

const templates: FrameTempProp[] = [
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
