<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { NSelect, NInput, NIcon, NScrollbar, useThemeVars } from 'naive-ui';
import { SearchOutline } from '@vicons/ionicons5';
import { useDebounceFn } from '@vueuse/core';
import { materialSchemas } from '../packages';
import { dragRegisterGraphics } from '../tools';
import type { SchemaMetaCfg, ComponentType, ComponentCfg } from '../packages';

type ModuleType = ComponentType | 'all';
type SelectedMenuItem = { key: ComponentType; components: SchemaMetaCfg['components'] };

const [defaultSelected] = materialSchemas;

const globalTheme = useThemeVars();
const menuSelected = reactive<SelectedMenuItem>({ key: defaultSelected.key, components: defaultSelected.components });
const componentType = ref<ModuleType>('all');
const searchValue = ref('');

const supplementTypeOpt = { label: '全部', value: 'all' };
const primaryColor = computed(() => {
  return globalTheme.value.primaryColor;
});
const typeOptions = computed(() => {
  const options = menuSelected.components.map((v) => {
    return { label: v.title, value: v.type };
  });
  return [supplementTypeOpt, ...options];
});
const componentGroup = computed<ComponentCfg[]>(() => {
  if (componentType.value === 'all') {
    const array: ComponentCfg[] = [];
    menuSelected.components.forEach((v) => {
      if (Array.isArray(v.props)) {
        array.push(...v.props);
      }
    });
    if (searchValue.value) {
      return array.filter((v) => v.title.includes(searchValue.value));
    }
    return array;
  }
  const current = menuSelected.components.find((v) => v.type === componentType.value);
  if (current) {
    if (searchValue.value) {
      return (current.props as ComponentCfg[]).filter((v) => v.title.includes(searchValue.value));
    }
    return current.props;
  }
  return [];
});
const onMenuChange = ({ key, components }: SchemaMetaCfg) => {
  menuSelected.key = key;
  menuSelected.components = components;
};
const onSelectChange = (value) => {
  componentType.value = value;
};
const onSearchChange = useDebounceFn((value) => {
  searchValue.value = value;
}, 1000);
const onDragStart = (event: DragEvent, item: ComponentCfg) => {
  dragRegisterGraphics<ComponentCfg>(event, item);
};

</script>

<template>
  <div class="inventory-wrapper">
    <div class="category-menu">
      <div :class="['custom-menu-item', { 'custom-menu-item-active': item.key === menuSelected.key }]" v-for="item in materialSchemas" :key="item.key" @click="onMenuChange(item)">
        <span class="custom-menu-item-title">{{item.title}}</span>
      </div>
    </div>
    <div class="component-area">
      <div class="head-search-filter">
        <NSelect class="custom-select-style" :options="typeOptions" :value="componentType" @update:value="onSelectChange" />
        <NInput type="text" placeholder="输入组件名" @update:value="onSearchChange">
          <template #suffix>
            <n-icon :component="SearchOutline" />
          </template>
        </NInput>
      </div>
      <n-scrollbar class="component-list">
        <div class="component-list-item" v-for="item in componentGroup" :key="item.type" @dragstart="onDragStart($event, item)" :draggable="true">
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
      display: flex;
      //flex-direction: column;
      margin: 0 0 12px 0;
      padding: 8px;
      box-sizing: border-box;
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
