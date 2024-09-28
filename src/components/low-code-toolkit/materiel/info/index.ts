import { autoModuleConversionSchema } from '@/utils';
import type { MetaCfg, PkgCfg } from '../types';

type InfoType = 'bar' | 'line';
interface InfoMeta extends MetaCfg {
  type: InfoType;
  props: PkgCfg[];
}
interface PkgType extends InfoMeta {
  belong: 'info';
}
type InfoModules = Record<string, { default: InfoMeta }>;

const infoModules: InfoModules = import.meta.glob('./*/meta.ts', { eager: true });

export const pkgSchema = autoModuleConversionSchema<InfoModules, PkgType, InfoMeta>(infoModules, (item) => {
  return { ...item, belong: 'info' };
});

export default {
  title: '信息',
  key: 'info',
  pkgs: pkgSchema,
};
