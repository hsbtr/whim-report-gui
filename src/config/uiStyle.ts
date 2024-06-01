export enum ThemeEnum {
  DARK = 'dark',
  LIGHT = 'light'
}
export enum LanguageEnum {
  ZH = 'zh',
  EN = 'en'
}
export enum PreviewEnum {
  FIT = '',
  SCROLL_Y = 'scrollY',
  SCROLL_X = 'scrollX',
  FULL = 'full'
}
export type ThemeColorInfo = {
  CMYK: number[];
  RGB: number[];
  hex: string;
  name: string;
  pinyin: string;
}
export type SettingOpt = {
  lang: LanguageEnum.EN | LanguageEnum.ZH;
  theme: ThemeEnum.LIGHT | ThemeEnum.DARK;
  primaryColor: string;
  themeInfo?: ThemeColorInfo;
}
export const setting: SettingOpt = {
  lang: LanguageEnum.ZH,
  theme: ThemeEnum.DARK,
  primaryColor: '#51d6a9',
};
