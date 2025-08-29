<script setup lang="ts">
import { inject } from 'vue';
import { NScrollbar } from 'naive-ui';
import Draggable from 'vuedraggable';
import SchemaParser from './NodeParsing.vue';
import { LowCodeShare } from './../common/constant';
import { useLowCodeState, useLowCodeContext } from '../hooks';
import { JSONParse } from '../tools';
import type { ComponentProp } from '../types';

const lowCodeState = useLowCodeState();
const context = useLowCodeContext();

const onDrop = async (e: DragEvent) => {
  console.log(e);
  e.preventDefault();
  try {
    const dataJson = e.dataTransfer?.getData(LowCodeShare.dragKey);
    if (!dataJson) return;
    const componentProps = JSONParse<ComponentProp>(dataJson);
    if (!componentProps) return;
    console.log(componentProps);
    componentProps.attr.x = e.offsetX - componentProps.attr.width / 2;
    componentProps.attr.y = e.offsetY - componentProps.attr.height / 2;
    context.addNode(componentProps);
  } catch (e) {
    console.error(e);
  }
};
const onDragover = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};
const onMousedown = () => {};
</script>

<template>
  <div class="sketchpad-wrapper" @mousedown="onMousedown" @drop="onDrop" @dragover="onDragover">
    <draggable class="painting" v-model="lowCodeState.nodes" item-key="key" ghost-class="ghost">
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
.sketchpad-wrapper {
  padding: 16px;
  overflow: auto;
  box-sizing: border-box;

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
