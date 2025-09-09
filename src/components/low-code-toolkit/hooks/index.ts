import { inject, ref, reactive, onBeforeUnmount } from 'vue';
import { throttle } from 'lodash-es';
import { LowCodeShare, LowCodeEvent } from '../common/constant';
import type { LowCodeStateType, NodeProps } from '../types';
export function useLowCodeState() {
  const defaultState = reactive<LowCodeStateType>({
    mode: 'view',
    nodes: [],
    selected: [],
    dark: false,
    canvas: { offset: 0, scale: 1 },
    isAdd: false,
    isMove: false,
    isSelect: false,
    selectionBox: {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      visible: false,
      source: null,
    },
    mousePosition: {
      startX: 0,
      startY: 0,
      x: 0,
      y: 0,
    },
  });
  return inject<LowCodeStateType>(LowCodeShare.globalState, defaultState);
}

type LowCodeContext = {
  addNode?: (node: NodeProps) => void;
  select?: (node: NodeProps) => void;
};
export function useLowCodeContext(): LowCodeContext {
  const addNode = inject<LowCodeContext['addNode']>(LowCodeEvent.addNode);
  const select = inject<LowCodeContext['select']>(LowCodeEvent.select);
  return {
    addNode,
    select,
  };
}


// 框选 Hook
export function useBoxSelect() {
  const state = useLowCodeState();
  const context = useLowCodeContext();
  const isSelecting = ref(false);

  let startOffsetX = 0;
  let startOffsetY = 0;
  let startScreenX = 0;
  let startScreenY = 0;
  let scale = 1;

  // 鼠标移动（节流）
  const mousemove = throttle((moveEvent: MouseEvent) => {
    if (!isSelecting.value) return;

    const currX = startOffsetX + moveEvent.screenX - startScreenX;
    const currY = startOffsetY + moveEvent.screenY - startScreenY;
    // chartEditStore.setMousePosition(currX, currY);

    const selectAttr = { x1: 0, y1: 0, x2: 0, y2: 0 };

    if (currX > startOffsetX && currY > startOffsetY) {
      // 右下方向
      selectAttr.x1 = startOffsetX;
      selectAttr.y1 = startOffsetY;
      selectAttr.x2 = Math.round(startOffsetX + (moveEvent.screenX - startScreenX) / scale);
      selectAttr.y2 = Math.round(startOffsetY + (moveEvent.screenY - startScreenY) / scale);
    } else if (currX > startOffsetX && currY < startOffsetY) {
      // 右上方向
      selectAttr.x1 = startOffsetX;
      selectAttr.y1 = Math.round(startOffsetY - (startScreenY - moveEvent.screenY) / scale);
      selectAttr.x2 = Math.round(startOffsetX + (moveEvent.screenX - startScreenX) / scale);
      selectAttr.y2 = startOffsetY;
    } else if (currX < startOffsetX && currY > startOffsetY) {
      // 左下方向
      selectAttr.x1 = Math.round(startOffsetX - (startScreenX - moveEvent.screenX) / scale);
      selectAttr.y1 = startOffsetY;
      selectAttr.x2 = startOffsetX;
      selectAttr.y2 = Math.round(startOffsetY + (moveEvent.screenY - startScreenY) / scale);
    } else {
      // 左上方向
      selectAttr.x1 = Math.round(startOffsetX - (startScreenX - moveEvent.screenX) / scale);
      selectAttr.y1 = Math.round(startOffsetY - (startScreenY - moveEvent.screenY) / scale);
      selectAttr.x2 = startOffsetX;
      selectAttr.y2 = startOffsetY;
    }

    // 遍历组件，判断是否完全包含
    state.nodes.forEach((item) => {
      const { x, y, w, h } = item.attr;
      const targetAttr = { x1: x, y1: y, x2: x + w, y2: y + h };

      if (
        targetAttr.x1 >= selectAttr.x1 &&
        targetAttr.y1 >= selectAttr.y1 &&
        targetAttr.x2 <= selectAttr.x2 &&
        targetAttr.y2 <= selectAttr.y2 &&
        !item.lock &&
        !item.hide
      ) {
        context.select?.(item);
      }
    });
  }, 30);

  // 鼠标抬起
  const mouseup = () => {
    if (!isSelecting.value) return;

    isSelecting.value = false;
    mousemove.cancel();
    // chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_SELECT, false);
    // chartEditStore.setMousePosition(0, 0, 0, 0);

    document.removeEventListener('mousemove', mousemove);
    document.removeEventListener('mouseup', mouseup);
  };

  // 鼠标按下入口（供外部绑定）
  const mousedown = (e: MouseEvent) => {
    if (e.button === 2) return;
    if (window.$KeyboardActive?.space) return;
    if (isSelecting.value) return;

    isSelecting.value = true;

    startOffsetX = e.offsetX;
    startOffsetY = e.offsetY;
    startScreenX = e.screenX;
    startScreenY = e.screenY;
    scale = state.canvas.scale;
    state.mousePosition.startX = startOffsetX;
    state.mousePosition.startY = startOffsetY;

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  };

  // 兜底清理（组件卸载时）
  onBeforeUnmount(() => {
    mouseup();
  });

  return {
    isSelecting,
    mousedown,
  };
}
