import { autoModuleConversionSchema } from '@/utils';
import type { MetaCfg, PkgCfg } from './types';

type PkgModules = Record<string, { default: MetaCfg }>;

const materialNotes: PkgModules = import.meta.glob('./*/index.ts', { eager: true });

const pkgArray = autoModuleConversionSchema<PkgModules, MetaCfg, PkgCfg>(materialNotes, (item) => {
  return { ...item, label: item.title };
});
console.log(pkgArray);
export const createMaterialOptions = () => {

  return {
    menuItems: pkgArray,
  };
};
