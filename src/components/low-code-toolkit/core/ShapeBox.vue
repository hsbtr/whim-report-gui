<script setup lang="ts">
import type { NodeProps } from '../types';
interface ShapeBoxProps {
  isPoint: Boolean;
  nodeProps: NodeProps;
}
type PointCfg = {
  point: string;
  cursor: string;
  position: (w: number, h: number) => [number, number];
};
const props = defineProps<ShapeBoxProps>();
const primaryColor = '#51d6a9';
const pointConfig: PointCfg[] = [
  {
    point: 'top',
    cursor: 'n-resize',
    position: (w: number) => [w / 2, 0]
  },
  {
    point: 'right',
    cursor: 'e-resize',
    position: (w: number, h: number) => [w, h / 2]
  },
  {
    point: 'bottom',
    cursor: 's-resize',
    position: (w: number, h: number) => [w / 2, h]
  },
  {
    point: 'left',
    cursor: 'w-resize',
    position: (_w: number, h: number) => [0, h / 2]
  },
  {
    point: 'left-top',
    cursor: 'nw-resize',
    position: () => [0, 0]
  },
  {
    point: 'right-top',
    cursor: 'ne-resize',
    position: (w: number) => [w, 0]
  },
  {
    point: 'right-bottom',
    cursor: 'se-resize',
    position: (w: number, h: number) => [w, h]
  },
  {
    point: 'left-bottom',
    cursor: 'sw-resize',
    position: (_w: number, h: number) => [0, h]
  }
];

// 锚点位置
const getPointStyle = (config: PointCfg, attr: NodeProps['attr']) => {
  const { w: width, h: height } = attr;
  const [newLeft, newTop] = config.position(width, height);

  return {
    left: `${newLeft}px`,
    top: `${newTop}px`,
    cursor: config.cursor
  };
};
const onMousePoint = (e: MouseEvent, point: string, attr: NodeProps['attr']) => {
  e.stopPropagation();
  e.preventDefault();
  // const nodeAttrX = attr.x;
  // const nodeAttrY = attr.y;
  // const nodeAttrW = attr.w;
  // const nodeAttrH = attr.h;
};
</script>

<template>
  <div class="shape-box">
    <slot />
    <div class="shape-modal">
      <div class="shape-modal-select"></div>
      <div class="shape-modal-change"></div>
    </div>
    <template v-if="!props.isPoint">
      <div
        v-for="cfg in pointConfig"
        :class="['shape-point', cfg.point]"
        :key="cfg.point"
        :style="getPointStyle(cfg, props.nodeProps.attr)"
        @mousedown="onMousePoint($event, cfg.point, props.nodeProps.attr)"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.shape-box {
  position: absolute;
  cursor: move;
  .lock {
    cursor: default !important;
  }
  .hide {
    display: none;
  }
  .shape-point {
    width: 7px;
    height: 7px;
    z-index: 1;
    background: #ffffff;
    border-radius: 5px;
    border: 3px solid v-bind(primaryColor);
    transform: translate(-40%, -30%);
    //.left-top {}
    .top, .button {
      width: 30px;
    }
    .top {
      transform: translate(-50%, -50%);
    }
    .button {
      transform: translate(-50%, -30%);
    }
    .left, .right {
      height: 30px;
    }
    .left {
      transform: translate(-45%, -50%);
    }
    .right {
      transform: translate(-20%, -50%);
    }
    .right-top, .right-bottom {
      transform: translate(-30%, -30%);
    }
  }
  .shape-modal {
    position: absolute;
    top: 0;
    left: 0;
    .shape-modal-select, .shape-modal-change {
      width: 100%;
      height: 100%;
      position: absolute;
      border-radius: 4px;
    }
    .shape-modal-select {
      top: 2px;
      left: 2px;
      opacity: 0.1;
      .active {
        background-color: v-bind(primaryColor);
      }
    }
    .shape-modal-change {
      border: 2px solid rgba(0, 0, 0, 0);
      .select-active, .hover-active {
        border-color: v-bind(primaryColor);
        border-width: 2px;
      }
      .hover-active {
        border-style: dotted;
      }
      .select-active {
        border-style: solid;
      }
    }
  }
}
</style>
