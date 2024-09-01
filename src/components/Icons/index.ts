import { h } from 'vue';
import { NIcon } from 'naive-ui';
import type { DefineComponent } from 'vue';

export const vIonIcons = (component: DefineComponent, props?: typeof NIcon) => {
  return () => h(NIcon, props, { default: () => h(component) });
};
