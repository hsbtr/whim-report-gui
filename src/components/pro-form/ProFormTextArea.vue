<script setup lang="ts">
import { inject } from 'vue';
import { NFormItem, NInput } from 'naive-ui';
import type { FormItemProps, InputProps } from 'naive-ui';
import type { FormState } from './BaseForm.vue';

type ProFormTextAreaProps = FormItemProps & { filedPath: InputProps };

const formState = inject<FormState>('formState');
const update = inject('update');
const props = defineProps<ProFormTextAreaProps>();
</script>

<template>
  <n-form-item :label="props.label" :path="props.path">
    <n-input type="textarea" v-model:value="formState[props.path || '']" />
  </n-form-item>
</template>

<style scoped>

</style>
