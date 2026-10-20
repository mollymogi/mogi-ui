import { useState } from "react"
import { Inbox, Play, RotateCcw } from "lucide-react"
import { FlipCard } from "@mogi-ui/ui/components/flip-card"
import { Button } from "@mogi-ui/ui/components/button"
import { Checkbox } from "@mogi-ui/ui/components/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mogi-ui/ui/components/dialog"
import { EmptyState } from "@mogi-ui/ui/components/empty-state"
import { Label } from "@mogi-ui/ui/components/label"
import { Popover, PopoverContent, PopoverTrigger } from "@mogi-ui/ui/components/popover"
import { RadioGroup, RadioGroupItem } from "@mogi-ui/ui/components/radio-group"
import { Switch } from "@mogi-ui/ui/components/switch"

// 动效 token 演示：每条轨道上的小圆点用对应的缓动和时长滑过去，点“播放”来回切换
const tracks = [
  { ease: "ease-mogi", duration: "--duration-mogi", note: "进入：快起慢停，用于弹层、侧边栏、抽屉" },
  { ease: "ease-mogi-spring", duration: "--duration-mogi", note: "进入：末尾轻轻回弹，用于开关、勾选、对话框" },
  { ease: "ease-mogi-in", duration: "--duration-mogi-fast", note: "退出：干脆收走，用于所有关闭" },
] as const

const durations = [
  { name: "--duration-mogi-fast", value: "120ms", note: "按下、悬停、颜色变化、关闭" },
  { name: "--duration-mogi", value: "200ms", note: "浮层、开关、侧边栏" },
  { name: "--duration-mogi-slow", value: "320ms", note: "抽屉滑入、空态图标" },
]

export function MotionDemo() {
  const [moved, setMoved] = useState(false)
  const [popKey, setPopKey] = useState(0)

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 rounded-lg border bg-card p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">缓动</span>
          <Button size="sm" variant="outline" onClick={() => setMoved((m) => !m)}>
            <Play /> 播放
          </Button>
        </div>
        {tracks.map((t) => (
          <div key={t.ease} className="grid gap-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs">
              <code className="font-medium text-foreground">{t.ease}</code>
              <span className="text-muted-foreground">{t.note}</span>
            </div>
            <div className="relative h-6 rounded-full bg-muted">
              <span
                className={`absolute top-1 size-4 rounded-full bg-primary transition-[left] ${t.ease}`}
                style={{
                  left: moved ? "calc(100% - 1.25rem)" : "0.25rem",
                  transitionDuration: `calc(var(${t.duration}) * 3)`,
                }}
              />
            </div>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">演示放慢了 3 倍，方便看清曲线。</p>
        <div className="grid gap-1 border-t pt-3 text-xs">
          {durations.map((d) => (
            <div key={d.name} className="flex flex-wrap gap-x-3">
              <code className="w-44 font-medium text-foreground">{d.name}</code>
              <span className="w-12">{d.value}</span>
              <span className="text-muted-foreground">{d.note}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FlipCard
          front={<div className="grid h-full min-h-48 content-center gap-3 rounded-xl border bg-accent p-6 text-accent-foreground"><strong className="text-xl">一个想法，两面展开。</strong><p>点击下方按钮，翻看行动清单。</p></div>}
          back={<div className="grid h-full min-h-48 content-center gap-3 rounded-xl border bg-card p-6"><strong className="text-xl">从一小步开始</strong><p>整理想法 → 选定重点 → 开始行动</p><a href="?preview=dashboard" className="text-link underline underline-offset-4">到工作台体验动态卡片</a></div>}
        />
        <p className="self-center text-sm text-muted-foreground">翻面按钮支持鼠标、触屏和键盘。隐藏面不可聚焦或点击；开启“减弱动态效果”时直接切换内容。必要操作始终保留在正面。</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid content-start gap-4 rounded-lg border bg-card p-5">
          <span className="text-sm font-medium">试试看</span>
          <div className="flex flex-wrap items-center gap-3">
            <Button>按住我</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">打开对话框</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>轻轻弹出来</DialogTitle>
                  <DialogDescription>
                    对话框从下方一点点升起并放大，末尾带一点回弹；关闭时更快地收走。
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost">弹出层</Button>
              </PopoverTrigger>
              <PopoverContent className="text-sm">从触发按钮的方向长出来。</PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch id="motion-switch" />
              <Label htmlFor="motion-switch">开关</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="motion-check" />
              <Label htmlFor="motion-check">勾选</Label>
            </div>
            <RadioGroup defaultValue="a" className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="a" id="motion-a" />
                <Label htmlFor="motion-a">柯基</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="b" id="motion-b" />
                <Label htmlFor="motion-b">茉莉</Label>
              </div>
            </RadioGroup>
          </div>
          <p className="text-xs text-muted-foreground">
            系统开启“减弱动态效果”后，这些动画都会几乎瞬间完成。
          </p>
        </div>
        <div className="grid gap-2">
          <EmptyState
            key={popKey}
            icon={<Inbox />}
            title="图标弹出来"
            description="空态图标出现时会轻轻弹一下。"
            action={
              <Button size="sm" variant="outline" onClick={() => setPopKey((k) => k + 1)}>
                <RotateCcw /> 再来一次
              </Button>
            }
          />
        </div>
      </div>
    </div>
  )
}
