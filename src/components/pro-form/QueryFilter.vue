<script setup lang="ts">
import { NRow, NCol, NFormItem, NSpace, NButton } from 'naive-ui';
import BaseForm from './BaseForm.vue';
import type { VNode } from 'vue';

interface VVNode extends VNode{
  key: PropertyKey;
}
type SlotsProps = {
  default(): VVNode[];
};

const slots = defineSlots<SlotsProps>();
console.log(slots.default);
const getChildren = () => {
  if (!slots.default) return [];
  return slots.default?.() || [];
};
</script>

<template>
  <base-form>
    <n-row :gutter="24">
      <n-col v-for="child in getChildren()" :key="child.key" :span="8">
        {{ child }}
      </n-col>
      <n-col v-if="getChildren().length !== 0" :span="8">
        <n-form-item>
          <n-space>
            <n-button type="default">重置</n-button>
            <n-button type="primary">查询</n-button>
            <n-button type="primary" bordered text>展开/收起</n-button>
          </n-space>
        </n-form-item>
      </n-col>
    </n-row>
  </base-form>
</template>

<style scoped>

</style>
