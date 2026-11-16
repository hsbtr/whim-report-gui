import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, expect, it, vi } from 'vitest';
import { commonNodeProps } from '../common/node.props';
import LazyLoadNode from '../core/LazyLoadNode.vue';
import { pkgMetas } from '../packages';
import { getMaterialLoader } from '../packages/material-loaders';

vi.mock('../packages/frame/VFrame.vue', () => {
  throw new Error('物料分包下载失败');
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('能解析所有已登记物料的组件路径', () => {
  expect(pkgMetas.length).toBeGreaterThan(0);
  for (const { type, fieldProps } of pkgMetas) {
    for (const { uuid } of fieldProps) {
      const loadPath = `../packages/${type}/${uuid.split('-')[0]}`;
      const loader = getMaterialLoader(loadPath);
      expect(loader, loadPath).toBeTypeOf('function');
      expect(getMaterialLoader(`${loadPath}.vue`)).toBe(loader);
    }
  }
});

it('为路径已失效的节点显示与节点等大的占位', () => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  const loadPath = '../packages/frame/Missing';
  const wrapper = mount(LazyLoadNode, {
    props: { path: loadPath, fieldProps: { ...commonNodeProps, title: '旧边框', uuid: 'VFrame-1', loadPath } },
    attrs: { style: { width: '500px', height: '300px' } }
  });

  const placeholder = wrapper.get('[role="status"]');
  expect(placeholder.text()).toBe('物料无法加载');
  expect(placeholder.attributes('style')).toContain('width: 500px');
  expect(placeholder.attributes('style')).toContain('height: 300px');
  wrapper.unmount();
});

it('在有效路径的组件分包加载失败时显示占位并记录路径', async () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  const loadPath = '../packages/frame/VFrame';
  const wrapper = mount(LazyLoadNode, {
    props: { path: loadPath, fieldProps: { ...commonNodeProps, title: '边框', uuid: 'VFrame-1', loadPath } }
  });

  await vi.dynamicImportSettled();
  await flushPromises();

  expect(wrapper.get('[role="status"]').text()).toBe('物料无法加载');
  expect(warn).toHaveBeenCalledWith(expect.any(String), loadPath, expect.any(Error));
  wrapper.unmount();
});
