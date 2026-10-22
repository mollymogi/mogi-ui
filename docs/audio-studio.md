# 音频工具与说明页模板

来源：Mogi Suno 网页。把一次业务页面回流成可组合 UI，保持 mogi 语义 token、亮/暗主题与手机阅读顺序。没有新增颜色或全局字体覆盖。

预览：`?preview=audio-studio`。完整页面源码在 `apps/docs/src/demo-audio-studio.tsx`，可在工具页与说明页之间切换。本地试听是真实的；方式和进度为明确标注的 UI 展览，不执行处理或上传。

## 安装

```sh
R=https://mollymogi.github.io/mogi-ui/r
npx shadcn add $R/mogi-theme.json
npx shadcn add $R/file-dropzone.json $R/audio-preview.json $R/choice-cards.json $R/task-progress.json $R/tool-page-layout.json
```

这些地址在合并并发布 GitHub Pages 后可用；PR 分支的组件可直接从源码使用。

## 组件契约

| 组件 | 输入与边界 |
|---|---|
| FileDropzone | `value: File|null`，`onFileChange(file)`；可选 `accept/maxSize/validateFile/onError/disabled`。只选择一个文件，按浏览器顺序取拖入的第一个文件。隐藏 input 每次清空，支持再次选择同一个文件。没有文件读取、上传、网络请求；校验只改善交互，不是安全边界。 |
| AudioPreview | `label/src` 与原生 audio 属性；`containerClassName` 控制外层。固定 controls，禁用自动播放。不创建或释放 URL，不承诺浏览器支持所有编码。 |
| ChoiceCards | `legend/value/options/onValueChange`。option 包含 value、label、description、disabled。可传 `name` 参与表单，自动 name 在每个实例独立。原生箭头键导航；fieldset.disabled 禁用整组。value 必须由调用方提供。 |
| TaskProgress | `label/state/detail`，state 为 running/success/error/cancelled；value 使用 0–100，超界夹紧，缺失或非有限数值显示不定进度。仅 running 显示取消和进度；成功不会由百分比自动推断。错误为 alert，状态有可见文字与图标。 |
| ToolPageLayout | navigation、hero、aside、after、footer 插槽，children 为工作台。大屏主区与辅助栏 2:1，手机辅助栏排在后面。 |
| ContentPageLayout | navigation、eyebrow、title、description、footer；children 为长文内容。内置页面 h1。两种布局用于完整页面，不要在已有 main 内嵌套。 |

## 使用与资源回收

```tsx
const [file, setFile] = useState<File | null>(null)
const [src, setSrc] = useState("")
useEffect(() => {
  if (!file) { setSrc(""); return }
  const url = URL.createObjectURL(file)
  setSrc(url)
  return () => URL.revokeObjectURL(url)
}, [file])
return <>
  <FileDropzone value={file} onFileChange={setFile} accept="audio/*,.wav,.flac" />
  {src && <AudioPreview src={src} label="原始音频" />}
</>
```

业务方仍需实现：解码、变速、上传、账号连接、权限确认、服务端输入校验、真实进度及取消语义。不要把组件切换或本地试听当作云端完成。

说明页模板只提供排版。隐私政策、条款、联系渠道及广告披露应反映业务自己的实际行为，不能直接复制演示作为合规承诺。
