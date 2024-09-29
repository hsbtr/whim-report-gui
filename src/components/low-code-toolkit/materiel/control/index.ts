import { autoModuleConversionSchema } from '@/utils';
import type { FrameMeta } from './frame/meta';

export type ControlType = FrameMeta['type'];
type ControlSchema = FrameMeta;
export type ControlPkgType = ControlSchema & {
  belong: 'control';
}
type ChartModules = Record<string, { default: ControlType }>;

const controlModules: ChartModules = import.meta.glob('./*/meta.ts', { eager: true });

export const pkgSchema = autoModuleConversionSchema<ChartModules, ControlPkgType, ControlSchema>(controlModules, (item) => {
  return { ...item, belong: 'control' };
});

export default {
  title: '控件',
  key: 'control',
  components: pkgSchema,
};
