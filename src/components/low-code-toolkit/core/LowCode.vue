<script setup lang="ts">
import { reactive, provide } from 'vue';
import { LowCodeEvent, LowCodeShare } from '../common/constant';
import SketchpadEngine from './SketchpadEngine.vue';
import type { LowCodeStateType, LowCodeProps, NodeProps } from '../types';

const { mode = 'view', dark = false } = defineProps<LowCodeProps>();

const lowCodeState = reactive<LowCodeStateType>({
  nodes: [],
  selected: [],
  mode: mode,
  dark: dark,
  canvas: {
    offset: 0,
    scale: 1
  },
  isAdd: false,
  isMove: false,
  isSelect: false
});

const onSelect = (node: NodeProps) => {
  lowCodeState.selected.push(node);
};
const onAddNode = (node: NodeProps) => {
  lowCodeState.nodes.push(node);
};

provide(LowCodeShare.globalState, lowCodeState);
provide(LowCodeEvent.select, onSelect);
provide(LowCodeEvent.addNode, onAddNode);
</script>

<template>
  <div class="low-code-wrapper">
    <slot>
      <sketchpad-engine />
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.low-code-wrapper {
  width: 100%;
  height: 100%;
}
</style>
