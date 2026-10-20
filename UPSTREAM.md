# 上游来源记录

`packages/ui/src/components/ui/` 下的组件复制自 shadcn/ui：

- 仓库：https://github.com/shadcn-ui/ui
- 路径：`apps/v4/registry/new-york-v4/ui/`
- 分支：`main`，拉取日期 2026-10-15（sheet、alert-dialog、pagination、form、sidebar 及 `hooks/use-mobile.ts` 为第二批，同日拉取；slider 于 2026-10-16 拉取）

拉取时只做了两处机械替换：
- `cn` 的导入改为 `@mogi-ui/ui/lib/utils`
- 组件间导入改为 `@mogi-ui/ui/components/*`，hook 导入改为 `@mogi-ui/ui/hooks/*`

在此之上的 mogi 改动都在代码里用 `// mogi:` 注释标出，合并上游更新时只需要关注这些位置：

| 组件 | 改动 |
|---|---|
| badge | 新增 `soft`、`success`、`warning`、`highlight` 变体；加大内边距（`px-2.5 py-1`）、图标间距（`gap-1.5`）和字距（`tracking-wide`），图标改为 `size-3.5`，带前置图标时左内边距收为 `pl-2`；圆角由 `rounded-full` 改为 `rounded-sm` |
| alert | 新增 `success`、`warning` 变体 |
| sonner | 去掉 `next-themes` 依赖，主题改为通过 `theme` 属性传入 |
| pagination | 文案改为中文（上一页 / 下一页 / 更多页，`aria-label` 同步），`PaginationPrevious` / `PaginationNext` 的 children 可覆盖文案；当前页改为 primary 色描边和文字 |
| sheet | 新增 `SheetBody`（正文独立滚动，头尾固定）；`SheetContent` 新增 `closeLabel`（默认"关闭"）和 `container`（渲染进局部主题容器）；上下方向限高 `max-h-dvh`；遮罩和内容尊重 `prefers-reduced-motion` |
| sidebar | 无障碍和提示文案改为中文（触发按钮、边缘拖条 `SidebarRail`、窄屏抽屉标题）；边缘拖条的悬停提示带上快捷键 Ctrl/⌘ + B；菜单按钮选中时图标用 primary 色、悬停用 60% 的 accent；窄屏抽屉渲染进 `SidebarProvider` 外层元素（继承局部主题），`Sidebar` 的 data-*、`style`、`id` 落到抽屉本身（上游落在不渲染 DOM 的 Sheet Root 上），`className` 仍只作用于桌面容器 |
| slider | 滑块底色由 `bg-white` 改为 `bg-background`，暗色主题下不刺眼；按住滑块时轻微放大；已选区段与圆钮边框用专用 `slider-range` token，保证亮/暗主题控件对比度 |
| table | 表头加浅底；选中态（`data-state="selected"` 或 `aria-selected="true"`）改为 `accent/50` 底色加首列左侧 primary 色条；新增 `TableEmpty` 空表行；`Table` 新增 `containerClassName` |
| 动效（多个组件） | 时长和缓动统一换成 mogi 动效 token（见 docs/design-tokens.md「动效」）：dialog、alert-dialog、popover、dropdown-menu、select、tooltip 打开用 `ease-mogi-spring`、关闭用更快的 `ease-mogi-in`，dialog 和 alert-dialog 打开时额外从下方升起一点；sheet 滑入改为 `ease-mogi`；sidebar 收起展开由 `ease-linear` 改为 `ease-mogi`；button 按下缩到 97%；switch 滑块回弹；checkbox、radio-group 的勾和圆点弹出；tabs 切换过渡 |

2026-10-19 对比度修复：button / badge 的 link 变体与 pagination 使用 `text-link`；主按钮 hover 改为 95%；outline 按钮用 `border-strong`。input / textarea / select / radio-group 不再叠加暗色 input 填充；tabs 激活态保持 background。各组件的 `ring-ring/50` 改为实色 `ring-ring`，保留原环宽；slider 同步。

其余组件与上游一致，mogi 风格完全来自 `@mogi-ui/tokens` 里的 CSS 变量。

## mogi 自有组件

以下组件 shadcn 没有，由 mogi-ui 自己实现，不需要跟上游同步：

| 组件 | 文件 | 说明 |
|---|---|---|
| LoadMore | `load-more.tsx` | 列表底部"已载入 N 条 + 继续加载"，说明文字可自定义；不叫 Pagination，避免和 shadcn 的页码分页撞名 |
| DescriptionList | `description-list.tsx` | 键值列表，语义化 `dl > div > dt + dd`，`compact` 收紧行距 |
| CodeBlock | `code-block.tsx` | 原始 JSON / 文本块，标题栏放标签和操作，内容区限高滚动；`masked` 时加"已遮罩"标签和左侧色条；`numbered` 时左侧显示行号（行号不可选中，复制不含行号）；行号使用实色 muted-foreground 保证亮/暗对比度 |
| Diff | `diff.tsx` | 统一 diff 视图：按 `+` / `-` / `@@` 用 success / destructive / highlight 语义色着色；`truncated` 显示截断标签；仅首个 `@@` 前的 `+++` / `---` 作为文件头，之后按增删行处理；删除行沿用 `bg-destructive/10 text-destructive`，暗色 destructive token 提亮以保证合成背景上的文字对比度 ≥4.5:1 |
| EmptyState / LoadingState | `empty-state.tsx` | 空态、失败、未接入三种状态（`variant`）和骨架加载态 |
| DetailLayout | `detail-layout.tsx` | 详情看板布局：可选 header/summary/metrics/aside，宽屏主区与辅助栏 2:1，窄屏按 DOM 顺序排列；不负责业务判断、取数或展开状态 |
