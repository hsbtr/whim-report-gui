<script setup lang="ts">
import { ref } from 'vue';
import { NSelect, NInput, useThemeVars } from 'naive-ui';
import { materialSchemas } from '../materiel';
import type { SchemaMetaCfg } from '../materiel';

const theme = useThemeVars();
const menuSelectKey = ref(materialSchemas[0].key);
const onMenuChange = ({ key }: SchemaMetaCfg) => {
  menuSelectKey.value = key;
};
console.log(theme);

</script>

<template>
  <div class="inventory-wrapper">
    <div class="category-menu">
      <div :class="['custom-menu-item', { 'custom-menu-item-active': item.key === menuSelectKey}]" v-for="item in materialSchemas" :key="item.key" @click="onMenuChange(item)">
        <span class="custom-menu-item-title">{{item.title}}</span>
      </div>
    </div>
    <div class="component-area">
      <div class="head-search-filter">
        <NSelect />
        <NInput type="text" />
      </div>
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
      //background: v-bind(theme.primaryColor);
    }
  }
  .component-area {
    flex: 1 1 auto;
    .head-search-filter {
      display: flex;
    }
  }
}
</style>
