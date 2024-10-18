import { autoModuleConversionSchema } from '@/utils';
import type { DefineComponent } from 'vue';
import type { MetaCfg, MaterialPackage } from './types';
import type { ChartPkgType, ChartType, ChartProp } from './chart';
import type { ControlPkgType, ControlType, ControlProp } from './control';
import type { InfoPkgType, InfoType, InfoProp } from './info';

type PkgModules<T = any> = Record<string, { default: T }>;
type SchemaOpt = ChartPkgType | ControlPkgType | InfoPkgType;
export type ComponentType = ChartType | ControlType | InfoType;
export type ComponentCfg = ChartProp | ControlProp | InfoProp;
export type SchemaMetaCfg = MetaCfg & {
  label?: string;
  key: ComponentType;
  components: SchemaOpt[];
}
type PackageKey = keyof MaterialPackage;

const materialNotes: PkgModules<MetaCfg> = import.meta.glob('./*/index.ts', { eager: true });
console.log(materialNotes);

const pkgGlob: PkgModules<DefineComponent<{}, any>> = import.meta.glob('./*/*/*.vue', { eager: true });
console.log(pkgGlob);

const packages: Partial<MaterialPackage> = {};
Object.keys(pkgGlob).forEach((key) => {
  const component: DefineComponent<{}, any> = pkgGlob[key].default;
  const { __name } = component;
  if (__name) {
    packages[__name as PackageKey] = component;
  } else {
    const name = key.split('/').pop()?.replace('.vue', '');
    if (name) {
      packages[name as PackageKey] = component;
    }
  }
});


export const materialSchemas = autoModuleConversionSchema<PkgModules, SchemaMetaCfg, Omit<SchemaMetaCfg, 'label'>>(materialNotes, (item) => {
  return { ...item, label: item.title };
});
