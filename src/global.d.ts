import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider';
import type { LoadingBarApiInjection } from 'naive-ui/es/loading-bar/src/LoadingBarProvider';
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';
import type { NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider';
import type { Component } from 'vue';
import type { MimeTypeString } from '@/http/method/download';

declare global {
  /** 项目通过声明合并增加扩展名，以获得 fileType 自动补全。 */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface DownloadFileTypeExtensions {}

  interface Window {
    /** 下载扩展表；在 main.ts 初始化，同名配置覆盖内置映射。 */
    $fileTypeMaps?: Partial<DownloadFileTypeExtensions> & Record<string, MimeTypeString>;
    $loading: LoadingBarApiInjection;
    $message: MessageApiInjection;
    $dialog: DialogApiInjection;
    $notification: NotificationApiInjection;
    //  语言
    $t: unknown;
    $vue: unknown;
    // 键盘按键记录
    $KeyboardActive?: { [T: string]: boolean };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
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
