<script setup lang="ts">
import { useBoxSelect } from '../hooks';

const { mousedown } = useBoxSelect();

</script>

<template>
  <div class="box-select-range" @mousedown="mousedown">
    <slot />
    <div class="mask-model"></div>
  </div>
</template>

<style lang="scss" scoped>
.box-select-range {
  position: relative;
  transform-origin: left top;
  background-size: cover;
  overflow: hidden;
  transition: all 0.4s;
  .mask-model {
    z-index: 1;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
