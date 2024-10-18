<script setup lang="ts">
import { reactive, provide } from 'vue';
import { layerCurrentlySelected, layerSelectionEvent, editorCfg } from '../provider/context';

type ChartCfg = {
  title: string;
  chartType: string;
  id: string;
};
type ChartCfgKey = keyof ChartCfg;

const drawConfig = reactive({
  components: [],
  selected: {},
});

const selectedLayer = reactive<ChartCfg>({ chartType: '', id: '', title: '' });

const onSelected = (chartCfg: ChartCfg) => {
  (Object.keys(chartCfg) as ChartCfgKey[]).forEach((key) => {
    selectedLayer[key] = chartCfg[key];
  });
};

provide(editorCfg, drawConfig);
provide(layerCurrentlySelected, selectedLayer);
provide(layerSelectionEvent, onSelected);
</script>

<template>
  <div class="low-code-layout">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.low-code-layout {
  width: 100%;
  height: 100%;
}
</style>
