# mogi-ui 仓库说明（给在本仓库里工作的 agent）

这是组件库本身，不是使用方项目。

- 目录结构、开发命令见 README.md。组件改动记录在 UPSTREAM.md，token 方案在 docs/design-tokens.md。
- `skills/mogi-ui/SKILL.md` 是给**使用方项目**的规范（各类 agent 通用）。它不约束本仓库的开发；但改了组件、变体、token 或安装方式时，要同步更新这份文件。
- 改颜色时保证亮/暗主题文字对比度都不低于 4.5:1，并同步 `registry.json`（再跑 `pnpm registry:build`）和 docs/design-tokens.md。
