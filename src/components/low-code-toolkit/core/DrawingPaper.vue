<script setup lang="ts">
import { inject } from 'vue';
import Draggable from 'vuedraggable';
import SchemaParser from './SchemaParser.vue';
import { editorCfg } from '../provider/context';

const drawCfg = inject(editorCfg);


</script>

<template>
  <draggable>
    <template #item="{ element }">
      <schema-parser :render-type="element.renderType" />
    </template>
  </draggable>
</template>

<style scoped></style>
