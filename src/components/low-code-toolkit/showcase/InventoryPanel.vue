<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { NSelect, NInput, NIcon, NScrollbar, useThemeVars } from 'naive-ui';
import { SearchOutline } from '@vicons/ionicons5';
import { materialSchemas } from '../materiel';
import type { SchemaMetaCfg, ComponentType, ComponentCfg } from '../materiel';

type ModuleType = ComponentType | 'all';

const [defaultSelected] = materialSchemas;

const globalTheme = useThemeVars();
const menuSelected = reactive({ key: defaultSelected.key, components: defaultSelected.components });
const componentType = ref<ModuleType>('all');
const supplementTypeOpt = { title: '全部', type: 'all' };
const primaryColor = computed(() => {
  return globalTheme.value.primaryColor;
});
const typeOptions = computed(() => {
  const [defaultItem] = menuSelected.components;
  if (defaultItem.type !== 'all') {
    const options = menuSelected.components.map((v) => {
      return { label: v.title, value: v.type };
    });
    return [{ label: supplementTypeOpt.title, value: supplementTypeOpt.type }, ...options];
  }
  return menuSelected.components.map((v) => {
    return { label: v.title, value: v.type };
  });
});
const componentGroup = computed<ComponentCfg>(() => {
  if (componentType.value === 'all') {
    const array = [];
    menuSelected.components.forEach((v) => {
      if (Array.isArray(v.props)) {
        array.push(...v.props);
      }
    });
    return array;
  }
  const current = menuSelected.components.find((v) => v.type === componentType.value);
  if (current) {
    return current.props.map((v) => {
      return { ...v };
    });
  }
  return [];
});
const onMenuChange = ({ key, pkgs }: SchemaMetaCfg) => {
  menuSelected.key = key;
  menuSelected.components = [supplementTypeOpt, ...pkgs];
};
const onSelectChange = (value) => {
  componentType.value = value;
};
const onSearch = () => {

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
        <NInput type="text" placeholder="输入组件名" >
          <template #prefix>
            <n-icon :component="SearchOutline" />
          </template>
        </NInput>
        <NSelect :options="typeOptions" :value="componentType" @update:value="onSelectChange" />
      </div>
      <n-scrollbar content-class="component-list" style="height: 100%">
        <div class="component-list-item" v-for="item in componentGroup" :key="item.type">
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
    .head-search-filter {
      display: flex;
      //flex-direction: column;
      margin: 0 0 12px 0;
    }

  }

}
:deep() {
  .component-list {
    padding: 0 12px;
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
</style>
