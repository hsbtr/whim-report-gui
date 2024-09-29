import { autoModuleConversionSchema } from '@/utils';
import type { LineMeta } from './line/meta';
import type { BarMeta } from './bar/meta';

export type ChartType = LineMeta['type'] | BarMeta['type'];
type ChartSchema = BarMeta | LineMeta;
export type ChartPkgType = ChartSchema & {
  belong: 'chart';
}

type ChartModules = Record<string, { default: ChartSchema }>;

const chartModules: ChartModules = import.meta.glob('./*/meta.ts', { eager: true });

export const pkgSchemas = autoModuleConversionSchema<ChartModules, ChartPkgType, ChartSchema>(chartModules, (item) => {
  return { ...item, belong: 'chart' };
});

export default {
  title: '图表',
  key: 'chart',
  components: pkgSchemas,
};

