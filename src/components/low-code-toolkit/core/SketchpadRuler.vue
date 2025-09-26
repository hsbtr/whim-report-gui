<script setup lang="ts">
import { computed } from 'vue';
import SketchRuler from 'vue3-sketch-ruler';
import { useLowCodeState } from '../hooks';
import type { SketchRulerProps } from 'vue3-sketch-ruler';
import 'vue3-sketch-ruler/lib/style.css';

const lowCodeState = useLowCodeState();
const thick = 16;

const scale = computed(() => {
  return lowCodeState.canvas.scale;
});

const palette = computed<SketchRulerProps['palette']>(() => {
  return lowCodeState.dark
    ?
    {
      bgColor: '#18181c',
      longfgColor: '#4d4d4d',
      shortfgColor: '#4d4d4d',
      fontColor: '#eff1f4',
      lineColor: '#f6f5f5',
      shadowColor: '#18181c',
      borderColor: '#18181c',
      cornerActiveColor: '#18181c'
    }
    :
    {};
});

</script>

<template>
  <div class="sketchpad-ruler">
    <sketch-ruler
      :thick="thick"
      :scale="scale"
      :auto-center="true"
      :width="1080"
      :height="900"
      :canvas-width="800"
      :canvas-height="800"
      :palette="palette"
    >
      <template #default>
        <slot />
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
.sketchpad-ruler-inner {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: auto;
  user-select: none;
  padding-bottom: 0;

}
</style>
