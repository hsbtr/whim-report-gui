import type { MetaCfg } from './types';
import type { ChartPkgType, ChartType, ChartProp } from './chart';
import type { ControlPkgType, ControlType, ControlProp } from './control';
import type { InfoPkgType, InfoType, InfoProp } from './info';

type SchemaOpt = ChartPkgType | ControlPkgType | InfoPkgType;
export type ComponentType = ChartType | ControlType | InfoType;
export type ComponentCfg = ChartProp | ControlProp | InfoProp;
export type SchemaMetaCfg = MetaCfg & {
  key: ComponentType;
  components: SchemaOpt[];
};

const materialNotes = import.meta.glob<SchemaMetaCfg>('./*/index.ts', { eager: true, import: 'default' });

export const materialSchemas = Object.values(materialNotes);
