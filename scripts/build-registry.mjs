// 生成 shadcn registry：主题条目来自根目录 registry.json，组件条目扫描 packages/ui 自动生成。
// 组件源码里的 @mogi-ui/ui/* 导入会改写成 shadcn 约定的 @/components/ui/*、@/lib/utils、@/hooks/*，
// 安装时 shadcn CLI 再按使用方的 components.json 别名替换。
//
// 用法：pnpm registry:build（REGISTRY_URL 可覆盖发布地址，默认 GitHub Pages）

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const uiDir = path.join(root, "packages/ui/src/components/ui")
const hooksDir = path.join(root, "packages/ui/src/hooks")
const stageDir = path.join(root, ".registry")
const outDir = "apps/docs/public/r"
const baseUrl = (
  process.env.REGISTRY_URL ?? "https://mollymogi.github.io/mogi-ui/r"
).replace(/\/$/, "")

// 安装列表里显示的说明，没写的组件只显示名字
const descriptions = {
  "file-dropzone": "可键盘选择与拖放的受控文件入口，含大小/格式校验提示",
  "audio-preview": "有名称的原生音频试听，不自动播放；地址生命周期由使用方管理",
  "choice-cards": "可描述的单选卡片组，原生键盘和表单语义",
  "task-progress": "真实事件驱动的进度、成功、失败与取消反馈",
  "tool-page-layout": "公开工具页与说明页布局：导航、首屏、主区、辅助区、页脚",
  alert: "提示条，含 success / warning 变体",
  "alert-dialog": "需要用户确认的对话框，用于删除等不可撤销操作",
  avatar: "头像",
  badge: "标签，含 soft / success / warning / highlight 变体",
  button: "按钮",
  card: "卡片",
  checkbox: "复选框",
  "file-type-icon": "文件类型映射与语义色图标，支持目录、链接、二进制和覆盖",
  "code-highlighter": "语义 token 语法高亮与文件名语言识别",
  "code-block": "原始 JSON / 文本块，可遮罩、可带行号",
  "description-list": "详情页键值列表",
  "dashboard-layout": "工作台布局：导航、页头、主内容与可选辅助区",
  "diff": "统一 diff 视图，增删行与 hunk 语义着色",
  "detail-layout": "详情看板布局：摘要、指标、主区和辅助栏",
  dialog: "对话框",
  "dropdown-menu": "下拉菜单",
  "empty-state": "空态 / 失败 / 未接入，以及加载骨架",
  "flip-card": "点击翻转卡片：正反面内容、键盘与触屏支持、减弱动态效果",
  "metric-card": "指标卡：标签、等宽值、单位、提示与状态色",
  "status-badge": "封闭枚举映射到标签、图标与变体，含未知值兜底",
  "table-cell-truncate": "保留完整长值的截断单元格，含可选复制",
  "password-input": "口令输入与可访问的显隐切换",
  form: "基于 react-hook-form 的表单字段、校验提示",
  input: "输入框",
  label: "表单标签",
  "load-more": "列表底部的已载入条数和继续加载",
  pagination: "页码分页，中文文案",
  popover: "弹出层",
  "radio-group": "单选组",
  select: "选择器",
  separator: "分隔线",
  sheet: "从屏幕边缘滑出的抽屉面板",
  sidebar: "可折叠的应用侧边栏，移动端自动变成抽屉",
  skeleton: "骨架占位",
  sonner: "Toast 通知（不依赖 next-themes）",
  switch: "开关",
  table: "数据表格，含选中态和空表行",
  tabs: "标签页",
  textarea: "多行输入框",
  tooltip: "文字提示",
  "use-mobile": "判断是否为移动端宽度的 hook",
}

// 不需要写进 dependencies 的包（使用方 shadcn init 时已有）
const builtinPackages = new Set(["react", "react-dom"])

function rewrite(source) {
  return source
    .replaceAll("@mogi-ui/ui/lib/utils", "@/lib/utils")
    .replaceAll("@mogi-ui/ui/components/", "@/components/ui/")
    .replaceAll("@mogi-ui/ui/hooks/", "@/hooks/")
}

function packageName(spec) {
  const parts = spec.split("/")
  return spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
}

function analyze(source) {
  const dependencies = new Set()
  const registryDependencies = new Set()
  for (const [, spec] of source.matchAll(/from\s+"([^"]+)"/g)) {
    if (spec === "@mogi-ui/ui/lib/utils") continue
    const local = spec.match(/^@mogi-ui\/ui\/(?:components|hooks)\/(.+)$/)
    if (local) {
      registryDependencies.add(`${baseUrl}/${local[1]}.json`)
    } else if (!spec.startsWith(".") && !spec.startsWith("@/")) {
      const name = packageName(spec)
      if (!builtinPackages.has(name)) dependencies.add(name)
    }
  }
  return {
    dependencies: [...dependencies].sort(),
    registryDependencies: [...registryDependencies].sort(),
  }
}

function collect(dir, ext, type, stageSub) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .sort()
    .map((file) => {
      const name = path.basename(file, ext)
      const source = fs.readFileSync(path.join(dir, file), "utf8")
      const stagePath = path.join(stageDir, stageSub, file)
      fs.mkdirSync(path.dirname(stagePath), { recursive: true })
      fs.writeFileSync(stagePath, rewrite(source))
      const { dependencies, registryDependencies } = analyze(source)
      return {
        name,
        type,
        title: name,
        ...(descriptions[name] && { description: descriptions[name] }),
        ...(dependencies.length && { dependencies }),
        ...(registryDependencies.length && { registryDependencies }),
        files: [{ path: path.relative(root, stagePath), type }],
      }
    })
}

fs.rmSync(stageDir, { recursive: true, force: true })

const base = JSON.parse(fs.readFileSync(path.join(root, "registry.json"), "utf8"))
const components = collect(uiDir, ".tsx", "registry:ui", "ui")
const hooks = collect(hooksDir, ".ts", "registry:hook", "hooks")

const all = {
  name: "all",
  type: "registry:item",
  title: "全部组件",
  description: "一次装上 mogi-ui 的全部组件",
  registryDependencies: components.map((c) => `${baseUrl}/${c.name}.json`),
}

const registry = { ...base, items: [...base.items, ...components, ...hooks, all] }
const registryPath = path.join(stageDir, "registry.json")
fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n")

// 清掉旧产物，避免删掉的组件还留在发布目录里
fs.rmSync(path.join(root, outDir), { recursive: true, force: true })
execFileSync(
  "pnpm",
  ["exec", "shadcn", "build", path.relative(root, registryPath), "--output", outDir],
  { cwd: root, stdio: "inherit" }
)
