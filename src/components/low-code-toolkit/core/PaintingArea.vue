<script setup lang="ts">
import { NScrollbar } from 'naive-ui';
import Draggable from 'vuedraggable';
import SchemaParser from './NodeParsing.vue';
import { useLowCodeStore } from '../hooks';

const lowCodeStore = useLowCodeStore();
console.log(lowCodeStore);

</script>

<template>
  <div class="painting-box">
    <draggable class="painting" v-model="lowCodeStore.nodes" item-key="key" ghost-class="ghost">
      <template #item="{ element }">
        <schema-parser
          class="node-item"
          :key="element.key"
          :options="element"
          v-bind="element"
        />
      </template>
    </draggable>
  </div>
</template>

<style lang="scss" scoped>
.painting-box {
  padding: 16px;
  overflow: auto;
  box-sizing: border-box;
  /* 1. 自定义滚动条的整体样式 */
  &::-webkit-scrollbar {
    width: 10px;  /* 设置垂直滚动条的宽度 */
    height: 10px; /* 设置水平滚动条的高度 */
  }

  /* 2. 自定义滚动条轨道 */
  &::-webkit-scrollbar-track {
    height: 80%;
    background-color: #f1f1f1;  /* 轨道背景色 */
    border-radius: 10px;        /* 轨道的圆角 */
  }

  /* 3. 自定义滚动条滑块（可拖动部分） */
  &::-webkit-scrollbar-thumb {
    background-color: #888;     /* 滑块的颜色 */
    border-radius: 10px;        /* 滑块的圆角 */
    border: 3px solid #f1f1f1;  /* 为滑块增加边框，确保其与轨道颜色区分 */
  }

  /* 4. 滑块在悬停时改变颜色 */
  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;  /* 悬停时滑块变色 */
  }

  /* 5. 自定义滚动条按钮（上下箭头） */
  &::-webkit-scrollbar-button {
    display: none;
    background-color: #ccc;  /* 按钮背景色 */
  }

}
.painting {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  .node-item {
    width: 22%;
    min-height: 300px;
    margin: 10px;
  }
}
:global() {
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
}

</style>
