<script setup lang="ts">
import { provide, computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import type { BarSeriesOption } from 'echarts/charts';

type BarProps = {
  title: string;
  dataSource: BarSeriesOption[];
}
const props = defineProps<BarProps>();

const option = computed(() => {
  return {
    title: {
      text: props.title,
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'bar',
        data: props.dataSource,
      }
    ],
  };
});
use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);
provide(THEME_KEY, 'dark');

</script>

<template>
  <VChart class="chart-box" :option="option" />
</template>

<style lang="scss" scoped>
.chart-box {
  height: 200px;
}
</style>
