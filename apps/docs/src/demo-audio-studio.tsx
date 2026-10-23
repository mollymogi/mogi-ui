import { useEffect, useState } from "react"
import { AudioLines, ArrowUpRight, LockKeyhole, Moon, Sun } from "lucide-react"
import { AudioPreview } from "@mogi-ui/ui/components/audio-preview"
import { ChoiceCards } from "@mogi-ui/ui/components/choice-cards"
import { FileDropzone } from "@mogi-ui/ui/components/file-dropzone"
import { TaskProgress } from "@mogi-ui/ui/components/task-progress"
import { ToolPageLayout, ContentPageLayout } from "@mogi-ui/ui/components/tool-page-layout"
import { Button } from "@mogi-ui/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@mogi-ui/ui/components/card"
import { Badge } from "@mogi-ui/ui/components/badge"

export function AudioStudioDemo({dark, onThemeChange}: {dark:boolean; onThemeChange:()=>void}) {
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState("")
  const [choice, setChoice] = useState("original")
  const [stage, setStage] = useState<"running"|"success"|"error"|"cancelled">("running")
  const [guide, setGuide] = useState(false)
  const [audioError, setAudioError] = useState(false)
  useEffect(() => {
    setAudioError(false)
    if (!file) {setUrl(""); return}
    const src = URL.createObjectURL(file)
    setUrl(src)
    return () => URL.revokeObjectURL(src)
  }, [file])
  const navigation = <div className="flex min-w-0 flex-wrap items-center gap-4">
    <span className="mr-auto flex items-center gap-2 font-bold"><AudioLines className="size-5 text-link" />Mogi Audio</span>
    <Button variant={guide ? "ghost" : "secondary"} size="sm" onClick={() => setGuide(false)}>创作工具</Button>
    <Button variant={guide ? "secondary" : "ghost"} size="sm" onClick={() => setGuide(true)}>使用指南</Button>
    <Button variant="outline" size="icon" onClick={onThemeChange} aria-label={dark ? "切换亮色" : "切换暗色"}>{dark ? <Sun /> : <Moon />}</Button>
  </div>
  const footer = <div className="flex flex-wrap gap-4 text-sm text-muted-foreground"><span>源自 Mogi Suno 的 UI 模式 · 独立组件示例</span><a className="text-link underline" href="?preview=components">返回组件展览</a></div>
  if (guide) return <ContentPageLayout navigation={navigation} eyebrow="FIELD NOTES / 使用指南" title="从一段声音开始。" description="这是说明页模板示例。内容由使用方提供，不包含平台条款或广告脚本。" footer={footer}>
    <section className="grid gap-3"><h2 className="text-xl font-semibold">01 · 选择你自己的音频</h2><p>支持拖放与键盘选择，文件名会完整换行。客户端大小和类型检查仅用于交互提示，服务端仍须独立验证。</p></section>
    <section className="grid gap-3"><h2 className="text-xl font-semibold">02 · 先试听，再决定</h2><p>示例会为本机文件创建临时试听地址，更换文件或离开页面后释放。试听并不等于已经处理或上传。</p></section>
    <section className="grid gap-3"><h2 className="text-xl font-semibold">03 · 用真实事件更新状态</h2><p>TaskProgress 只展示调用方传入的状态，不会自行计时或虚构完成。没有已知百分比时使用不定进度。</p></section>
    <Button variant="outline" className="justify-self-start" onClick={() => setGuide(false)}>返回工具示例</Button>
  </ContentPageLayout>
  return <ToolPageLayout navigation={navigation} footer={footer}
    hero={<div className="grid gap-4"><Badge variant="soft" className="justify-self-start"><LockKeyhole />仅在本机试听的 UI 示例</Badge><h1 className="text-3xl font-bold text-balance sm:text-4xl">每一段音乐，都有下一种可能。</h1><p className="max-w-2xl text-muted-foreground">从 Mogi Suno 提取的组件与页面模板。选择文件可以真实试听；方式选择和进度切换仅展示 UI，不处理、不上传音频。</p></div>}
    aside={<><Card><CardHeader><CardTitle>你的音乐，留在你手里。</CardTitle></CardHeader><CardContent className="grid gap-3 text-sm text-muted-foreground"><p>这个演示不连接任何账号或上传服务，不含 Suno 凭据、接口和广告代码。</p><Button variant="link" className="justify-self-start px-0" onClick={() => setGuide(true)}>查看说明页模板 <ArrowUpRight /></Button></CardContent></Card><Card><CardHeader><CardTitle>按真实事件组合</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">接入方提供处理器、状态与回调。组件不会将等待计时视为成功。</CardContent></Card></>}
    after={<section className="grid gap-4 border-t pt-8"><h2 className="text-xl font-semibold">开始之前，你可能想知道。</h2>{[["哪些代码来自组件库？","文件选择、音频播放器、单选卡片、进度反馈及两种页面布局。"],["可以直接连接 Suno 吗？","不可以。这里是 UI 模板，账号连接、上传协议与权限检查属于业务项目。"],["支持暗色与手机吗？","所有配色沿用 Mogi 语义 token，窄屏按阅读顺序排列。"]].map(([q,a])=><details key={q} className="rounded-lg border bg-card p-4"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-3 text-sm text-muted-foreground">{a}</p></details>)}</section>}>
    <Card><CardHeader><CardTitle>创作工作台</CardTitle></CardHeader><CardContent className="grid gap-6">
      <FileDropzone value={file} onFileChange={setFile} accept="audio/*,.wav,.mp3,.flac,.m4a,.ogg" maxSize={50*1024*1024} label="把你的音乐放到这里" description="WAV、MP3、FLAC 等 · 最大 50 MB · 此示例只在本机试听" />
      {url && <AudioPreview key={url} src={url} label="原始音频" onError={() => setAudioError(true)} />}
      {audioError && <p role="alert" className="text-sm text-destructive">浏览器无法试听此文件，请换用标准 WAV 或 MP3。</p>}
      <ChoiceCards legend="准备方式（仅展示选择）" value={choice} onValueChange={setChoice} options={[{value:"original",label:"原速",description:"保持速度与音高"},{value:"quality",label:"音质优先",description:"使用方接入对应处理器"},{value:"speed",label:"速度优先",description:"使用方接入对应处理器"}]} />
      <div className="grid gap-3 border-t pt-5"><p className="text-sm text-muted-foreground">进度状态展览：点击切换示例状态，不代表真实处理。</p><div className="flex flex-wrap gap-2">{([{value:"running",label:"进行中"},{value:"success",label:"成功"},{value:"error",label:"失败"},{value:"cancelled",label:"已取消"}] as const).map(item=><Button key={item.value} size="sm" variant={stage===item.value?"secondary":"outline"} onClick={()=>setStage(item.value)}>{item.label}</Button>)}</div><TaskProgress state={stage} label={{running:"示例：等待处理事件",success:"示例：准备完成",error:"示例：处理失败",cancelled:"示例：已取消"}[stage]} detail="这是组件状态展览；百分比未知时不传 value。" onCancel={()=>setStage("cancelled")} /></div>
    </CardContent></Card>
  </ToolPageLayout>
}
