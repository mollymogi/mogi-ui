"use client"

import * as React from "react"
import { AlertCircle, Bot, Loader2, User, X } from "lucide-react"
import { cn } from "@mogi-ui/ui/lib/utils"

type ChatParticipantStatus = "idle" | "starting" | "working" | "error" | "stopped"

type ChatParticipantChipProps = Omit<React.ComponentProps<"div">, "children"> & {
  label: React.ReactNode
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

// mogi: Multi-agent group chat participant pill using semantic status dots and accessible focus rings.
function ChatParticipantChip({
  label,
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
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-card-foreground transition-colors duration-(--duration-mogi-fast) ease-mogi hover:border-border-strong",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        title={statusTitle}
        className={cn("size-2 shrink-0 rounded-full", participantDotClass[status])}
      />
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

type ChatThreadProps = React.ComponentProps<"div">

function ChatThread({ className, ...props }: ChatThreadProps) {
  return (
    <div
      data-slot="chat-thread"
      role="log"
      aria-live="polite"
      className={cn("flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4", className)}
      {...props}
    />
  )
}

type ChatBubbleProps = Omit<React.ComponentProps<"article">, "title"> & {
  sender?: "user" | "agent" | "system"
  speaker?: React.ReactNode
  badge?: React.ReactNode
  meta?: React.ReactNode
  avatar?: React.ReactNode
  status?: "idle" | "sending" | "starting" | "working" | "completed" | "error"
  workingLabel?: React.ReactNode
  error?: React.ReactNode
  actions?: React.ReactNode
}

function ChatBubble({
  sender = "agent",
  speaker,
  badge,
  meta,
  avatar,
  status = "completed",
  workingLabel = "思考中…",
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

  return (
    <article
      data-slot="chat-bubble"
      data-sender={sender}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start", className)}
      {...props}
    >
      <div
        className={cn(
          "max-w-[84%] rounded-xl border px-4 py-3 text-sm transition-colors duration-(--duration-mogi-fast) ease-mogi",
          isUser
            ? "border-border-strong/50 bg-secondary text-secondary-foreground"
            : "border-border bg-card text-card-foreground",
          status === "error" && "border-destructive/50"
        )}
      >
        <header className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span
              aria-hidden
              className={cn(
                "inline-flex size-5 shrink-0 items-center justify-center rounded-md",
                isUser ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {avatar ?? (isUser ? <User className="size-3" /> : <Bot className="size-3" />)}
            </span>
            {speaker != null && (
              <span className={cn("font-medium text-foreground", !isUser && "font-mono")}>
                {speaker}
              </span>
            )}
            {badge}
            {meta != null && <span className="text-[11px] text-muted-foreground">{meta}</span>}
          </div>
          <div className="flex items-center gap-1.5">
            {isBusy && (
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Loader2 className="size-3 motion-safe:animate-spin" />
                {workingLabel}
              </span>
            )}
            {actions}
          </div>
        </header>

        {status === "error" && error != null && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-2.5 py-2 text-xs text-destructive"
          >
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
            <span className="min-w-0 break-words">{error}</span>
          </div>
        )}

        {children != null && children !== "" && (
          <div className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-foreground">
            {children}
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

export { ChatThread, ChatBubble, ChatParticipantChip, ChatMentionBar }
export type {
  ChatThreadProps,
  ChatBubbleProps,
  ChatParticipantChipProps,
  ChatParticipantStatus,
  ChatMentionBarProps,
}
