<script setup lang="ts">
import { inject } from 'vue';
import Draggable from 'vuedraggable';
import SchemaParser from './NodeParsing.vue';
import { editorOptions } from '../provider/context';

const drawOpts = inject(editorOptions);
console.log(drawOpts);

</script>

<template>
  <draggable class="painting" v-model="drawOpts.nodes" item-key="key" ghost-class="ghost">
    <template #item="{ element }">
      <schema-parser
        class="node-item"
        :key="element.key"
        :options="element"
        v-bind="element"
      />
    </template>
  </draggable>
</template>

<style lang="scss" scoped>
.painting {
  display: flex;
  flex-wrap: wrap;
  .node-item {
    flex: 1 0 20%;
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
