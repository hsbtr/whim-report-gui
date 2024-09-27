<script setup lang="ts">
import { ref, provide } from 'vue';
import { NForm } from 'naive-ui';

const formValue = ref();
provide('formValue', formValue);

</script>

<template>
  <n-form></n-form>
</template>

<style scoped>

</style>
