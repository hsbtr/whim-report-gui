<script setup lang="ts">
import { computed } from 'vue';
import SketchRuler from 'vue3-sketch-ruler';
import { useLowCodeState } from '../hooks';
import type { SketchRulerProps } from 'vue3-sketch-ruler';

const lowCodeState = useLowCodeState();
const thick = 20;

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
      fontColor: '#4d4d4d',
      shadowColor: '#18181c',
      borderColor: '#18181c',
      cornerActiveColor: '#18181c'
    }
    :
    {};
});

</script>

<template>
  <div class="custom-sketch-ruler">
    <sketch-ruler
      :thick="thick"
      :scale="scale"
      :palette="palette"
    />
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.custom-sketch-ruler {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.custom-sketch-ruler-inner {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: auto;
  user-select: none;
  padding-bottom: 0;

}
</style>
