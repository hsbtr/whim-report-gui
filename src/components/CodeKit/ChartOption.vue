<script setup lang="ts">
import { NMenu } from 'naive-ui';
import { createMaterialOptions } from '@/components/Materials';
import { renderIcon } from '@/utils';
import { vIonIcons } from '@/components/Icons';

const { series, packages } = createMaterialOptions();
console.log(series);
console.log(packages);

</script>

<template>
  <div>
    <n-menu
      mode="vertical"
      :options="series"

    />
    <div>

    </div>
  </div>
</template>

<style scoped>

</style>
