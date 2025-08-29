import { Pkg, ChartOpts } from '../../common/constant';
import type { PkgComponentMeta } from '../../types';

const meta: PkgComponentMeta = {
  title: ChartOpts.bar.label,
  type: ChartOpts.bar.value,
  key: ChartOpts.bar.value,
  pkgType: Pkg.chart.value,
  fieldProps: [
    {
      title: '普通柱状图1',
      key: 'bar-1',
    },
    {
      title: '普通柱状图2',
      key: 'bar-2',
    },
  ]
};

export default meta;
