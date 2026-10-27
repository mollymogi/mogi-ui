# 上游来源记录

## 2026-10-27 · Herdr Studio 工作流步骤

修复 R1：运行状态文字改用 accent-foreground，并为 card 与选中／悬停 accent 底色增加亮／暗对比度检查；图标继续使用独立底色上的 link。

新增自有组件 `WorkflowSteps`，由 Herdr Studio 的任务节点视图提炼。调用者提供每个节点的状态、描述与元数据；组件不推断阶段完成、不模拟进度，也不推进业务流程。支持横向/纵向、键盘可达的可选步骤选择、当前运行节点、未知/阻塞/跳过状态及减少动态效果偏好。无新增依赖或主题颜色。交互示例：`?preview=workflow-steps`；回归检查：`node scripts/workflow-steps.test.mjs`。

## 2026-10-21 · Mogi Suno 网页组件回流

来源：Mogi Suno 网页 `rea/sites/mogi-suno-web`。以下为重新适配语义 token 的 mogi 自有组件，没有复制业务处理器、Chrome 扩展、Suno 接口或凭据。

| 组件 | 文件 | 说明 |
|---|---|---|
| FileDropzone | `file-dropzone.tsx` | 单文件拖放与键盘选择、大小和格式提示、可选自定义校验 |
| AudioPreview | `audio-preview.tsx` | 有名称的原生音频试听；不自动播放，使用方管理 URL |
| ChoiceCards | `choice-cards.tsx` | 原生 radio 卡片组、描述、禁用与受控选择 |
| TaskProgress | `task-progress.tsx` | 事件驱动的进度与不定进度、成功、失败和取消 |
| ToolPageLayout / ContentPageLayout | `tool-page-layout.tsx` | 公开工具页和说明页插槽布局 |

完整页面示例为 `apps/docs/src/demo-audio-studio.tsx`，通过 `?preview=audio-studio` 查看。支持真实本地试听；进度状态展览明确标注为演示。

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
| Diff | `diff.tsx` | 统一 diff 视图：所有行共享 `w-max min-w-full` 容器，横向滚动时背景覆盖最长行宽度；按 `+` / `-` / `@@` 用 success / destructive / highlight 语义色着色；`truncated` 显示截断标签；仅首个 `@@` 前的 `+++` / `---` 作为文件头，之后按增删行处理；删除行沿用 `bg-destructive/10 text-destructive`，暗色 destructive token 提亮以保证合成背景上的文字对比度 ≥4.5:1 |
| EmptyState / LoadingState | `empty-state.tsx` | 空态、失败、未接入三种状态（`variant`）和骨架加载态 |
| DetailLayout | `detail-layout.tsx` | 详情看板布局：可选 header/summary/metrics/aside，宽屏主区与辅助栏 2:1，窄屏按 DOM 顺序排列；不负责业务判断、取数或展开状态 |
| DashboardLayout | `dashboard-layout.tsx` | mogi 自有工作台壳：navigation/header/children/aside，桌面侧栏、窄屏顶部导航，可选辅助区；不管理数据和导航状态 |
| FlipCard | `flip-card.tsx` | mogi React 自有实现；借鉴 Inspira UI 翻转交互思路，声明客户端边界、非提交按钮切换、正反面自适应高度、隐藏面 inert、减弱动态效果直接切换；没有复制 Vue 代码 |

| FileTypeIcon / fileTypeOf | `file-type-icon.tsx` | mogi 自有文件名映射与语义图标，显式 kind、扩展名/文件名覆盖；不读取文件或跟随链接 |
| CodeHighlighter | `code-highlighter.tsx` | lowlight / highlight.js 语法树转 React 语义 token；保留原文换行、未知语言回退，不注入 HTML |

CodeBlock 增加 language/fileName 语法高亮、保留行号与复制原文；补充客户端边界。高亮语法来自 lowlight 与 highlight.js，使用各自包许可证；没有复制来源项目的临时实现。

## #33 看板接入反馈

- form：新增 FormItem.itemId，渲染时统一显式/自动 control ID，FormLabel 与 FormControl 配对，描述/错误 ID 保持独立。直接子控件 ID 可自动识别，不透明包装需 itemId。
- badge：新增 historical（去饱和底色、虚线边框）。
- table：新增 density=default/compact，仅作用于本表直接行。
- DescriptionItem：新增 valueVariant 与 valueClassName；CodeHighlighter 改用 currentLine 引用，UI 包开启 noUncheckedIndexedAccess。
- mogi 自有组件：MetricCard（metric-card.tsx）、StatusBadge（status-badge.tsx）、TableCellTruncate（table-cell-truncate.tsx）、PasswordInput（password-input.tsx），组合现有 Card/Badge/TableCell/Input/Button，未新增运行依赖。
- use-mobile 仍保留上游 registry:hook 安装约定，只补别名配置说明，不移动用户目录。
- TableCellTruncate：复制失败时显示错误图标与可换行的文字提示，保留 role=status 读屏通知；成功和错误状态仍在 2.5 秒后复位。

### Motion trio preview

- TabsList adds a shared sliding indicator (default and line, horizontal and vertical), interruptible on repeated selection, with `animated={false}` opt-out. Radix continues to manage selection, keyboard navigation and focus.
- AnimatedNumber shows the actual formatted value on first render and animates only subsequent changed digits. MetricCard exposes opt-in `animated` for numeric values; text values keep their existing rendering.
- FeedbackButton handles async pending/success/error states, duplicate submission protection, accessible status, stable label width and failure retry. Success only follows a resolved action; no automatic retries.
- Animation uses the browser Web Animations API and follows reduced-motion preferences, including changes while running. No added runtime packages or theme colors.
- Dedicated local showcase: `?preview=motion-trio`. Copy uses the real clipboard; save and metrics are explicitly local demos.

### Motion controls follow-up

- Checkbox now renders a minus for indeterminate state and draws newly checked strokes without replaying on first render; native Radix controlled/uncontrolled and form behavior are preserved.
- Switch uses scoped color/position transitions with a slight thumb press response. Checkbox/Switch accept `animated={false}`.
- Added Collapsible: Radix manages state and trigger semantics, a separate inner grid animates height without conflicting with Radix's layout measurements. Content stays mounted, but is inert and hidden from accessibility when collapsed.
- Added reusable CopyButton; TableCellTruncate composes it while retaining visible failure text. Copy shows success only after a real clipboard write, cancels stale feedback on value change/unmount and allows retry after failure.
- DialogContent/PopoverContent accept `animated={false}`, and constrain scrolling to the available viewport. The preview's motion toggle propagates through portals.
- Expanded motion-trio preview with interactive notification selection, persistent collapsible form, config copy, local dialog edits and popover density control. No new dependencies or colors.
- Portal motion opt-out uses an effectively instant animation rather than removing animation names during exit, so Radix Presence still receives completion events when the motion setting changes mid-close.

### Optional ambient background / dark glass

- Added AmbientBackground and GlassSurface, with separately switchable preview controls. Existing base card/background/popover tokens retain opaque defaults.
- Added light/dark ambient stops, glass tint and border tokens to CSS and registry. Dark major panels and portals use glass; nested data cards and inputs retain opaque fills. Unsupported blur and reduced-transparency preferences use opaque surfaces.
- Contrast validation now covers gradient endpoints, conservative RGB bounds and alpha-composited glass text. Docs and consumer SKILL describe the opt-in usage and limits.

### Clear glass panel refinement

- Replaced dark glass's 72% brown fill with a neutral white tint at 4% opacity and a translucent white rim; increased backdrop blur to 40px. The panel now reveals the actual ambient backdrop instead of reading as an opaque brown card.
- Nested metric/code panels in the glass preview use transparent fills without additional blur; inputs retain their control surface. Base card tokens and the glass-off fallback stay opaque.
