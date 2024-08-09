<script setup lang="ts">
import { reactive, provide } from 'vue';
import { layerCurrentlySelected, layerSelectionEvent } from '@/components/CodeKit/context';

type ChartCfg = {
  title: string;
  chartType: string;
  id: string;
};
type ChartCfgKey = keyof ChartCfg;

const selectedLayer = reactive<ChartCfg>({ chartType: '', id: '', title: '' });

const onSelected = (chartCfg: ChartCfg) => {
  (Object.keys(chartCfg) as ChartCfgKey[]).forEach((key) => {
    selectedLayer[key] = chartCfg[key];
  });
};

provide(layerCurrentlySelected, selectedLayer);
provide(layerSelectionEvent, onSelected);
</script>

<template>
  <slot></slot>
</template>

<style scoped>

</style>
