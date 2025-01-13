<script setup lang="ts">
import { provide, computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import type { BarSeriesOption } from 'echarts/charts';

type BarProps = {
  title: string;
  dataSource: BarSeriesOption[];
}
const props = defineProps<BarProps>();

const option = computed(() => {
  return {
    title: props.title,
    series: [],
  };
});
use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, LegendComponent]);
provide(THEME_KEY, 'dark');

</script>

<template>
  <v-chart class="chart-box" />
</template>

<style lang="scss" scoped>
.chart-box {
  height: 200px;
}
</style>
