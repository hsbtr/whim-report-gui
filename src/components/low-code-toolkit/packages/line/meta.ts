import { Pkg, ChartOpts } from '../../common/constant';
import type { PkgComponentMeta } from '../../types';

const meta: PkgComponentMeta = {
  title: ChartOpts.line.label,
  type: ChartOpts.line.value,
  key: ChartOpts.line.value,
  pkgType: Pkg.chart.value,
  fieldProps: [
    {
      title: '普通折线图',
      uuid: 'VLine-1',
    },
    {
      title: '普通折线图',
      uuid: 'VLine-2',
    },
    {
      title: '普通折线图',
      uuid: 'VLine-3',
    },
    {
      title: '普通折线图',
      uuid: 'VLine-4',
    },
    {
      title: '普通折线图',
      uuid: 'VLine-5',
    }
  ],
};
export default meta;
