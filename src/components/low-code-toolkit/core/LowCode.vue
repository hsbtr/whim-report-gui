<script setup lang="ts">
import { reactive, provide } from 'vue';
import { LowCodeEvent, LowCodeShare } from '../common/constant';
import PaintingArea from './PaintingArea.vue';
import type { LowCodeStateType } from '../types';

type ChartCfg = {
  title: string;
  chartType: string;
  id: string;
};
type ChartCfgKey = keyof ChartCfg;

const lowCodeStore = reactive<LowCodeStateType>({
  nodes: [],
  selected: {},
  mode: 'view',
});

const onSelected = () => {

};
const onUpdateNode = (chartCfg: ChartCfg) => {
  (Object.keys(chartCfg) as ChartCfgKey[]).forEach((key) => {});
};
const onAddNode = (node) => {
  lowCodeStore.nodes.push(node);
};

provide(LowCodeShare.globalState, lowCodeStore);
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
