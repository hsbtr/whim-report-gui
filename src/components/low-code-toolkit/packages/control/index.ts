import { generatedSchemas } from '../../tools';
import { PkgType } from '../types';
import type { FrameMeta, FrameProp } from './frame/meta';

export type ControlType = PkgType.control;
export type ControlProp = FrameProp;
type ControlSchema = Omit<FrameMeta, 'type'>;
export type ControlPkgType = Omit<ControlSchema, 'templates'> & {
  type: ControlType;
  templates: ControlProp[];
};

const controlModules = import.meta.glob<ControlSchema>('./*/meta.ts', { eager: true, import: 'default' });

export const pkgSchema = generatedSchemas(controlModules, ({ templates, ...meta }): ControlPkgType => ({
  ...meta,
  type: PkgType.control,
  templates: templates.map((template) => ({ ...template, type: PkgType.control, series: meta.name }))
}));

export default {
  title: '控件',
  key: PkgType.control,
  components: pkgSchema
};
