export type FrameMetaProps = {
  title: string;
  type: string;
};
export type FrameMeta = {
  title: string;
  type: string;
  belong: 'control',
  props: FrameMetaProps[];
};
export default {
  title: '边框',
  type: 'frame',
  belong: 'control',
  props: [
    {
      title: '普通边框',
      type: 'frame-1',
    }
  ]
};
