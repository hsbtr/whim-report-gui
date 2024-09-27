<script setup lang="ts">
import { provide, computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import type { LineSeriesOption } from 'echarts/charts';

type LineProps = {
  title: string;
  dataSource: LineSeriesOption[];
};
const defaultOpt = {
  title: {
    text: 'Title',
  },
};

use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, LegendComponent]);
provide(THEME_KEY, 'dark');

const props = defineProps<LineProps>();

const option = computed(() => {
  return {
    title: props.title,
    series: props.dataSource,
  };
});

const item = {
  name: '',
  group: '',
  xAxis: 'a',

};
</script>

<template>
  <v-chart class="chart-line" :option="option" />
</template>

<style lang="scss" scoped>
.chart-line {
  min-height: 200px;
}
</style>
