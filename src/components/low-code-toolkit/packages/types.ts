import type { DefineComponent } from 'vue';

export interface MetaCfg {
  title: string;
}

export interface PkgCfg {
  title: string;
  key: string;
  icon?: DefineComponent;
  loadPath?: string;
}

export interface MaterialPackage {
  ChartLine: any;
}

export const enum PkgType {
  chart = 'chart',
  control = 'control',
  info = 'info',
}
