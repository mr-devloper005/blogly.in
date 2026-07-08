import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search, FileText } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) =>
  typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const compactRaw = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images)
    ? (content.images.find((item) => typeof item === 'string') as string | undefined)
    : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => {
  const raw = post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''
  return stripHtml(raw).replace(/\s+/g, ' ').trim()
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  // Never surface profile results in the public search UI.
  if (derivedTask === 'profile') return false
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [
    post.title,
    post.summary,
    content.description,
    content.body,
    content.excerpt,
    content.category,
    Array.isArray(post.tags) ? post.tags.join(' ') : '',
  ].some((value) => compactText(value).includes(query))
}

// Only surface Reference Library (pdf) as a filter option publicly. Other
// tasks stay searchable but aren't offered as filter chips.
const enabledPublicTasks = () =>
  SITE_CONFIG.tasks.filter((item) => item.enabled && item.key === 'pdf')

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'pdf'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] transition-all duration-500 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
        {image ? (
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FileText className="h-14 w-14 text-[var(--slot4-muted-text)]/40" />
          </div>
        )}
        <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-[var(--slot4-page-bg)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-page-text)]">
          Reference · {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="editable-display line-clamp-3 text-2xl leading-[1.05] tracking-[-0.03em]">{post.title}</h2>
        {summary ? (
          <p className="mt-4 line-clamp-3 text-sm leading-[1.65] text-[var(--slot4-muted-text)]">{summary}</p>
        ) : null}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-[var(--slot4-page-text)] transition-all duration-500 group-hover:gap-2.5">
          Open reference <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined
  )
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
    ? []
    : SITE_CONFIG.tasks
        .filter((item) => item.enabled && item.key !== 'profile')
        .flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const publicTasks = enabledPublicTasks()

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* Hero + search form */}
        <section className={`${dc.shell.section} pt-16 pb-14 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24`}>
          <EditableReveal index={0}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
              {pagesContent.search.hero.badge}
            </p>
            <h1 className="editable-display mt-8 text-[3rem] leading-[0.9] tracking-[-0.05em] sm:text-[5rem] lg:text-[6.5rem]">
              {pagesContent.search.hero.title}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-[var(--slot4-muted-text)] sm:text-xl">
              {pagesContent.search.hero.description}
            </p>
          </EditableReveal>

          <EditableReveal index={1} className="mt-12">
            <form action="/search" className="grid gap-3 sm:grid-cols-[1.4fr_1fr_1fr_auto]">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] px-5 py-3.5">
                <Search className="h-5 w-5 text-[var(--slot4-muted-text)]" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder={pagesContent.search.hero.placeholder}
                  className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-[var(--slot4-muted-text)]"
                />
              </label>
              <label className="flex items-center gap-3 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] px-5 py-3.5">
                <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                <input
                  name="category"
                  defaultValue={category}
                  placeholder="Collection"
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--slot4-muted-text)]"
                />
              </label>
              <select
                name="task"
                defaultValue={task}
                className="rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] px-5 py-3.5 text-sm font-medium outline-none"
              >
                <option value="">All types</option>
                {publicTasks.map((item) => (
                  <option key={item.key} value={item.key}>
                    Reference Library
                  </option>
                ))}
              </select>
              <button
                className={`${dc.button.primary} sm:justify-self-end`}
                type="submit"
              >
                Search
              </button>
            </form>
          </EditableReveal>
        </section>

        {/* Results */}
        <section className={`${dc.shell.section} pb-20 sm:pb-24 lg:pb-32`}>
          <EditableReveal index={0} className="flex flex-wrap items-end justify-between gap-4 border-t border-[var(--editable-border)] pt-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">
                {results.length} results
              </p>
              <h2 className="editable-display mt-3 text-3xl tracking-[-0.03em] sm:text-4xl">
                {query ? `Results for "${query}"` : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <Link href="/pdf" className={dc.button.secondary}>
              Browse the library <ArrowUpRight className="h-4 w-4" />
            </Link>
          </EditableReveal>

          {results.length ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((post, index) => (
                <EditableReveal key={post.id || post.slug} index={index}>
                  <SearchResultCard post={post} index={index} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-[16px] border border-dashed border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] p-14 text-center">
              <p className="editable-display text-3xl tracking-[-0.03em]">Nothing matched.</p>
              <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">
                Try a different keyword or clear the collection filter.
              </p>
            </div>
          )}

          {/* Footer ad on search */}
          <div className="mt-16">
            <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
