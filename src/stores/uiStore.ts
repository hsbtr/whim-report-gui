import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { LanguageEnum, setting, ThemeEnum } from '@/config'
import type { Ref } from 'vue';
import type { SettingOpt } from '@/config';

type StyleState = Pick<SettingOpt, 'theme' | 'primaryColor'>;

const { theme, primaryColor } = setting;

export const useUiStore = defineStore('ui', () => {
  const lang = ref(setting.lang);
  const style: Ref<StyleState> = ref({ theme, primaryColor  });
  const getTheme = computed(() => {
    return style.value.theme;
  });
  const getPrimaryColor = computed(() => {
    return style.value.primaryColor;
  });
  const getLang = computed(() => {
    return lang.value;
  });
  const updateTheme = (name?: ThemeEnum.LIGHT | ThemeEnum.DARK) => {
    if (name) {
      style.value.theme = name;
    }
    style.value.theme = style.value.theme === 'dark' ? ThemeEnum.LIGHT : ThemeEnum.DARK;
  };
  const setPrimaryColor = (color: string) => {
    style.value.primaryColor = color;
  }
  const updateLang = (language: LanguageEnum) => {
    if (lang.value === language) return;
    lang.value = language;
    // 刷新页面
  };
  return { style, lang, getTheme, getPrimaryColor, updateTheme, setPrimaryColor, getLang, updateLang };
});
