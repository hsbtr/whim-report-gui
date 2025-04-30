<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import type { ComponentCfg } from '../packages';

type SchemaParserProps = Omit<ComponentCfg, 'key'> & { name: string };
const props = defineProps<SchemaParserProps>();
console.log(props);

const AsyncComponent = defineAsyncComponent(() => import((`../packages/${props.type}/${props.series}/${props.name}.vue`)));

</script>

<template>
  <div class="node-box">
    <div class="node-header">{{ props.title }}</div>
    <div class="node-body">
      <async-component :series="props.series" :type="props.type" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.node-box {
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  .node-header {}
  .node-body {}
  .node-action {}
}
</style>
