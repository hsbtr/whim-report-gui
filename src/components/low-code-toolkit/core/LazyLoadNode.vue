<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import type { Component } from 'vue';
import type { NodeProps } from '../types';

interface LazyLoadNodeProps {
  path: string;
  fieldProps: NodeProps
}
const props = defineProps<LazyLoadNodeProps>();

const materialLoaders = import.meta.glob<Component>('../packages/*/*.vue', { import: 'default' });
const loader = materialLoaders[props.path];
const AsyncComponent = loader ? defineAsyncComponent(loader) : null;

</script>

<template>
  <component :is="AsyncComponent" v-if="AsyncComponent" v-bind="props.fieldProps" />
</template>

<style lang="scss" scoped>
</style>
