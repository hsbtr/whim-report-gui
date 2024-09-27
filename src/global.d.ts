import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider';
import type { LoadingBarApiInjection } from 'naive-ui/es/loading-bar/src/LoadingBarProvider';
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';
import type { NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider';
import type { Component } from 'vue';

declare global {
  interface Window {
    $loading: LoadingBarApiInjection;
    $message: MessageApiInjection;
    $dialog: DialogApiInjection;
    $notification: NotificationApiInjection;
    // 语言
    $t: any;
    $vue: any;
    // 键盘按键记录
    $KeyboardActive?: { [T: string]: boolean };
    onKeySpacePressHold?: Function;

    // 编辑 JSON 的存储对象
    opener: any
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    icon?: Component;
    // 隐藏当前菜单及子菜单
    hideInMenu?: boolean;
    hideInBread?: boolean;
    access?: string;
  }
}
