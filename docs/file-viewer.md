# 文件类型图标与源码高亮

对应使用方需求 #30、#31。组件只接受名称/内容，不读取文件，不跟随符号链接，也不访问使用方服务。

## 文件类型

```tsx
import { FileTypeIcon, fileTypeOf, fileToneClass } from "@mogi-ui/ui/components/file-type-icon"

<FileTypeIcon name="Dispatcher.cpp" />
<FileTypeIcon name="src" kind="directory" />
<FileTypeIcon name="current" kind="symlink" />
const type = fileTypeOf("config.custom", {
  overrides: { custom: { label: "工程配置", tone: "highlight" } },
})
```

返回 `{ icon, tone, label, kind }`。kind 为 file/directory/symlink/binary，显式 kind 优先；文件名未知时显示普通文件。内置源码、头文件、脚本、JSON/YAML 等配置、Markdown/文本、图片、归档、二进制映射，包含复合扩展名 tar.gz、路径分隔符与大小写无关匹配。overrides 的键为小写扩展名（无前导点）或完整小写文件名；完整文件名优先，扩展名取最长匹配。

图标默认 16px，带可访问的中文类型名。若相邻文本已标注类型，可传 `aria-hidden` 避免重复朗读。tone 使用 primary/success/warning/highlight/muted，`fileToneClass` 给出符合主题的可读文本类；不要把按钮的 primary/warning 填充色直接用作暗/亮主题的小字。覆盖 label/icon/tone 不负责文件系统真实性，调用方根据真实元数据传入 kind，并自行禁用符号链接等不可预览项目的点击。

## 语法高亮

```tsx
<CodeBlock fileName="Dispatcher.cpp" numbered startLine={10}>
  {source}
</CodeBlock>
<CodeBlock language="python" numbered>{source}</CodeBlock>
// 可选：独立使用，父级提供 pre 与滚动容器
<pre><CodeHighlighter content={source} language="json" /></pre>
```

支持 C、C++、CMake、Shell/Bash、Python、JSON、Markdown、YAML、JavaScript、TypeScript；未提供 language 时可通过 fileName（含 CMakeLists.txt）识别。显式 language 优先，包括显式未知语言：未知值回退纯文本，不猜测语言。

采用 lowlight/highlight.js 的完整语法树后拆成逐行片段，保留多行注释、字符串、缩进、空行及行终止符。React 输出转义后的文本节点，不注入源码 HTML。行号不能选中；复制事件移除行号节点，保留选择范围内的原文，支持整块和部分行复制。CodeBlock 的非字符串 children 保持原来的渲染行为。

注释使用 muted-foreground，字符串使用 success，关键字/JSON key 使用 link，类型/预处理使用 highlight，数字使用 warning-foreground（亮）或 warning（暗）。基于已有语义 token，未改颜色值。对 code/card 及页面底色的两主题配对有对比度断言。

registry 的 code-block 条目依赖 code-highlighter；后者声明 lowlight/highlight.js 运行依赖，会随 registry 安装，不需要额外主题 CSS。CodeBlock 是客户端组件，新增复制处理与记忆化解析；语法解析同步执行，特别大的文件建议由调用方分页或截取并明确标注范围。

语法库参考：[lowlight 官方文档](https://github.com/wooorm/lowlight)、[highlight.js API](https://highlightjs.readthedocs.io/en/latest/api.html)。没有复制来源项目的临时 tokenizer。
