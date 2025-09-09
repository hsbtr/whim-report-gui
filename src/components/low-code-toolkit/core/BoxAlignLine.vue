<script setup lang="ts">
import { computed } from 'vue';
import { useLowCodeState } from '../hooks';

const lowCodeState = useLowCodeState();
const borderColor = '#51d6a9';
const lines = computed(() => {
  const box = lowCodeState.selectionBox;
  if (!box.visible) return [];
  return [];
});
</script>

<template>
  <div></div>
</template>

<style lang="scss" scoped>
.align-lines {
  .line {
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    border-width: 1px;
    border-style: solid;
    border-color: v-bind(borderColor);
    opacity: 0.7;
  }
}
</style>
