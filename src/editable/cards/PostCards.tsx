import Link from 'next/link'
import { ArrowUpRight, FileText } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

/*
  Card visual language mapped from thomas-henry.webflow.io:
    - Bordered soft on white (hairline #ededed), radius 16px
    - Big imagery (16/10 or 4/3)
    - Slight card lift + image zoom on hover
    - Editorial serif-scale display headline on titles
  Signatures are preserved byte-for-byte.
*/

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/* Large hero card — dark surface, cream text, oversized display title.
   Used for the biggest featured tile in the reference-portfolio grid. */
export function EditorialFeatureCard({
  post,
  href,
  label = 'Featured reference',
}: {
  post: SitePost
  href: string
  label?: string
}) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden rounded-[20px] ${pal.darkBg} ${pal.darkText} transition-all duration-500 hover:-translate-y-1`}>
      <div className="relative flex min-h-[560px] flex-col justify-end p-8 sm:min-h-[640px] sm:p-10 lg:min-h-[700px] lg:p-12">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover opacity-[0.42] transition-transform duration-[900ms] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,4,7,0.15)_0%,rgba(12,4,7,0.85)_75%,rgba(12,4,7,0.95)_100%)]" />
        <div className="relative z-10 flex flex-col gap-6">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">{label}</span>
          <h3 className="editable-display max-w-3xl text-5xl leading-[0.9] tracking-[-0.04em] sm:text-6xl lg:text-[5.5rem]">
            {post.title}
          </h3>
          <p className="max-w-2xl text-[15px] leading-[1.7] text-white/75 sm:text-base">
            {getEditableExcerpt(post, 190)}
          </p>
          <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-page-bg)] px-6 py-3 text-sm font-semibold text-[var(--slot4-page-text)] transition-all duration-500 group-hover:bg-[var(--slot4-warm-accent)]">
            Open reference
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* Rail card — portrait-ish tile used inside horizontal rails.
   Bordered soft, 4/3 image on top, label + title + excerpt below. */
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} transition duration-500 hover:-translate-y-1`}>
      <div className={`${dc.media.frame} ${dc.media.ratio} rounded-none`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
        />
      </div>
      <div className="p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">
          {String(index + 1).padStart(2, '0')} · {getEditableCategory(post)}
        </p>
        <h3 className="editable-display mt-4 line-clamp-3 text-[26px] leading-[1] tracking-[-0.03em] text-[var(--slot4-page-text)]">
          {post.title}
        </h3>
        <p className="mt-4 line-clamp-2 text-[14px] leading-[1.65] text-[var(--slot4-muted-text)]">
          {getEditableExcerpt(post, 120)}
        </p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-page-text)] transition-all duration-500 group-hover:gap-2.5">
          Open reference <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

/* Compact index card — soft surface, small icon + text row. */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 ${dc.surface.soft} p-6 transition duration-500 hover:-translate-y-[2px]`}>
      <div className="flex items-start gap-5">
        <span className="editable-display flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-page-text)] text-lg text-[var(--slot4-page-bg)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">
            {getEditableCategory(post)}
          </p>
          <h3 className="editable-display mt-3 line-clamp-2 text-[22px] leading-[1.05] tracking-[-0.02em] text-[var(--slot4-page-text)]">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-2 text-[14px] leading-[1.65] text-[var(--slot4-muted-text)]">
            {getEditableExcerpt(post, 110)}
          </p>
        </div>
      </div>
    </Link>
  )
}

/* Horizontal list card — image left, editorial body right. */
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group grid min-w-0 gap-6 overflow-hidden ${dc.surface.card} p-5 transition duration-500 hover:-translate-y-1 sm:grid-cols-[280px_minmax(0,1fr)] sm:p-6`}
    >
      <div className={`${dc.media.frame} aspect-[4/3] sm:aspect-auto sm:min-h-[220px]`}>
        {getEditablePostImage(post) ? (
          <img
            src={getEditablePostImage(post)}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText className="h-8 w-8 text-[var(--slot4-muted-text)]" />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-col justify-center p-1 sm:py-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">
          {String(index + 1).padStart(2, '0')} · {getEditableCategory(post)}
        </p>
        <h2 className="editable-display mt-4 line-clamp-3 text-3xl leading-[1] tracking-[-0.03em] text-[var(--slot4-page-text)] sm:text-4xl">
          {post.title}
        </h2>
        <p className="mt-5 line-clamp-3 text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">
          {getEditableExcerpt(post, 200)}
        </p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-page-text)] transition-all duration-500 group-hover:gap-2.5">
          Open reference <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
