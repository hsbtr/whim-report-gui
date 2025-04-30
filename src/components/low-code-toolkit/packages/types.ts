import type { DefineComponent } from 'vue';

export interface MetaCfg {
  title: string;
}

export interface PkgCfg {
  title: string;
  key: string;
  icon?: DefineComponent;
}

export interface MaterialPackage {
  ChartLine: any;
}

export const enum PkgType {
  chart = 'chart',
  control = 'control',
  info = 'info',
}
