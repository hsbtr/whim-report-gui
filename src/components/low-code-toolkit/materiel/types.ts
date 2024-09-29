import type { DefineComponent } from 'vue';

export interface MetaCfg {
  title: string;
  icon?: DefineComponent;
}

export interface PkgCfg {
  title: string;
  type: string;
  props: PkgCfg[];
}
