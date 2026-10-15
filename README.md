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

## 预览站

线上地址：https://mollymogi.github.io/mogi-ui/

每次推送到 `main` 都会通过 GitHub Actions（`.github/workflows/deploy-docs.yml`）自动构建并发布到 GitHub Pages。

## 在其他项目里使用

**方式一：只用主题。** 任何 shadcn 项目都可以直接套用 mogi 配色：

```bash
npx shadcn add https://mollymogi.github.io/mogi-ui/r/mogi-theme.json
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

## 上游同步

组件来源和 mogi 改动记录在 [UPSTREAM.md](./UPSTREAM.md)。

## 抽屉 Sheet

设置、详情与测试记录侧栏可使用 `Sheet`：

```tsx
import { Button } from "@mogi-ui/ui/components/button"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter, SheetClose } from "@mogi-ui/ui/components/sheet"

<Sheet>
  <SheetTrigger asChild><Button variant="outline">设置</Button></SheetTrigger>
  <SheetContent side="right" closeLabel="关闭">
    <SheetHeader><SheetTitle>设置</SheetTitle><SheetDescription>修改本次测试参数。</SheetDescription></SheetHeader>
    <SheetBody>{/* 长表单或 Table，正文独立滚动 */}</SheetBody>
    <SheetFooter><SheetClose asChild><Button>完成</Button></SheetClose></SheetFooter>
  </SheetContent>
</Sheet>
```

支持 `right`（默认）、`left`、`top`、`bottom`。头尾固定，正文滚动；继承 Radix Dialog 的焦点圈定、Escape 关闭、滚动锁定与关闭后焦点返回。主题在局部容器中时，可用 `SheetContent container={element}` 指定 portal 容器，或在内容节点上传入相同主题 class。

通过 registry 安装：`npx shadcn add https://mollymogi.github.io/mogi-ui/r/sheet.json`。`registry:build` 会将 workspace 别名转换为消费方可解析的 shadcn 别名。
