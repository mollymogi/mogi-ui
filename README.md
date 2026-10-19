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
skills/     给 AI agent 的使用规范（SKILL.md）
registry.json  shadcn registry 定义（只放主题，组件条目由脚本生成）
scripts/       build-registry.mjs：扫描 ui 包生成每个组件的 registry 条目
```

## 本地开发

```bash
pnpm install
pnpm dev          # 启动预览站
pnpm contrast:check # 检查亮/暗文字、交互边框、焦点环及色板标签
pnpm typecheck
pnpm build
pnpm registry:build   # 生成 apps/docs/public/r/*.json（主题 + 每个组件一份）
```

## 预览站

线上地址：https://mollymogi.github.io/mogi-ui/

每次推送到 `main` 都会通过 GitHub Actions（`.github/workflows/deploy-docs.yml`）自动构建并发布到 GitHub Pages。

## 布局模式

- [详情看板 DetailLayout](docs/detail-layout.md)：一句话结论、关键指标、主内容与辅助栏；技术细节用 Sheet 按需查看。预览站包含亮/暗主题示例。

## 在其他项目里使用

**方式一：通过 registry 安装（推荐）。** 任何 React 19 + Tailwind v4 的 shadcn 项目，先套主题，再按需装组件：

```bash
R=https://mollymogi.github.io/mogi-ui/r
npx shadcn add $R/mogi-theme.json      # 主题，先装
npx shadcn add $R/button.json $R/table.json   # 按需装组件，依赖的 mogi 组件会一起装上
npx shadcn add $R/all.json             # 或者一次装全部组件
```

组件会复制到使用方 `components.json` 配置的目录里，导入路径按使用方的别名改写。
组件之间的依赖都指向 mogi-ui 自己的 registry，不会混进 shadcn 官方的同名组件。
可安装的条目见 `https://mollymogi.github.io/mogi-ui/r/registry.json`。

新增或修改组件后跑 `pnpm registry:build` 即可，不需要手动改 `registry.json`；
只有组件说明需要在 `scripts/build-registry.mjs` 的 `descriptions` 里补一行。

**方式二：作为 workspace 包。** 在 Tailwind v4 的 CSS 入口里引入：

```css
@import "@mogi-ui/ui/styles.css";
```

然后按需导入组件：

```tsx
import { Button } from "@mogi-ui/ui/components/button"
```

只需要配色和字体、不需要组件时，引入 `@mogi-ui/tokens` 即可（包含 `@theme` 映射，需在 `@import "tailwindcss"` 之后）。

## 给 AI agent 用

使用规范写在 [`skills/mogi-ui/SKILL.md`](./skills/mogi-ui/SKILL.md)，这是唯一来源，Claude Code、Codex 等 agent 共用同一份。规则改了只改这个文件，各项目重新下载一次即可更新。

**支持 SKILL.md 的 agent**（Claude Code、Codex 等）：把文件放进它的 skills 目录，全局装一次所有项目都能用。

```bash
URL=https://raw.githubusercontent.com/mollymogi/mogi-ui/main/skills/mogi-ui/SKILL.md
# Claude Code
mkdir -p ~/.claude/skills/mogi-ui && curl -fsSL $URL -o ~/.claude/skills/mogi-ui/SKILL.md
# Codex
mkdir -p ~/.codex/skills/mogi-ui && curl -fsSL $URL -o ~/.codex/skills/mogi-ui/SKILL.md
```

只想对单个项目生效时，放到该项目的 `.claude/skills/mogi-ui/` 或 `.agents/skills/mogi-ui/` 下。

**只读 AGENTS.md 的 agent**：把规范正文追加到项目根目录的 `AGENTS.md`：

```bash
curl -fsSL https://raw.githubusercontent.com/mollymogi/mogi-ui/main/skills/mogi-ui/SKILL.md \
  | awk 'f>=2; /^---$/{f++}' >> AGENTS.md
```

## 字体

- **JetBrains Mono**：通过 `@fontsource-variable/jetbrains-mono` 引入，SIL OFL 1.1。
- **江城圆体** v3.4（刘鹏）：SIL OFL 1.1，见 `packages/tokens/fonts/OFL-jiangcheng.txt`。
  原始 ttf 每个字重约 14MB，这里用 `packages/tokens/scripts/split-cjk-font.py`
  按 unicode-range 切成 25 片 woff2（400 / 500 / 700 三个字重，共约 4.4MB），
  覆盖 GB2312 全部 6763 个汉字和中文标点，浏览器只下载页面实际用到的分片。
  范围外的生僻字会回退到 Noto Sans SC 或系统字体。

**方式一（只套主题）的项目怎么拿字体：** 主题 JSON 只写字体名，不带文件。
- JetBrains Mono：`npm i @fontsource-variable/jetbrains-mono`，在入口 `import "@fontsource-variable/jetbrains-mono"`。
- 江城圆体：预览站把整套文件原样发布在 `https://mollymogi.github.io/mogi-ui/fonts/`，
  包括 `jiangcheng.css`、`jiangcheng/` 下的分片和许可证 `OFL-jiangcheng.txt`。
  建议把这三样下载到自己项目里自托管（保持 `jiangcheng.css` 与 `jiangcheng/` 的相对路径），再在入口引入 `jiangcheng.css`。
  workspace 项目直接 `@import "@mogi-ui/tokens/fonts.css"` 即可。

预览站构建关闭了 Vite 的资源内联（`assetsInlineLimit: 0`），所有字体都是独立文件，不会出现 `data:` 字体，开了 CSP 的项目可以直接参照。

## 兼容性

组件按 React 19 写法实现（`ref` 作为普通 prop 传递，没有 `forwardRef`），只支持 React 19。
在 React 18 里 `ref` 会被丢掉，`asChild` 组合（如 `<TooltipTrigger asChild><Button /></TooltipTrigger>`）的定位和焦点管理会失效。

## 上游同步

组件来源和 mogi 改动记录在 [UPSTREAM.md](./UPSTREAM.md)。
