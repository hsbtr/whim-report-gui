<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router';
import { NConfigProvider, zhCN, enUS, dateEnUS, dateZhCN, darkTheme } from 'naive-ui';
import AppProvider from '@/components/popups/AppProvider.vue';
import { useStyleStore } from '@/stores/styleStore';
import { useLangStore } from '@/stores/langStore';
import { LanguageEnum } from '@/config';
import { useHLJSInit } from '@/hooks';

const styleStore = useStyleStore();
const langStore = useLangStore();
const hlJS = useHLJSInit();

const dark = computed(() => {
  return styleStore.getTheme === 'dark' ? darkTheme : undefined;
});
const locale = computed(() => {
  return langStore.getLang === LanguageEnum.ZH ? zhCN : enUS;
});
const dateLocale = computed(() => {
  return langStore.getLang === LanguageEnum.ZH ? dateZhCN : dateEnUS;
})

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
