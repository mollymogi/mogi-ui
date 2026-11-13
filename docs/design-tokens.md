# Mogi 风格 Design Token 方案（v1.7，2026-11-02：语义色拉开与重点层级）

来源：角色形象 mogi（茉莉花 + 柯基）。配色直接从原图取样：头发 `#be7d53`、耳朵 `#f3c59f`、毛衣 `#f9e9d9`、肩部 `#ebc0a7`、裙子 `#a57e69`、眼睛 `#9c755e`、叶子 `#a78b57`、花瓣近白 `#f7dfc7`。

## 一、风格关键词

- **暖、软、圆**：柯基的毛色 + 针织毛衣。整体是暖色调中性色，以暖色为主，主按钮使用白字；色板标签必要时用黑白保证可读性。
- **一点清新**：茉莉花的白和叶子的绿，作为点缀和成功态颜色。
- **圆角偏大、阴影轻**：像毛茸茸的手感，而不是扁平硬边。
- **字体：英文 JetBrains Mono + 中文江城圆体**：英文数字等宽，带一点开发者/工具感；中文用江城圆体（基于源泉圆体/思源黑体改造，SIL OFL 授权，可免费商用和嵌入网页），圆润的笔画正好呼应柯基的软萌感。

## 二、基础层色板（Primitive）

| 名称 | 用途 | 色阶 |
|---|---|---|
| `corgi` | 主色，柯基姜橘 | 50 `#fdf6ee` · 100 `#fae8d3` · 200 `#f3cfa6` · 300 `#e9b07a` · 400 `#dc9357` · **500 `#c97d45`** · 600 `#a65a2a` · 700 `#8c4f2a` · 800 `#6d3f24` · 900 `#58331f` |
| `sand` | 中性色，奶油到摩卡 | 50 `#fdfaf5` · 100 `#f9efe3` · 200 `#efe1d0` · 300 `#dfcbb5` · 400 `#c4a88f` · 500 `#a57e69` · 600 `#86634f` · 650 `#765645` · 700 `#6a4c3c` · 800 `#4e372c` · 900 `#3a2820` · 950 `#291b15` |
| `terracotta` | 辅助强调（毛衣肩部） | 100 `#f8ddd0` · 300 `#eab399` · **500 `#d98d6a`** · 700 `#b86b48` · 800 `#984a28` |
| `jasmine` | 叶绿，成功态 / 点缀 | 100 `#e8efd6` · 300 `#b9cc8a` · **500 `#7f9a4a`** · 700 `#55702a` |
| `petal` | 茉莉白，高亮面 | `#fffaf3` |
| `rose` | 错误 / 危险态 | 100 `#f9ddd6` · **500 `#c4553c`** · 600 `#a8402c` · 700 `#9b3f2b` |
| `honey` | 警告态 | 100 `#fbefc9` · **500 `#d9a63a`** · 700 `#a67a1f` |

## 三、语义层（沿用 shadcn 变量名）

亮色（正文阈值 4.5:1、交互边框和焦点环阈值 3:1；由 `pnpm contrast:check` 读取源码实测）：
```css
:root {
  --background: #fdfaf5;
  --foreground: #3a2820;
  --card: #fffdf9;            --card-foreground: #3a2820;
  --popover: #fffdf9;         --popover-foreground: #3a2820;
  --link: #a65a2a;
  --primary: #a65a2a;         --primary-foreground: #ffffff;
  --slider-range: #a65a2a;
  --secondary: #f9efe3;       --secondary-foreground: #6a4c3c;
  --muted: #f3e8da;           --muted-foreground: #765645;
  --accent: #fae8d3;          --accent-foreground: #8c4f2a;
  --destructive: #a8402c;     --destructive-foreground: #fffaf3;
  --success: #55702a;         --success-foreground: #fffaf3;
  --highlight: #984a28;
  --warning: #d9a63a;         --warning-foreground: #3a2820;
  --border: #e9dccb;
  --border-strong: #a57e69;
  --input: #a57e69;
  --ring: #a65a2a;
  --radius: 0.75rem;
  --sidebar: #fffdf9;         --sidebar-foreground: #3a2820; /* 暖白底 */
  --sidebar-accent: #fae8d3;  --sidebar-accent-foreground: #3a2820; /* 选中浅橘底 + 深色字，悬停 60% */
  --shadow-sm: 0 1px 2px rgb(58 40 32 / .06);
  --shadow-md: 0 4px 14px rgb(58 40 32 / .10);
}
```

暗色（摩卡底，链接和焦点环提亮；按钮保持深橘底白字）：
```css
.dark {
  --background: #241811;
  --foreground: #f6ebdd;
  --card: #2e2017;            --card-foreground: #f6ebdd;
  --popover: #2e2017;         --popover-foreground: #f6ebdd;
  --link: #dc9357;
  --primary: #a65a2a;         --primary-foreground: #ffffff;
  --slider-range: #dc9357;
  --secondary: #3a2a1f;       --secondary-foreground: #e6d3bf;
  --muted: #3a2a1f;           --muted-foreground: #c4a88f;
  --accent: #4a3425;          --accent-foreground: #f3cfa6;
  --destructive: #e87960;     --destructive-foreground: #2a1a10;
  --success: #a3bd6c;         --success-foreground: #1d2410;
  --warning: #e6b94f;         --warning-foreground: #2a1a10;
  --border: #44332a;
  --border-strong: #a57e69;
  --input: #a57e69;
  --ring: #dc9357;
  --sidebar: #2e2017;         --sidebar-foreground: #f6ebdd;
  --sidebar-accent: #4a3425;  --sidebar-accent-foreground: #f6ebdd;
}
```

## 四、非颜色 token

| 类别 | 值 |
|---|---|
| 圆角 | sm 0.5rem · md 0.75rem（默认）· lg 1rem · full 9999px；按钮、输入框用 md，卡片用 lg，头像/标签用 full |
| 字体 | 全局 `"JetBrains Mono", "Jiangcheng Yuanti", "Noto Sans SC", ui-monospace, monospace`；JetBrains Mono 不含汉字，中文自动落到江城圆体，Noto Sans SC 兜底。江城圆体有 300/400/500/600/700 五个字重，单个 ttf 约 14MB，网页使用时须用 fonttools（pyftsubset）子集化或按 unicode-range 切片后转 woff2，否则加载太慢；数字天然等宽，无需 `tabular-nums`。正文字号建议 14px、行高 1.7（等宽字体偏宽，字号比普通无衬线小一号更舒服） |
| 字号 | xs 11 · sm 13 · base 14 · lg 16 · xl 18 · 2xl 22 · 3xl 28 |
| 间距 | 4 的倍数，组件内 8/12/16，区块间 24/32/48 |
| 阴影 | 只用 sm / md 两档，颜色基于 `sand-900` 带透明度，避免灰色阴影 |
| 动效 | 见下方「动效」一节 |
| 焦点环 | 实色 `--ring`，亮色 corgi-600、暗色 corgi-400；组件保留各自的环宽，不再把焦点环降到 50% 透明度 |

### 动效

源码在 `packages/tokens/src/motion.css`，主题 registry（`mogi-theme.json`）里也带着同一套值。风格是轻、软、末尾带一点回弹，不做大位移和长动画。

| token | 值 | 用在哪里 |
|---|---|---|
| `--duration-mogi-fast` | 120ms | 按下、悬停、颜色变化、所有关闭 |
| `--duration-mogi` | 200ms | 浮层打开、开关、勾选、侧边栏收起展开 |
| `--duration-mogi-slow` | 320ms | 抽屉滑入、空态图标弹出 |
| `ease-mogi` | `cubic-bezier(0.22, 1, 0.36, 1)` | 进入：快起慢停（弹出层、侧边栏、抽屉） |
| `ease-mogi-spring` | `cubic-bezier(0.34, 1.4, 0.64, 1)` | 进入：末尾轻轻回弹（开关、勾选、对话框、下拉菜单） |
| `ease-mogi-in` | `cubic-bezier(0.4, 0, 1, 1)` | 退出：干脆收走 |
| `animate-mogi-pop` | 320ms 从 60% 弹到原大小 | 空态图标 |

写法：`duration-(--duration-mogi) ease-mogi-spring`。时长是普通 CSS 变量，使用方在 `:root` 里改值就能整体调快调慢。
系统开启"减弱动态效果"（`prefers-reduced-motion: reduce`）时，所有动画和过渡压到 1ms，只保留加载转圈。

## 五、组件层约定（少量）

- 按钮：默认 `primary`（亮/暗均为 `corgi-600` + 白字，5.10:1），hover 为 primary 的 95% 透明度；`secondary` 用 sand-100 底 + sand-700 字。
- 滑块：已选区段 `bg-slider-range`、圆钮边框 `border-slider-range` 共用专用 token；亮色沿用 primary（`#a65a2a`），暗色用 corgi-400（`#dc9357`）。对 muted 轨道分别为 4.218:1、5.457:1，对 background 圆钮底色分别为 4.899:1、6.883:1，均达到 3:1；该 token 用于控件图形，不用于文字。
- Diff 删除行：使用 `bg-destructive/10 text-destructive`，背景按 10% destructive 与 card 合成。暗色 destructive 从 `#e0735a` 提亮为 `#e87960`，删除行对比度从 4.395:1 提升到 4.700:1；亮色保持 `#a8402c`，对比度 5.188:1。颜色统一来自主题 token，不在组件中硬编码。
- CodeBlock 行号：使用不带透明度的 `text-muted-foreground`，在默认 `bg-card` 上亮/暗主题均达到 4.5:1；不要给行号额外降低透明度。
- 标签 Badge：圆角 full，低饱和底色（corgi-100 / jasmine-100 / terracotta-100）+ 深字。
- 卡片：petal 底色 + border + shadow-sm，hover 升为 shadow-md。
- 空状态、加载态插画位可以放 mogi 的简笔形象（耳朵 + 茉莉花图标）。

## 六、对比度验证

- `text-link`：亮色 corgi-600，暗色 corgi-400；链接不要使用按钮底色 `text-primary`。
- 亮色成功文字用 jasmine-700；terracotta-700 仅作装饰，文字强调用 terracotta-800。
- `border` 保持装饰卡片边框，亮色仍为 `#e9dccb`；交互轮廓用 `border-strong`，输入控件用 `input`，两套主题均为 sand-500。输入控件不再用 input 的半透明色作为暗色填充，以免冲淡边界。
- 色板标签根据实际背景计算对比度：优先 sand-950，其次白色；两者都不足 4.5:1 时用黑色。terracotta-700 是需要黑色的例子，不能只按色阶编号判断。
- `pnpm contrast:check` 检查亮/暗语义文字、链接、成功和强调文字、按钮 hover、Diff 删除行合成背景、输入边框、焦点环、滑块已选区段对轨道、圆钮边框对背景/卡片/浮层、基础色板标签，并核对 registry 与 CSS 一致；采用未四舍五入的比值判定。
- PR 和 main push 运行 Contrast CI；发布 docs 前也必须通过检查。装饰边框不纳入 3:1 的交互阈值。
- 辅助文字值保持不变；不同承载背景的比值分别检查，不能把某个背景上的比值当作所有背景的结论。

## 七、下一步

1. 把以上写成 `packages/tokens/tokens.json`，用 Style Dictionary 生成 `globals.css` 和 Tailwind preset。
2. 在 shadcn 初始化后用这份 CSS 覆盖 `globals.css`，跑一遍 Button / Input / Card / Dialog 看效果，再微调。
3. 可选：做一个 mogi 图标（耳朵剪影 + 小花）作为库的 logo 和 favicon。

## 语义色分离（v1.7）

旧色板里 `primary`、`destructive`、`highlight` 都在 10°–23° 的橙红区间，亮色下主色与危险色只有 1.20:1，危险色与强调色 1.03:1；各类浅色底彼此 1.03–1.08:1，卡片与页面 1.02:1。看板上警告、主按钮和失败状态因此分不出主次。

| 变化 | 亮色 | 暗色 |
|---|---|---|
| `rose` 改为灰玫红，`destructive` 跟随 | `#a62b3c`（白字 6.9:1） | `#ee9a98`，深色字 |
| 新增 `destructive-soft`（暖藕粉，大面积不显艳） | `#f2e3e1` | `#3d2422` |
| 新增冷色 `dew` 与 `info` / `info-foreground` / `info-soft` | `#2a6176` / `#fffaf3` / `#dcebf0` | `#8cc6dc` / `#10242c` / `#1c3640` |
| `warning-soft`（honey-100） | `#fbefcb` | `#4a3b16` |
| `success-soft` 加深 | `#e3edc9` | `#38481f` |
| `background` 比卡片低一层 | `#f9f3ea` | `#1e130d` |

`contrast:check` 新增两类检查：`primary`、`destructive`、`warning`、`success`、`info` 两两之间要么色相差 ≥18°，要么明度比 ≥1.5:1；卡片与页面背景亮色 ≥1.05:1、暗色 ≥1.15:1。旧色板在第一项上失败。

配套组件：`StatusBanner`（一句话结论 + 下一步）、`LinkList`（同级入口）、`MetricCard` 的 `emphasis` / `density`、`Badge` 的 `danger` / `info`、`Alert` 的 `info` 与柔和底 `destructive`。示例：`?preview=emphasis`。

## 渐变背景与深色毛玻璃（可选）

新增独立 token，原有 background/card/popover 仍是实色，不自动改变所有使用方：

| Token | 亮色 | 深色 |
|---|---|---|
| ambient-start | #fdfaf5 | #211917 |
| ambient-middle | #faf1e7 | #30201c |
| ambient-end | #f3f2e9 | #202822 |
| glass-tint | rgb(255 253 249 / 0.8) | rgb(255 255 255 / 0.04) |
| glass-border | #e9dccb | rgb(255 255 255 / 0.14) |

AmbientBackground 用静态线性与径向渐变提供低对比度的空间层次。GlassSurface 在浅色保持实色；深色、支持 backdrop-filter 且 enabled 时使用半透明填充、40px 模糊及轻微内高光。不支持模糊、关闭玻璃或系统要求减少透明度时回退到 card 实色。主要面板和弹层可用玻璃，嵌套指标卡与代码面板在玻璃模式下透明，不叠加额外模糊；输入保持实色，避免多层透明叠加。

contrast:check 新增渐变端点、逐通道保守边界和玻璃 alpha 合成的正文检查，覆盖 foreground / muted-foreground / link / success / highlight / destructive / warning；这不是对任意图片背景的保证。新的表面仅应用在受控渐变上，勿直接放在任意高对比图片或视频上。首个预览位于 `?preview=motion-trio`，页头可分别切换渐变与深色毛玻璃。

WorkflowSteps 的运行状态文字使用 `accent-foreground`，覆盖默认 `card` 和选中／悬停 `accent` 底色；`scripts/check-contrast.mjs` 对这两种组合分别检查亮／暗主题 4.5:1。运行图标在独立的 `background` 圆形底色上保留 `link`，不修改主题 token。

Button 与 Badge 的实心 `destructive` 使用 `text-destructive-foreground`，暗色保持不透明底色；悬停使用 90% 底色。`contrast:check` 从组件变体读取实际文字、底色与透明度，检查亮暗主题在 background / card / popover 上的静止和悬停合成对比度（≥4.5:1）。


## 可选 paper 纸感主题

在 `<html data-palette="paper">` 上启用，仅作用于非 `.dark` 根元素。
通过 registry 先安装 `mogi-theme`，再安装 `mogi-theme-paper`；workspace 包直接设置属性。

奶油底 `#fff7e6`、纸卡 `#fffdf6`、墨色字 `#29251f`、黄色主操作 `#f8d956`、粉色便签 `#f5d5df`。
纸卡依靠墨色边线与硬阴影区分层级，默认和暗色的卡片亮度检查维持原门槛；paper 额外检查墨色边线对比度。
主题继承 main 当前危险、成功、警告、信息语义色；不从旧分支覆盖这些角色。
主按钮 hover/pressed 改变位移与阴影，focus-visible 始终使用独立 3px/4px-offset 轮廓。
`prefers-reduced-motion: reduce` 下按钮不位移；暗色自动回退基础 token，不保留纸感硬阴影。

`node scripts/check-contrast.mjs` 同时核对 paper 发布条目与 CSS 变量、正文、控件、状态、叠层与边线。
完整页面参考 [PR 工作台](pr-workspace.md)，预览 `?preview=pr-workspace&theme=paper`。

## Agent 品牌与局部 clean 表面

`--agent-foreground` 是品牌头像前景色（亮／暗均为 `#ffffff`），与以下实心背景配对；`@theme inline` 将它们映射为 `--color-agent-*`，可使用 `bg-agent-claude`、`text-agent-foreground` 等工具类。

| Token | 亮色 | 暗色 |
|---|---|---|
| `--agent-claude` | `#bc5332` | `#bc5332` |
| `--agent-openai` | `#098566` | `#098566` |
| `--agent-grok` | `#18181b` | `#27272a` |
| `--agent-gemini` | `#1d63ed` | `#1d63ed` |
| `--agent-deepseek` | `#3b5bdb` | `#3b5bdb` |
| `--agent-opencode` | `#334155` | `#334155` |
| `--agent-dsh` | `#0f766e` | `#0f766e` |
| `--agent-qwen` | `#6d28d9` | `#6d28d9` |
| `--agent-glm` | `#0369a1` | `#0369a1` |
| `--agent-kimi` | `#4338ca` | `#4338ca` |
| `--agent-minimax` | `#be123c` | `#be123c` |
| `--agent-hermes` | `#b45309` | `#b45309` |
| `--agent-generic` | `#475569` | `#475569` |

在面板上设置 `.mogi-surface-clean` 或 `data-surface="clean"` 启用局部语义变量覆盖，子元素通过继承使用；宿主其余区域继续使用原主题。仍需用 `bg-background text-foreground` 等工具类绘制表面。选择器为 `:where(.mogi-surface-clean, [data-surface="clean"])`；面板本身或祖先有 `.dark` 时使用暗色覆盖，同时设置对应的 `color-scheme`。

| 语义变量 | clean 亮色 | clean 暗色 |
|---|---|---|
| `background` / `foreground` | `#ffffff` / `#09090b` | `#09090b` / `#fafafa` |
| `card`、`popover` / 对应前景 | `#ffffff` / `#09090b` | `#111113` / `#fafafa` |
| `primary` / `primary-foreground` | `#18181b` / `#ffffff` | `#fafafa` / `#09090b` |
| `muted` / `muted-foreground` | `#f4f4f5` / `#52525b` | `#18181b` / `#a1a1aa` |
| `link` | `#1d4ed8` | `#60a5fa` |

clean 同时覆盖 secondary、accent、状态色及 soft 背景、highlight、border、input 与 ring；完整值以 `packages/tokens/src/theme.css` 为准。品牌 token 继续继承基础亮／暗主题。`scripts/check-contrast.mjs` 覆盖品牌头像前景／背景与 clean 表面的文字配对，正文目标为至少 4.5:1；任意自定义颜色组合仍需单独核验。
