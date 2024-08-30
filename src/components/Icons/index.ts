import { h } from 'vue';
import IonIcons from '@/components/Icons/IonIcons.vue';
export const vIonIcons = (props: typeof IonIcons) => {
  return () => h(IonIcons, props as any);
};
