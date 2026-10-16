# Mogi 风格 Design Token 方案（v1.2，2026-10-16：侧边栏当前项改为暖白底）

来源：角色形象 mogi（茉莉花 + 柯基）。配色直接从原图取样：头发 `#be7d53`、耳朵 `#f3c59f`、毛衣 `#f9e9d9`、肩部 `#ebc0a7`、裙子 `#a57e69`、眼睛 `#9c755e`、叶子 `#a78b57`、花瓣近白 `#f7dfc7`。

## 一、风格关键词

- **暖、软、圆**：柯基的毛色 + 针织毛衣。整体是暖色调中性色，没有纯黑纯白纯灰。
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

亮色（文字类配对全部达到 WCAG AA 4.5:1：主按钮 4.9、链接 4.9、success 标签 4.8、highlight 标签 4.9、muted 区域文字 5.5、删除按钮 5.9）：
```css
:root {
  --background: #fdfaf5;
  --foreground: #3a2820;
  --card: #fffdf9;            --card-foreground: #3a2820;
  --popover: #fffdf9;         --popover-foreground: #3a2820;
  --primary: #a65a2a;         --primary-foreground: #fffaf3;
  --secondary: #f9efe3;       --secondary-foreground: #6a4c3c;
  --muted: #f3e8da;           --muted-foreground: #765645;
  --accent: #fae8d3;          --accent-foreground: #8c4f2a;
  --destructive: #a8402c;     --destructive-foreground: #fffaf3;
  --success: #55702a;         --success-foreground: #fffaf3;
  --highlight: #984a28;
  --warning: #d9a63a;         --warning-foreground: #3a2820;
  --border: #e9dccb;
  --input: #e3d4c1;
  --ring: #dc9357;
  --radius: 0.75rem;
  --sidebar: #f9efe3;         --sidebar-foreground: #3a2820;
  --sidebar-accent: #fffdf9;  --sidebar-accent-foreground: #3a2820; /* 当前项暖白底 + 深色字 */
  --shadow-sm: 0 1px 2px rgb(58 40 32 / .06);
  --shadow-md: 0 4px 14px rgb(58 40 32 / .10);
}
```

暗色（摩卡底，主色提亮一档）：
```css
.dark {
  --background: #241811;
  --foreground: #f6ebdd;
  --card: #2e2017;            --card-foreground: #f6ebdd;
  --popover: #2e2017;         --popover-foreground: #f6ebdd;
  --primary: #e0a06c;         --primary-foreground: #2a1a10;
  --secondary: #3a2a1f;       --secondary-foreground: #e6d3bf;
  --muted: #3a2a1f;           --muted-foreground: #c4a88f;
  --accent: #4a3425;          --accent-foreground: #f3cfa6;
  --destructive: #e0735a;     --destructive-foreground: #2a1a10;
  --success: #a3bd6c;         --success-foreground: #1d2410;
  --warning: #e6b94f;         --warning-foreground: #2a1a10;
  --border: #44332a;
  --input: #4e3b30;
  --ring: #e0a06c;
  --sidebar: #2e2017;         --sidebar-foreground: #f6ebdd;
  --sidebar-accent: #3d2b20;  --sidebar-accent-foreground: #f6ebdd;
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
| 动效 | 150ms 快速反馈、250ms 展开/收起，缓动 `cubic-bezier(.2,.8,.2,1)` |
| 焦点环 | 2px `--ring`，offset 2px |

## 五、组件层约定（少量）

- 按钮：默认 `primary`（亮色为 `corgi-600`），hover 为 primary 的 90% 透明度；`secondary` 用 sand-100 底 + sand-700 字。
- 标签 Badge：圆角 full，低饱和底色（corgi-100 / jasmine-100 / terracotta-100）+ 深字。
- 卡片：petal 底色 + border + shadow-sm，hover 升为 shadow-md。
- 空状态、加载态插画位可以放 mogi 的简笔形象（耳朵 + 茉莉花图标）。

## 六、下一步

1. 把以上写成 `packages/tokens/tokens.json`，用 Style Dictionary 生成 `globals.css` 和 Tailwind preset。
2. 在 shadcn 初始化后用这份 CSS 覆盖 `globals.css`，跑一遍 Button / Input / Card / Dialog 看效果，再微调。
3. 可选：做一个 mogi 图标（耳朵剪影 + 小花）作为库的 logo 和 favicon。
