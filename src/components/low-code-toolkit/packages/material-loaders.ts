import type { Component } from 'vue';

const materialLoaders = import.meta.glob<Component>('./*/*.vue', { import: 'default' });
const packagePrefix = '../packages/';

export function getMaterialLoader(loadPath: unknown) {
  if (typeof loadPath !== 'string' || !loadPath.startsWith(packagePrefix)) return;

  const path = `./${loadPath.slice(packagePrefix.length)}`;
  return materialLoaders[path.endsWith('.vue') ? path : `${path}.vue`];
}
