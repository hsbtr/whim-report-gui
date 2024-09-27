<script setup lang="ts">
import VLine from '@/components/ve-chart/VLine.vue';
import http from '@/http';

const props = defineProps({
  url: {
    type: String,
    default: () => '',
  }
});
const getDataSource = async (params) => {
  const { result, code } = await http.get(props.url, { data: params });

};

</script>

<template>
  <v-line title="" data-source="" />
</template>

<style scoped>

</style>
