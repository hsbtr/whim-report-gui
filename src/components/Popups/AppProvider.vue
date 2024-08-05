<script setup lang="ts">
import { NLoadingBarProvider, NDialogProvider, NMessageProvider, NNotificationProvider } from 'naive-ui';
import LoadingInit from './LoadingInit.vue';
import DialogInit from './DialogInit.vue';
import MessageInit from './MessageInit.vue';
import NotificationInit from './NotificationInit.vue';
</script>

<template>
<n-loading-bar-provider>
  <n-dialog-provider>
    <LoadingInit />
    <DialogInit />
    <n-notification-provider>
      <n-message-provider>
        <MessageInit />
        <NotificationInit />
        <slot />
      </n-message-provider>
    </n-notification-provider>
  </n-dialog-provider>
</n-loading-bar-provider>
</template>
