<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { NIcon, NInput, NScrollbar, NSelect, useThemeVars } from 'naive-ui';
import { SearchOutline } from '@vicons/ionicons5';
import { useDebounceFn } from '@vueuse/core';
import { useLowCodeState } from './../hooks';
import { pkgMetas } from '../packages';
import { jsonStringify, formatPkgOptions } from '../tools';
import { LowCodeShare } from '../common/constant';
import { componentCfg } from '../common/component.config';
import type { ComponentPropsRaw, NodeProps } from '../types';
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface';

const pkgs = formatPkgOptions<NodeProps>(pkgMetas, ({ type, fieldProps }) => {
  return fieldProps.map((v) => ({ ...componentCfg, ...v, type: type, }));
});
const [defaultSelectedPkg] = pkgs;

// const addNode = inject(LowCodeEvent.addNode);
const lowCodeState = useLowCodeState();
const globalTheme = useThemeVars();
const selectedPkgType = reactive({ ...defaultSelectedPkg });
const selectedComponentType = reactive({ fieldProps: [], value: 'all' });
const searchComponentName = ref('');

const supplementTypeOpt = { label: '全部', value: 'all' };
const primaryColor = computed(() => {
  return globalTheme.value.primaryColor;
});
const componentTypeOptions = computed(() => {
  const { opts = [] } = selectedPkgType;
  return [supplementTypeOpt, ...opts];
});
// 组件
const componentGroup = computed<NodeProps[]>(() => {
  const { value, fieldProps = [] } = selectedComponentType;
  if (value !== 'all') return fieldProps;
  return componentTypeOptions.value.flatMap((item) => item.fieldProps ?? []);
});

const onPkgTypeChange = (_value: string, option: SelectMixedOption) => {
  Object.assign(selectedPkgType, option);
  Object.assign(selectedComponentType, { label: '全部', value: 'all' });
};
const onComponentTypeChange = (value, option) => {
  Object.assign(selectedComponentType, option);
};
const onSearchChange = useDebounceFn((value) => {
  searchComponentName.value = value;
}, 1000);
const onDragStart = (event: DragEvent, item: ComponentPropsRaw) => {
  console.log(item);
  event.dataTransfer?.setData(LowCodeShare.dragKey, jsonStringify(item));
  lowCodeState.isAdd = true;
};
const onDragEnd = () => {
  lowCodeState.isAdd = false;
};

</script>

<template>
  <div class="stencil-wrapper">
    <div class="component-area">
      <div class="head-search-filter">
        <div class="filter-space">
          <n-select
            class="custom-select-size"
            :options="pkgs"
            :value="selectedPkgType.value"
            @update:value="onPkgTypeChange"
          />
          <n-select
            class="custom-select-size"
            :options="componentTypeOptions"
            :value="selectedComponentType.value"
            @update:value="onComponentTypeChange"
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
            v-if="item.title.includes(searchComponentName)"
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
