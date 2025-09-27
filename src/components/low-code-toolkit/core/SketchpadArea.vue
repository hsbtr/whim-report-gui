<script setup lang="ts">
import LazyLoadNode from './LazyLoadNode.vue';
import SketchpadBoxSelect from './SketchpadBoxSelect.vue';
import SketchpadRuler from './SketchpadRuler.vue';
import ShapeBox from './ShapeBox.vue';
import { LowCodeShare } from './../common/constant';
import { useLowCodeState, useLowCodeContext } from '../hooks';
import { JSONParse, mergeNodeProps } from '../tools';
import type { ComponentPropsExtra } from '../types';

const lowCodeState = useLowCodeState();
const context = useLowCodeContext();

const onDrop = async (e: DragEvent) => {
  e.preventDefault();
  try {
    const dataJson = e.dataTransfer?.getData(LowCodeShare.dragKey);
    if (!dataJson) return;
    const componentProps = JSONParse<ComponentPropsExtra>(dataJson);
    if (!componentProps) return;
    const uuid = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newNodeProps = mergeNodeProps(componentProps, { uuid });
    console.log(newNodeProps);
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
</script>

<template>
  <div class="sketchpad-wrapper" @mousedown="onMousedown" @drop="onDrop" @dragover="onDragover">
    <SketchpadRuler>
      <div class="sketchpad-content">
        <SketchpadBoxSelect>
          <div v-for="(node) in lowCodeState.nodes" :key="node.id || node.uuid">
            <ShapeBox :is-point="false" :node-props="node">
              <LazyLoadNode
                :key="node.id || node.uuid"
                :path="`../packages${node.loadPath}.vue`"
                :field-props="node"
              />
            </ShapeBox>
          </div>
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
