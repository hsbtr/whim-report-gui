<script setup lang="ts">
import { NLoadingBarProvider, NDialogProvider, NModalProvider, NMessageProvider, NNotificationProvider } from 'naive-ui';
import PopupsInit from './PopupsInit.vue';
</script>

<template>
<n-loading-bar-provider>
  <n-dialog-provider>
    <n-modal-provider>
      <n-notification-provider>
        <n-message-provider>
          <popups-init>
            <slot />
          </popups-init>
        </n-message-provider>
      </n-notification-provider>
    </n-modal-provider>
  </n-dialog-provider>
</n-loading-bar-provider>
</template>
