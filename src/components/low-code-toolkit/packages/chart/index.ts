import { generatedSchemas } from '../../tools';
import { PkgType } from '../types';
import type { LineMeta, LineProp } from './line/meta';
import type { BarMeta, BarProp } from './bar/meta';

export type ChartType = LineMeta['type'] | BarMeta['type'];
export type ChartProp = LineProp | BarProp;
type ChartSchema = BarMeta | LineMeta;
export type ChartPkgType = ChartSchema & {
  type: PkgType.chart;
}

type ChartModules = Record<string, { default: ChartSchema }>;

const chartModules: ChartModules = import.meta.glob('./*/meta.ts', { eager: true });

export const pkgSchemas = generatedSchemas<ChartModules, ChartPkgType, Omit<ChartSchema, 'type'>>(chartModules, ({ templates, ...rest }) => {
  const temps: ChartProp[] = templates.map((temp) => {
    return { ...temp, type: PkgType.chart, series: rest.name };
  });
  return { ...rest, type: PkgType.chart, templates: temps };
});

export default {
  title: '图表',
  key: 'chart',
  components: pkgSchemas,
};

