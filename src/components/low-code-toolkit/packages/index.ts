import { moduleToArray } from '../tools';
import type { PkgComponentMeta, PkgModule } from '../types';

const metaModules = import.meta.glob('./*/meta.ts', { eager: true });

export const pkgMetas = moduleToArray<PkgModule, PkgComponentMeta>(metaModules);

