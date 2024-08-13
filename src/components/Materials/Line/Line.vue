<script setup lang="ts">
import BaseLine from '@/components/BaseChart/BaseLine.vue';
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
  <base-line title="" data-source="" />
</template>

<style scoped>

</style>
