<script setup lang="ts">
import { useDialog, useModal, useMessage, useNotification } from 'naive-ui';

const dialog = useDialog();
const modal = useModal();
const message = useMessage();
const notification = useNotification();

window['$dialog'] = dialog;
window['$modal'] = modal;
window['$message'] = message;
window['$notification'] = notification;
</script>

<template>
  <slot></slot>
</template>

<style scoped>

</style>
