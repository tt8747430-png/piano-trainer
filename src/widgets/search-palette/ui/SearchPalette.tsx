import { useRouter } from '@tanstack/react-router'
import { ChevronRight, Search, X } from 'lucide-react'
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
import { rememberSearch } from '@/features/remember-view'
import { pieceById } from '@/entities/piece'
import { selectLearned, useProgress } from '@/entities/progress'
import { stepLink } from '@/entities/step'
import { cn, LAPTOP, useMediaQuery, type Up } from '@/shared/lib'
import { printedSymbol } from '@/shared/lib/music'
import { Sheet, SheetContent } from '@/shared/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/ui/primitives/dialog'
import { searchIndex, typedEntry, type IndexEntry } from '../model/index-entries'
import { paletteGroups } from '../model/palette-groups'
import { targetLink } from '../model/target-link'
import { useIndex, useIndexNames } from '../model/use-index'
import { continueStep, useStepTitle } from '@/widgets/curriculum'

/** One row of the palette: a result, a suggested place, or Continue; each a link. */
interface Option {
  readonly id: string
  readonly title: string
  readonly detail?: string | undefined
  readonly archived?: boolean
  readonly link: Up
}

interface Section {
  readonly heading: string
  readonly options: readonly Option[]
}

/** What the palette suggests before anything is typed (canvas, AppLayers): Continue, then these. */
const SUGGESTED_PAGES = ['chords', 'metronome'] as const

const result = (entry: IndexEntry): Option => ({
  id: entry.id,
  title: entry.kind === 'chords' ? printedSymbol(entry.title) : entry.title,
  detail: entry.detail,
  archived: entry.target.opens === 'piece' && entry.target.archived,
  link: targetLink(entry.target).link,
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
  const { t } = useTranslation(['search', 'learn'])
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
      const goOn: Option[] =
        next && link
          ? [
              {
                id: 'continue',
                title: `${t('learn:continue')}: ${stepTitle(next.step).primary}`,
                link,
              },
            ]
          : []
      const pages = SUGGESTED_PAGES.flatMap((page) =>
        index.filter((entry) => entry.target.opens === 'page' && entry.target.page === page),
      ).map((entry) => ({ ...result(entry), detail: undefined }))
      return [{ heading: t('suggested'), options: [...goOn, ...pages] }]
    }
    return paletteGroups(searchIndex(index, wanted, typedEntry(wanted, names))).map((group) => ({
      heading: t(`groups.${group.id}`),
      options: group.entries.map(result),
    }))
  }, [typing, wanted, learned, stepTitle, index, names, t])
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
    <div className="flex flex-col gap-3">
      <label className="flex h-12 items-center gap-2 rounded-control bg-card pr-1 pl-3 text-muted-foreground ring-1 ring-border focus-within:ring-2 focus-within:ring-ring">
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
      {!typing && recent.length > 0 ? (
        <section className="flex flex-col gap-2">
          <Caps>{t('recent')}</Caps>
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
            chevrons={!typing}
            optionId={optionId}
            onHover={(option) => setActive(options.indexOf(option))}
            onChoose={choose}
          />
        ))}
      </div>
      {typing && options.length === 0 ? (
        <div role="status" className="flex flex-col items-center gap-2 px-4 py-10 text-center">
          <p className="text-lg font-bold text-balance">{t('none', { query: wanted.trim() })}</p>
          <p className="text-[0.9375rem] text-pretty text-muted-foreground">{t('noneHint')}</p>
          <Chip onClick={() => ask('')}>{t('clear')}</Chip>
        </div>
      ) : null}
      {wide ? <p className="text-sm text-pretty text-muted-foreground">{t('hint')}</p> : null}
    </div>
  )

  if (!wide)
    return (
      <Sheet open onOpenChange={(open) => (open ? undefined : onClose())}>
        <SheetContent title={t('title')} initialFocus={() => fieldRef.current ?? true}>
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
        className="top-24 flex max-h-[min(42.5rem,calc(100dvh-8rem))] -translate-y-0 flex-col overflow-y-auto rounded-sheet bg-background p-4 sm:max-w-160"
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
    <p
      id={id}
      className="px-1 text-sm font-semibold tracking-wider text-muted-foreground uppercase"
    >
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
      className="h-11 rounded-pill bg-muted px-3.5 text-[0.9375rem] transition-colors duration-200 ease-out hover:bg-accent"
    >
      {children}
    </button>
  )
}

function PaletteSection({
  section,
  active,
  chevrons,
  optionId,
  onHover,
  onChoose,
}: {
  section: Section
  active: Option | undefined
  /** Places to go on to: each row its chevron. */
  chevrons: boolean
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
            className={cn(
              'flex min-h-13 cursor-pointer items-center gap-3 border-b border-hairline px-4 py-1.5 last:border-b-0',
              option === active && 'bg-muted',
            )}
          >
            <span className="flex min-w-0 flex-1 flex-col gap-px">
              <span
                className={cn('line-clamp-2 text-base text-pretty', !chevrons && 'font-semibold')}
              >
                {option.title}
              </span>
              {option.detail ? (
                <span className="line-clamp-1 text-[0.8125rem] text-muted-foreground">
                  {option.detail}
                </span>
              ) : null}
            </span>
            {option.archived ? (
              <span className="rounded-pill bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                {t('archived')}
              </span>
            ) : null}
            {chevrons ? (
              <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
