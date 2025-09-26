<script setup lang="ts">
import { reactive, provide } from 'vue';
import { LowCodeEvent, LowCodeShare } from '../common/constant';
import SketchpadArea from './SketchpadArea.vue';
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
  isSelect: false,
  selectionBox: {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    visible: false,
    source: null
  },
  mousePosition: {
    startX: 0,
    startY: 0,
    x: 0,
    y: 0
  }
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
      <SketchpadArea />
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.low-code-wrapper {
  width: 100%;
  height: 100%;
}
</style>
