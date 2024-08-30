<script setup lang="ts">
import { NIcon } from 'naive-ui';
import { StatsChartOutline } from '@vicons/ionicons5';

type IonIconsProps = {
  color?: string;
  depth?: 1 | 2 | 3 | 4 | 5;
  size?: number | string;
  type: string;
}
console.log(1);

const props = defineProps<IonIconsProps>();
console.log(props);
</script>

<template>
  <n-icon
    :size="props.size"
    :color="props.color"
    :depth="props.depth"
  >
    <StatsChartOutline />
  </n-icon>
</template>

<style scoped>

</style>
