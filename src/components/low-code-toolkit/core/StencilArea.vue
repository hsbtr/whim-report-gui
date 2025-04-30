<script setup lang="ts">
import { ref, computed, inject } from 'vue';
import { NSelect, NInput, NIcon, NScrollbar, useThemeVars } from 'naive-ui';
import { SearchOutline } from '@vicons/ionicons5';
import { useDebounceFn } from '@vueuse/core';
import { materialSchemas } from '../packages';
import { jsonStringify } from '../tools';
import { LowCodeEvent } from '../types/core';
import type { ComponentCfg } from '../packages';


const [defaultSelected] = materialSchemas;

const addNode = inject(LowCodeEvent.addNode);
const globalTheme = useThemeVars();
const currentType = ref({ ...defaultSelected });
const currentSeries = ref({ templates: [], type: 'all' });
const searchValue = ref('');

const supplementTypeOpt = { title: '全部', type: 'all' };

const primaryColor = computed(() => {
  return globalTheme.value.primaryColor;
});
const seriesOptions = computed(() => {
  const { components } = currentType.value;
  return [supplementTypeOpt, ...components];
});

const componentGroup = computed(() => {
  const { templates, type } = currentSeries.value;
  if (type === 'all') {
    const array: ComponentCfg[] = [];
    currentType.value.components.forEach((v) => {
      if (Array.isArray(v.templates)) {
        array.push(...v.templates);
      }
    });
    return array;
  }
  if (type !== 'all') return templates;
  return [];
});

const onTypeChange = (value, option) => {
  currentType.value = option;
};
const onSeriesChange = (value, option) => {
  currentSeries.value = option;
};
const onSearchChange = useDebounceFn((value) => {
  searchValue.value = value;
}, 1000);
const onDragStart = (event: DragEvent, item: ComponentCfg) => {
  event.dataTransfer?.setData('low-code', jsonStringify(item));
};
const onDragEnd = (event: DragEvent, item: ComponentCfg) => {
  addNode(item);
};

</script>

<template>
  <div class="stencil-wrapper">
    <div class="component-area">
      <div class="head-search-filter">
        <div class="filter-space">
          <n-select
            class="custom-select-size"
            :options="materialSchemas"
            label-field="title"
            value-field="key"
            :value="currentType.key"
            @update:value="onTypeChange"
          />
          <n-select
            class="custom-select-size"
            :options="seriesOptions"
            label-field="title"
            value-field="type"
            :value="currentSeries.type"
            @update:value="onSeriesChange"
          />
        </div>
        <n-input class="search-input" type="text" placeholder="输入组件名" @update:value="onSearchChange">
          <template #suffix>
            <n-icon :component="SearchOutline" />
          </template>
        </n-input>
      </div>
      <n-scrollbar class="sten-cli-main">
        <template v-for="item in componentGroup" :key="item.key">
          <div
            class="component-item"
            v-if="item.title.includes(searchValue)"
            :key="item.key"
            @dragstart="onDragStart($event, item)"
            @dragend="onDragEnd($event, item)"
            :draggable="item.disabled || true"
          >
            <div class="thumbnail">
              <img :src="item.icon" alt="" >
            </div>
            <div class="title">
              <span>{{item.title}}</span>
            </div>
          </div>
        </template>
      </n-scrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stencil-wrapper {
  width: 100%;
  height: 100%;
  .component-area {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .head-search-filter {
      margin: 0 0 12px 0;
      padding: 8px 18px;
      box-sizing: border-box;
      .filter-space {
        display: flex;
        justify-content: space-between;
        .custom-select-size {
          width: 49%;
        }
      }
      .search-input {
        margin: 4px 0 0 0;
      }
      .custom-select-style {
        flex: 0 0 90px;
      }
    }
    .component-item {
      width: 100%;
      margin: 0 0 12px 0;
      .thumbnail {
        width: 100%;
        height: 100px;
        overflow: hidden;
        border-radius: 4px;
        border: 1px solid v-bind(primaryColor);
        img {
          width: 100%;
          height:  100%;
        }
      }
      .title {
        width: 100%;
        text-align: center;
        span {
          font-size: 14px;
        }
      }
    }
    :deep(.sten-cli-main) {
      flex: 1 1 auto;
      height: 80vh;
      .n-scrollbar-content {
        padding: 0 18px;
        box-sizing: border-box;
      }
    }
  }
}

</style>
