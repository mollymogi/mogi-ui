import * as React from "react"
import { CheckCircle2, CircleAlert, Info, TriangleAlert, type LucideIcon } from "lucide-react"
import { cn } from "@mogi-ui/ui/lib/utils"

const tones = {
  danger: { box: "border-destructive/40 bg-destructive-soft", icon: "text-destructive", glyph: CircleAlert },
  warning: { box: "border-warning/60 bg-warning-soft", icon: "text-warning-foreground dark:text-warning", glyph: TriangleAlert },
  success: { box: "border-success/40 bg-success-soft", icon: "text-success", glyph: CheckCircle2 },
  info: { box: "border-info/40 bg-info-soft", icon: "text-info", glyph: Info },
  neutral: { box: "bg-card", icon: "text-muted-foreground", glyph: Info },
}

type StatusBannerProps = Omit<React.ComponentProps<"section">, "title"> & {
  tone?: keyof typeof tones
  title: React.ReactNode
  description?: React.ReactNode
  /** 对 tone 的文字说明，避免只靠颜色表达状态 */
  label?: React.ReactNode
  /** 这个状态要求的下一步；一屏只放一个填充按钮 */
  action?: React.ReactNode
  icon?: LucideIcon
  /** 次要信息和次要控件，显示在分隔线下方 */
  footer?: React.ReactNode
}

// mogi: 页面顶部的一句话结论。颜色只表达严重程度，下一步紧跟结论。
function StatusBanner({ tone = "neutral", title, description, label, action, icon, footer, className, children, ...props }: StatusBannerProps) {
  const style = Object.hasOwn(tones, tone) ? tones[tone] : tones.neutral
  const Icon = icon ?? style.glyph
  const urgent = tone === "danger" || tone === "warning"
  return <section data-slot="status-banner" data-tone={Object.hasOwn(tones, tone) ? tone : "neutral"} className={cn("grid min-w-0 gap-3 rounded-xl border px-5 py-4 text-foreground", style.box, className)} {...props}>
    <div className="flex min-w-0 flex-wrap items-start gap-x-4 gap-y-3">
      <Icon aria-hidden="true" className={cn("mt-0.5 size-5 shrink-0", style.icon)} />
      <div className="grid min-w-0 flex-1 basis-64 gap-1" role={urgent ? "alert" : "status"}>
        {label != null && <p className={cn("text-xs font-medium", style.icon)}>{label}</p>}
        <p className="text-lg font-semibold leading-snug">{title}</p>
        {description != null && <div className="text-sm leading-relaxed">{description}</div>}
        {children}
      </div>
      {action != null && <div data-slot="status-banner-action" className="shrink-0">{action}</div>}
    </div>
    {footer != null && <div data-slot="status-banner-footer" className="border-t border-foreground/15 pt-3 text-sm">{footer}</div>}
  </section>
}

export { StatusBanner }
export type { StatusBannerProps }
