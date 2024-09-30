import { autoModuleConversionSchema } from '@/utils';
import type { MetaCfg } from './types';
import type { ChartPkgType, ChartType, ChartProp } from './chart';
import type { ControlPkgType, ControlType, ControlProp } from './control';
import type { InfoPkgType, InfoType, InfoProp } from './info';

type PkgModules = Record<string, { default: MetaCfg }>;
type SchemaOpt = ChartPkgType | ControlPkgType | InfoPkgType;
export type ComponentType = ChartType | ControlType | InfoType;
export type ComponentCfg = ChartProp | ControlProp | InfoProp;
export type SchemaMetaCfg = MetaCfg & {
  label?: string;
  key: ComponentType;
  components: SchemaOpt[];
}

const materialNotes: PkgModules = import.meta.glob('./*/index.ts', { eager: true });

export const materialSchemas = autoModuleConversionSchema<PkgModules, SchemaMetaCfg, Omit<SchemaMetaCfg, 'label'>>(materialNotes, (item) => {
  return { ...item, label: item.title };
});
export const createMaterialOptions = () => {

  return {
    menuItems: materialSchemas,
  };
};
