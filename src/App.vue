<script setup lang="ts">
import { computed } from 'vue';
import { RouterView } from 'vue-router';
import { zhCN, enUS, dateEnUS, dateZhCN, darkTheme } from 'naive-ui';
import AppConfigProvider from '@/components/popups/AppConfigProvider.vue';
import { useUiStore } from '@/stores';
import { LanguageEnum } from '@/config';
import { useHLJSInit } from '@/hooks';
import type { ConfigProviderProps } from 'naive-ui';

const uiStore = useUiStore();
const hlJS = useHLJSInit();

const dark = computed<ConfigProviderProps['theme']>(() => {
  return uiStore.getTheme === 'dark' ? darkTheme : null;
});
const locale = computed(() => {
  return uiStore.getLang === LanguageEnum.ZH ? zhCN : enUS;
});
const dateLocale = computed(() => {
  return uiStore.getLang === LanguageEnum.ZH ? dateZhCN : dateEnUS;
});

</script>

<template>
  <app-config-provider
    :theme="dark"
    :locale="locale"
    :date-locale="dateLocale"
    :hljs="hlJS"
  >
    <router-view />
  </app-config-provider>
</template>

<style scoped>
</style>
