import { useDialog, useNotification, useMessage, useModal } from 'naive-ui'

export function useApp() {
  const dialog = useDialog()
  const notification = useNotification()
  const message = useMessage()
  const modal = useModal()
  return {
    dialog,
    notification,
    message,
    modal,
  };
}
