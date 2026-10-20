# Mogi 风格 Design Token 方案（v1.6，2026-10-19：Diff 删除行对比度）

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
