import { h } from 'vue';
import { NIcon } from 'naive-ui';
import type { Component, VNode } from 'vue';

type ElmNode = undefined | (() => VNode);
export const renderIcon = (icon?: Component, iconProps?: typeof NIcon): ElmNode => {
  if (!icon) return;
  return () => h(NIcon, iconProps, { default: () => h(icon) });
};
