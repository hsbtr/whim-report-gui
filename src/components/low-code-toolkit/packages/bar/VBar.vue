<script setup lang="ts">
import EChartBar from '@/components/ve-chart/EChartBar.vue';
import type { NodeProps } from '../../types';
const props = defineProps<NodeProps>();
</script>

<template>
  <EChartBar :title="props.title" :data-source="props.dataSource" />
</template>

<style scoped>

</style>
