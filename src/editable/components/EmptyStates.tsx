import Link from 'next/link'
import { ArrowUpRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing on the shelf yet',
  description = 'New references will appear here as they land. Come back soon.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        'rounded-[16px] border border-dashed border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] p-14 text-center',
        className
      )}
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
        <SearchX className="h-6 w-6" />
      </div>
      <h2 className="editable-display mt-8 text-3xl leading-[1.05] tracking-[-0.03em]">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">{description}</p>
      <Link
        href={actionHref}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-6 py-3 text-sm font-semibold transition-all duration-500 hover:-translate-y-[1px] hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-page-bg)]"
      >
        {actionLabel}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'references', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Fresh ${taskLabel} will land here as they're added.`}
      actionLabel="Explore the library"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. We'll get back to you soon."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
