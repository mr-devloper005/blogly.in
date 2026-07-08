import Link from 'next/link'
import {
  ArrowUpRight,
  ChevronDown,
  FileText,
  Search,
  UserRound,
  BookOpen,
} from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getSummary = (post: SitePost) =>
  stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
  listing: 'grid gap-6 xl:grid-cols-2',
  classified: 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-6 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

const cardBase =
  'group block overflow-hidden rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition-all duration-500 hover:-translate-y-1'

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return (
    <TaskArchiveView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath || taskConfig?.route || `/${task}`}
    />
  )
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const categoryLabel =
    category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  return (
    <EditableSiteShell>
      <main
        style={taskThemeStyle(task)}
        className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]"
      >
        {/* Editorial hero header */}
        <header className="border-b border-[var(--tk-line)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-6 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
            <EditableReveal index={0}>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-text)]">
                  <BookOpen className="h-3.5 w-3.5" />
                  {theme.kicker}
                </span>
                <span className="h-1 w-1 rounded-full bg-[var(--tk-muted)] opacity-50" />
                <span className="text-xs font-medium tracking-[0.18em] text-[var(--tk-muted)]">
                  {posts.length} {posts.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>
              <h1 className="editable-display mt-8 max-w-4xl text-[3rem] leading-[0.9] tracking-[-0.05em] sm:text-[5rem] lg:text-[6.5rem]">
                {voice?.headline || theme.note}
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-[var(--tk-muted)] sm:text-xl">
                {voice?.description || theme.note}
              </p>
            </EditableReveal>

            {/* Header ad — Reference Library archive */}
            {task === 'pdf' ? (
              <EditableReveal index={1} className="mt-14">
                <Ads slot="header" size={pickRandom(getSlotSizes('header'))} showLabel />
              </EditableReveal>
            ) : null}

            {/* Filter row */}
            <EditableReveal
              index={2}
              className="mt-16 flex flex-col gap-4 border-t border-[var(--tk-line)] pt-8 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm text-[var(--tk-muted)]">
                Showing <span className="font-semibold text-[var(--tk-text)]">{categoryLabel}</span>
              </p>
              <form action={basePath} className="flex items-center gap-3">
                <div className="relative">
                  <select
                    name="category"
                    defaultValue={category}
                    className="h-11 appearance-none rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] pl-5 pr-11 text-sm font-medium text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-text)]"
                    aria-label="Filter category"
                  >
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                </div>
                <button className="inline-flex h-11 items-center rounded-full bg-[var(--tk-text)] px-6 text-sm font-semibold text-[var(--tk-bg)] transition-all duration-500 hover:-translate-y-[1px]">
                  Apply
                </button>
              </form>
            </EditableReveal>
          </div>
        </header>

        <section className="mx-auto max-w-[var(--editable-container)] px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
          {posts.length ? (
            <div className={taskGrid[task]}>
              {posts.map((post, index) => (
                <EditableReveal key={post.id || post.slug} index={index}>
                  <ArchivePostCard post={post} task={task} basePath={basePath} index={index} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-[16px] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] px-8 py-20 text-center">
              <Search className="mx-auto h-8 w-8 text-[var(--tk-muted)]" />
              <h2 className="editable-display mt-6 text-3xl tracking-[-0.03em]">Shelf is empty for now</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--tk-muted)]">
                Try another category, or come back once more entries are added.
              </p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-20 flex items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? (
                <Link
                  href={pageHref(basePath, category, page - 1)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-6 py-3 font-medium transition-all duration-500 hover:-translate-y-[1px] hover:bg-[var(--tk-text)] hover:text-[var(--tk-bg)]"
                >
                  Previous
                </Link>
              ) : null}
              <span className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-6 py-3 font-medium text-[var(--tk-muted)]">
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link
                  href={pageHref(basePath, category, page + 1)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-6 py-3 font-medium transition-all duration-500 hover:-translate-y-[1px] hover:bg-[var(--tk-text)] hover:text-[var(--tk-bg)]"
                >
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({
  post,
  task,
  basePath,
  index,
}: {
  post: SitePost
  task: TaskKey
  basePath: string
  index: number
}) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} index={index} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

/* --- PDF (Reference Library) — the public, promoted variant --- */
function PdfArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const category = getCategory(post, 'Reference')
  const image = getImages(post)[0]
  const isPlaceholder = !image || image.includes('placeholder')
  return (
    <Link href={href} className={cardBase}>
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--tk-raised)]">
        {!isPlaceholder ? (
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FileText className="h-16 w-16 text-[var(--tk-muted)]/40" />
          </div>
        )}
        <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-[var(--tk-bg)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--tk-text)]">
          {category}
        </span>
      </div>
      <div className="p-7 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">
          {String(index + 1).padStart(2, '0')} · Reference document
        </p>
        <h2 className="editable-display mt-4 line-clamp-3 text-[1.75rem] leading-[1.05] tracking-[-0.03em]">
          {post.title}
        </h2>
        <p className="mt-4 line-clamp-2 text-[15px] leading-[1.65] text-[var(--tk-muted)]">{getSummary(post)}</p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-500 group-hover:gap-2.5">
          Open reference <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

/* --- Article variant (kept, not surfaced publicly) --- */
function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  return (
    <Link href={href} className={cardBase}>
      <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-[900ms] group-hover:scale-[1.03]" />
      </div>
      <div className="p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">
          {String(index + 1).padStart(2, '0')} · {category}
        </p>
        <h2 className="editable-display mt-4 text-2xl leading-[1.05] tracking-[-0.03em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-[15px] leading-[1.65] text-[var(--tk-muted)]">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-7`}>
      <h2 className="editable-display text-xl leading-[1.05] tracking-[-0.02em]">{post.title}</h2>
      <p className="mt-3 line-clamp-2 text-sm text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-7`}>
      <p className="editable-display text-3xl tracking-[-0.03em]">{price || 'Open'}</p>
      <h2 className="editable-display mt-4 text-xl leading-[1.05] tracking-[-0.02em]">{post.title}</h2>
      <p className="mt-3 line-clamp-2 text-sm text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-6 block break-inside-avoid overflow-hidden rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1">
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-[900ms] group-hover:scale-[1.03]" />
      </div>
      <div className="p-5">
        <h2 className="editable-display line-clamp-2 text-lg leading-[1.15] tracking-[-0.02em]">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-7`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">
        {String(index + 1).padStart(2, '0')}
      </p>
      <h2 className="editable-display mt-3 text-xl leading-[1.05] tracking-[-0.02em]">{post.title}</h2>
      <p className="mt-3 line-clamp-2 text-sm text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}

/* Profile variant — kept in code (byte-identical signature) but NEVER surfaced
   publicly. Only reachable if you already have the archive URL, which the shell
   itself does not link to. */
function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  return (
    <Link href={href} className={`${cardBase} flex flex-col items-center p-8 text-center`}>
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[var(--tk-muted)]" />}
      </div>
      <h2 className="editable-display mt-6 text-lg tracking-[-0.02em]">{post.title}</h2>
    </Link>
  )
}

