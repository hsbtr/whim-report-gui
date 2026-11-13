<script setup lang="ts">
import Draggable from 'vuedraggable';
import SchemaParser from './SchemaParser.vue';
</script>

<template>
  <draggable>
    <template #item="{ element }">
      <schema-parser :render-type="element.renderType" />
    </template>
  </draggable>
</template>

<style scoped></style>
