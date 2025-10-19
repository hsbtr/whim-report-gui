<script setup lang="ts">
import { ref, computed } from 'vue';
import SketchRuler from 'vue3-sketch-ruler';
import { useElementSize } from '@vueuse/core';
import { useLowCodeState, useLowCodeContext } from '../hooks';
import type { SketchRulerProps } from 'vue3-sketch-ruler';
import type { LowCodeProps } from '../types';
import 'vue3-sketch-ruler/lib/style.css';

const lowCodeState = useLowCodeState();
const context = useLowCodeContext();
const sketchpadRulerRef = ref<HTMLElement | null>(null);
const { width, height } = useElementSize(sketchpadRulerRef);
const thick = 16;

const scale = computed(() => {
  return lowCodeState.canvas.scale;
});
const sketchpadRulerProps = computed<LowCodeProps['sketchpadRuler']>(() => {
  const { sketchpadRuler } = context.config || {};
  return sketchpadRuler || {};
});
const sketchpadBacgroundColor = computed<string>(() => {
  return sketchpadRulerProps.value?.palette?.backgroundColor || '';
});
const palette = computed<SketchRulerProps['palette']>(() => {
  const { baseBackgroundColor } = sketchpadRulerProps.value?.palette || {};
  return lowCodeState.dark
    ? {
        bgColor: baseBackgroundColor,
        longfgColor: '#4d4d4d',
        shortfgColor: '#4d4d4d',
        fontColor: '#eff1f4',
        lineColor: '#f6f5f5',
        shadowColor: '#18181c',
        borderColor: '#18181c',
        cornerActiveColor: '#18181c'
      }
    : {};
});
</script>

<template>
  <div class="sketchpad-ruler" ref="sketchpadRulerRef">
    <sketch-ruler
      class="sketchpad-ruler-real"
      :thick="thick"
      :scale="scale"
      :width="width - 200"
      :height="height"
      :canvas-width="width - 200"
      :canvas-height="height"
      :palette="palette"
      :auto-center="false"
      :panzoom-option="{ startX: 60, startY: 60 }"
    >
      <template #default>
        <div
          data-type="page"
          class="sketchpad-ruler-inner"
          :style="{ width: `${width - 200}px`, height: `${height}px` }"
        >
          <slot />
        </div>
      </template>
    </sketch-ruler>
  </div>
</template>

<style lang="scss" scoped>
.sketchpad-ruler {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
//.sketchpad-ruler-real {
//  width: 100%;
//  height: 100%;
//  :deep(.canvasedit) {}
//}
.sketchpad-ruler-inner {
  background: v-bind(sketchpadBacgroundColor);
}
</style>
