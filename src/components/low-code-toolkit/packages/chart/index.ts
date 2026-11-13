import { generatedSchemas } from '../../tools';
import { PkgType } from '../types';
import type { LineMeta, LineProp } from './line/meta';
import type { BarMeta, BarProp } from './bar/meta';

export type ChartType = PkgType.chart;
export type ChartProp = LineProp | BarProp;
type ChartSchema = Omit<LineMeta | BarMeta, 'type'>;
export type ChartPkgType = Omit<ChartSchema, 'templates'> & {
  type: ChartType;
  templates: ChartProp[];
};

const chartModules = import.meta.glob<ChartSchema>('./*/meta.ts', { eager: true, import: 'default' });

export const pkgSchemas = generatedSchemas(chartModules, ({ templates, ...meta }): ChartPkgType => ({
  ...meta,
  type: PkgType.chart,
  templates: templates.map((template) => ({ ...template, type: PkgType.chart, series: meta.name }))
}));

export default {
  title: '图表',
  key: PkgType.chart,
  components: pkgSchemas
};
