<script setup lang="ts">
import VLine from '@/components/ve-chart/VLine.vue';

defineProps({
  url: {
    type: String,
    default: () => ''
  }
});
</script>

<template>
  <v-line title="" :data-source="[]" />
</template>

<style scoped></style>
