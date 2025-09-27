<script setup lang="ts">
import EChartBar from '@/components/ve-chart/EChartBar.vue';
import type { NodeProps } from '../../types';
const props = defineProps<Omit<NodeProps, 'key'>>();
</script>

<template>
  <EChartBar :title="props.title" :data-source="[]" />
</template>

<style scoped>

</style>
