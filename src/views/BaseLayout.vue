<script setup lang="ts">
import { ref, h } from 'vue';
import { RouterView, RouterLink, useRoute } from 'vue-router';
import { NLayout, NLayoutHeader, NLayoutContent, NMenu, NButton, NAvatar, NIcon, NFlex, NDropdown } from 'naive-ui';
import { LightModeFilled, DarkModeOutlined } from '@vicons/material';
import { useUiStore } from '@/stores/uiStore';
import { useCurrentRoutes } from '@/hooks';
import { mapArrayItem, renderIcon } from '@/utils';
import { setting } from '@/config';
import type { VNodeChild } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import type { MenuOption } from 'naive-ui';

type LabelType = string | (() => VNodeChild);

const route = useRoute();
const newRoutes = useCurrentRoutes();
const uiStore = useUiStore();
const menuSelected = ref(typeof route.name === 'string' ? route.name : '');

const dropdownItems = [
  {
    key: 'quit',
    label: '退出',
  },
];
const menuItems = mapArrayItem<RouteRecordRaw, MenuOption>(newRoutes, (item) => {
  const { meta, name, children } = item;
  const { title, hideInMenu, icon } = meta || {};
  let label: LabelType = title || '';
  if (!children) {
    label = () => h(RouterLink, { to: { name } }, { default: () => title });
  }
  return {
    label,
    key: name as string,
    show: hideInMenu,
    icon: renderIcon(icon),
  };
});
// console.log(menuItems)
const onTheme = () => {
  uiStore.updateTheme();
};
const onMenuUpdate = (key: string) => {
  menuSelected.value = key;
};
</script>

<template>
  <n-layout>
    <n-layout-header class="layout-head" bordered>
      <div class="head-logo">
        <img :src="setting.logo"  alt="" />
        <span>{{ setting.title }}</span>
      </div>
      <div class="head-content">
        <n-menu :options="menuItems" mode="horizontal" v-model:value="menuSelected" @update:value="onMenuUpdate" />
      </div>
      <n-flex align="center">
        <n-button size="small" :bordered="false" @click="onTheme" ghost>
          <n-icon size="24">
            <dark-mode-outlined v-if="uiStore.getTheme === 'dark'" />
            <light-mode-filled v-else />
          </n-icon>
        </n-button>
        <n-dropdown :options="dropdownItems">
          <n-flex align="center">
            <n-avatar size="small" round />
            <span>张三</span>
          </n-flex>
        </n-dropdown>
      </n-flex>
    </n-layout-header>
    <n-layout-content class="layout-content" inverted bordered>
      <router-view />
    </n-layout-content>
  </n-layout>
</template>

<style lang="scss" scoped>
.layout-head {
  width: 100%;
  height: 54px;
  padding: 0 16px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-content: center;
  box-sizing: border-box;
}
.head-logo {
  height: inherit;
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    width: 34px;
    height: 34px;
  }
  span {
    margin: 0 0 0 8px;
    font-size: 24px;
    font-weight: 700;
  }
}
.head-content {
  flex: 1 1 auto;
  :deep(.n-menu) {
    height: 54px;
    align-items: center;
  }
}
.head-extra {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.layout-content {
  min-height: 100vh;
  padding: 70px 16px 0 16px;
  box-sizing: border-box;
}
</style>
