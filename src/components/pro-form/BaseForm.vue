<script setup lang="ts">
import { reactive, provide } from 'vue';
import { NForm } from 'naive-ui';

export interface FormState {
  [key: string]: any;
}

const formState = reactive<FormState>({});
const update = (key: string, value: any) => {
  formState[key] = value;
};
provide('update', update);
provide('formState', formState);

</script>

<template>
  <n-form :model="formState">
    <slot></slot>
  </n-form>
</template>

<style scoped>

</style>
