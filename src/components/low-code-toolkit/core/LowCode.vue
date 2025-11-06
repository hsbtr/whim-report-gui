<script setup lang="ts">
import { reactive, provide } from 'vue';
import { cloneDeep } from 'lodash-es';
import { LowCodeEvent, LowCodeShare } from '../common/constant';
import SketchpadArea from './SketchpadArea.vue';
import { defaultLowCodeState } from '../hooks';
import type { LowCodeStateType, LowCodeProps, NodeProps } from '../types';

const { mode = 'view', dark = false } = defineProps<LowCodeProps>();

const lowCodeState = reactive<LowCodeStateType>({
  ...cloneDeep(defaultLowCodeState),
  mode: mode,
  dark: dark
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
