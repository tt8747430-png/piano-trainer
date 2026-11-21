import { useTranslation } from 'react-i18next'
import type { PublicEntry } from '@/shared/api/public-library'
import { Avatar } from '@/shared/ui'
import { SavesCount, useAuthorName } from '@/widgets/song-preview'

/**
 * Who shared an item (D12): their picture and name where their profile is public, else a learner's
 * mark and "Piano Trainer learner"; then its saves (its stars are the rating's, under it).
 */
export function Byline({ entry }: { entry: PublicEntry }) {
  const { t } = useTranslation('songs')
  const author = useAuthorName(entry)
  return (
    <div className="flex items-center gap-3">
      <Avatar name={entry.authorName || null} picture={entry.authorAvatar} size="byline" />
      <span className="flex min-w-0 flex-col">
        <span className="text-sm text-muted-foreground">{t('explore.sharedBy')}</span>
        <span className="truncate font-semibold">{author}</span>
      </span>
      <span className="ml-auto flex shrink-0 items-center gap-3 text-sm font-semibold text-muted-foreground">
        <SavesCount count={entry.saves} />
      </span>
    </div>
  )
}

/** What its author wrote of it (Noji's About); nothing where they wrote nothing. */
export function About({ entry }: { entry: PublicEntry }) {
  const { t } = useTranslation('songs')
  const text = entry.meta.description
  if (!text) return null
  return (
    <section aria-labelledby="public-about" className="flex flex-col gap-1.5">
      <h2 id="public-about" className="font-sans text-sm font-semibold text-muted-foreground">
        {t(entry.kind === 'pattern' ? 'explore.aboutPattern' : 'explore.aboutSong')}
      </h2>
      <p className="text-pretty whitespace-pre-line">{text}</p>
    </section>
  )
}

/** Grey where the item will be, while it is read; said once, to a screen reader. */
export function ReadingItem({ label }: { label: string }) {
  return (
    <div aria-busy className="flex flex-col gap-5">
      <p role="status" className="sr-only">
        {label}
      </p>
      <div aria-hidden className="card flex flex-col gap-4 p-4">
        <span className="h-4 w-48 rounded-pill bg-muted motion-safe:animate-pulse" />
        <div className="flex items-center gap-3">
          <span className="size-11 rounded-pill bg-muted motion-safe:animate-pulse" />
          <span className="flex flex-col gap-2">
            <span className="h-3 w-16 rounded-pill bg-muted motion-safe:animate-pulse" />
            <span className="h-4 w-28 rounded-pill bg-muted motion-safe:animate-pulse" />
          </span>
        </div>
        <span className="h-8 w-40 rounded-pill bg-muted motion-safe:animate-pulse" />
      </div>
      <div aria-hidden className="h-48 rounded-card bg-muted motion-safe:animate-pulse" />
    </div>
  )
}

/**
 * An item's facts as Flat's info pane lists them: each name over its value in two columns
 * (Composer, Type, Published, the rest its page gives), then its tags as chips.
 */
export function Facts({
  facts,
  tags,
}: {
  facts: readonly { name: string; value: string; phoneOnly?: boolean }[]
  tags: readonly string[]
}) {
  return (
    <>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 text-subhead">
        {facts.map((fact) => (
          <div key={fact.name} className={fact.phoneOnly ? 'contents sm:hidden' : 'contents'}>
            <dt className="text-muted-foreground">{fact.name}</dt>
            <dd className="font-semibold">{fact.value}</dd>
          </div>
        ))}
      </dl>
      {tags.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li
              key={tag}
              className="flex h-8 items-center rounded-pill bg-muted px-3 text-sm font-semibold"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  )
}
