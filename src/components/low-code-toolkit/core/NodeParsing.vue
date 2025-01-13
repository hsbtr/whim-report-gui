<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import type { ComponentCfg } from '../packages';

type SchemaParserProps = Omit<ComponentCfg, 'key'> & {
  loadPath: string;
};
const props = defineProps<SchemaParserProps>();
console.log(props);

const AsyncComponent = defineAsyncComponent(() => import((`../packages/${props.type}${props.loadPath}.vue`)));

</script>

<template>
  <async-component :series="props.series" :type="props.type" />
</template>

<style scoped>

</style>
