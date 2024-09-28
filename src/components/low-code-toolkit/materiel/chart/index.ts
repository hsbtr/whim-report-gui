import { autoModuleConversionSchema } from '@/utils';
import type { MetaCfg, PkgCfg } from '../types';

type ChartType = 'bar' | 'line';
interface ChartMeta extends MetaCfg {
  type: ChartType;
  props: PkgCfg[];
}
interface PkgType extends ChartMeta {
  belong: 'chart';
}
type ChartModules = Record<string, { default: ChartMeta }>;

const chartModules: ChartModules = import.meta.glob('./*/meta.ts', { eager: true });

export const pkgSchemas = autoModuleConversionSchema<ChartModules, PkgType, ChartMeta>(chartModules, (item) => {
  return { ...item, belong: 'chart' };
});

export default {
  title: '图表',
  key: 'chart',
  pkgs: pkgSchemas,
};

