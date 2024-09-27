<script setup lang="ts">
import { computed } from 'vue';
import { RouterView } from 'vue-router';
import { NConfigProvider, zhCN, enUS, dateEnUS, dateZhCN, darkTheme } from 'naive-ui';
import AppProvider from '@/components/popups/AppProvider.vue';
import { useUiStore } from '@/stores/uiStore';
import { LanguageEnum } from '@/config';
import { useHLJSInit } from '@/hooks';
import type { ConfigProviderProps, GlobalTheme } from 'naive-ui';

const uiStore = useUiStore();
const hlJS = useHLJSInit();

const dark = computed(() => {
  return uiStore.getTheme === 'dark' ? darkTheme : null;
}) as GlobalTheme;
const locale = computed(() => {
  return uiStore.getLang === LanguageEnum.ZH ? zhCN : enUS;
});
const dateLocale = computed(() => {
  return uiStore.getLang === LanguageEnum.ZH ? dateZhCN : dateEnUS;
});

</script>

<template>
  <NConfigProvider
    :theme="dark"
    :locale="locale"
    :date-locale="dateLocale"
    :hljs="hlJS"
  >
    <AppProvider>
      <router-view />
    </AppProvider>
  </NConfigProvider>
</template>

<style scoped>
</style>
