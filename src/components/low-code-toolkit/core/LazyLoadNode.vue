<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import type { NodeProps } from '../types';

interface LazyLoadNodeProps {
  path: string;
  fieldProps: NodeProps
}
const props = defineProps<LazyLoadNodeProps>();

const AsyncComponent = defineAsyncComponent(() => import(props.path));

</script>

<template>
  <async-component v-bind="props.fieldProps" />
</template>

<style lang="scss" scoped>
</style>
