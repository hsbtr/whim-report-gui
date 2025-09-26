<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import type { NodeProps } from '../types';

interface LazyLoadNodeProps {
  path: string;
}
const props = defineProps<LazyLoadNodeProps>();

const AsyncComponent = defineAsyncComponent(() => import(props.path));

</script>

<template>
  <async-component :series="props.series" :type="props.type" />
</template>

<style lang="scss" scoped>
</style>
