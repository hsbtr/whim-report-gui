<script setup lang="ts">
import { onMounted } from 'vue';
import { NLayout, NLayoutHeader, NLayoutSider, NLayoutContent } from 'naive-ui';
import { LowCode, StencilArea, PaintingArea } from '@/components/low-code-toolkit';
onMounted(() => {
  // console.log(1);
});

</script>

<template>
  <low-code>
    <n-layout content-class="customize-editor">
      <n-layout-header class="head-tools" bordered inverted></n-layout-header>
      <n-layout-content sider-placement="left" has-sider>
        <n-layout-sider
          content-class="chart-options"
          collapse-mode="width"
          :collapsed-width="300"
          width="300px"
          collapsed
          bordered
          inverted
        >
          <stencil-area />
        </n-layout-sider>
        <div class="paint-main">
          <painting-area/>
        </div>
      </n-layout-content>
    </n-layout>
  </low-code>
</template>

<style lang="scss" scoped>
:deep(.customize-editor) {
  width: 100%;
  .head-tools {
    height: 64px;
  }
  .chart-options {
    height: 93vh;
  }
}
.paint-main {
  width: 100%;
  align-self: stretch;
}
</style>
