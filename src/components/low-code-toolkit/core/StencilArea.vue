<script setup lang="ts">
import { ref, computed } from 'vue';
import { NIcon, NInput, NScrollbar, NSelect, useThemeVars } from 'naive-ui';
import { SearchOutline } from '@vicons/ionicons5';
import { useDebounceFn } from '@vueuse/core';
import { useLowCodeContext } from './../hooks';
import { pkgMetas } from '../packages';
import { jsonStringify, transformPkgOptions } from '../tools';
import { LowCodeShare } from '../common/constant';
import type { ComponentPropsRaw, PkgType, PkgComponentType } from '../types';

type SelectedComponentType = PkgComponentType | 'all';

const pkgs = transformPkgOptions();
const [defaultSelectedPkg] = pkgs;

const context = useLowCodeContext();
const globalTheme = useThemeVars();
const selectedPkg = ref(defaultSelectedPkg.value);
const selectedComponentType = ref<SelectedComponentType>('all');
const searchComponentName = ref('');

const supplementTypeOpt = { label: '全部', value: 'all' };
const primaryColor = computed(() => {
  return globalTheme.value.primaryColor;
});
const categoryMetas = computed(() => pkgMetas.filter(({ pkgType }) => pkgType === selectedPkg.value));
const componentTypeOptions = computed(() => [
  supplementTypeOpt,
  ...categoryMetas.value.map(({ title, type }) => ({ label: title, value: type }))
]);
const componentGroup = computed(() =>
  categoryMetas.value
    .filter(({ type }) => selectedComponentType.value === 'all' || type === selectedComponentType.value)
    .flatMap(({ fieldProps }) => fieldProps)
    .filter(({ title }) => title.includes(searchComponentName.value))
);
const onPkgChange = (value: PkgType) => {
  selectedPkg.value = value;
  selectedComponentType.value = 'all';
};
const onComponentTypeChange = (value: SelectedComponentType) => {
  selectedComponentType.value = value;
};
const onSearchChange = useDebounceFn((value: string) => {
  searchComponentName.value = value;
}, 1000);
const onDragStart = (event: DragEvent, item: ComponentPropsRaw) => {
  // 通过 item.uuid 找到对应的 pkg
  const parentPkg = categoryMetas.value.find((pkg) => pkg.fieldProps.some((field) => field.uuid === item.uuid));
  if (parentPkg) {
    const [componentName] = item.uuid.split('-');
    const loadPath = `../packages/${parentPkg.type}/${componentName}`;
    event.dataTransfer?.setData(LowCodeShare.dragKey, jsonStringify({ ...item, loadPath }));
    context.state.isAdd = true;
  }
};
const onDragEnd = () => {
  context.state.isAdd = false;
};
</script>

<template>
  <div class="stencil-wrapper">
    <div class="component-area">
      <div class="head-search-filter">
        <div class="filter-space">
          <NSelect class="custom-select-size" :options="pkgs" :value="selectedPkg" @update:value="onPkgChange" />
          <NSelect
            class="custom-select-size"
            :options="componentTypeOptions"
            :value="selectedComponentType"
            @update:value="onComponentTypeChange"
          />
        </div>
        <NInput class="search-input" type="text" placeholder="输入组件名" @update:value="onSearchChange">
          <template #suffix>
            <NIcon :component="SearchOutline" />
          </template>
        </NInput>
      </div>
      <NScrollbar class="sten-cli-main">
        <div
          v-for="item in componentGroup"
          :key="item.uuid"
          class="component-item"
          @dragstart="onDragStart($event, item)"
          @dragend="onDragEnd"
          :draggable="true"
        >
          <div class="thumbnail">
            <img :src="item.icon" alt="" />
          </div>
          <div class="title">
            <span>{{ item.title }}</span>
          </div>
        </div>
      </NScrollbar>
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
          height: 100%;
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
