import { computed, ref } from 'vue'
import { defineStore } from 'pinia';
import { setting, LanguageEnum } from '@/config';

export const useLangStore = defineStore('lang', () => {
  const lang = ref(setting.lang);
  const getLang = computed(() => {
    return lang.value;
  });
  const updateLang = (language: LanguageEnum) => {
    if (lang.value === language) return;
    lang.value = language;
    // 刷新页面
  };
  return { lang, getLang, updateLang };
});
