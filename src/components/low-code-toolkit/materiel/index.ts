import { autoModuleConversionSchema } from '@/utils';
import type { MetaCfg, PkgCfg } from './types';

type PkgModules = Record<string, { default: MetaCfg }>;
export type SchemaItem = SchemaMetaCfg & PkgCfg;
export type SchemaMetaCfg = MetaCfg & {
  key: string;
  pkgs: PkgCfg[];
}

const materialNotes: PkgModules = import.meta.glob('./*/index.ts', { eager: true });

export const materialSchemas = autoModuleConversionSchema<PkgModules, SchemaMetaCfg, SchemaItem>(materialNotes, (item) => {
  return { ...item, label: item.title };
});
export const createMaterialOptions = () => {

  return {
    menuItems: materialSchemas,
  };
};
