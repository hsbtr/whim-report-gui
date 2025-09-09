<script setup lang="ts">
import BoxAlignLine from './BoxAlignLine.vue';
import { useBoxSelect } from '../hooks';

const { mousedown } = useBoxSelect();

const bkgColor = '#51d6a9';
</script>

<template>
  <div class="sketchpad-box-select" @mousedown="mousedown">
    <slot />
    <box-align-line />
    <div class="box-select">
      <div class="box-select-background" />
      <div class="box-select-border" />
    </div>
    <div class="mask-model" />
  </div>
</template>

<style lang="scss" scoped>
.sketchpad-box-select {
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
  .box-select {
    position: absolute;
    .box-select-background, .box-select-border {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .box-select-background {
      top: 2px;
      left: 2px;
      opacity: 0.08;
      background-color: v-bind(bkgColor);
    }
    .box-select-border {
      left: 0;
      top: 0;
      opacity: 1;
      border-width: 1px;
      border-style: solid;
      border-color: v-bind(bkgColor);
    }
  }

}
</style>
