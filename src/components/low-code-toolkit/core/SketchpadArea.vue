<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import LazyLoadNode from './LazyLoadNode.vue';
import SketchpadBoxSelect from './SketchpadBoxSelect.vue';
import SketchpadRuler from './SketchpadRuler.vue';
import ShapeBox from './ShapeBox.vue';
import { LowCodeShare } from './../common/constant';
import { useLowCodeContext, useWindowResizeObserver } from '../hooks';
import { JSONParse, mergeNodeProps, getNodeSizeStyle, getPositionStyle, createUuid } from '../tools';
import type { ComponentPropsExtra, SketchpadAreaProps } from '../types';

const props = defineProps<SketchpadAreaProps>();
const context = useLowCodeContext();
const sketchpadRef = useTemplateRef('sketchpad');

const adjustScale = useDebounceFn(() => {
  if (sketchpadRef.value === null) return;
  const boxWidth = sketchpadRef.value.clientWidth - context.state.canvas.offset * 2 - 5;
  const boxHeight = sketchpadRef.value.clientHeight - context.state.canvas.offset * 4;
  const canvasScale = parseFloat((context.state.width / context.state.height).toFixed(5));
  const boxScale = parseFloat((boxWidth / boxHeight).toFixed(5));
  if (boxScale > canvasScale) {
    const scale = parseFloat(((boxHeight * canvasScale) / context.state.width).toFixed(5));
    context.state.canvas.scale = scale > 1 ? 1 : scale;
  } else {
    const scale = parseFloat((boxWidth / canvasScale / context.state.height).toFixed(5));
    context.state.canvas.scale = scale > 1 ? 1 : scale;
  }
}, 200);
const onDrop = async (e: DragEvent) => {
  e.preventDefault();
  try {
    const dataJson = e.dataTransfer?.getData(LowCodeShare.dragKey);
    if (!dataJson) return;
    const componentProps = JSONParse<ComponentPropsExtra>(dataJson);
    if (!componentProps) return;
    const uuid = createUuid(componentProps.uuid);
    const newNodeProps = mergeNodeProps(componentProps, { uuid });
    newNodeProps.attr.x = e.offsetX - newNodeProps.attr.w / 2;
    newNodeProps.attr.y = e.offsetY - newNodeProps.attr.h / 2;
    context.addNode?.(newNodeProps);
  } catch (e) {
    console.error(e);
  }
};
const onDragover = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};
const onMousedown = () => {};

useWindowResizeObserver(() => {
  adjustScale();
});
</script>

<template>
  <div class="sketchpad-wrapper" ref="sketchpad" @mousedown="onMousedown" @drop="onDrop" @dragover="onDragover">
    <SketchpadRuler v-bind="props.ruler">
      <div class="sketchpad-content">
        <SketchpadBoxSelect>
          <template v-for="(node, index) in context.state.nodes" :key="node.id || node.uuid">
            <ShapeBox :is-point="false" :node-props="node" :style="getPositionStyle(node.attr, index)">
              <LazyLoadNode
                :key="node.id || node.uuid"
                :path="`${node.loadPath}.vue`"
                :field-props="node"
                :style="getNodeSizeStyle(node.attr)"
              />
            </ShapeBox>
          </template>
        </SketchpadBoxSelect>
      </div>
    </SketchpadRuler>
  </div>
</template>

<style lang="scss" scoped>
.sketchpad-wrapper {
  padding: 16px;
  overflow: auto;
  box-sizing: border-box;
  .sketchpad-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    transition: all 0.4s;
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
