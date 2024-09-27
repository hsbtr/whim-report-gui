import { autoModuleConversionSchema } from '@/utils';
import type { MetaCfg, PkgCfg } from '../types';

type ControlType = 'frame';
interface ControlMeta extends MetaCfg {
  type: ControlType;
  props: PkgCfg[];
}
interface PkgType extends ControlMeta {
  belong: 'control';
}
type ChartModules = Record<string, { default: ControlType }>;

const controlModules: ChartModules = import.meta.glob('./*/meta.ts', { eager: true });

export const pkgSchema = autoModuleConversionSchema<ChartModules, PkgType, ControlMeta>(controlModules, (item) => {
  return { ...item, belong: 'control' };
});

export default {
  title: '控件',
  key: 'control',
  pkgs: pkgSchema,
};
