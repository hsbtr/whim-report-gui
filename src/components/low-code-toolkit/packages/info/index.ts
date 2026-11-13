import { generatedSchemas } from '../../tools';
import { PkgType } from '../types';
import type { ListMeta, ListProp } from './list/meta';

export type InfoType = PkgType.info;
export type InfoProp = ListProp;
type InfoSchema = Omit<ListMeta, 'type'>;
export type InfoPkgType = Omit<InfoSchema, 'templates'> & {
  type: InfoType;
  templates: InfoProp[];
};

const infoModules = import.meta.glob<InfoSchema>('./*/meta.ts', { eager: true, import: 'default' });

export const pkgSchema = generatedSchemas(infoModules, ({ templates, ...meta }): InfoPkgType => ({
  ...meta,
  type: PkgType.info,
  templates: templates.map((template) => ({ ...template, type: PkgType.info, series: meta.name }))
}));

export default {
  title: '信息',
  key: PkgType.info,
  components: pkgSchema
};
