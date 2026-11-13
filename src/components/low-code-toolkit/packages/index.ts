import type { PkgComponentMeta } from '../types';

const metaModules = import.meta.glob<PkgComponentMeta>('./*/meta.ts', { eager: true, import: 'default' });

export const pkgMetas = Object.values(metaModules);
