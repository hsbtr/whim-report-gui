<script setup lang="ts">
import { inject } from 'vue';
import { NFormItem, NSelect } from 'naive-ui';
import type { FormItemProps, SelectProps } from 'naive-ui';
import type { FormState } from './BaseForm.vue';

type ProFormSelectProps = FormItemProps & { filedProps: SelectProps };

const formState = inject<FormState>('formState');
const update = inject('update');
const props = defineProps<ProFormSelectProps>();

</script>

<template>
  <n-form-item :label="props.label" :path="props.path" >
    <n-select v-model:value="formState[props.path || '']" />
  </n-form-item>
</template>

<style scoped>

</style>
