import type { MetaCfg, PkgCfg } from '../../types';

export interface FrameMeta extends MetaCfg {
  type: 'frame';
  props: FrameProp[];
}
export interface FrameProp extends PkgCfg {

}
export default {
  title: '边框',
  type: 'frame',
  belong: 'control',
  props: [
    {
      title: '普通边框',
      type: 'frame-1',
    }
  ]
};
