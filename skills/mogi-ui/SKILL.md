---
name: mogi-ui
description: 在 mercury 的任何项目里搭建或改造界面（页面、仪表盘、组件）时使用：统一用 mogi-ui 组件库和主题，缺少的组件或主题改动上报给 mogi-ui。Use when building or restyling any UI in mercury's projects.
---

<!-- 本文件是 mogi-ui 使用规范的唯一来源，与 agent 无关（Claude Code、Codex 等通用）。
     安装方法见仓库 README「给 AI agent 用」一节。修改规范只改这里。 -->

# mogi-ui 使用规范

所有界面统一使用 mogi-ui（基于 shadcn/ui 的个人组件库，风格来自角色 mogi：茉莉花 + 柯基）。

- 源码：https://github.com/mollymogi/mogi-ui
- 预览站（组件 + 亮/暗主题）：https://mollymogi.github.io/mogi-ui/

## 1. 接入

1. 项目需为 React + Tailwind，并已初始化 shadcn（`npx shadcn init`）。
2. 套用主题：`npx shadcn add https://mollymogi.github.io/mogi-ui/r/mogi-theme.json`
3. 需要的组件从 mogi-ui 仓库的 ui 包复制或通过 registry 安装，不要从 shadcn 官方重新拉取同名组件覆盖 mogi 版本。

## 2. 必须遵守

- 颜色只用语义变量（`bg-primary`、`text-muted-foreground`、`bg-success` 等），禁止写死 hex 或用 Tailwind 原生色板（如 `bg-orange-500`）。
- 字体沿用主题：英文/数字 JetBrains Mono，中文江城圆体，不另引字体。
- 圆角、阴影、间距使用主题 token，不自定义数值。
- 优先用 mogi-ui 已有组件和变体；同一功能不要自己再写一个。
- 数据表格用 mogi-ui 的 `Table` 组合组件（自带横向滚动容器）：选中行设 `data-state="selected"`，并在首列放 `Checkbox` 让读屏也能识别；空表用 `TableEmpty`。
- 亮/暗两套主题都要检查；文字对比度不低于 4.5:1。
- 不修改 mogi-ui 主题文件本身；需要改主题时走第 3 步上报。

## 3. 缺什么就上报

遇到以下情况，不要在业务项目里私自造一个长期组件或改主题：
- mogi-ui 没有需要的组件或变体
- 现有组件不满足需求或有 bug
- 需要新的颜色、token 或主题调整

做法：
1. 当前任务可以先写一个临时实现，文件顶部注明 `// TODO(mogi-ui): 待上游提供 <组件名>`。
2. 在 mollymogi/mogi-ui 开一个 issue，标题 `[需求] <组件名/改动>`，内容写：使用场景、来源项目、期望的 API 或外观、临时实现的位置。
3. 无法开 issue 时，在给用户的回复末尾列出「mogi-ui 待补清单」。
4. 不要直接向 mogi-ui 推代码，除非用户明确要求。

## 4. 交付前自查

- [ ] 没有写死颜色或原生色板
- [ ] 亮/暗主题都看过
- [ ] 用到的组件都来自 mogi-ui，临时实现都标了 TODO 并已上报