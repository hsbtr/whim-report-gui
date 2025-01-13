<script setup lang="ts">
import { reactive, provide } from 'vue';
import { LowCodeEvent, editorOptions } from '../provider/context';
import PaintingArea from './PaintingArea.vue';

type ChartCfg = {
  title: string;
  chartType: string;
  id: string;
};
type ChartCfgKey = keyof ChartCfg;

const drawOptions = reactive({
  nodes: [],
  selected: {},
});

const onSelected = () => {

};
const onUpdateNode = (chartCfg: ChartCfg) => {
  (Object.keys(chartCfg) as ChartCfgKey[]).forEach((key) => {});
};
const onAddNode = (node) => {
  drawOptions.nodes.push(node);
};

provide(editorOptions, drawOptions);
provide(LowCodeEvent.selected, onSelected);
provide(LowCodeEvent.addNode, onAddNode);
</script>

<template>
  <div class="low-code-wrapper">
    <slot>
      <painting-area />
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.low-code-wrapper {
  width: 100%;
  height: 100%;
}
</style>
