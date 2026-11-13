import { useRouter } from '@tanstack/react-router'
import { History, Search } from 'lucide-react'
import { useDeferredValue, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from 'zustand'
import { selectRecentSearches } from '@/entities/views'
import { rememberSearch } from '@/features/remember-view'
import { cn, type Up } from '@/shared/lib'
import { printedSymbol } from '@/shared/lib/music'
import { RowFace, type Tile } from '@/shared/ui'
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

/** One row of the palette: a recent search to type again, or a result to open. */
type Option =
  | { readonly id: string; readonly kind: 'recent'; readonly query: string }
  | {
      readonly id: string
      readonly kind: 'result'
      readonly entry: IndexEntry
      readonly link: Up
      readonly tile: Tile
    }

interface Section {
  readonly heading: string
  readonly options: readonly Option[]
}

const result = (entry: IndexEntry): Option => ({
  id: entry.id,
  kind: 'result',
  entry,
  ...targetLink(entry.target),
})

/**
 * The Search palette (rule 27, Spotlight's and Linear's): a field over the screen, and under it the
 * recent searches and the pages of Practice until something is typed, then what it finds, grouped
 * Practice · Songs · Folders · Lessons. The arrow keys move through the rows, Enter opens one (one
 * entry pushed from the screen underneath, so Back returns there), Escape closes it with nothing
 * written to the history.
 */
export function SearchPalette({ initial, onClose }: { initial: string; onClose: () => void }) {
  const { t } = useTranslation('search')
  const router = useRouter()
  const { views } = router.options.context
  const recent = useStore(views, selectRecentSearches)
  const [query, setQuery] = useState(initial)
  const wanted = useDeferredValue(query)
  const names = useIndexNames()
  const index = useIndex(names)
  const { sections, missed } = useMemo((): { sections: Section[]; missed: boolean } => {
    const places: Section = {
      heading: t('suggested'),
      options: index.filter((entry) => entry.kind === 'pages').map(result),
    }
    if (wanted.trim() === '') {
      const opening = [
        {
          heading: t('recent'),
          options: recent.map((each): Option => ({
            id: `recent:${each}`,
            kind: 'recent',
            query: each,
          })),
        },
        places,
      ].filter((section) => section.options.length > 0)
      return { sections: opening, missed: false }
    }
    const found = paletteGroups(searchIndex(index, wanted, typedEntry(wanted, names))).map(
      (group) => ({ heading: t(`groups.${group.id}`), options: group.entries.map(result) }),
    )
    // Nothing found is never a dead end: the places to go on from, under what was missed.
    return found.length > 0
      ? { sections: found, missed: false }
      : { sections: [places], missed: true }
  }, [wanted, recent, index, names, t])
  const options = sections.flatMap((section) => section.options)
  const [active, setActive] = useState(0)
  const at = Math.min(active, options.length - 1)
  const listId = useId()
  const fieldRef = useRef<HTMLInputElement>(null)
  const optionId = (option: Option) => `${listId}-${option.id}`

  const choose = (option: Option) => {
    if (option.kind === 'recent') {
      setQuery(option.query)
      setActive(0)
      return
    }
    rememberSearch(views, query)
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

  return (
    <Dialog open onOpenChange={(open) => (open ? undefined : onClose())}>
      <DialogContent
        showCloseButton={false}
        // The field has the focus as it opens: the palette is typed into.
        initialFocus={fieldRef}
        className="top-[max(1rem,10vh)] flex max-h-[80dvh] -translate-y-0 flex-col gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        <DialogTitle className="sr-only">{t('title')}</DialogTitle>
        <DialogDescription className="sr-only">{t('hint')}</DialogDescription>
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search aria-hidden className="size-5 shrink-0 text-muted-foreground" />
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
            className="h-14 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div id={listId} role="listbox" aria-label={t('title')} className="overflow-y-auto p-2">
          {missed ? (
            <div role="status" className="flex flex-col gap-1 px-3 pt-4 pb-3">
              <p className="font-semibold text-pretty">{t('none', { query: wanted.trim() })}</p>
              <p className="text-sm text-pretty text-muted-foreground">{t('noneHint')}</p>
            </div>
          ) : null}
          {sections.map((section) => (
            <PaletteSection
              key={section.heading}
              section={section}
              active={current}
              optionId={optionId}
              onHover={(option) => setActive(options.indexOf(option))}
              onChoose={choose}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
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
    <div role="group" aria-labelledby={headingId} className="flex flex-col pb-2">
      <p id={headingId} className="px-3 pt-2 pb-1 text-sm font-semibold text-muted-foreground">
        {section.heading}
      </p>
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
            'flex min-h-14 cursor-pointer items-center gap-3 rounded-control py-1.5 pr-3 pl-2',
            option === active && 'bg-muted',
          )}
        >
          {option.kind === 'recent' ? (
            <RowFace title={option.query} icon={History} paint="sand" />
          ) : (
            <RowFace
              title={
                option.entry.kind === 'chords'
                  ? printedSymbol(option.entry.title)
                  : option.entry.title
              }
              detail={
                option.entry.target.opens === 'piece' && option.entry.target.archived
                  ? t('archived')
                  : option.entry.detail
              }
              {...option.tile}
            />
          )}
        </div>
      ))}
    </div>
  )
}
