<script setup lang="ts">
import { RouterView } from 'vue-router';
import { NLayout, NLayoutHeader, NLayoutContent, NMenu, NButton, NAvatar } from 'naive-ui';

</script>

<template>
  <n-layout>
    <n-layout-header class="layout-head">
      <div class="head-logo">
        <img src=""  alt="" />
        <span></span>
      </div>
      <div>
        <n-menu />
      </div>
      <div>
        <n-button></n-button>
        <div></div>
      </div>
    </n-layout-header>
    <n-layout-content>
      <router-view />
    </n-layout-content>
  </n-layout>
</template>

<style lang="scss" scoped>
.layout-head {
  width: 100%;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  box-sizing: border-box;
}
.head-logo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    width: 84px;
    height: 64px;
  }
}

</style>
