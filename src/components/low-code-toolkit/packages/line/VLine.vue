<script setup lang="ts">
import EChartLine from '@/components/ve-chart/EChartLine.vue';

const props = defineProps({
  url: {
    type: String,
    default: () => ''
  }
});
</script>

<template>
  <EChartLine title="" :data-source="[]" />
</template>

<style scoped></style>
