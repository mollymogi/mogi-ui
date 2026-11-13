"use client"

import * as React from "react"
import {
  AlertCircle,
  Bot,
  Check,
  ExternalLink,
  FileText,
  Loader2,
  Sparkles,
  User,
  X,
} from "lucide-react"
import { cn } from "@mogi-ui/ui/lib/utils"
import { CopyButton } from "@mogi-ui/ui/components/copy-button"

type ChatParticipantStatus = "idle" | "starting" | "working" | "error" | "stopped"
type ChatStatusTone = "neutral" | "success" | "warning" | "danger"

type ChatAgentBrand =
  | "claude"
  | "openai"
  | "grok"
  | "gemini"
  | "deepseek"
  | "opencode"
  | "dsh"
  | "qwen"
  | "glm"
  | "kimi"
  | "minimax"
  | "hermes"
  | "generic"

const brandSurfaceClass: Record<ChatAgentBrand, string> = {
  claude: "bg-agent-claude text-agent-foreground",
  openai: "bg-agent-openai text-agent-foreground",
  grok: "bg-agent-grok text-agent-foreground",
  gemini: "bg-agent-gemini text-agent-foreground",
  deepseek: "bg-agent-deepseek text-agent-foreground",
  opencode: "bg-agent-opencode text-agent-foreground",
  dsh: "bg-agent-dsh text-agent-foreground",
  qwen: "bg-agent-qwen text-agent-foreground",
  glm: "bg-agent-glm text-agent-foreground",
  kimi: "bg-agent-kimi text-agent-foreground",
  minimax: "bg-agent-minimax text-agent-foreground",
  hermes: "bg-agent-hermes text-agent-foreground",
  generic: "bg-agent-generic text-agent-foreground",
}

function resolveAgentBrand(cli?: string | null, model?: string | null): ChatAgentBrand {
  const m = (model || "").trim().toLowerCase()
  const c = (cli || "").trim().toLowerCase()

  if (m) {
    if (/(?:claude|opus|sonnet|haiku)/.test(m)) return "claude"
    if (/deepseek/.test(m)) return "deepseek"
    if (/gemini/.test(m)) return "gemini"
    if (/grok/.test(m)) return "grok"
    if (/(?:qwen|tongyi)/.test(m)) return "qwen"
    if (/(?:glm|chatglm|zhipu)/.test(m)) return "glm"
    if (/(?:kimi|moonshot)/.test(m)) return "kimi"
    if (/(?:minimax|abab)/.test(m)) return "minimax"
    if (/(?:gpt|codex|\bo[134](?:-|$))/.test(m)) return "openai"
  }

  if (c === "claude") return "claude"
  if (c === "codex" || c === "openai") return "openai"
  if (c === "grok") return "grok"
  if (c === "agy" || c === "gemini") return "gemini"
  if (c === "deepseek") return "deepseek"
  if (c === "opencode") return "opencode"
  if (c === "dsh") return "dsh"
  if (c === "qwen") return "qwen"
  if (c === "glm") return "glm"
  if (c === "kimi") return "kimi"
  if (c === "minimax") return "minimax"
  if (c === "hermes") return "hermes"

  return "generic"
}

function ChatAgentIcon({
  brand,
  className,
}: {
  brand: ChatAgentBrand
  className?: string
}) {
  switch (brand) {
    case "claude":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
          <path d="M11.15 2.5h1.7l-.3 7.15 5.26-4.8 1.2 1.2-5.05 4.95 7.04-.2v1.7l-7.04-.2 5.05 4.95-1.2 1.2-5.26-4.8.3 7.15h-1.7l.3-7.15-5.26 4.8-1.2-1.2 5.05-4.95-7.04.2v-1.7l7.04.2-5.05-4.95 1.2-1.2 5.26 4.8-.3-7.15z" />
        </svg>
      )
    case "openai":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
          <circle cx="12" cy="12" r="2.2" />
          <path d="M12 4.2a3.8 3.8 0 0 1 3.3 5.7L12 12m0-7.8a3.8 3.8 0 0 0-3.3 5.7L12 12" />
          <path d="M18.75 8.1a3.8 3.8 0 0 1-1.9 6.6L12 12m6.75-3.9a3.8 3.8 0 0 0-5.15-1.4L12 12" />
          <path d="M18.75 15.9a3.8 3.8 0 0 1-5.2 1.4L12 12m6.75 3.9a3.8 3.8 0 0 0-1.9-6.6L12 12" />
          <path d="M12 19.8a3.8 3.8 0 0 1-3.3-5.7L12 12m0 7.8a3.8 3.8 0 0 0 3.3-5.7L12 12" />
          <path d="M5.25 15.9a3.8 3.8 0 0 1 1.9-6.6L12 12m-6.75 3.9a3.8 3.8 0 0 0 5.15 1.4L12 12" />
          <path d="M5.25 8.1a3.8 3.8 0 0 1 5.2-1.4L12 12M5.25 8.1a3.8 3.8 0 0 0 1.9 6.6L12 12" />
        </svg>
      )
    case "grok":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
          <path d="M9.6 15.8c-2.6-1.9-3.1-5.6-1-8.1 2-2.4 5.7-2.7 8-.6" />
          <path d="M14.8 8.6c2.2 2.1 2.4 5.6.3 7.9-2.2 2.4-6 2.5-8.3.2" />
          <path d="M6.2 17.8 18.2 5.8" />
        </svg>
      )
    case "gemini":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
          <path d="M12 2.5c.6 4.7 4.8 8.9 9.5 9.5-4.7.6-8.9 4.8-9.5 9.5-.6-4.7-4.8-8.9-9.5-9.5 4.7-.6 8.9-4.8 9.5-9.5z" />
        </svg>
      )
    case "deepseek":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
          <path d="M4.5 14.2c1.4-4.2 5-6.7 9.4-6.2 3.1.4 5.4 2.5 5.6 5.3.2 2.7-1.9 4.9-5.1 4.9H8.3c-2.3 0-4.2-1.6-3.8-4z" />
          <path d="M10.5 7.8c.2-1.7 1.3-3 3-3.3.1 1.6-.4 2.8-1.4 3.6" />
          <circle cx="15.2" cy="12.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case "opencode":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
          <path d="m7.5 8.5 3.8 3.5-3.8 3.5" />
          <path d="M13 15.5h4.5" />
        </svg>
      )
    case "dsh":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
          <polygon points="12 3.8 19.2 8.2 19.2 15.8 12 20.2 4.8 15.8 4.8 8.2" />
          <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
        </svg>
      )
    case "qwen":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
          <rect x="6.5" y="6.5" width="11" height="11" rx="2.5" transform="rotate(45 12 12)" />
          <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
        </svg>
      )
    case "glm":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
          <path d="M7 7h10l-10 10h10" />
        </svg>
      )
    case "kimi":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
          <path d="M14.8 4.2a8 8 0 1 0 5 14.3 7.2 7.2 0 0 1-5-14.3z" />
          <circle cx="17.5" cy="7.5" r="1.4" />
        </svg>
      )
    case "minimax":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
          <path d="M5 15V9.5a2 2 0 0 1 3.4-1.4L12 11.7l3.6-3.6A2 2 0 0 1 19 9.5V15" />
          <path d="M8.5 16.5v-3M15.5 16.5v-3" />
        </svg>
      )
    case "hermes":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
          <path d="M13 3.5 6.5 13h5l-1 7.5L17.5 11h-5z" />
        </svg>
      )
    default:
      return <Bot className={className} />
  }
}

type ChatAgentAvatarProps = Omit<React.ComponentProps<"span">, "children"> & {
  brand?: ChatAgentBrand
  cli?: string | null
  model?: string | null
  size?: "xs" | "sm" | "md" | "lg"
}

const agentAvatarSizeClass: Record<NonNullable<ChatAgentAvatarProps["size"]>, string> = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-8",
  lg: "size-9",
}

const agentIconSizeClass: Record<NonNullable<ChatAgentAvatarProps["size"]>, string> = {
  xs: "size-2.5",
  sm: "size-2.5",
  md: "size-4",
  lg: "size-[18px]",
}

// mogi: GrokBot-inspired circular agent avatar colored by brand signature token + vector logo.
function ChatAgentAvatar({
  brand,
  cli,
  model,
  size = "md",
  className,
  ...props
}: ChatAgentAvatarProps) {
  const resolved = brand ?? resolveAgentBrand(cli, model)
  return (
    <span
      data-slot="chat-agent-avatar"
      data-brand={resolved}
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full ring-1 ring-foreground/15 select-none",
        agentAvatarSizeClass[size],
        brandSurfaceClass[resolved],
        className
      )}
      {...props}
    >
      <ChatAgentIcon brand={resolved} className={agentIconSizeClass[size]} />
    </span>
  )
}

type ChatMonogramProps = React.ComponentProps<"span"> & {
  text: string
  size?: "xs" | "sm" | "md"
}

const monogramSizeClass: Record<NonNullable<ChatMonogramProps["size"]>, string> = {
  xs: "size-3.5 text-[8px]",
  sm: "size-4 text-[9px]",
  md: "size-8 text-[11px]",
}

// mogi: Adapted from slev12397/beautiful-ui Monogram using semantic accent tokens.
function ChatMonogram({ text, size = "sm", className, ...props }: ChatMonogramProps) {
  return (
    <span
      data-slot="chat-monogram"
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-accent font-mono font-semibold leading-none text-accent-foreground uppercase select-none",
        monogramSizeClass[size],
        className
      )}
      {...props}
    >
      {text.slice(0, 2)}
    </span>
  )
}

type ChatEntityChipProps = {
  name: React.ReactNode
  avatar?: React.ReactNode
  monogram?: string
  badge?: React.ReactNode
  size?: "sm" | "md"
  interactive?: boolean
  onClick?: () => void
  title?: string
  className?: string
}

// mogi: Adapted from slev12397/beautiful-ui EntityChip for inline @Agent tokens and quick-mention pills.
function ChatEntityChip({
  name,
  avatar,
  monogram,
  badge,
  size = "md",
  interactive,
  onClick,
  title,
  className,
}: ChatEntityChipProps) {
  const isClickable = Boolean(interactive || onClick)
  const sharedClass = cn(
    "inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary align-middle font-medium text-secondary-foreground transition-colors duration-(--duration-mogi-fast) ease-mogi",
    size === "sm" ? "py-px pl-0.5 pr-2 text-[11px]" : "py-0.5 pl-1 pr-2.5 text-xs",
    isClickable &&
      "cursor-pointer hover:border-border-strong hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    className
  )

  const content = (
    <>
      {avatar ? (
        <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center">
          {avatar}
        </span>
      ) : monogram ? (
        <ChatMonogram text={monogram} size={size === "sm" ? "xs" : "sm"} />
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground",
            size === "sm" ? "size-3.5" : "size-4"
          )}
        >
          <Bot className={size === "sm" ? "size-2.5" : "size-3"} />
        </span>
      )}
      <span className="truncate font-mono">{name}</span>
      {badge}
    </>
  )

  if (isClickable) {
    return (
      <button
        type="button"
        data-slot="chat-entity-chip"
        data-size={size}
        onClick={onClick}
        title={title}
        className={sharedClass}
      >
        {content}
      </button>
    )
  }

  return (
    <span data-slot="chat-entity-chip" data-size={size} title={title} className={sharedClass}>
      {content}
    </span>
  )
}

type ChatStatusPillProps = React.ComponentProps<"span"> & {
  tone?: ChatStatusTone
  pulse?: boolean
}

const statusPillToneClass: Record<ChatStatusTone, string> = {
  neutral: "border-border bg-muted text-muted-foreground",
  success: "border-success/25 bg-success-soft text-success",
  warning: "border-warning/25 bg-warning-soft text-warning-foreground dark:text-warning",
  danger: "border-destructive/25 bg-destructive-soft text-destructive",
}

const statusPillDotClass: Record<ChatStatusTone, string> = {
  neutral: "bg-muted-foreground",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
}

// mogi: Adapted from slev12397/beautiful-ui StatusPill using semantic surface/status tokens.
function ChatStatusPill({
  tone = "neutral",
  pulse = false,
  children,
  className,
  ...props
}: ChatStatusPillProps) {
  return (
    <span
      data-slot="chat-status-pill"
      data-tone={tone}
      className={cn(
        "inline-flex h-5 shrink-0 items-center gap-1.5 rounded-full border px-2 text-[11px] font-medium leading-none",
        statusPillToneClass[tone],
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          statusPillDotClass[tone],
          pulse && "motion-safe:animate-pulse"
        )}
      />
      <span>{children}</span>
    </span>
  )
}

type ChatParticipantChipProps = Omit<React.ComponentProps<"div">, "children"> & {
  label: React.ReactNode
  avatar?: React.ReactNode
  monogram?: string
  badge?: React.ReactNode
  status?: ChatParticipantStatus
  statusTitle?: string
  onMention?: () => void
  onRemove?: () => void
  removeLabel?: string
}

const participantDotClass: Record<ChatParticipantStatus, string> = {
  idle: "bg-success",
  starting: "bg-warning motion-safe:animate-pulse",
  working: "bg-warning motion-safe:animate-pulse",
  error: "bg-destructive",
  stopped: "bg-muted-foreground",
}

// mogi: Multi-agent group chat participant pill combining beautiful-ui avatar/monogram and semantic status dots.
function ChatParticipantChip({
  label,
  avatar,
  monogram,
  badge,
  status = "idle",
  statusTitle,
  onMention,
  onRemove,
  removeLabel = "移除成员",
  className,
  ...props
}: ChatParticipantChipProps) {
  return (
    <div
      data-slot="chat-participant-chip"
      data-status={status}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-card py-1 pl-2 pr-2.5 text-xs text-card-foreground transition-colors duration-(--duration-mogi-fast) ease-mogi hover:border-border-strong",
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        title={statusTitle}
        className={cn("size-2 shrink-0 rounded-full", participantDotClass[status])}
      />
      {avatar ?? (monogram && <ChatMonogram text={monogram} size="sm" />)}
      {onMention ? (
        <button
          type="button"
          onClick={onMention}
          className="inline-flex min-w-0 items-center gap-1.5 rounded-sm font-mono font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="truncate">{label}</span>
          {badge}
        </button>
      ) : (
        <span className="inline-flex min-w-0 items-center gap-1.5 font-mono font-medium text-foreground">
          <span className="truncate">{label}</span>
          {badge}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="ml-0.5 rounded-full p-0.5 text-muted-foreground transition-colors duration-(--duration-mogi-fast) ease-mogi hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  )
}

type ChatThinkingStateProps = React.ComponentProps<"div"> & {
  label?: React.ReactNode
  detail?: React.ReactNode
}

// mogi: Adapted from slev12397/beautiful-ui ThinkingState for live agent reasoning/turn status.
function ChatThinkingState({
  label = "正在思考与调查…",
  detail,
  className,
  ...props
}: ChatThinkingStateProps) {
  return (
    <div
      data-slot="chat-thinking-state"
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/60 px-3 py-2 text-xs text-muted-foreground",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Loader2 aria-hidden="true" className="size-3.5 shrink-0 text-link motion-safe:animate-spin" />
        <Sparkles aria-hidden="true" className="size-3 shrink-0 text-link" />
        <span className="truncate font-medium text-foreground">{label}</span>
      </div>
      {detail != null && <span className="shrink-0 text-[11px] text-muted-foreground">{detail}</span>}
    </div>
  )
}

type ChatThreadProps = React.ComponentProps<"div">

function ChatThread({ className, ...props }: ChatThreadProps) {
  return (
    <div
      data-slot="chat-thread"
      role="log"
      aria-live="polite"
      className={cn("flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4", className)}
      {...props}
    />
  )
}

type FilePathRef = {
  path: string
  line?: number
  raw: string
}

const KNOWN_FILE_EXTENSIONS = new Set([
  "md", "mdx", "markdown", "rst", "txt", "log", "csv", "tsv",
  "json", "jsonc", "jsonl", "yaml", "yml", "toml", "ini", "cfg", "conf",
  "ts", "tsx", "js", "jsx", "mjs", "cjs", "mts", "cts",
  "py", "sh", "zsh", "bash", "fish", "rb", "go", "rs", "java", "kt", "swift",
  "c", "cc", "cpp", "cxx", "h", "hpp", "cmake",
  "css", "scss", "less", "html", "htm", "xml", "svg", "sql", "graphql",
  "png", "jpg", "jpeg", "gif", "webp", "ico", "pdf", "mp3", "wav", "mp4", "mov",
])

const KNOWN_ABS_ROOTS = /^\/(?:Users|Volumes|tmp|var|private|home|opt|etc|Applications|Library|mnt|root)\//

function parseFilePathRef(raw: string): FilePathRef | null {
  let candidate = raw.trim()
  if (!candidate) return null
  if (/^https?:\/\//i.test(candidate)) return null

  if (candidate.startsWith("file://")) {
    let stripped = candidate.slice("file://".length)
    if (stripped.startsWith("localhost/")) stripped = stripped.slice("localhost".length)
    try {
      stripped = decodeURIComponent(stripped)
    } catch {}
    candidate = stripped
  }

  let line: number | undefined
  const hashLine = candidate.match(/#L(\d+)(?:-L?\d+)?$/)
  if (hashLine?.[1]) {
    line = Number(hashLine[1])
    candidate = candidate.slice(0, hashLine.index)
  } else {
    const colonLine = candidate.match(/:(\d+)(?::\d+)?$/)
    if (colonLine?.[1]) {
      line = Number(colonLine[1])
      candidate = candidate.slice(0, colonLine.index)
    }
  }

  if (!candidate || /^\/api\//.test(candidate)) return null
  const extMatch = candidate.match(/\.([a-zA-Z0-9]{1,10})$/)
  const ext = extMatch?.[1]?.toLowerCase() ?? ""
  const hasKnownExt = KNOWN_FILE_EXTENSIONS.has(ext)

  if (candidate.startsWith("/")) {
    const segs = candidate.split("/").filter(Boolean)
    if (segs.length < 2) return null
    if (!KNOWN_ABS_ROOTS.test(candidate) && !hasKnownExt) return null
    return { path: candidate, line, raw }
  }

  if (candidate.startsWith("~/") || candidate.startsWith("./") || candidate.startsWith("../")) {
    if (candidate.length <= 2) return null
    return { path: candidate, line, raw }
  }

  if (hasKnownExt && /^[a-zA-Z0-9._-]+(?:\/[a-zA-Z0-9._\-\u4e00-\u9fff]+)*$/.test(candidate)) {
    return { path: candidate, line, raw }
  }

  return null
}

type MarkdownBlock =
  | { kind: "heading"; level: 1 | 2 | 3 | 4; text: string }
  | { kind: "hr" }
  | { kind: "code"; language: string; code: string; closed: boolean }
  | { kind: "blockquote"; lines: string[] }
  | { kind: "table"; headers: string[]; rows: string[][] }
  | { kind: "list"; ordered: boolean; start: number; items: { text: string; checked?: boolean; indent: number }[] }
  | { kind: "paragraph"; lines: string[] }

function parseTableCells(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "")
  return trimmed.split("|").map(cell => cell.trim())
}

function isTableSeparator(line: string): boolean {
  const trimmed = line.trim()
  return /^\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?$/.test(trimmed)
}

// mogi: Streaming-safe Markdown block parser; incomplete code fences & constructs render cleanly mid-stream.
function parseMarkdownBlocks(input: string): MarkdownBlock[] {
  const text = (input || "").replace(/\r\n?/g, "\n")
  if (!text) return []
  const lines = text.split("\n")
  const blocks: MarkdownBlock[] = []

  let i = 0
  while (i < lines.length) {
    const line = lines[i] ?? ""
    if (!line.trim()) {
      i++
      continue
    }

    const fenceOpen = line.match(/^\s*```([a-zA-Z0-9_+#.-]*)\s*$/)
    if (fenceOpen) {
      const lang = fenceOpen[1] ?? ""
      const codeLines: string[] = []
      i++
      let closed = false
      while (i < lines.length) {
        const curr = lines[i] ?? ""
        if (/^\s*```\s*$/.test(curr)) {
          closed = true
          i++
          break
        }
        codeLines.push(curr)
        i++
      }
      blocks.push({ kind: "code", language: lang, code: codeLines.join("\n"), closed })
      continue
    }

    const headingMatch = line.match(/^\s*(#{1,4})\s+(.+?)\s*$/)
    if (headingMatch?.[1] && headingMatch[2]) {
      const level = Math.min(4, headingMatch[1].length) as 1 | 2 | 3 | 4
      blocks.push({ kind: "heading", level, text: headingMatch[2] })
      i++
      continue
    }

    if (/^\s*(?:---+|===+|\*\*\*+)\s*$/.test(line)) {
      blocks.push({ kind: "hr" })
      i++
      continue
    }

    if (line.includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1] ?? "")) {
      const headers = parseTableCells(line)
      i += 2
      const rows: string[][] = []
      while (i < lines.length) {
        const rowLine = lines[i] ?? ""
        if (!rowLine.trim() || !rowLine.includes("|")) break
        rows.push(parseTableCells(rowLine))
        i++
      }
      blocks.push({ kind: "table", headers, rows })
      continue
    }

    if (/^\s*>\s?/.test(line)) {
      const qLines: string[] = []
      while (i < lines.length && /^\s*>\s?/.test(lines[i] ?? "")) {
        qLines.push((lines[i] ?? "").replace(/^\s*>\s?/, ""))
        i++
      }
      blocks.push({ kind: "blockquote", lines: qLines })
      continue
    }

    const ulStart = line.match(/^(\s*)(?:[-*+•])\s+(.*)$/)
    const olStart = line.match(/^(\s*)(\d+)\.\s+(.*)$/)
    if (ulStart || olStart) {
      const ordered = Boolean(olStart)
      const startNum = olStart?.[2] ? Math.max(1, Number(olStart[2])) : 1
      const items: { text: string; checked?: boolean; indent: number }[] = []
      while (i < lines.length) {
        const curr = lines[i] ?? ""
        if (!curr.trim()) break
        const match = ordered
          ? curr.match(/^(\s*)\d+\.\s+(.*)$/)
          : curr.match(/^(\s*)(?:[-*+•])\s+(.*)$/)
        if (match) {
          const indent = Math.floor((match[1] ?? "").length / 2)
          let body = match[2] ?? ""
          let checked: boolean | undefined
          if (!ordered) {
            const taskMatch = body.match(/^\[( |x|X)\]\s+(.*)$/)
            if (taskMatch) {
              checked = taskMatch[1]?.toLowerCase() === "x"
              body = taskMatch[2] ?? ""
            }
          }
          items.push({ text: body, checked, indent })
          i++
          continue
        }
        if (/^\s{2,}\S/.test(curr) && items.length > 0) {
          const last = items[items.length - 1]
          if (last) last.text += "\n" + curr.trim()
          i++
          continue
        }
        break
      }
      blocks.push({ kind: "list", ordered, start: startNum, items })
      continue
    }

    const pLines: string[] = []
    while (i < lines.length) {
      const curr = lines[i] ?? ""
      if (!curr.trim()) break
      if (/^\s*```/.test(curr)) break
      if (/^\s*#{1,4}\s+/.test(curr)) break
      if (/^\s*(?:---+|===+|\*\*\*+)\s*$/.test(curr)) break
      if (/^\s*>\s?/.test(curr)) break
      if (/^\s*(?:[-*+•]|\d+\.)\s+/.test(curr)) break
      if (curr.includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1] ?? "")) break
      pLines.push(curr)
      i++
    }
    if (pLines.length) blocks.push({ kind: "paragraph", lines: pLines })
  }

  return blocks
}

type ChatMentionCandidate = {
  matchers: string[]
  token: string
  label: string
  monogram?: string
  avatar?: React.ReactNode
  cli?: string | null
  model?: string | null
}

type MentionLookup = {
  byKey: Map<string, ChatMentionCandidate>
  patterns: string[]
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function buildMentionLookup(mentions?: ChatMentionCandidate[]): MentionLookup | null {
  if (!mentions?.length) return null
  const byKey = new Map<string, ChatMentionCandidate>()
  for (const item of mentions) {
    for (const raw of item.matchers) {
      const key = raw.trim().toLowerCase()
      if (key && !byKey.has(key)) byKey.set(key, item)
    }
  }
  const patterns = [...byKey.keys()].sort((a, b) => b.length - a.length).map(escapeRegExp)
  return patterns.length ? { byKey, patterns } : null
}

const PATH_OR_URL_REGEX =
  /(https?:\/\/[^\s<>"'()\]，。！？；：、】」》]+|file:\/\/\/[^\s"'`<>\[\]()，。！？；：、）】」》]+|(?<![a-zA-Z0-9_@./-])(?:~\/|\.\.?\/|\/(?:Users|Volumes|tmp|var|private|home|opt|etc|Applications|Library|mnt)\/)[^\s"'`<>\[\]()，。！？；：、）】」》]+|(?<![a-zA-Z0-9_@./:-])(?:[a-zA-Z0-9._-]+\/)+[a-zA-Z0-9._\-\u4e00-\u9fff]+\.(?:md|mdx|txt|log|csv|json|jsonc|jsonl|yaml|yml|toml|ts|tsx|js|jsx|mjs|cjs|py|sh|zsh|bash|css|scss|html|sql|rs|go|java|c|cpp|h|hpp|png|jpg|jpeg|svg|mp3|wav|mp4|pdf)(?::\d+(?::\d+)?)?(?:#L\d+)?|(?<![a-zA-Z0-9_@./:-])[a-zA-Z0-9._-]+\.(?:md|mdx|json|yaml|yml|toml|ts|tsx|js|jsx|mjs|cjs|py|sh|css|html|sql|rs|go|java)(?::\d+(?::\d+)?)?(?:#L\d+)?)/g

function renderPlainSegment(
  segment: string,
  mentionLookup: MentionLookup | null,
  onMentionClick: ((token: string) => void) | undefined,
  onOpenPath: ((filePath: string, line?: number) => void) | undefined,
  keyPrefix: string
): React.ReactNode {
  if (!segment) return null

  if (mentionLookup) {
    const mentionRegex = new RegExp(
      `(^|[\\s([{\"'“‘：:])(${mentionLookup.patterns.join("|")})(?=$|[\\s\\])},.!?，。！？：；;\"'”’])`,
      "gi"
    )
    const parts: React.ReactNode[] = []
    let last = 0
    let match: RegExpExecArray | null
    let idx = 0
    while ((match = mentionRegex.exec(segment)) !== null) {
      const lead = match[1] ?? ""
      const tokenText = match[2] ?? ""
      const start = match.index + lead.length
      if (start > last) {
        parts.push(
          renderPathsAndUrls(segment.slice(last, start), onOpenPath, `${keyPrefix}-pre-${idx}`)
        )
      }
      const cand = mentionLookup.byKey.get(tokenText.toLowerCase())
      if (cand) {
        const avatarNode =
          cand.avatar ??
          (cand.cli || cand.model ? (
            <ChatAgentAvatar cli={cand.cli} model={cand.model} size="xs" />
          ) : undefined)
        parts.push(
          <ChatEntityChip
            key={`${keyPrefix}-m-${idx++}`}
            size="sm"
            avatar={avatarNode}
            monogram={cand.monogram}
            name={cand.label}
            onClick={onMentionClick ? () => onMentionClick(cand.token) : undefined}
            className="mx-0.5 align-baseline"
          />
        )
      } else {
        parts.push(tokenText)
      }
      last = start + tokenText.length
    }
    if (last > 0) {
      if (last < segment.length) {
        parts.push(renderPathsAndUrls(segment.slice(last), onOpenPath, `${keyPrefix}-tail`))
      }
      return parts
    }
  }

  return renderPathsAndUrls(segment, onOpenPath, keyPrefix)
}

function renderPathsAndUrls(
  text: string,
  onOpenPath: ((filePath: string, line?: number) => void) | undefined,
  keyPrefix: string
): React.ReactNode {
  if (!text) return null
  const regex = new RegExp(PATH_OR_URL_REGEX.source, "g")
  const parts: React.ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  let idx = 0

  while ((match = regex.exec(text)) !== null) {
    const rawMatched = match[0]
    const cleanMatched = rawMatched.replace(/[，。！？；：、】」》.,;:!?)'"\]}]+$/, "")
    if (!cleanMatched) continue

    if (match.index > last) {
      parts.push(text.slice(last, match.index))
    }

    if (/^https?:\/\//i.test(cleanMatched)) {
      parts.push(
        <a
          key={`${keyPrefix}-u-${idx++}`}
          href={cleanMatched}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 break-all font-medium text-link underline underline-offset-2 hover:opacity-80"
        >
          <span>{cleanMatched}</span>
          <ExternalLink aria-hidden="true" className="size-3 shrink-0" />
        </a>
      )
      last = match.index + cleanMatched.length
      continue
    }

    const parsedPath = parseFilePathRef(cleanMatched)
    if (parsedPath && onOpenPath) {
      parts.push(
        <button
          key={`${keyPrefix}-p-${idx++}`}
          type="button"
          onClick={() => onOpenPath(parsedPath.path, parsedPath.line)}
          title={`点击预览或打开：${parsedPath.path}${parsedPath.line ? ` (第 ${parsedPath.line} 行)` : ""}`}
          className="mx-0.5 inline-flex max-w-full cursor-pointer items-center gap-1 rounded-md border border-border bg-secondary/75 px-1.5 py-px align-baseline font-mono text-[0.88em] text-link transition-colors duration-(--duration-mogi-fast) ease-mogi hover:border-border-strong hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <FileText aria-hidden="true" className="size-3 shrink-0" />
          <span className="truncate">{cleanMatched}</span>
        </button>
      )
      last = match.index + cleanMatched.length
      continue
    }

    parts.push(rawMatched)
    last = match.index + rawMatched.length
  }

  if (last === 0) return text
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

const INLINE_TOKEN_REGEX =
  /(`[^`\n]+`|\[[^\]\n]+\]\([^)\s]+\)|\*\*[^*\n]+(?:\*(?!\*)[^*\n]+)*\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\s][^*\n]*?\*)/g

function renderInlineRich(
  text: string,
  mentionLookup: MentionLookup | null,
  onMentionClick: ((token: string) => void) | undefined,
  onOpenPath: ((filePath: string, line?: number) => void) | undefined,
  keyPrefix = "in"
): React.ReactNode {
  if (!text) return null
  const regex = new RegExp(INLINE_TOKEN_REGEX.source, "g")
  const parts: React.ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  let seq = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(
        renderPlainSegment(
          text.slice(last, match.index),
          mentionLookup,
          onMentionClick,
          onOpenPath,
          `${keyPrefix}-s-${seq++}`
        )
      )
    }
    const token = match[0]
    const k = `${keyPrefix}-t-${seq++}`

    if (token.startsWith("`") && token.endsWith("`")) {
      const inner = token.slice(1, -1)
      const parsedPath = onOpenPath ? parseFilePathRef(inner) : null
      if (parsedPath && onOpenPath) {
        parts.push(
          <button
            key={k}
            type="button"
            onClick={() => onOpenPath(parsedPath.path, parsedPath.line)}
            title={`点击预览或打开：${parsedPath.path}${parsedPath.line ? ` (第 ${parsedPath.line} 行)` : ""}`}
            className="mx-0.5 inline-flex max-w-full cursor-pointer items-center gap-1 rounded-md border border-border bg-secondary/75 px-1.5 py-px align-baseline font-mono text-[0.88em] text-link transition-colors duration-(--duration-mogi-fast) ease-mogi hover:border-border-strong hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <FileText aria-hidden="true" className="size-3 shrink-0" />
            <span className="truncate">{inner}</span>
          </button>
        )
      } else {
        parts.push(
          <code
            key={k}
            className="rounded-md border border-border/70 bg-muted px-1.5 py-px font-mono text-[0.88em] text-foreground"
          >
            {inner}
          </code>
        )
      }
    } else if (token.startsWith("[")) {
      const linkMatch = token.match(/^\[([^\]\n]+)\]\(([^)\s]+)\)$/)
      if (linkMatch?.[1] && linkMatch[2]) {
        const label = linkMatch[1]
        const href = linkMatch[2]
        if (/^https?:\/\//i.test(href)) {
          parts.push(
            <a
              key={k}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-medium text-link underline underline-offset-2 hover:opacity-80"
            >
              <span>{label}</span>
              <ExternalLink aria-hidden="true" className="size-3 shrink-0" />
            </a>
          )
        } else {
          const ref = parseFilePathRef(href)
          if (ref && onOpenPath) {
            parts.push(
              <button
                key={k}
                type="button"
                onClick={() => onOpenPath(ref.path, ref.line)}
                title={ref.path}
                className="inline-flex cursor-pointer items-center gap-1 font-medium text-link underline underline-offset-2 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <FileText aria-hidden="true" className="size-3 shrink-0" />
                <span>{label}</span>
              </button>
            )
          } else {
            parts.push(
              <span key={k} className="font-medium text-link">
                {label}
              </span>
            )
          }
        }
      } else {
        parts.push(token)
      }
    } else if (
      (token.startsWith("**") && token.endsWith("**")) ||
      (token.startsWith("__") && token.endsWith("__"))
    ) {
      parts.push(
        <strong key={k} className="font-semibold text-foreground">
          {renderInlineRich(token.slice(2, -2), mentionLookup, onMentionClick, onOpenPath, k)}
        </strong>
      )
    } else if (token.startsWith("~~") && token.endsWith("~~")) {
      parts.push(
        <del key={k} className="text-muted-foreground line-through">
          {renderInlineRich(token.slice(2, -2), mentionLookup, onMentionClick, onOpenPath, k)}
        </del>
      )
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={k} className="italic">
          {renderInlineRich(token.slice(1, -1), mentionLookup, onMentionClick, onOpenPath, k)}
        </em>
      )
    } else {
      parts.push(token)
    }

    last = match.index + token.length
  }

  if (last === 0) {
    return renderPlainSegment(text, mentionLookup, onMentionClick, onOpenPath, `${keyPrefix}-plain`)
  }
  if (last < text.length) {
    parts.push(
      renderPlainSegment(text.slice(last), mentionLookup, onMentionClick, onOpenPath, `${keyPrefix}-end`)
    )
  }
  return parts
}

type ChatMessageContentProps = React.ComponentProps<"div"> & {
  content: string
  streaming?: boolean
  mentions?: ChatMentionCandidate[]
  onMentionClick?: (token: string) => void
  onOpenPath?: (filePath: string, line?: number) => void
}

// mogi: Streaming-safe Markdown, GFM table, code block, @mention chip, and clickable file-path renderer.
function ChatMessageContent({
  content,
  streaming = false,
  mentions,
  onMentionClick,
  onOpenPath,
  className,
  ...props
}: ChatMessageContentProps) {
  const blocks = React.useMemo(() => parseMarkdownBlocks(content), [content])
  const mentionLookup = React.useMemo(() => buildMentionLookup(mentions), [mentions])

  if (!blocks.length) return null

  return (
    <div
      data-slot="chat-message-content"
      data-streaming={streaming || undefined}
      className={cn("min-w-0 space-y-2.5 break-words text-[13.5px] leading-relaxed text-foreground", className)}
      {...props}
    >
      {blocks.map((block, index) => {
        if (block.kind === "heading") {
          const Tag = block.level <= 2 ? "h3" : "h4"
          const sizeCls =
            block.level === 1
              ? "text-[15.5px] font-semibold tracking-tight text-foreground mt-3 first:mt-0"
              : block.level === 2
                ? "text-[14.5px] font-semibold tracking-tight text-foreground mt-2.5 first:mt-0"
                : "text-[13.5px] font-semibold text-foreground mt-2 first:mt-0"
          return (
            <Tag key={index} className={sizeCls}>
              {renderInlineRich(block.text, mentionLookup, onMentionClick, onOpenPath, `h-${index}`)}
            </Tag>
          )
        }

        if (block.kind === "hr") {
          return <hr key={index} className="my-2.5 border-border" />
        }

        if (block.kind === "code") {
          return (
            <figure
              key={index}
              data-slot="chat-code-block"
              className="my-2 overflow-hidden rounded-lg border border-border bg-card text-card-foreground"
            >
              <figcaption className="flex items-center justify-between gap-2 border-b border-border bg-muted/60 px-3 py-1.5 text-[11px] text-muted-foreground">
                <span className="font-mono font-medium uppercase tracking-wide">
                  {block.language || (block.closed ? "code" : "streaming…")}
                </span>
                <CopyButton value={block.code} label="复制" />
              </figcaption>
              <pre className="max-h-96 overflow-x-auto bg-card p-3 font-mono text-xs leading-relaxed text-foreground">
                <code>{block.code}</code>
              </pre>
            </figure>
          )
        }

        if (block.kind === "blockquote") {
          return (
            <blockquote
              key={index}
              className="space-y-1 border-l-2 border-border-strong pl-3 py-0.5 text-muted-foreground"
            >
              {block.lines.map((qLine, qi) => (
                <p key={qi}>
                  {renderInlineRich(qLine, mentionLookup, onMentionClick, onOpenPath, `q-${index}-${qi}`)}
                </p>
              ))}
            </blockquote>
          )
        }

        if (block.kind === "table") {
          return (
            <div key={index} className="my-2 overflow-x-auto rounded-lg border border-border">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="border-b border-border bg-muted/60 text-foreground">
                  <tr>
                    {block.headers.map((h, hi) => (
                      <th key={hi} className="px-3 py-2 font-semibold">
                        {renderInlineRich(h, mentionLookup, onMentionClick, onOpenPath, `th-${index}-${hi}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {block.rows.map((row, ri) => (
                    <tr key={ri}>
                      {block.headers.map((_, ci) => (
                        <td key={ci} className="px-3 py-2 align-top text-foreground">
                          {renderInlineRich(
                            row[ci] ?? "",
                            mentionLookup,
                            onMentionClick,
                            onOpenPath,
                            `td-${index}-${ri}-${ci}`
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        if (block.kind === "list") {
          const ListTag = block.ordered ? "ol" : "ul"
          const hasTasks = !block.ordered && block.items.some(item => item.checked !== undefined)
          return (
            <ListTag
              key={index}
              start={block.ordered && block.start !== 1 ? block.start : undefined}
              className={cn(
                "space-y-1",
                hasTasks ? "list-none pl-1" : block.ordered ? "list-decimal pl-5" : "list-disc pl-5"
              )}
            >
              {block.items.map((item, li) => (
                <li
                  key={li}
                  className={cn("leading-relaxed", item.indent > 0 && "ml-4")}
                >
                  {item.checked !== undefined ? (
                    <span className="inline-flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-1 inline-flex size-3.5 shrink-0 items-center justify-center rounded-[3px] border",
                          item.checked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border-strong bg-card"
                        )}
                      >
                        {item.checked && <Check className="size-2.5" />}
                      </span>
                      <span className={item.checked ? "text-muted-foreground line-through" : undefined}>
                        {renderInlineRich(item.text, mentionLookup, onMentionClick, onOpenPath, `li-${index}-${li}`)}
                      </span>
                    </span>
                  ) : (
                    renderInlineRich(item.text, mentionLookup, onMentionClick, onOpenPath, `li-${index}-${li}`)
                  )}
                </li>
              ))}
            </ListTag>
          )
        }

        return (
          <p key={index} className="leading-relaxed">
            {block.lines.map((pLine, pi) => (
              <React.Fragment key={pi}>
                {pi > 0 && <br />}
                {renderInlineRich(pLine, mentionLookup, onMentionClick, onOpenPath, `p-${index}-${pi}`)}
              </React.Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}

type ChatBubbleProps = Omit<React.ComponentProps<"article">, "title"> & {
  sender?: "user" | "agent" | "system"
  speaker?: React.ReactNode
  monogram?: string
  badge?: React.ReactNode
  meta?: React.ReactNode
  avatar?: React.ReactNode
  status?: "idle" | "sending" | "starting" | "working" | "completed" | "error"
  workingLabel?: React.ReactNode
  error?: React.ReactNode
  actions?: React.ReactNode
}

// mogi: Adapted from slev12397/beautiful-ui ChatExperience (AssistantMessage + asymmetric user bubble).
function ChatBubble({
  sender = "agent",
  speaker,
  monogram,
  badge,
  meta,
  avatar,
  status = "completed",
  workingLabel = "正在思考与调查…",
  error,
  actions,
  children,
  className,
  ...props
}: ChatBubbleProps) {
  if (sender === "system") {
    return (
      <div
        data-slot="chat-bubble"
        data-sender="system"
        className={cn("flex justify-center py-0.5", className)}
      >
        <span className="rounded-full border border-border bg-muted px-3 py-0.5 text-[11px] text-muted-foreground">
          {children}
        </span>
      </div>
    )
  }

  const isUser = sender === "user"
  const isBusy = status === "sending" || status === "starting" || status === "working"
  const isPlainTextBody = typeof children === "string"

  if (isUser) {
    return (
      <article
        data-slot="chat-bubble"
        data-sender="user"
        className={cn("flex w-full justify-end", className)}
        {...props}
      >
        <div
          className={cn(
            "max-w-[78%] rounded-2xl rounded-br-xs border border-border bg-secondary px-4 py-2.5 text-[13.5px] text-secondary-foreground transition-colors duration-(--duration-mogi-fast) ease-mogi",
            status === "error" && "border-destructive/50"
          )}
        >
          {(speaker != null || meta != null || badge != null) && (
            <header className="mb-1 flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground">
              {badge}
              {meta != null && <span>{meta}</span>}
              {speaker != null && <span className="font-medium text-foreground">{speaker}</span>}
              <span
                aria-hidden="true"
                className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                {avatar ?? <User className="size-2.5" />}
              </span>
            </header>
          )}
          {children != null && children !== "" && (
            <div className={cn("break-words leading-relaxed text-foreground", isPlainTextBody && "whitespace-pre-wrap")}>
              {children}
            </div>
          )}
        </div>
      </article>
    )
  }

  return (
    <article
      data-slot="chat-bubble"
      data-sender="agent"
      className={cn("flex w-full items-start justify-start gap-2.5", className)}
      {...props}
    >
      <div aria-hidden="true" className="mt-0.5 shrink-0 select-none">
        {avatar ?? (
          <span className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-accent font-mono text-[11px] font-semibold text-accent-foreground">
            {monogram ? monogram.slice(0, 2).toUpperCase() : <Bot className="size-4" />}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1 max-w-[86%]">
        <header className="mb-1 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            {speaker != null && <span className="font-mono font-semibold text-foreground">{speaker}</span>}
            {badge}
            {meta != null && <span className="text-[11px] text-muted-foreground">{meta}</span>}
          </div>
          {actions != null && <div className="flex items-center gap-1.5">{actions}</div>}
        </header>

        {isBusy && <ChatThinkingState label={workingLabel} />}

        {status === "error" && error != null && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive-soft px-3 py-2 text-xs text-destructive"
          >
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
            <span className="min-w-0 break-words">{error}</span>
          </div>
        )}

        {children != null && children !== "" && (
          <div
            className={cn(
              "rounded-2xl rounded-tl-xs border border-border bg-card px-4 py-3 text-[13.5px] leading-relaxed text-card-foreground shadow-xs transition-colors duration-(--duration-mogi-fast) ease-mogi",
              (isBusy || (status === "error" && error != null)) && "mt-1.5",
              status === "error" && "border-destructive/50"
            )}
          >
            <div className={cn("break-words text-foreground", isPlainTextBody && "whitespace-pre-wrap")}>
              {children}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

type ChatMentionBarProps = React.ComponentProps<"div">

function ChatMentionBar({ className, ...props }: ChatMentionBarProps) {
  return (
    <div
      data-slot="chat-mention-bar"
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      {...props}
    />
  )
}

type ChatPromptBarProps = React.ComponentProps<"div"> & {
  contextSlot?: React.ReactNode
  footerStart?: React.ReactNode
  footerEnd?: React.ReactNode
}

// mogi: Adapted from slev12397/beautiful-ui PromptBar — unified rounded composer container with top context slot and bottom toolbar.
function ChatPromptBar({
  contextSlot,
  footerStart,
  footerEnd,
  children,
  className,
  ...props
}: ChatPromptBarProps) {
  return (
    <div
      data-slot="chat-prompt-bar"
      className={cn(
        "rounded-xl border border-border-strong/60 bg-card p-2.5 transition-colors duration-(--duration-mogi-fast) ease-mogi focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
        className
      )}
      {...props}
    >
      {contextSlot != null && (
        <div className="mb-2 border-b border-border/70 pb-2">{contextSlot}</div>
      )}
      <div>{children}</div>
      {(footerStart != null || footerEnd != null) && (
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex min-w-0 items-center gap-2">{footerStart}</div>
          <div className="flex shrink-0 items-center gap-2">{footerEnd}</div>
        </div>
      )}
    </div>
  )
}

export {
  ChatThread,
  ChatBubble,
  ChatMonogram,
  ChatAgentAvatar,
  ChatAgentIcon,
  ChatEntityChip,
  ChatStatusPill,
  ChatParticipantChip,
  ChatThinkingState,
  ChatMessageContent,
  ChatMentionBar,
  ChatPromptBar,
  resolveAgentBrand,
  parseFilePathRef,
  parseMarkdownBlocks,
}
export type {
  ChatThreadProps,
  ChatBubbleProps,
  ChatMonogramProps,
  ChatAgentAvatarProps,
  ChatAgentBrand,
  ChatEntityChipProps,
  ChatStatusPillProps,
  ChatStatusTone,
  ChatParticipantChipProps,
  ChatParticipantStatus,
  ChatThinkingStateProps,
  ChatMessageContentProps,
  ChatMentionCandidate,
  ChatMentionBarProps,
  ChatPromptBarProps,
  FilePathRef,
}
