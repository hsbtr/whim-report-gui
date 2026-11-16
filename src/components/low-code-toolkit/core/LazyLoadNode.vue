<script setup lang="ts">
import { computed, defineAsyncComponent, h } from 'vue';
import type { FunctionalComponent } from 'vue';
import { getMaterialLoader } from '../packages/material-loaders';
import type { NodeProps } from '../types';

interface LazyLoadNodeProps {
  path?: string;
  fieldProps: NodeProps;
}
const props = defineProps<LazyLoadNodeProps>();

const UnavailableMaterial: FunctionalComponent = (_, { attrs }) =>
  h('div', { class: 'material-unavailable', role: 'status', style: attrs.style }, '物料无法加载');
UnavailableMaterial.inheritAttrs = false;

const material = computed(() => {
  const path = props.path;
  const load = getMaterialLoader(path);
  if (!load) {
    if (import.meta.env.DEV) console.warn('找不到物料组件', path);
    return UnavailableMaterial;
  }

  return defineAsyncComponent(() =>
    load().catch((error: unknown) => {
      if (import.meta.env.DEV) console.warn('物料组件加载失败', path, error);
      return UnavailableMaterial;
    })
  );
});
</script>

<template>
  <component :is="material" v-bind="props.fieldProps" />
</template>

<style scoped>
.material-unavailable {
  display: grid;
  place-items: center;
  overflow: hidden;
  outline: 1px dashed currentColor;
}
</style>
