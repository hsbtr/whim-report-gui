# 单元测试脚本收敛设计

## 背景

`package.json` 同时提供 `test:unit`（`vitest`）和 `test:unit:run`（`vitest run`）。后者只用于 VERIFY 规则，是前者加 `--run` 参数的重复入口，没有独立业务语义。

## 方案

- 删除 `package.json` 中的 `test:unit:run`。
- 保留 `test:unit` 作为唯一单元测试入口：日常监听使用 `pnpm test:unit`，单次验证使用 `pnpm test:unit --run`。
- 将 `AGENTS.md` 的相关 VERIFY 示例改为 `pnpm test:unit --run -- <related test files or filters>`。
- 不修改历史计划文档中的旧命令，以保留历史记录。

## 范围与兼容性

本次只修改 npm 脚本和维护规则，不修改 Vitest 配置、测试代码或生产代码。`test:unit` 的原有监听行为保持不变；单次运行仍由 Vitest 原生 `--run` 参数提供。

## 验证

- 检查 `package.json` 和 `AGENTS.md` 格式。
- 通过保留入口运行现有单元测试，确认 `--run` 参数可用。
