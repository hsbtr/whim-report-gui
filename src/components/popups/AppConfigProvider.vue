<script setup lang="ts">
import { NConfigProvider, NLoadingBarProvider, NDialogProvider, NModalProvider, NMessageProvider, NNotificationProvider } from 'naive-ui';
import PopupsInit from './PopupsInit.vue';
import type { ConfigProviderProps } from 'naive-ui';
const props = defineProps<ConfigProviderProps>();
</script>

<template>
  <n-config-provider v-bind="props">
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
  </n-config-provider>
</template>
