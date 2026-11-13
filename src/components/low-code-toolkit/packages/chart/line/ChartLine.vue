<script setup lang="ts">
import VLine from '@/components/ve-chart/VLine.vue';
import { request } from '@/http';

const props = defineProps({
  url: {
    type: String,
    default: () => ''
  }
});
const getDataSource = async (params: Record<string, unknown>) => {
  const { success, data } = await request.get(props.url, params);
};
</script>

<template>
  <v-line title="" :data-source="[]" />
</template>

<style scoped></style>
