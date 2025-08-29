import { Pkg, ControlOpts } from '../../common/constant';
import type { PkgComponentMeta } from '../../types';

const meta: PkgComponentMeta = {
  title: ControlOpts.frame.label,
  type: ControlOpts.frame.value,
  key: ControlOpts.frame.value,
  pkgType: Pkg.control.value,
  fieldProps: [
    {
      title: '普通边框',
      key: 'frame-1',
    }
  ]
};
export default meta;
