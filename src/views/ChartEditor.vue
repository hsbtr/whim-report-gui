<script setup lang="ts">
import { onMounted } from 'vue';
import { NLayout, NLayoutHeader, NLayoutSider, NLayoutContent } from 'naive-ui';
import { ContextProvider, InventoryPanel } from '@/components/low-code-toolkit';
onMounted(() => {
  // console.log(1);
});

</script>

<template>
  <ContextProvider>
    <n-layout content-class="customize-editor">
      <n-layout-header class="head-tools" bordered inverted></n-layout-header>
      <n-layout-content sider-placement="left" has-sider>
        <n-layout-sider
          content-class="chart-options"
          collapse-mode="width"
          :collapsed-width="400"
          collapsed
          bordered
          inverted
        >
          <inventory-panel />
        </n-layout-sider>
        <div></div>
      </n-layout-content>
    </n-layout>
  </ContextProvider>
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

</style>
