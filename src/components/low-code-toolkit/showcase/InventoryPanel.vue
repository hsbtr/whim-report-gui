<script setup lang="ts">
import { shallowRef, ref, computed } from 'vue';
import { NSelect, NInput, NIcon, NScrollbar, useThemeVars } from 'naive-ui';
import { SearchOutline } from '@vicons/ionicons5';
import { useDebounceFn } from '@vueuse/core';
import { materialSchemas } from '../packages';
import { dragRegisterGraphics } from '../tools';
import type { ComponentCfg } from '../packages';

const [defaultCategory] = materialSchemas;
const currentCategory = shallowRef(defaultCategory);
const currentSeries = ref('all');
const searchValue = ref('');

const globalTheme = useThemeVars();
const primaryColor = computed(() => globalTheme.value.primaryColor);
const categoryOptions = materialSchemas.map(({ title, key }) => ({ label: title, value: key }));
const seriesOptions = computed(() => [
  { label: '全部', value: 'all' },
  ...currentCategory.value.components.map(({ title, name }) => ({ label: title, value: name }))
]);

const componentGroup = computed(() =>
  currentCategory.value.components
    .filter(({ name }) => currentSeries.value === 'all' || name === currentSeries.value)
    .flatMap(({ templates }): ComponentCfg[] => templates)
    .filter(({ title }) => title.includes(searchValue.value))
);

const onCategoryChange = (value: string | number | null) => {
  const category = materialSchemas.find(({ key }) => key === value);
  if (category) {
    currentCategory.value = category;
    currentSeries.value = 'all';
  }
};
const onSeriesChange = (value: string | number | null) => {
  if (typeof value === 'string') currentSeries.value = value;
};
const onSearchChange = useDebounceFn((value: string) => {
  searchValue.value = value;
}, 1000);
</script>

<template>
  <div class="inventory-wrapper">
    <div class="component-area">
      <div class="head-search-filter">
        <div class="filter-space">
          <n-select
            class="custom-select-size"
            :options="categoryOptions"
            :value="currentCategory.key"
            @update:value="onCategoryChange"
          />
          <n-select class="custom-select-size" :options="seriesOptions" :value="currentSeries" @update:value="onSeriesChange" />
        </div>
        <n-input class="search-input" type="text" placeholder="输入组件名" @update:value="onSearchChange">
          <template #suffix>
            <n-icon :component="SearchOutline" />
          </template>
        </n-input>
      </div>
      <n-scrollbar class="component-list">
        <div class="component-list-item" v-for="item in componentGroup" :key="item.key" @dragstart="dragRegisterGraphics($event, item)" :draggable="true">
          <div class="thumbnail">
            <img src="" alt="" >
          </div>
          <div class="title">
            <span>{{item.title}}</span>
          </div>
        </div>
      </n-scrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.inventory-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  .category-menu {
    flex: 0 0 64px;
    height: 100%;
    .custom-menu-item {
      width: 100%;
      padding: 10px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      .custom-menu-item-title {
        width: 100%;
        text-align: center;
        font-size: 14px;
      }
    }
    .custom-menu-item-active {
      background: #18a058;
    }
  }
  .component-area {
    flex: 1 1 auto;
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
    :deep(.component-list) {
      flex: 1 1 auto;
      .n-scrollbar-content {
        padding: 0 18px;
        box-sizing: border-box;
        .component-list-item {
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
      }
    }
  }
}

</style>
