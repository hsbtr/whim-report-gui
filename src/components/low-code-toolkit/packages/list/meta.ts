import { Pkg, ExhibitOpts } from '../../common/constant';
import type { PkgComponentMeta } from '../../types';

const meta: PkgComponentMeta = {
  title: ExhibitOpts.list.label,
  type: ExhibitOpts.list.value,
  key: ExhibitOpts.list.value,
  pkgType: Pkg.exhibit.value,
  fieldProps: [
    {
      title: '普通列表',
      key: 'list-1',
    }
  ]
};

export default meta;
