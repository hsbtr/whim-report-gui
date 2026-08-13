# whim-report-gui 架构说明

## 1. 项目定位与成熟度

`whim-report-gui` 是一个面向低代码报表场景的 Vue 3 前端。仓库当前已经具备基础后台布局、项目分页列表、HTTP 请求封装、Mock 数据、主题切换和物料面板；图表编辑器、画布解析、配置持久化和预览渲染仍处于搭建阶段。

本文描述的是仓库当前代码，而不是目标蓝图。空组件或尚未串联的模块会明确标注，后续实现不应依赖未落地行为。

## 2. 技术栈

| 领域     | 选型                       | 作用                               |
| -------- | -------------------------- | ---------------------------------- |
| 应用框架 | Vue 3                      | Composition API 与 Vue SFC         |
| 语言     | TypeScript                 | 应用、配置、测试和物料类型         |
| 构建工具 | Vite 5                     | 开发服务、构建、别名和模块自动发现 |
| UI       | Naive UI                   | 布局、菜单、表单、弹窗和主题       |
| 路由     | Vue Router 4               | 静态页面路由                       |
| 状态管理 | Pinia                      | 当前用于 UI 主题和语言状态         |
| HTTP     | Axios                      | 统一请求、响应和错误拦截           |
| 图表     | ECharts + vue-echarts      | 图表基础组件                       |
| 拖拽     | vuedraggable               | 低代码画布方向的拖拽能力           |
| Mock     | vite-plugin-mock + Mock.js | 本地接口模拟                       |
| 单元测试 | Vitest + Vue Test Utils    | jsdom 环境下的组件测试             |
| E2E      | Cypress                    | 浏览器端流程测试                   |
| 包管理   | pnpm                       | 依赖与脚本执行                     |

Node.js 版本要求以 `package.json` 为准，当前为 `>=20.8.1`。

## 3. 运行时启动流程

应用入口是 `src/main.ts`：

1. 导入全局样式 `src/assets/main.css`。
2. 通过 `createApp` 创建根应用。
3. 注册 Pinia。
4. 注册 Vue Router，并等待 `router.isReady()`。
5. 将应用挂载到 `#app`。

根组件 `src/App.vue` 负责两个全局横切能力：

- `NConfigProvider`：根据 `uiStore` 选择明暗主题、中文或英文 locale，以及 Highlight.js 实例。
- `AppProvider`：建立 Naive UI 的 loading、dialog、notification 和 message Provider，并把对应 API 暴露到 `window`。

因此，HTTP 错误通知等依赖 `window.$notification` 的逻辑只有在根 Provider 初始化后才可用。

## 4. 目录与职责

```text
.
├─ cypress/                         # Cypress E2E 用例、fixture 与支持代码
├─ mock/                            # vite-plugin-mock 接口定义
├─ public/                          # 原样复制的静态资源
├─ src/
│  ├─ api/                          # 面向业务域的接口函数与返回类型
│  ├─ assets/                       # 全局样式、基础样式和图片
│  ├─ components/
│  │  ├─ low-code-toolkit/          # 物料、编辑器上下文、画布和工具函数
│  │  ├─ popups/                    # Naive UI 全局反馈 Provider 初始化
│  │  ├─ pro-form/                  # 表单封装
│  │  └─ ve-chart/                  # ECharts 展示组件
│  ├─ config/                       # UI、请求字段、状态码等共享配置
│  ├─ hooks/                        # 可复用 Composition API hooks
│  ├─ http/                         # Axios 实例、拦截器和下载工具
│  ├─ router/                       # 路由实例与静态路由表
│  ├─ stores/                       # Pinia stores
│  ├─ utils/                        # 通用函数和 VNode 辅助方法
│  ├─ views/                        # 路由级页面
│  ├─ App.vue                       # 根 Provider 与 RouterView
│  └─ main.ts                       # 应用入口
├─ vite.config.ts                   # Vite、Vue、Mock、DevTools 与别名配置
├─ vitest.config.ts                 # Vitest 配置
└─ cypress.config.ts                # Cypress 配置
```

`@/` 在 Vite 和 TypeScript 中都映射到 `src/`。新增源码应继续使用该别名，避免深层相对路径。

## 5. 页面与路由

路由使用 `createWebHistory(import.meta.env.BASE_URL)`，路由表集中在 `src/router/routes.ts`。

主要页面关系如下：

```text
/
└─ /base
   ├─ /base/home          首页
   ├─ /base/test/about    关于页
   ├─ /base/project       项目列表
   └─ /base/data/source   数据源

/chart/editor             图表编辑器
/chart/preview            图表预览
```

`/base` 使用 `BaseLayout.vue`，其子路由通过嵌套 `RouterView` 渲染。顶部菜单由 `useCurrentRoutes()` 根据当前 matched routes 和静态路由表生成。

编辑器和预览页位于基础布局之外，适合承载独立的全屏工作区。目前：

- `ChartEditor.vue` 只挂载了编辑器上下文和左侧物料面板，主画布尚未接入。
- `ChartPreview.vue` 仍为空壳。
- `MyProject.vue` 的“编辑”操作会把项目 ID 放入 `/chart/editor?id=...` 并打开新标签页；“预览”当前未传项目 ID。

当前没有路由守卫、鉴权路由、动态菜单或自动路由注册。新增此类机制前应先明确后端协议和访问控制需求。

## 6. UI 状态与全局反馈

### 6.1 Pinia

`src/stores/uiStore.ts` 管理：

- 当前语言 `lang`；
- 主题 `light` / `dark`；
- 主色 `primaryColor`。

初始值来自 `src/config/ui.ts` 的 `setting`。当前语言切换只影响根组件传给 Naive UI 的 locale，没有注册完整的业务文案 i18n 流程。

### 6.2 Naive UI Provider

`src/components/popups/AppProvider.vue` 依次建立：

- `NLoadingBarProvider` → `window.$loading`；
- `NDialogProvider` → `window.$dialog`；
- `NNotificationProvider` → `window.$notification`；
- `NMessageProvider` → `window.$message`。

这些全局对象的类型声明位于 `src/global.d.ts`。需要全局反馈时应复用现有对象，不要在模块顶层自行创建脱离 Provider 的实例。

## 7. HTTP 与数据协议

### 7.1 Axios 实例

`src/http/index.ts` 的默认导出是项目公共 HTTP 实例：

- `baseURL`：`VITE_APP_HTTP_PREFIX`，缺省为 `/api/`；
- `timeout`：5 秒；
- `withCredentials`：`true`；
- 数组 query 参数使用 `repeat` 形式序列化；
- 从 Cookie 或 `sessionStorage` 读取 `Token`，并写入同名请求头。

文件中的具名导出 `request` 指向原始 `axios` 对象，不包含本实例的默认配置和拦截器。业务 API 应导入默认实例：

```ts
import http from '@/http';
```

### 7.2 请求参数改写

请求拦截器当前约定如下：

| 方法       | 调用侧传入                    | 实际发送位置                     |
| ---------- | ----------------------------- | -------------------------------- |
| GET        | `{ data: params }`            | `config.params`，即 query string |
| POST / PUT | `{ data: { data: payload } }` | body 中的 `payload`              |
| DELETE     | `{ data: params }`            | `config.params`                  |

示例：

```ts
export function getProjectPage(params: ProjectPageQuery): PagingType<ProjectInfo> {
  return http.get('project/page', { data: params });
}
```

不要在接口路径中再次拼接 `/api/`，否则会与默认 `baseURL` 重复。

### 7.3 响应约定

`src/config/fetch.ts` 通过 `DataConfig` 定义字段：

```text
code  业务状态码
msg   消息
data  业务数据
```

正常 JSON 响应由拦截器整理为 `{ code, msg, data }`。纯字符串响应被包装为成功响应；Blob 响应进入下载处理。`failureCodeGroup` 中的业务码会触发全局错误通知，HTTP 401 和其他网络错误也由响应拦截器报告。

401 后的登录跳转和用户状态清理目前只有注释骨架，不能视为已经实现的鉴权流程。

### 7.4 Mock

`vite.config.ts` 配置 `vite-plugin-mock` 从 `mock/` 加载接口，当前 `enable: true`。`mock/myProject.ts` 提供 `/api/project/page` 的 GET 分页数据，用于项目列表本地开发。该 Mock 当前返回 `message`，而公共响应协议读取 `msg`；分页数据不受影响，但调用侧取得的消息字段会是空值。

修改真实接口联调方式前，应先确认 Mock 是否仍会拦截相同 URL。

## 8. 低代码物料机制

低代码相关代码集中在 `src/components/low-code-toolkit/`，分为五个部分：

```text
low-code-toolkit/
├─ core/       编辑器上下文、画布和 Schema 解析入口
├─ packages/   chart、control、info 物料分类与组件
├─ provider/   provide/inject 使用的上下文键
├─ showcase/   物料选择面板
└─ tools/      Schema 生成和拖拽注册工具
```

### 8.1 自动发现

物料注册依赖两级 `import.meta.glob`：

1. `packages/index.ts` 使用 `./*/index.ts` 收集分类入口，生成 `materialSchemas`。
2. 每个分类入口使用 `./*/meta.ts` 收集具体物料元数据，并为模板补充分类 `type` 和组件系列 `series`。
3. `packages/index.ts` 还会扫描 `./*/*/*.vue` 并按 Vue 组件名构建组件映射；该映射目前未导出，也未被 Schema 解析器消费。

现有分类：

- `chart`：图表，例如折线图、柱状图；
- `control`：控件，例如容器；
- `info`：信息展示，例如列表。

物料元数据的核心关系是：

```text
分类入口
  └─ meta.ts
      └─ templates[]
          ├─ key       模板唯一键
          ├─ title     展示名称
          ├─ type      分类，由入口补充
          └─ series    对应组件系列，由入口补充
```

新增物料时应同时核对：

- Vue 组件文件名与元数据中的组件系列名称；
- 所属分类的类型联合；
- `meta.ts` 默认导出结构；
- 模板 `key` 在目标范围内是否唯一；
- Schema 解析端是否已经支持该物料。

### 8.2 编辑器上下文

`LowCodeLayout.vue` 以 `ContextProvider` 名称导出，提供三项上下文：

- `editorCfg`：包含组件集合和选中配置的响应式对象；
- `layerCurrentlySelected`：当前选中图层；
- `layerSelectionEvent`：更新选中图层的函数。

上下文键目前是字符串常量。扩展时应从 `provider/context.ts` 导入，避免在消费者中重复硬编码。

### 8.3 物料面板与拖拽

`InventoryPanel.vue` 从 `materialSchemas` 渲染分类、系列筛选和搜索结果。开始拖拽时，`dragRegisterGraphics()` 将物料模板序列化到：

```ts
event.dataTransfer?.setData('low-code', JSON.stringify(item));
```

接收侧必须使用相同的 `low-code` 键，并对反序列化结果做结构校验。

### 8.4 当前未闭环部分

以下模块仍是骨架：

- `DrawingPaper.vue` 注入了编辑器配置并渲染 `vuedraggable`，但尚未绑定列表、接收物料面板的 drop 数据或更新配置。
- `SchemaParser.vue` 只声明 `renderType` prop，模板为空。
- 自动收集的 Vue 组件映射尚未提供给 Schema 解析器。
- `ChartEditor.vue` 尚未挂载 `DrawingPaper`。
- `ChartPreview.vue` 尚未实现配置加载与渲染。
- 项目配置的保存、读取、发布和删除流程尚未接通。

后续实现应先定义稳定的 Schema 类型和持久化协议，再打通“物料元数据 → 拖拽实例 → 编辑器状态 → 保存 → 预览渲染”的单向数据链路。

## 9. 测试与构建

### 9.1 常用命令

```sh
pnpm dev
pnpm type-check
pnpm build
pnpm test:unit --run
pnpm test:e2e
```

`pnpm build` 会并行执行类型检查和 Vite 构建。`pnpm test:e2e` 会启动构建后的 preview 服务，并由 Cypress 访问 `http://localhost:4173`。

### 9.2 修改型脚本

以下脚本会改写文件：

```sh
pnpm lint     # ESLint --fix，范围是整个仓库
pnpm format   # Prettier --write src/
```

`.prettierrc.json` 当前使用了 `"arrowParens": true`，但仓库安装的 Prettier 3 要求该值为 `"always"` 或 `"avoid"`。因此，现有 `pnpm format` 和 Prettier check 会在处理文件前报配置错误；这是仓库既有问题，不应把该错误误判为目标文件格式错误。

只检查本次修改时应使用：

```sh
pnpm run lint:check -- <modified files>
pnpm run format:check -- <modified files>
```

### 9.3 当前测试覆盖

仓库中的 Vitest 和 Cypress 用例主要来自项目模板。它们证明测试工具已配置，但不能证明项目列表、HTTP 拦截器或低代码编辑器已有有效业务覆盖。新增关键数据转换或编辑器状态逻辑时，应优先补充与该逻辑直接相关的测试。

## 10. 变更边界与扩展原则

- 页面级功能放在 `src/views`，可复用 UI 放在 `src/components`。
- 业务接口放在 `src/api`，统一走默认 HTTP 实例。
- 跨页面 UI 状态放在 Pinia；编辑器内部状态优先留在低代码上下文中，除非确实需要跨路由共享。
- 物料定义应保持声明式，避免让物料面板依赖具体组件内部实现。
- 在 Schema 格式稳定前，不要过早设计复杂插件系统、版本迁移层或远程物料协议。
- 修改 `vite.config.ts` 中的 Mock、别名或插件时，应同时检查 Vitest 对该配置的合并使用。
- 涉及浏览器交互的改动不能只依赖类型检查；拖拽、Provider、路由新窗口和主题行为需要实际页面验证。
