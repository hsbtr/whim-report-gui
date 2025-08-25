<script setup lang="ts">
import { inject } from 'vue';
import { NFormItem, NInput } from 'naive-ui';
import type { FormItemProps, InputProps } from 'naive-ui';
import type { FormState } from './BaseForm.vue';

type ProFormTextProps = FormItemProps & { filedProps: InputProps };

const formState = inject<FormState>('formState');
const update = inject('update');
const props = defineProps<ProFormTextProps>();

</script>

<template>
  <n-form-item :label="props.label" :path="props.path" >
    <n-input type="text" v-model="formState[props.path || '']" />
  </n-form-item>
</template>

<style scoped>

</style>
