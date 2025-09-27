# whim-report-gui

此模板应该可以帮助您开始在 Vite 中使用 Vue 3 进行开发。

## TS 中对 '.vue' 导入的类型支持

TypeScript 默认无法处理 '.vue' 导入的类型信息，因此我们将 'tsc' CLI 替换为 'vue-tsc' 进行类型检查。在编辑器中，我们需要 [Volar]（https://marketplace.visualstudio.com/items?itemName=Vue.volar） 来使 TypeScript 语言服务能够识别 '.vue' 类型。

## 自定义配置

See [Vite Configuration Reference](https://vitejs.dev/config/).

## 项目设置

```sh
npm install
```

### 用于开发的 Compile 和 Hot-Reload

```sh
npm run dev
```

### 用于生产的类型检查、编译和缩小

```sh
npm run build
```

### 运行单元测试 [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```
这将针对 Vite 开发服务器运行端到端测试。
它比生产构建快得多.

但仍然建议在部署之前使用 'test：e2e' 测试生产版本（例如在 CI 环境中）：

```sh
npm run build
npm run test:e2e
```

### Lint 与[ESLint](https://eslint.org/)

```sh
npm run lint
```
