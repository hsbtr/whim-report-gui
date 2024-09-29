import { autoModuleConversionSchema } from '@/utils';
import type { ListMeta } from './list/meta';

export type InfoType = ListMeta['type'];
type InfoSchema = ListMeta;
export type InfoPkgType = InfoSchema & {
  belong: 'info';
}
type InfoModules = Record<string, { default: InfoSchema }>;

const infoModules: InfoModules = import.meta.glob('./*/meta.ts', { eager: true });

export const pkgSchema = autoModuleConversionSchema<InfoModules, InfoPkgType, InfoSchema>(infoModules, (item) => {
  return { ...item, belong: 'info' };
});

export default {
  title: '信息',
  key: 'info',
  components: pkgSchema,
};
