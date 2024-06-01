import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { setting, ThemeEnum } from '@/config'
import type { Ref } from 'vue';
import type { SettingOpt } from '@/config';

type StyleState = Pick<SettingOpt, 'theme' | 'primaryColor'>;

const { theme, primaryColor } = setting;

export const useStyleStore = defineStore('style', () => {
  const style: Ref<StyleState> = ref({ theme, primaryColor  });
  const getTheme = computed(() => {
    return style.value.theme;
  });
  const getPrimaryColor = computed(() => {
    return style.value.primaryColor;
  });
  const updateTheme = (name: ThemeEnum.LIGHT | ThemeEnum.DARK) => {
    style.value.theme = name;
  };
  const setPrimaryColor = (color: string) => {
    style.value.primaryColor = color;
  }
  return { style, getTheme, getPrimaryColor, updateTheme, setPrimaryColor };
});
