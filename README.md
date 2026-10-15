# Mogi UI

一套基于 [shadcn/ui](https://ui.shadcn.com) 的个人组件库，风格取自角色 **mogi**（茉莉花 + 柯基）：
姜橘主色、奶油底色、摩卡文字、茉莉叶绿点缀，圆角偏大、阴影轻。
英文和数字用 JetBrains Mono，中文用江城圆体。

## 目录结构

```
packages/
  tokens/   设计 token：基础色板、语义变量（与 shadcn 同名）、字体
  ui/       组件源码（shadcn/ui + mogi 改动）
apps/
  docs/     组件预览站（Vite + React），同时托管 shadcn registry
docs/       设计文档：token 方案、路线图
registry.json  shadcn registry 定义
```

## 本地开发

```bash
pnpm install
pnpm dev          # 启动预览站
pnpm typecheck
pnpm build
pnpm registry:build   # 生成 apps/docs/public/r/*.json
```

## 在其他项目里使用

**方式一：只用主题。** 任何 shadcn 项目都可以直接套用 mogi 配色（预览站部署后）：

```bash
npx shadcn add https://<预览站地址>/r/mogi-theme.json
```

**方式二：作为 workspace 包。** 在 Tailwind v4 的 CSS 入口里引入：

```css
@import "@mogi-ui/ui/styles.css";
```

然后按需导入组件：

```tsx
import { Button } from "@mogi-ui/ui/components/button"
```

只需要配色和字体、不需要组件时，引入 `@mogi-ui/tokens` 即可（包含 `@theme` 映射，需在 `@import "tailwindcss"` 之后）。

## 字体

- **JetBrains Mono**：通过 `@fontsource-variable/jetbrains-mono` 引入，SIL OFL 1.1。
- **江城圆体** v3.4（刘鹏）：SIL OFL 1.1，见 `packages/tokens/fonts/OFL-jiangcheng.txt`。
  原始 ttf 每个字重约 14MB，这里用 `packages/tokens/scripts/split-cjk-font.py`
  按 unicode-range 切成 25 片 woff2（400 / 500 / 700 三个字重，共约 4.4MB），
  覆盖 GB2312 全部 6763 个汉字和中文标点，浏览器只下载页面实际用到的分片。
  范围外的生僻字会回退到 Noto Sans SC 或系统字体。

## 上游同步

组件来源和 mogi 改动记录在 [UPSTREAM.md](./UPSTREAM.md)。
