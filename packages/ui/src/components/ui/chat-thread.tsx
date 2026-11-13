"use client"

import * as React from "react"
import { AlertCircle, Bot, Loader2, Sparkles, User, X } from "lucide-react"
import { cn } from "@mogi-ui/ui/lib/utils"

type ChatParticipantStatus = "idle" | "starting" | "working" | "error" | "stopped"
type ChatStatusTone = "neutral" | "success" | "warning" | "danger"

type ChatMonogramProps = React.ComponentProps<"span"> & {
  text: string
  size?: "xs" | "sm" | "md"
}

const monogramSizeClass: Record<NonNullable<ChatMonogramProps["size"]>, string> = {
  xs: "size-3.5 text-[8px]",
  sm: "size-4 text-[9px]",
  md: "size-7 text-[10px]",
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
      {monogram ? (
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

// mogi: Multi-agent group chat participant pill combining beautiful-ui monogram and semantic status dots.
function ChatParticipantChip({
  label,
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
      {monogram && <ChatMonogram text={monogram} size="sm" />}
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
      className={cn("flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-4 py-4", className)}
      {...props}
    />
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
      <article
        data-slot="chat-bubble"
        data-sender="system"
        className={cn("flex justify-center py-0.5", className)}
        {...props}
      >
        <span className="rounded-full border border-border bg-muted px-3 py-0.5 text-[11px] text-muted-foreground">
          {children}
        </span>
      </article>
    )
  }

  const isUser = sender === "user"
  const isBusy = status === "sending" || status === "starting" || status === "working"

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
            "max-w-[78%] rounded-[18px] rounded-br-[5px] border border-border-strong/50 bg-secondary px-4 py-2.5 text-[13px] text-secondary-foreground transition-colors duration-(--duration-mogi-fast) ease-mogi",
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
                className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
              >
                {avatar ?? <User className="size-2.5" />}
              </span>
            </header>
          )}
          {children != null && children !== "" && (
            <div className="whitespace-pre-wrap break-words leading-relaxed text-foreground">
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
      <div
        aria-hidden="true"
        className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-[9px] border border-border bg-accent font-mono text-[10px] font-semibold text-accent-foreground select-none"
      >
        {avatar ?? (monogram ? <span>{monogram.slice(0, 2).toUpperCase()}</span> : <Bot className="size-3.5" />)}
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
              "rounded-xl border border-border bg-card px-4 py-3 text-[13px] leading-relaxed text-card-foreground transition-colors duration-(--duration-mogi-fast) ease-mogi",
              (isBusy || (status === "error" && error != null)) && "mt-1.5",
              status === "error" && "border-destructive/50"
            )}
          >
            <div className="whitespace-pre-wrap break-words text-foreground">{children}</div>
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
  ChatEntityChip,
  ChatStatusPill,
  ChatParticipantChip,
  ChatThinkingState,
  ChatMentionBar,
  ChatPromptBar,
}
export type {
  ChatThreadProps,
  ChatBubbleProps,
  ChatMonogramProps,
  ChatEntityChipProps,
  ChatStatusPillProps,
  ChatStatusTone,
  ChatParticipantChipProps,
  ChatParticipantStatus,
  ChatThinkingStateProps,
  ChatMentionBarProps,
  ChatPromptBarProps,
}
