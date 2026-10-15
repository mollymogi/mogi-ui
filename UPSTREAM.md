# 上游来源记录

`packages/ui/src/components/ui/` 下的组件复制自 shadcn/ui：

- 仓库：https://github.com/shadcn-ui/ui
- 路径：`apps/v4/registry/new-york-v4/ui/`
- 分支：`main`，拉取日期 2026-10-15

拉取时只做了两处机械替换：
- `cn` 的导入改为 `@mogi-ui/ui/lib/utils`
- 组件间导入改为 `@mogi-ui/ui/components/*`

在此之上的 mogi 改动都在代码里用 `// mogi:` 注释标出，合并上游更新时只需要关注这些位置：

| 组件 | 改动 |
|---|---|
| badge | 新增 `soft`、`success`、`warning`、`highlight` 变体；加大内边距（`px-2.5 py-1`）、图标间距（`gap-1.5`）和字距（`tracking-wide`），图标改为 `size-3.5`，带前置图标时左内边距收为 `pl-2`；圆角由 `rounded-full` 改为 `rounded-sm` |
| alert | 新增 `success`、`warning` 变体 |
| sonner | 去掉 `next-themes` 依赖，主题改为通过 `theme` 属性传入 |
| table | 表头加浅底；选中态（`data-state="selected"` 或 `aria-selected="true"`）改为 `accent/50` 底色加首列左侧 primary 色条；新增 `TableEmpty` 空表行；`Table` 新增 `containerClassName` |

其余组件与上游一致，mogi 风格完全来自 `@mogi-ui/tokens` 里的 CSS 变量。
