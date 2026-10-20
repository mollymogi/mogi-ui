# #30 / #31 文件类型与语法高亮验证

范围：FileTypeIcon/fileTypeOf、CodeHighlighter、CodeBlock 的 language/fileName、行号与复制兼容，registry、组件展览、文档及组件 CI。

## 本地验证

- `node --test scripts/code-block-diff.test.mjs scripts/check-contrast.test.mjs`：23 项通过。
- UI/docs TypeScript 检查通过。
- registry 构建成功；code-block 依赖 code-highlighter，后者声明 lowlight/highlight.js。
- `node scripts/check-contrast.mjs`：131 项、0 失败；另有语法/文件图标所有语义前景与 card/background 两主题组合的 4.5:1 断言。没有改动主题 token。
- Vite 生产构建通过，完整组件展览仍有 >500KB 提醒。
- Chrome 浏览器 9 项检查通过，原始记录 file-viewer-browser.json：11 类文件示例、原生剪贴板整块/部分行复制、单行视觉高度、390/1440px 亮暗布局、无 pageerror。
- 手工查看桌面暗色源码、JSON、未知语言和文件类型截图。

## 重点边界

- 两种显式文件 kind 优先、扩展名/完整文件名覆盖、大小写与复合后缀、路径分隔符、未知类型。
- C/C++、CMake、Bash、Python、JSON、Markdown、YAML、JS、TS 都校验重建原文；包括多行字符串/注释、CRLF、空行和末尾换行。
- JSON key、数字、预处理和多行注释确有语义 token。
- HTML 字符转义，不注入 HTML，未知语言回退，非字符串 children 保持渲染。
- 原生浏览器复制验证整块源码精确相等且没有行号；部分行复制保留缩进。
- 每一行包含末尾空行都有一行高度，窄屏只滚动表格/代码内容。组件展览根网格、Section 和原 TableDemo 补 min-width/grid 单列约束，避免内在宽度撑开整页。

组件 CI 新增依赖安装、类型检查、code-block-diff 测试和 registry 漂移校验；远端结果以 PR 实际检查为准。

限制：纯文件名分类不能判定实际文件是否可读，符号链接必须由调用方传 kind 并控制点击；高亮是同步完整语法解析，大文件应由调用方按需限制内容。没有访问或修改来源项目服务。
