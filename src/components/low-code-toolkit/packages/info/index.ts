import { generatedSchemas } from '../../tools';
import { PkgType } from '../types';
import type { ListMeta, ListProp } from './list/meta';

export type InfoType = ListMeta['type'];
export type InfoProp = ListProp;
type InfoSchema = ListMeta;
export type InfoPkgType = Omit<InfoSchema, 'templates'> & {
  type: PkgType.info;
  templates: InfoProp[];
}
type InfoModules = Record<string, { default: InfoSchema }>;

const infoModules: InfoModules = import.meta.glob('./*/meta.ts', { eager: true });

export const pkgSchema = generatedSchemas<InfoModules, InfoPkgType, Omit<InfoSchema, 'type'>>(infoModules, ({ templates, ...rest }, filePath) => {
  const temps: InfoProp[] = templates.map((temp) => {
    return { ...temp, type: PkgType.info, series: rest.name, loadPath: `/${filePath}/${rest.name}` };
  });
  return { ...rest, type: PkgType.info, templates: temps };
});

export default {
  title: '信息',
  key: 'info',
  components: pkgSchema,
};
