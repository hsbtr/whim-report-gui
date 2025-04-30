import { generatedSchemas } from '../../tools';
import { PkgType } from '../types';
import type { FrameMeta, FrameProp } from './frame/meta';

export type ControlType = FrameMeta['type'];
export type ControlProp = FrameProp;
type ControlSchema = FrameMeta;
export type ControlPkgType = Omit<ControlSchema, 'templates'> & {
  type: PkgType.control;
  templates: ControlProp[];
}
type ChartModules = Record<string, { default: ControlType }>;

const controlModules: ChartModules = import.meta.glob('./*/meta.ts', { eager: true });

export const pkgSchema = generatedSchemas<ChartModules, ControlPkgType, Omit<ControlSchema, 'type'>>(controlModules, ({ templates, ...rest }, series) => {
  const temps: ControlProp[] = templates.map((temp) => {
    return { ...temp, name: rest.name, type: PkgType.control, series: series || '' };
  });
  return { ...rest, type: PkgType.control, templates: temps };
});

export default {
  title: '控件',
  key: 'control',
  components: pkgSchema,
};
