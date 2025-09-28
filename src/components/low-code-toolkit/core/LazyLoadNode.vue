<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import type { NodeProps } from '../types';

interface LazyLoadNodeProps {
  path: string;
  fieldProps: NodeProps
}
const props = defineProps<LazyLoadNodeProps>();

// TODO 还需要配置加载中组件 错误组件
const AsyncComponent = defineAsyncComponent({
  loader: () => import(props.path),
});

</script>

<template>
  <AsyncComponent v-bind="props.fieldProps" />
</template>

<style lang="scss" scoped>
</style>
