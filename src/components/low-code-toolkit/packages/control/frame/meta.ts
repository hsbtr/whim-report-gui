import type { MetaCfg, PkgCfg } from '../../types';

export interface FrameMeta extends MetaCfg {
  type: 'frame';
  props: FrameProp[];
}
export interface FrameProp extends PkgCfg {

}
const presetTemplates = [
  {
    title: '普通边框',
    type: 'frame-1',
  }
];
export default {
  name: 'ControlFrame',
  title: '边框',
  type: 'frame',
  belong: 'control',
  presetTemplates: presetTemplates,
};
