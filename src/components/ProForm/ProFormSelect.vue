<script setup lang="ts">
import { NFormItem, NSelect } from 'naive-ui';
import type { FormItemProps, SelectProps } from 'naive-ui';

type ProFormSelectProps = FormItemProps & { filedProps: SelectProps };

const props = defineProps<ProFormSelectProps>();

</script>

<template>
  <n-form-item :label="props.label" :path="props.path" >
    <n-select />
  </n-form-item>
</template>

<style scoped>

</style>
