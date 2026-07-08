import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  Building2,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Layers,
  Link2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Tag,
  UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { taskThemeStyle } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(
  task: TaskKey,
  params: Promise<{ slug?: string; username?: string }>
) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({
  task,
  params,
}: {
  task: TaskKey
  params: Promise<{ slug?: string; username?: string }>
}) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const relatedTask = task === 'profile' ? 'pdf' : task
  const related = (await fetchTaskPosts(relatedTask, 8)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

/* -------------------------- Helpers ------------------------------------- */
const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const asDisplayText = (value: unknown) => {
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return ''
}
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getNestedValue = (source: Record<string, unknown>, path: string): unknown => {
  if (Object.prototype.hasOwnProperty.call(source, path)) return source[path]
  return path.split('.').reduce<unknown>((value, key) => {
    if (!value || typeof value !== 'object') return undefined
    return (value as Record<string, unknown>)[key]
  }, source)
}

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  const root = post as unknown as Record<string, unknown>
  for (const key of keys) {
    const value = asDisplayText(getNestedValue(content, key)) || asDisplayText(getNestedValue(root, key))
    if (value) return value
  }
  return ''
}

const formatFileSize = (value: string) => {
  const raw = value.trim()
  if (!raw) return ''
  if (/[a-z]/i.test(raw)) return raw
  const bytes = Number(raw.replace(/,/g, ''))
  if (!Number.isFinite(bytes) || bytes <= 0) return raw
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const size = bytes / 1024 ** index
  return `${Number(size.toFixed(size >= 10 || index === 0 ? 0 : 1))} ${units[index]}`
}

const formatPageCount = (value: string) => {
  const raw = value.trim()
  if (!raw) return ''
  const numeric = Number(raw.replace(/,/g, ''))
  if (!Number.isFinite(numeric)) return raw
  return String(Math.max(0, Math.floor(numeric)))
}
const countPdfPages = (buffer: Buffer) => {
  const text = buffer.toString('latin1')
  return (text.match(/\/Type\s*\/Page\b/g) || []).length
}

const fetchPdfMetadata = async (fileUrl: string) => {
  if (!/^https?:\/\//i.test(fileUrl)) return { pages: '', fileSize: '' }
  try {
    const response = await fetch(fileUrl, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6000),
    })
    if (!response.ok) return { pages: '', fileSize: '' }
    const contentLength = response.headers.get('content-length') || ''
    const buffer = Buffer.from(await response.arrayBuffer())
    const pages = countPdfPages(buffer)
    const fileSize = formatFileSize(contentLength || String(buffer.length))
    return {
      pages: pages > 0 ? String(pages) : '',
      fileSize,
    }
  } catch {
    return { pages: '', fileSize: '' }
  }
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']
    .map((key) => asText(content[key]))
    .filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return (
    asText(content.body) ||
    asText(content.description) ||
    asText(content.details) ||
    post.summary ||
    'Details will appear here once available.'
  )
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')

const linkifyMarkdown = (value: string) =>
  value.replace(
    /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi,
    (_m, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`
  )

const linkifyText = (value: string) =>
  linkifyMarkdown(value).replace(
    /(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi,
    (_m, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`
  )

const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_m, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })

const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"')
  )

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) =>
  post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

/* ---------------------- Root switch --------------------------------------- */
export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main
        style={taskThemeStyle(task)}
        className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]"
      >
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--tk-muted)]">
      {children}
    </span>
  )
}

function BackLink({ task, label }: { task: TaskKey; label?: string }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link
      href={taskConfig?.route || '/'}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-muted)] transition duration-300 hover:text-[var(--tk-text)]"
    >
      <ArrowLeft className="h-4 w-4" /> Back to {label || 'the library'}
    </Link>
  )
}

/* ================================================================
   PDF DETAIL â€” public Reference Library detail (document workspace)
   ================================================================ */
async function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const filename = getField(post, ['filename', 'fileName']) || `${post.slug || 'reference'}.pdf`
  const fieldPages = formatPageCount(
    getField(post, [
      'pages',
      'pageCount',
      'page_count',
      'pageNo',
      'page_no',
      'pageNumber',
      'page_number',
      'numberOfPages',
      'number_of_pages',
      'totalPages',
      'total_pages',
      'pdfPages',
      'pdf_pages',
      'documentPages',
      'document_pages',
      'metadata.pages',
      'metadata.pageCount',
      'pdf.pages',
      'document.pages',
      'file.pages',
    ])
  )
  const fieldFileSize = formatFileSize(
    getField(post, [
      'fileSize',
      'file_size',
      'size',
      'sizeBytes',
      'size_bytes',
      'fileSizeBytes',
      'file_size_bytes',
      'documentSize',
      'document_size',
      'pdfSize',
      'pdf_size',
      'bytes',
      'metadata.fileSize',
      'metadata.size',
      'pdf.fileSize',
      'pdf.size',
      'document.fileSize',
      'document.size',
      'file.fileSize',
      'file.size',
      'file.bytes',
    ])
  )
  const derivedPdfMetadata = !fieldPages || !fieldFileSize ? await fetchPdfMetadata(fileUrl) : { pages: '', fileSize: '' }
  const pages = fieldPages || derivedPdfMetadata.pages || '—'
  const fileSize = fieldFileSize || derivedPdfMetadata.fileSize || '—'
  const uploader = getField(post, ['author', 'uploader', 'contributor']) || SITE_CONFIG.name
  const updated = getField(post, ['updatedLabel', 'version']) || 'Latest revision'
  const category = categoryOf(post, 'General')
  const inside = getField(post, ['whatsInside', 'sections', 'toc']) || ''
  const insideList = inside
    ? inside.split(/\n|;|Â·|â€¢/).map((s) => s.trim()).filter(Boolean).slice(0, 6)
    : [
        'Executive summary and scope',
        'Core concepts and definitions',
        'Method notes and references',
        'Findings and takeaways',
        'Appendix and further reading',
      ]

  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <BackLink task="pdf" label="Reference Library" />

        <EditableReveal index={0} className="mt-10">
          {/* Label row: mono chips (reference document / PDF badge / category) */}
          <div className="editable-ui flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[var(--tk-text)]">
              <FileText className="h-3.5 w-3.5" /> Reference document
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tk-text)] px-3.5 py-1.5 text-[var(--tk-bg)]">
              PDF
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[var(--tk-muted)]">
              {category}
            </span>
          </div>

          {/* Very large title â€” reference-scale display h1 */}
          <h1 className="editable-display mt-10 max-w-5xl text-[3rem] leading-[0.9] tracking-[-0.05em] sm:text-[5.5rem] lg:text-[7rem]">
            {post.title}
          </h1>

          {/* Pull-quote-styled lead */}
          {leadText(post) ? (
            <blockquote className="mt-10 max-w-3xl border-l-2 border-[var(--tk-text)] pl-6 text-2xl leading-[1.25] tracking-[-0.02em] text-[var(--tk-text)] sm:text-3xl">
              {leadText(post)}
            </blockquote>
          ) : null}

          {/* Primary + secondary CTA */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            {fileUrl ? (
              <a
                href={fileUrl}
                download
                className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-7 py-3.5 text-sm font-semibold text-[var(--tk-bg)] transition-all duration-500 hover:-translate-y-[1px]"
              >
                Download PDF
                <Download className="h-4 w-4" />
              </a>
            ) : null}
            {fileUrl ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-7 py-3.5 text-sm font-semibold text-[var(--tk-text)] transition-all duration-500 hover:-translate-y-[1px] hover:bg-[var(--tk-text)] hover:text-[var(--tk-bg)]"
              >
                Open in new tab
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : null}
          </div>

          {/* Quick facts strip (NO date) */}
          <dl className="mt-14 grid gap-4 border-t border-[var(--tk-line)] pt-8 sm:grid-cols-4">
            {[
              ['Pages', pages],
              ['File size', fileSize],
              ['Format', 'PDF'],
              ['Updated', updated],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">{label}</dt>
                <dd className="editable-display mt-2 text-2xl leading-[1] tracking-[-0.02em]">{value}</dd>
              </div>
            ))}
          </dl>
        </EditableReveal>
      </section>

      {/* Two-column body + sticky sidebar */}
      <section className="border-t border-[var(--tk-line)]">
        <div className="mx-auto grid max-w-[var(--editable-container)] gap-12 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-12 lg:py-24">
          <article className="min-w-0">
            {/* Embedded PDF preview â€” the visual centerpiece */}
            {fileUrl ? (
              <EditableReveal index={0}>
                <div className="overflow-hidden rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                  <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] px-5 py-4">
                    <span className="editable-ui text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                      Reference preview
                    </span>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tk-text)] px-4 py-2 text-xs font-semibold text-[var(--tk-bg)] transition-all duration-500 hover:-translate-y-[1px]"
                    >
                      Open <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                  <iframe
                    src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    title={post.title}
                    className="h-[80vh] w-full bg-[var(--tk-raised)]"
                  />
                </div>
              </EditableReveal>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-[16px] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <div className="text-center">
                  <FileText className="mx-auto h-14 w-14 text-[var(--tk-muted)]/40" />
                  <p className="mt-4 text-sm text-[var(--tk-muted)]">Preview not available yet.</p>
                </div>
              </div>
            )}

            {/* Body */}
            <EditableReveal index={1} className="mt-14">
              <h2 className="editable-display text-[2.5rem] leading-[0.95] tracking-[-0.04em] sm:text-[3.5rem]">
                About this reference
              </h2>
              <BodyContent post={post} />
              <TagChips post={post} />
            </EditableReveal>

            {/* Repeated CTA callout mirroring reference pattern */}
            {fileUrl ? (
              <EditableReveal index={2} className="mt-14 rounded-[20px] bg-[var(--tk-text)] p-10 text-[var(--tk-bg)] sm:p-12">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div className="max-w-xl">
                    <p className="editable-ui text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">Take it with you</p>
                    <h3 className="editable-display mt-5 text-[2rem] leading-[0.95] tracking-[-0.04em] sm:text-[2.75rem]">
                      Download and keep this reference on hand.
                    </h3>
                  </div>
                  <a
                    href={fileUrl}
                    download
                    className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--tk-bg)] px-7 py-3.5 text-sm font-semibold text-[var(--tk-text)] transition-all duration-500 hover:-translate-y-[1px]"
                  >
                    Download PDF <Download className="h-4 w-4" />
                  </a>
                </div>
              </EditableReveal>
            ) : null}

            {/* Article-bottom ad â€” Reference Library detail */}
            <EditableReveal index={3} className="mt-14">
              <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel />
            </EditableReveal>
          </article>

          {/* Sticky sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-6">
              {/* Document identity block */}
              <div className="rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
                <div className="editable-display flex h-24 items-center justify-center rounded-[12px] bg-[var(--tk-text)] text-[3.5rem] leading-none tracking-[-0.05em] text-[var(--tk-bg)]">
                  PDF
                </div>
                <p className="editable-ui mt-5 text-[13px] font-medium text-[var(--tk-text)]">{filename}</p>
                <dl className="mt-5 space-y-3.5 border-t border-[var(--tk-line)] pt-5 text-sm">
                  {[
                    ['Category', category],
                    ['Pages', pages],
                    ['File size', fileSize],
                    ['Uploaded by', uploader],
                    ['Version', updated],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-baseline justify-between gap-4">
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--tk-muted)]">{label}</dt>
                      <dd className="text-right text-[13px] font-medium text-[var(--tk-text)]">{value}</dd>
                    </div>
                  ))}
                </dl>
                {fileUrl ? (
                  <a
                    href={fileUrl}
                    download
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-text)] px-5 py-3 text-sm font-semibold text-[var(--tk-bg)] transition-all duration-500 hover:-translate-y-[1px]"
                  >
                    Download
                    <Download className="h-4 w-4" />
                  </a>
                ) : null}
              </div>

              {/* What's inside */}
              <div className="rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
                <p className="editable-ui text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-muted)]">What's inside</p>
                <ul className="mt-4 space-y-3">
                  {insideList.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[14px] leading-[1.5] text-[var(--tk-text)]">
                      <Layers className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-muted)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related documents strip â€” glyph-based tiles, no hero photography */}
      {related.length ? (
        <section className="border-t border-[var(--tk-line)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-6 py-20 sm:px-8 sm:py-24 lg:px-12">
            <EditableReveal index={0} className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="editable-ui text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-muted)]">On the same shelf</p>
                <h2 className="editable-display mt-4 text-[2.5rem] leading-[0.95] tracking-[-0.04em] sm:text-[3.5rem]">
                  Related references
                </h2>
              </div>
              <Link href="/pdf" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--tk-text)] transition-all duration-500 hover:gap-2.5">
                Browse the library <ArrowUpRight className="h-4 w-4" />
              </Link>
            </EditableReveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item, i) => {
                const size = getField(item, ['fileSize', 'size']) || 'PDF'
                return (
                  <EditableReveal key={item.id || item.slug} index={i}>
                    <Link
                      href={`/pdf/${item.slug}`}
                      className="group block h-full rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 transition-all duration-500 hover:-translate-y-1"
                    >
                      <div className="editable-display flex h-28 items-center justify-center rounded-[10px] bg-[var(--tk-raised)] text-4xl tracking-[-0.03em] text-[var(--tk-text)]">
                        PDF
                      </div>
                      <h3 className="editable-display mt-5 line-clamp-3 text-xl leading-[1.1] tracking-[-0.02em]">
                        {item.title}
                      </h3>
                      <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--tk-muted)]">
                        {size}
                      </span>
                    </Link>
                  </EditableReveal>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

/* ================================================================
   PROFILE DETAIL â€” enhanced Contributor page, direct-URL only
   No links out to other profiles anywhere.
   ================================================================ */
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const avatar = images[0]
  const role = getField(post, ['role', 'designation', 'company', 'title'])
  const location = getField(post, ['location', 'address', 'city'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const links = [
    ['website', 'Website', website, Globe2],
    ['email', 'Email', email, Mail],
    ['phone', 'Phone', phone, Phone],
    ['location', 'Location', location, MapPin],
  ] as const

  const verified = [
    { icon: CheckCircle2, label: 'Verified contributor' },
    { icon: ShieldCheck, label: 'Reviewed submissions' },
    { icon: Bookmark, label: 'Curates active references' },
  ]

  const mapSrc = mapSrcFor(post)

  return (
    <>
      {/* Hero band */}
      <section className="border-b border-[var(--tk-line)] bg-[var(--tk-surface)]">
        <div className="mx-auto max-w-[var(--editable-container)] px-6 py-16 sm:px-8 sm:py-24 lg:px-12">
          <BackLink task="profile" label="library" />
          <EditableReveal index={0} className="mt-12 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
            <div className="flex h-52 w-52 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
              {avatar ? (
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-24 w-24 text-[var(--tk-muted)]" />
              )}
            </div>
            <div className="min-w-0">
              <Kicker>Contributor</Kicker>
              <h1 className="editable-display mt-6 text-[3rem] leading-[0.9] tracking-[-0.05em] sm:text-[5rem] lg:text-[6rem]">
                {post.title}
              </h1>
              {role || location ? (
                <p className="mt-5 text-lg text-[var(--tk-muted)]">
                  {[role, location].filter(Boolean).join(' Â· ')}
                </p>
              ) : null}
              {leadText(post) ? (
                <p className="mt-6 max-w-3xl text-lg leading-[1.6] text-[var(--tk-text)] sm:text-xl">
                  {leadText(post)}
                </p>
              ) : null}
            </div>
          </EditableReveal>

          {/* Quick-facts strip */}
          <EditableReveal
            index={1}
            className="mt-14 grid grid-cols-2 gap-4 border-t border-[var(--tk-line)] pt-8 sm:grid-cols-3"
          >
            {[
              ['References', String(related.length || getImages(post).length || 'â€”')],
              ['Status', 'Verified'],
              ['Based in', location || 'â€”'],
              
              
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">{label}</p>
                <p className="editable-display mt-2 text-xl leading-[1.05] tracking-[-0.02em] sm:text-2xl">{value}</p>
              </div>
            ))}
          </EditableReveal>
        </div>
      </section>

      {/* Body + sticky sidebar */}
      <section>
        <div className="mx-auto grid max-w-[var(--editable-container)] gap-12 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-12 lg:py-24">
          <article className="min-w-0">
            <EditableReveal index={0}>
              <h2 className="editable-display text-[2.5rem] leading-[0.95] tracking-[-0.04em] sm:text-[3.5rem]">
                Biography
              </h2>
              <BodyContent post={post} />
              <TagChips post={post} />
            </EditableReveal>

            {/* Their references â€” links INTO the public library, never to other profiles */}
            {related.length ? (
              <EditableReveal index={1} className="mt-16">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="editable-ui text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                      Their contributions
                    </p>
                    <h3 className="editable-display mt-3 text-[2rem] leading-[1] tracking-[-0.03em]">
                      References on the library shelf
                    </h3>
                  </div>
                  <Link
                    href="/pdf"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--tk-text)] transition-all duration-500 hover:gap-2.5"
                  >
                    See all <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  {related.map((item, i) => (
                    <Link
                      key={item.id || item.slug}
                      href={`/pdf/${item.slug}`}
                      className="group flex items-start gap-5 rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-5 transition-all duration-500 hover:-translate-y-1"
                    >
                      <div className="editable-display flex h-16 w-16 shrink-0 items-center justify-center rounded-[10px] bg-[var(--tk-text)] text-lg tracking-[-0.03em] text-[var(--tk-bg)]">
                        PDF
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">
                          {String(i + 1).padStart(2, '0')} Â· Reference
                        </p>
                        <h4 className="editable-display mt-2 line-clamp-2 text-lg leading-[1.15] tracking-[-0.02em]">
                          {item.title}
                        </h4>
                      </div>
                      <ArrowUpRight className="h-5 w-5 shrink-0 opacity-40 transition duration-500 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </EditableReveal>
            ) : null}

            {/* Inline map if address/lat/lng */}
            {mapSrc ? (
              <EditableReveal index={2} className="mt-14">
                <div className="overflow-hidden rounded-[16px] border border-[var(--tk-line)]">
                  <iframe src={mapSrc} title="Map" loading="lazy" className="h-80 w-full border-0" />
                </div>
              </EditableReveal>
            ) : null}
          </article>

          {/* Sticky sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-6">
              {/* Contact card */}
              <div className="rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
                <p className="editable-ui text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-muted)]">Get in touch</p>
                <ul className="mt-5 space-y-3">
                  {links.filter(([, , v]) => Boolean(v)).map(([key, label, value, Icon]) => {
                    const href =
                      key === 'email'
                        ? `mailto:${value}`
                        : key === 'phone'
                        ? `tel:${value}`
                        : key === 'website'
                        ? safeUrl(value as string)
                        : `https://maps.google.com/maps?q=${encodeURIComponent(value as string)}`
                    return (
                      <li key={key as string}>
                        <a
                          href={href}
                          target={key === 'email' || key === 'phone' ? undefined : '_blank'}
                          rel={key === 'email' || key === 'phone' ? undefined : 'noopener noreferrer'}
                          className="group flex items-start gap-3 rounded-xl border border-transparent px-3 py-2.5 transition duration-500 hover:border-[var(--tk-line)]"
                        >
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--tk-raised)] text-[var(--tk-text)]">
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--tk-muted)]">{label}</p>
                            <p className="truncate text-[14px] font-medium text-[var(--tk-text)]">{value}</p>
                          </div>
                          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 opacity-40 transition duration-500 group-hover:opacity-100" />
                        </a>
                      </li>
                    )
                  })}
                </ul>
                {website ? (
                  <a
                    href={safeUrl(website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-text)] px-5 py-3 text-sm font-semibold text-[var(--tk-bg)] transition-all duration-500 hover:-translate-y-[1px]"
                  >
                    Visit website <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </div>

              {/* Trust panel */}
              <div className="rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
                <p className="editable-ui text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-muted)]">Trust</p>
                <ul className="mt-5 space-y-4">
                  {verified.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-3 text-[14px] font-medium text-[var(--tk-text)]">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--tk-text)] text-[var(--tk-bg)]">
                        <Icon className="h-4 w-4" />
                      </span>
                      {label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sidebar ad â€” only ad on the profile detail */}
              <div>
                <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

/* ================================================================
   Remaining task variants (non-public, kept functional)
   ================================================================ */

function ArticleDetail({
  post,
  related,
  comments,
}: {
  post: SitePost
  related: SitePost[]
  comments: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        <BackLink task="article" label="the library" />
        <p className="mt-12 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-muted)]">
          {categoryOf(post, 'Article')}
        </p>
        <h1 className="editable-display mt-6 text-[3rem] leading-[0.9] tracking-[-0.05em] sm:text-[4.5rem]">
          {post.title}
        </h1>
        {images[0] ? (
          <img src={images[0]} alt="" className="mt-12 aspect-[16/9] w-full rounded-[16px] border border-[var(--tk-line)] object-cover" />
        ) : null}
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

function ListingDetail({ post }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-6 py-16 sm:px-8 sm:py-24 lg:px-12">
      <BackLink task="listing" />
      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="min-w-0">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
              {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-12 w-12 text-[var(--tk-muted)]" />}
            </div>
            <div className="min-w-0">
              <Kicker>Directory entry</Kicker>
              <h1 className="editable-display mt-4 text-[2.5rem] leading-[0.95] tracking-[-0.04em] sm:text-[3.5rem]">
                {post.title}
              </h1>
            </div>
          </div>
          <BodyContent post={post} />
        </article>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
          <ContactAction website={website} phone={phone} email={email} />
        </aside>
      </div>
    </section>
  )
}

function ClassifiedDetail({ post }: { post: SitePost; related: SitePost[] }) {
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-6 py-16 sm:px-8 sm:py-24 lg:px-12">
      <BackLink task="classified" />
      <Kicker>Notice</Kicker>
      <h1 className="editable-display mt-4 text-[3rem] leading-[0.95] tracking-[-0.04em] sm:text-[4rem]">{post.title}</h1>
      <BodyContent post={post} />
    </section>
  )
}

function ImageDetail({ post }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-6 py-16 sm:px-8 sm:py-24 lg:px-12">
      <BackLink task="image" />
      <Kicker>Visual</Kicker>
      <h1 className="editable-display mt-4 text-[3rem] leading-[0.95] tracking-[-0.04em] sm:text-[4rem]">{post.title}</h1>
      <div className="mt-10 columns-1 gap-5 [column-fill:_balance] sm:columns-2">
        {images.map((image, index) => (
          <figure key={`${image}-${index}`} className="mb-5 break-inside-avoid overflow-hidden rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
            <img src={image} alt="" className="w-full object-cover" />
          </figure>
        ))}
      </div>
      <BodyContent post={post} />
    </section>
  )
}

function BookmarkDetail({ post }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <BackLink task="sbm" />
      <div className="mt-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--tk-raised)] text-[var(--tk-text)]">
        <Link2 className="h-7 w-7" />
      </div>
      <div className="mt-6"><Kicker>Saved link</Kicker></div>
      <h1 className="editable-display mt-4 text-[3rem] leading-[0.95] tracking-[-0.04em] sm:text-[4rem]">{post.title}</h1>
      {website ? (
        <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-3 text-sm font-semibold text-[var(--tk-bg)] transition-all duration-500 hover:-translate-y-[1px]">
          Open resource <ExternalLink className="h-4 w-4" />
        </Link>
      ) : null}
      <BodyContent post={post} />
    </article>
  )
}

/* ---------------------- Shared building blocks --------------------------- */
function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-10 max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-[1.7]' : 'text-[1.0625rem] leading-[1.75]'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function TagChips({ post }: { post: SitePost }) {
  const tags = Array.isArray(post.tags) ? post.tags.slice(0, 8) : []
  if (!tags.length) return null
  return (
    <div className="mt-10 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--tk-muted)]"
        >
          <Tag className="h-3 w-3" /> {tag}
        </span>
      ))}
    </div>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
      <div className="flex items-center gap-2 p-4 text-sm font-semibold">
        <MapPin className="h-4 w-4" /> {label || 'Map location'}
      </div>
      <iframe src={src} title="Map" loading="lazy" className="h-72 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-muted)]">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {website ? (
          <a href={safeUrl(website)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-4 py-2.5 text-sm font-semibold text-[var(--tk-bg)] transition duration-500 hover:-translate-y-[1px]">
            Website <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
        {phone ? (
          <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-2.5 text-sm font-semibold transition duration-500 hover:border-[var(--tk-text)]">
            <Phone className="h-4 w-4" /> Call
          </a>
        ) : null}
        {email ? (
          <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-2.5 text-sm font-semibold transition duration-500 hover:border-[var(--tk-text)]">
            <Mail className="h-4 w-4" /> Email
          </a>
        ) : null}
      </div>
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-6 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="flex items-center justify-between">
          <h2 className="editable-display text-[2rem] leading-[0.95] tracking-[-0.03em] sm:text-[2.75rem]">
            More from the library
          </h2>
          <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-semibold">
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => {
            const href = `${taskConfig?.route || `/${task}`}/${item.slug}`
            return (
              <Link
                key={item.id || item.slug}
                href={href}
                className="group block h-full rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-5 transition duration-500 hover:-translate-y-1"
              >
                <h3 className="editable-display line-clamp-3 text-lg leading-[1.15] tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-3 line-clamp-2 text-sm leading-[1.6] text-[var(--tk-muted)]">{stripHtml(summaryText(item))}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

