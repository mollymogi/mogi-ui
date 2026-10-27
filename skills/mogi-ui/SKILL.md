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

1. 项目需为 React 19 + Tailwind v4，并已初始化 shadcn（`npx shadcn init`）。
2. 套用主题：`npx shadcn add https://mollymogi.github.io/mogi-ui/r/mogi-theme.json`
   主题更新后（例如 2026-10-18 新增了动效 token）要重新执行这条命令，否则新版组件的动效时长和缓动不生效。
   主题不带字体文件：JetBrains Mono 装 `@fontsource-variable/jetbrains-mono`；江城圆体从 https://mollymogi.github.io/mogi-ui/fonts/ 下载 `jiangcheng.css`、`jiangcheng/` 和 `OFL-jiangcheng.txt` 自托管。
3. 组件通过 registry 安装：`npx shadcn add https://mollymogi.github.io/mogi-ui/r/<组件名>.json`（如 `button`、`table`、`sidebar`；`all` 一次装全部）。可装的条目见 `https://mollymogi.github.io/mogi-ui/r/registry.json`。不要用 `npx shadcn add button` 这类官方短名，会装成 shadcn 原版覆盖 mogi 版本。

## 2. 必须遵守

- 颜色只用语义变量（`bg-primary`、`text-muted-foreground`、`bg-success` 等），禁止写死 hex 或用 Tailwind 原生色板（如 `bg-orange-500`）。
- 字体沿用主题：英文/数字 JetBrains Mono，中文江城圆体，不另引字体。
- 圆角、阴影、间距使用主题 token，不自定义数值。
- 动效用主题的动效 token：时长 `duration-(--duration-mogi-fast)` / `duration-(--duration-mogi)` / `duration-(--duration-mogi-slow)`，缓动 `ease-mogi`（进入）、`ease-mogi-spring`（带轻微回弹的进入）、`ease-mogi-in`（退出）。mogi-ui 组件已自带动效，不要再叠加；自己写的过渡只做透明度、小位移和缩放，不超过 320ms，不加动画库。减弱动态效果由主题统一处理，不要绕过（如写死 `animation-duration` 加 `!important`）。
- 优先用 mogi-ui 已有组件和变体；同一功能不要自己再写一个。
- 表示状态的 Badge（成功、失败、待审核等）前面放一个 lucide 图标，直接写在 children 里，例如 `<Badge variant="success"><CheckCircle2 /> 已完成</Badge>`，不只靠颜色区分。
- 工作台页面可用 `DashboardLayout`：`navigation` 放有名称的导航，`header` 放位置与全局操作，`children` 为主内容，`aside` 放辅助信息。窄屏导航在上方，辅助区在主内容后；移动导航的展开状态由使用方管理。总览用任务与项目建立中心，列表保持紧凑，详情给正文留空间，避免所有内容都放成同等强调的卡片。
- Dashboard 详情页优先用 `DetailLayout`：`summary` 放一句话结论，`metrics` 仅在有独立价值的指标时使用，主内容放对比/趋势，`aside` 放来源和操作；不要把全部信息堆成纵向手风琴。需要追溯的技术细节用 `Sheet`，同一区域切换用 `Tabs`；异常结论必须在首屏可见。`metricColumns` 支持 2/3/4，窄屏会按阅读顺序排列。
- 数据表格用 mogi-ui 的 `Table` 组合组件（自带横向滚动容器）：选中行设 `data-state="selected"`，并在首列放 `Checkbox` 让读屏也能识别；空表用 `TableEmpty`。
- 列表底部的"已载入 N 条 / 继续加载"用 `LoadMore`；详情页的键值对用 `DescriptionList` + `DescriptionItem`；原始 JSON / 文本用 `CodeBlock`（代码加 `numbered` 显示行号，行号使用实色 muted-foreground，不要降低透明度）；统一 diff 用 `Diff`（`content` 传 unified diff，`truncated` 标截断；所有行共享按内容撑宽且不窄于可视区的容器，横向滚动时增删/hunk 背景覆盖整行；仅首个 `@@` 之前的 `+++` / `---` 视为文件头，之后按增删行显示；删除行使用 `bg-destructive/10 text-destructive`，暗色对比度修复依赖新版主题 `destructive` token，更新时需同时重装主题）；空、失败、未接入用 `EmptyState`（`variant` 为 `empty` / `error` / `unavailable`），加载中用 `LoadingState`。
- 应用外框用 `Sidebar`（`SidebarProvider` 包住页面，`SidebarInset` 放主内容），默认 `collapsible="icon"` 并放一个 `SidebarRail`，让用户能点边缘或按 Ctrl/⌘ + B 在图标栏和完整宽度之间切换，每个 `SidebarMenuButton` 都传 `tooltip`；`SidebarContent` 只放业务导航；`SidebarFooter` 只放一个账号按钮（头像 + 名字 + 上下箭头图标），点开是 `DropdownMenu`，设置、账号、退出登录都收在菜单里；菜单向上弹（`side="top"`），侧栏收起成图标栏时向右弹（`side="right"`）；局部主题（如只给某块区域加 `.dark`）写在 `SidebarProvider` 或它的祖先上，窄屏抽屉会一起继承；侧栏配色由组件提供（暖白底，悬停和选中浅橘底 + 深色字），不要自己改；临时面板（筛选、编辑）用 `Sheet`，长内容放 `SheetBody`（正文滚动，`SheetFooter` 里的操作始终可见）；删除等不可撤销操作的确认用 `AlertDialog`，不要用普通 `Dialog`。
- 表单校验用 `Form`（react-hook-form）：每个字段用 `FormField` + `FormItem` + `FormLabel` + `FormControl` + `FormMessage`，错误提示交给 `FormMessage`，不自己写红字。
- 有总页数、需要跳页的列表用 `Pagination`；只需要往下加载的用 `LoadMore`。
- mogi-ui 只支持 React 19；React 18 项目先升级再接入。
- 亮/暗两套主题都要检查；文字对比度不低于 4.5:1，交互边框和焦点环不低于 3:1。链接用 `text-link`（亮色 corgi-600、暗色 corgi-400），交互轮廓用 `border-border-strong` 或 `border-input`，装饰卡片保留 `border-border`。滑块已选区段和圆钮边框使用 `slider-range`（亮色沿用 primary，暗色 corgi-400），更新滑块时需同时重装主题以获得该 token。主按钮为深橘底白字；不要给焦点环额外叠加透明度。更新主题和组件时一并重新安装 registry 条目。
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
- [ ] 没有写死动画时长或缓动
- [ ] 用到的组件都来自 mogi-ui，临时实现都标了 TODO 并已上报
- 动态卡片可用 `FlipCard`：传 `front` / `back`，组件自带客户端边界，通过独立的 `type="button"` 按钮翻面，支持键盘和触屏，放入表单不会触发提交。不要把必要操作或异常只藏在背面；隐藏面的内容会 inert，系统减弱动态效果时直接切换。项目卡片 hover 只对精确指针启用，避免触屏粘滞；不要让无意义动画持续循环。

- 文件列表使用 `FileTypeIcon` / `fileTypeOf(name, { kind, overrides })`，kind 为 `file` / `directory` / `symlink` / `binary`。这是纯文件名分类，不读取文件、不解析或跟随符号链接；调用方自行禁用不可读链接的操作。overrides 用小写扩展名（不含点）或完整小写文件名作为键，可覆盖 icon/tone/label；显式 kind 优先。tone 仅为 primary/success/warning/highlight/muted，用 `fileToneClass` 映射可读文本语义色。
- `CodeBlock` 可传 `language` 或 `fileName`，兼容 `numbered` / `startLine`，支持 C/C++、CMake、Shell、Python、JSON、Markdown、YAML、JS、TS；未知语言回退纯文本，显式 language 优先。`CodeHighlighter` 可单独用在 pre 内；只输出 React 文本节点，不注入 HTML。语法高亮按完整源码解析后拆行，保留多行 token、空行和换行；复制排除行号。依赖 lowlight/highlight.js 由 registry 自动安装，使用其内置语法，未使用外部主题 CSS。数字和 warning 图标在亮主题用 warning-foreground，暗主题用 warning；primary 文本用 link，避免直接使用按钮填充色作小字。

- 表单需要稳定 DOM ID 时用 `FormItem itemId="login-password"`，标签/控件共用它；常见直接子控件的显式 id 也会自动配对。ID 优先级 itemId > FormControl.id > 子控件 id > 自动 ID。FormItem.id 仍是容器 ID；自定义不透明包装应明确传 itemId。每个 FormItem 对应一个 FormControl。
- `MetricCard` 提供 label/value/unit/hint/icon/tone（default/success/warning/destructive），可组合进 DetailLayout.metrics；不要为填满栅格而捏造数据，普通信息仍可用 Card 组合或 DescriptionList。
- `StatusBadge value map unknownLabel` 由调用方提供状态映射（label/variant/icon）；空值与未识别值会兜底。历史状态使用 `Badge variant="historical"` 或对应 StatusBadge 映射，并在文案中写清“上次报告”，不沿用 success 表达当前已就绪。
- 长摘要单元格用 `TableCellTruncate value maxChars mono copyable`，完整文本保留在 DOM/title，复制使用原文；失败显示错误图标与可见文字，并通知读屏，状态在 2.5 秒后复位。maxChars 是 ch 视觉宽度，不截断数据。技术表可用 `Table density="compact"`。
- DescriptionItem.valueVariant 支持 default/mono/truncate，valueClassName 可叠加 font-mono；PasswordInput 保留 Input 表单属性并提供可访问的显隐按钮，使用 autoComplete 指明登录或新口令场景。
- use-mobile 仍为 registry:hook，安装位置由 components.json 的 aliases.hooks 控制；希望放在 lib 可配置为 @/lib，不需要库统一改目录。详见 docs/console-feedback.md。

- 单文件入口用 `FileDropzone`（value/onFileChange/accept/maxSize/validateFile）。键盘和拖放共用校验，客户端校验不能代替服务端验证。试听用 `AudioPreview`，调用方创建并在更换文件或卸载时释放 object URL，组件不自动播放。
- 互斥处理方式用 `ChoiceCards`（legend/options/value/onValueChange），保留原生 radio 箭头键和表单语义。任务用 `TaskProgress`（state/value/label/detail/onCancel），value 为 0–100，未知时不传；仅由真实事件更新，不用计时器伪造成功。
- 公开工具站用 `ToolPageLayout`（navigation/hero/aside/after/footer）；指南、关于、隐私等长文用 `ContentPageLayout`（navigation/eyebrow/title/description/footer）。两者组织完整页面，不应嵌套在已有 main 中；不提供账号连接、上传、法律文案或广告脚本。示例见 `?preview=audio-studio` 和 `docs/audio-studio.md`。

### 可选交互动效

- 多节点流程用 `WorkflowSteps`（steps/orientation/selectedStepId/onStepSelect/stateLabels）。每步显式提供 id/label/state，可选 description/meta/disabled；state 为 pending/running/completed/blocked/failed/skipped/unknown，不从相邻节点推断完成。onStepSelect 提供时渲染 type=button，支持键盘选择；静态流程不渲染按钮。横向在窄屏纵排，运行中图标遵循减少动态效果。选中、进行中与业务成功是不同事实。

- `TabsList` 默认提供滑动选中指示器；`animated={false}` 恢复静态样式。保留 Radix 的 value/defaultValue、键盘和焦点约定；支持 default/line 与横纵方向。
- `MetricCard animated` 仅为有限 number 值启用按位变化动画，首屏直接显示实际值；也可单独使用 `AnimatedNumber value locale formatOptions animated`。不要用动画生成假的进度或统计值。
- `FeedbackButton onAction` 接收真实操作（可返回 Promise），内部处理 pending/success/error、重复点击保护和失败重试。children 为默认文字，pendingLabel/successLabel/errorLabel 可自定义。固定 type=button，表单提交应显式调用表单的合法提交逻辑。保存失败须 reject/throw；组件不会把返回 false 当成失败。复制操作返回 navigator.clipboard.writeText 的 Promise。
- 上述动效遵循 prefers-reduced-motion；FeedbackButton 的 animated=false 关闭内容运动与加载旋转。不要对这些元素叠加相同属性的动画。

### 勾选、折叠与复制交互

- Checkbox 支持 checked="indeterminate"，半选显示减号；checked/defaultChecked/onCheckedChange 与 Radix 一致。Checkbox、Switch 的 animated=false 可关闭组件自身的运动。
- Collapsible / CollapsibleTrigger / CollapsibleContent：根组件接受 open/defaultOpen/onOpenChange、disabled 与 animated。关闭时内容保留在 DOM 中并设为 inert、aria-hidden，适合保留输入草稿；不要依靠收起来隐藏敏感资料。内容 padding 放在内部 children，避免关闭后仍占空间。Trigger 默认包含旋转箭头；asChild 时调用方提供完整触发元素与图标。
- CopyButton value label animated：原文始终由调用方提供，复制实际通过 navigator.clipboard.writeText 执行。权限拒绝显示可见错误文字，成功提示在 2.2 秒后复位。点击阻止向外冒泡；原生 DOM 监听器可能已先于 React 委托处理执行。复制按钮放在 CodeBlock.actions 或直接使用；TableCellTruncate copyable 已组合它。请为失败文字预留可换行空间。
- DialogContent / PopoverContent 的 animated=false 关闭进入和退出动画；DialogContent 同时关闭其遮罩动画。保留 Escape、焦点管理与原有受控 API。长内容在视口范围内滚动；不要在有裁剪需求的内容区放会溢出显示的装饰。

### 渐变与深色毛玻璃

- 在受控页面外层使用 AmbientBackground，enabled=false 回到实色背景；它使用 ambient-start/middle/end 主题 token 的静态渐变，不做持续背景动画。
- GlassSurface 默认 div，也可 asChild 包裹 section、DialogContent、PopoverContent；enabled=false 回到 card 实色。浅色保持实色，深色开启支持检测后的半透明与模糊；不支持 backdrop-filter 或系统减少透明度时回退实色。
- 玻璃用于主要面板，玻璃模式下嵌套指标卡可透明，输入保留实色。不直接覆盖任意图片/视频；内置对比度验证仅针对受控渐变和对应 alpha 合成。单独安装这两个组件时也需要最新 mogi-theme token。
