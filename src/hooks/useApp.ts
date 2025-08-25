import { useDialog, useNotification, useMessage, useModal, useLoadingBar } from 'naive-ui';

export function useApp() {
  const dialog = useDialog();
  const notification = useNotification();
  const message = useMessage();
  const modal = useModal();
  const loading = useLoadingBar();
  return {
    loading,
    dialog,
    notification,
    message,
    modal,
  };
}
