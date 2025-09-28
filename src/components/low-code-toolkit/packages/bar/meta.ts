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
      uuid: 'VBar-1',
      dataSource: [220, 182, 191, 234, 290]
    },
    {
      title: '普通柱状图2',
      uuid: 'VBar-2',
    },
  ]
};

export default meta;
