<script setup lang="ts">
import { NMenu } from 'naive-ui';
import { createMaterialOptions } from '@/components/Materials';
const { series, packages } = createMaterialOptions();
console.log(series);
console.log(packages);

</script>

<template>
  <div>
    <n-menu :options="series" />
    <div>

    </div>
  </div>
</template>

<style scoped>

</style>
