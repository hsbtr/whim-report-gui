<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useThemeVars, NLayout, NLayoutHeader, NLayoutContent } from 'naive-ui';
import { LowCode, StencilArea, SketchpadEngine } from '@/components/low-code-toolkit';

const themes = useThemeVars();

onMounted(() => {
  // console.log(1);
});

</script>

<template>
  <low-code>
    <n-layout>
      <n-layout-header class="editor-header" bordered inverted></n-layout-header>
      <n-layout-content class="editor-content">
        <stencil-area class="sten-cli-panel" />
        <sketchpad-engine class="draw-inner" />
      </n-layout-content>
    </n-layout>
  </low-code>
</template>

<style lang="scss" scoped>
.editor-header {
  height: 64px;
}
.editor-content :deep(.n-layout-scroll-container) {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
}
.sten-cli-panel {
  flex: 0 0 300px;
}
.draw-inner {
  flex: 1 1 auto;
}
.low-code {
  width: 100%;
  height: 100vh;
  background-color: v-bind('themes.baseColor');
  .low-code-header {
    width: 100%;
    height: 6.97vh;
    padding: 0 16px;
    margin: 0 0 16px 0;
    background-color: v-bind('themes.cardColor');
    border-bottom: solid 1px v-bind('themes.borderColor');
    box-sizing: border-box;
  }
  .low-code-main {
    width: 100%;
    height: 90vh;
    display: flex;
    .sten-cli-box {
      flex: 0 0 300px;
      background-color: v-bind('themes.cardColor');
      border: solid 1px v-bind('themes.borderColor');
    }
    .paint-draw {
      flex: 1 1 auto;
      margin: 0 16px;
      background-color: v-bind('themes.cardColor');
      border: solid 1px v-bind('themes.borderColor');
    }
  }
}
</style>
