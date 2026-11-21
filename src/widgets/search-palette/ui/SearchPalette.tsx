import { useRouter } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import {
  useDeferredValue,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from 'zustand'
import { selectRecentSearches } from '@/entities/views'
import { forgetSearches, rememberSearch } from '@/features/remember-view'
import { pieceById } from '@/entities/piece'
import { selectLearned, useProgress } from '@/entities/progress'
import { stepLink } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { cn, LAPTOP, useMediaQuery, type Up } from '@/shared/lib'
import { printedSymbol } from '@/shared/lib/music'
import { LessonIcon, OpensMark, PAGE_TILES, Said, Sheet, SheetContent, TileMark } from '@/shared/ui'
import { Kbd } from '@/shared/ui/primitives/kbd'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/ui/primitives/dialog'
import { searchIndex, typedEntry, type IndexEntry, type IndexTarget } from '../model/index-entries'
import { paletteGroups } from '../model/palette-groups'
import { targetLink } from '../model/target-link'
import { useIndex, useIndexNames } from '../model/use-index'
import { continuePlace, continueStep, useStepTitle } from '@/widgets/curriculum'
import { PieceMark } from '@/widgets/piece-cover'
import { PRACTICE_GROUPS, PRACTICE_PAGES, type PracticePageId } from '@/widgets/practice-pages'

/** One row of the palette: a result, a suggested place, or Continue; each a link. */
interface Option {
  readonly id: string
  readonly title: string
  readonly detail?: string | undefined
  readonly archived?: boolean
  readonly link: Up
  /** What it is, at the row's head (the board's SROW9 and SUG): its page's tile, a song's mark. */
  readonly picture: ReactNode
}

interface Section {
  readonly heading: string
  readonly options: readonly Option[]
}

/** What the palette suggests before anything is typed (canvas, AppLayers): Continue, then these. */
const SUGGESTED_PAGES = ['chords', 'metronome'] as const

/** A lesson's tile, as Learn's rows wear one until it is learned: a white circle, its book in ink. */
const LESSON_TILE = (
  <span
    aria-hidden
    className="grid size-11 shrink-0 place-items-center rounded-pill bg-card text-foreground ring-1 ring-border ring-inset"
  >
    <LessonIcon className="size-5" />
  </span>
)

const pageTile = (page: PracticePageId) => <TileMark large {...PRACTICE_PAGES[page].tile} />

/** The picture at a result's head: a song's mark, a lesson's circle, else the tile of the page it opens on. */
function pictureOf(target: IndexTarget): ReactNode {
  switch (target.opens) {
    case 'piece':
      return <PieceMark entry={target.entry} />
    case 'folder':
      return <TileMark large {...PAGE_TILES.folder} />
    case 'lesson':
    case 'course-lesson':
      return LESSON_TILE
    case 'course':
      return <TileMark large {...PAGE_TILES.course} />
    case 'page':
      return pageTile(target.page)
    case 'chord':
      return pageTile('chords')
    case 'scale':
      return pageTile('scales')
    case 'progression':
    case 'typed-line':
      return pageTile('progressions')
    case 'pattern':
      return pageTile('accompaniment')
    case 'exercise':
      return pageTile('exercises')
  }
}

const result = (entry: IndexEntry): Option => ({
  id: entry.id,
  title: entry.kind === 'chords' ? printedSymbol(entry.title) : entry.title,
  detail: entry.detail,
  archived: entry.target.opens === 'piece' && entry.target.archived,
  link: targetLink(entry.target).link,
  picture: pictureOf(entry.target),
})

/**
 * The Search palette (rule 27, canvas AppLayers): on a phone the app's bottom sheet, on a laptop a
 * panel over the screen. A field, and under it, until something is typed, the recent searches as
 * chips and three suggestions (Continue, Chords, Metronome); then what it finds, grouped Practice ·
 * Songs · Folders · Lessons, each group a card of rows. Nothing found says so and clears. The arrow
 * keys move through the rows, Enter opens one (one entry pushed from the screen underneath, so Back
 * returns there), Escape closes it with nothing written to the history; a laptop says so at its foot.
 */
export function SearchPalette({ initial, onClose }: { initial: string; onClose: () => void }) {
  const { t } = useTranslation(['search', 'learn', 'practice'])
  const locale = useLocale()
  const router = useRouter()
  const { views } = router.options.context
  const wide = useMediaQuery(LAPTOP)
  const recent = useStore(views, selectRecentSearches)
  const learned = useProgress(selectLearned)
  const stepTitle = useStepTitle()
  const [query, setQuery] = useState(initial)
  const wanted = useDeferredValue(query)
  const names = useIndexNames()
  const index = useIndex(names)
  const typing = wanted.trim() !== ''
  const sections = useMemo((): Section[] => {
    if (!typing) {
      const next = continueStep(learned)
      const piece = next?.step.kind === 'piece' ? pieceById(next.step.pieceId) : undefined
      const link = !next
        ? undefined
        : next.step.kind === 'piece'
          ? piece && targetLink({ opens: 'piece', entry: piece, archived: false }).link
          : stepLink(next.step)
      const place = next && continuePlace(next, learned)
      const goOn: Option[] =
        next && link && place
          ? [
              {
                id: 'continue',
                title: stepTitle(next.step).primary,
                // Where it stands, as Learn's Continue says it: Continue · Lesson 1 of 11.
                detail: `${t('learn:continue')} · ${
                  'n' in place
                    ? t('learn:lessonOf', { n: place.n, count: place.count })
                    : localText(('course' in next ? next.course : next.journey).title, locale)
                }`,
                link,
                picture:
                  next.step.kind === 'piece' && piece ? <PieceMark entry={piece} /> : LESSON_TILE,
              },
            ]
          : []
      // A place says where it lives in the app: Practice · Theory.
      const pages = SUGGESTED_PAGES.flatMap((page) =>
        index.filter((entry) => entry.target.opens === 'page' && entry.target.page === page),
      ).map((entry) => {
        const page = entry.target.opens === 'page' ? entry.target.page : undefined
        const group = PRACTICE_GROUPS.find((each) => page && each.pages.some((one) => one === page))
        return {
          ...result(entry),
          detail: group
            ? `${t('groups.practice')} · ${t(`practice:groups.${group.id}`)}`
            : undefined,
        }
      })
      return [{ heading: t('suggested'), options: [...goOn, ...pages] }]
    }
    return paletteGroups(searchIndex(index, wanted, typedEntry(wanted, names))).map((group) => ({
      heading: t(`groups.${group.id}`),
      options: group.entries.map(result),
    }))
  }, [typing, wanted, learned, stepTitle, index, names, t, locale])
  const options = sections.flatMap((section) => section.options)
  const [active, setActive] = useState(0)
  const at = Math.min(active, options.length - 1)
  const listId = useId()
  const fieldRef = useRef<HTMLInputElement>(null)
  const optionId = (option: Option) => `${listId}-${option.id}`
  const ask = (text: string) => {
    setQuery(text)
    setActive(0)
    fieldRef.current?.focus()
  }

  const choose = (option: Option) => {
    if (typing) rememberSearch(views, query)
    onClose()
    void router.navigate(option.link)
  }
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key]
    if (step !== undefined && options.length > 0) {
      event.preventDefault()
      setActive((at + step + options.length) % options.length)
    } else if (event.key === 'Enter' && options[at]) {
      event.preventDefault()
      choose(options[at])
    }
  }
  const current = options[at]

  const content = (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <label className="flex h-12 shrink-0 items-center gap-2 rounded-control bg-card pr-1 pl-3 text-muted-foreground ring-1 ring-border focus-within:ring-foreground/35">
        <Search aria-hidden className="size-4.5 shrink-0" />
        <input
          ref={fieldRef}
          role="combobox"
          aria-label={t('field')}
          aria-expanded
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={current ? optionId(current) : undefined}
          placeholder={t('placeholder')}
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          onKeyDown={onKeyDown}
          className="h-full min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
        />
        {query === '' ? null : (
          <button
            type="button"
            aria-label={t('clear')}
            onClick={() => ask('')}
            className="grid size-11 shrink-0 place-items-center rounded-control hover:text-foreground"
          >
            <X aria-hidden className="size-4.5" />
          </button>
        )}
      </label>
      <div className="-mx-4 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 scrollbar-none">
        {!typing && recent.length > 0 ? (
          <section className="mb-2 flex flex-col gap-2 pt-2">
            <div className="-my-2.5 flex items-center justify-between">
              <Caps>{t('recent')}</Caps>
              <button
                type="button"
                className="h-11 rounded-control px-1 text-subhead font-semibold text-link focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                onClick={() => forgetSearches(views)}
              >
                {t('clearRecent')}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recent.map((each) => (
                <Chip key={each} onClick={() => ask(each)}>
                  {each}
                </Chip>
              ))}
            </div>
          </section>
        ) : null}
        <div id={listId} role="listbox" aria-label={t('title')} className="flex flex-col gap-3">
          {sections.map((section) => (
            <PaletteSection
              key={section.heading}
              section={section}
              active={wide ? current : undefined}
              optionId={optionId}
              onHover={(option) => setActive(options.indexOf(option))}
              onChoose={choose}
            />
          ))}
        </div>
        {typing && options.length === 0 ? (
          <Said
            icon={Search}
            title={t('none', { query: wanted.trim() })}
            description={t('noneHint')}
            quiet
            action={
              <button type="button" onClick={() => ask('')}>
                {t('clear')}
              </button>
            }
          />
        ) : null}
      </div>
      {wide ? (
        <div
          aria-label={t('keys.label')}
          className="-mx-4 flex shrink-0 gap-4 px-5 pt-3 text-footnote text-muted-foreground shadow-[inset_0_1px_0_var(--color-muted)]"
        >
          <span className="flex items-center gap-1">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            <span className="ms-0.5">{t('keys.move')}</span>
          </span>
          <span className="flex items-center gap-1">
            <Kbd>↵</Kbd>
            <span className="ms-0.5">{t('keys.open')}</span>
          </span>
          <span className="flex items-center gap-1">
            <Kbd>Esc</Kbd>
            <span className="ms-0.5">{t('keys.close')}</span>
          </span>
        </div>
      ) : null}
    </div>
  )

  if (!wide)
    return (
      <Sheet open onOpenChange={(open) => (open ? undefined : onClose())}>
        <SheetContent title={t('title')} tall initialFocus={() => fieldRef.current ?? true}>
          {content}
        </SheetContent>
      </Sheet>
    )
  return (
    <Dialog open onOpenChange={(open) => (open ? undefined : onClose())}>
      <DialogContent
        showCloseButton={false}
        // The field has the focus as it opens: the palette is typed into.
        initialFocus={fieldRef}
        className="top-24 flex h-[min(30.5rem,calc(100dvh-8rem))] -translate-y-0 flex-col overflow-hidden rounded-sheet bg-background p-4 shadow-[0_0_0_1px_var(--color-border),var(--elevation-2)] ring-0 sm:max-w-160"
      >
        <DialogTitle className="sr-only">{t('title')}</DialogTitle>
        <DialogDescription className="sr-only">{t('hint')}</DialogDescription>
        {content}
      </DialogContent>
    </Dialog>
  )
}

/** A group's name over its card, in small capitals as every group's in the app. */
function Caps({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="px-4 caps">
      {children}
    </p>
  )
}

/** A recent search, or Clear search: a pill that acts at once. */
function Chip({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-11 rounded-pill bg-muted px-4 text-subhead transition-colors duration-200 ease-out hover:bg-accent"
    >
      {children}
    </button>
  )
}

function PaletteSection({
  section,
  active,
  optionId,
  onHover,
  onChoose,
}: {
  section: Section
  active: Option | undefined
  optionId: (option: Option) => string
  onHover: (option: Option) => void
  onChoose: (option: Option) => void
}) {
  const { t } = useTranslation('search')
  const headingId = useId()
  return (
    <div role="group" aria-labelledby={headingId} className="flex flex-col gap-2">
      <Caps id={headingId}>{section.heading}</Caps>
      <div className="overflow-hidden card">
        {section.options.map((option) => (
          // The field keeps the focus: a row is chosen by the arrows and Enter, or by a tap.
          <div
            key={option.id}
            id={optionId(option)}
            role="option"
            aria-selected={option === active}
            onMouseMove={() => onHover(option)}
            onClick={() => onChoose(option)}
            // The board's SROW9 and SUG: 60 tall, its picture, 12 apart, its chevron at 12 from the edge.
            className={cn(
              'flex min-h-15 cursor-pointer items-center gap-3 px-3 py-2 shadow-[inset_0_-1px_0_var(--color-hairline)] last:shadow-none',
              option === active && 'bg-muted',
            )}
          >
            {option.picture}
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="line-clamp-2 text-base/[normal] font-semibold text-pretty">
                {option.title}
              </span>
              {option.detail ? (
                <span className="line-clamp-1 text-footnote/[normal] text-muted-foreground">
                  {option.detail}
                </span>
              ) : null}
            </span>
            {option.archived ? (
              <span className="flex h-6 shrink-0 items-center rounded-pill bg-muted px-2 text-xs font-semibold text-muted-foreground">
                {t('archived')}
              </span>
            ) : null}
            <OpensMark />
          </div>
        ))}
      </div>
    </div>
  )
}
