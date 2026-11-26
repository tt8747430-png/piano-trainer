import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LEFT_FIGURE_GROUPS,
  LEFT_FIGURE_IDS,
  LEFT_FIGURES,
  RIGHT_FIGURE_GROUPS,
  RIGHT_FIGURE_IDS,
  RIGHT_FIGURES,
  type AccompanimentChoice,
  type PatternFit,
} from '@/entities/pattern'
import type { PracticeLibraryView } from '@/widgets/practice-library'
import { PATTERN_VIEW } from '../model/pattern-folds'
import type { FigureChange } from '../model/setup-params'
import { FigurePage } from './FigurePage'
import { PatternFilterPage } from './PatternFilterPage'
import { PatternPage } from './PatternPage'
import { SettingsSheet } from './SettingsSheet'
import { SetupContext, type SetupPage } from './setup-context'
import type { SettingsRow } from './setup-extras'

/**
 * A page of the music's own choices (R31-P: a song's Staves, its Accompaniment): a row on the first
 * page, ranked among the Player's own (R32), with what it controls and what it is set to.
 */
export interface MusicPage extends SettingsRow {
  readonly content: ReactNode
  /** False where a card on the first page opens it (the Accompaniment card's Pattern), not a row. */
  readonly listed?: boolean
}

/**
 * The Player's Settings with an accompaniment (`SettingsSheet`): its first page is the music's own
 * pages (`pages`, R31-P), each a row opening it with Back, then `children`, composed by the page: the
 * music's own choices, `PatternCard`, how it plays. The pattern and figure lists open as the sheet's
 * pages, so a sheet never opens over a sheet, and close back to the page they were opened from; each
 * closes a pattern or figure the music cannot play (`fit`). The patterns' Sort and filter is a page
 * of its own after theirs, back to them, what they show kept between the two.
 */
export function PlayerSetup({
  figures,
  fit,
  onFigures,
  pages = [],
  children,
}: {
  figures: AccompanimentChoice
  fit: PatternFit
  onFigures: (change: FigureChange) => void
  pages?: readonly MusicPage[]
  children?: ReactNode
}) {
  const { t } = useTranslation(['player', 'common'])
  const [page, setPage] = useState<string>('main')
  const main = useRef<HTMLDivElement>(null)
  /** The list page last open: back on the first page, its row takes the focus again. */
  const [opened, setOpened] = useState<SetupPage | null>(null)
  useEffect(() => {
    if (page !== 'main' || opened === null) return
    main.current?.querySelector<HTMLElement>(`[data-setup-page="${opened}"]`)?.focus()
  }, [page, opened])
  // The page a pattern or figure list was opened from, where it closes back to.
  const [from, setFrom] = useState('main')
  const openPage = (next: SetupPage) => {
    setOpened(next)
    setFrom(page)
    setPage(next)
  }
  const choose = (change: FigureChange) => {
    onFigures(change)
    setPage(from)
  }
  const toMain = () => setPage(from)
  // What the Pattern sheet shows, kept across its Sort and filter page and while the sheet is open.
  const [patternView, setPatternView] = useState<PracticeLibraryView>(PATTERN_VIEW)
  const onPatternView = (change: Partial<PracticeLibraryView>) =>
    setPatternView((now) => ({ ...now, ...change }))
  const own = pages.find((each) => each.id === page)
  const inner = own
    ? {
        title: own.label,
        onBack: () => setPage('main'),
        content: (
          <SetupContext value={{ figures, fit, openPage, onFigures }}>{own.content}</SetupContext>
        ),
      }
    : page === 'pattern'
      ? {
          title: t('pattern'),
          onBack: toMain,
          content: (
            <PatternPage
              value={figures.pattern}
              fit={fit}
              view={patternView}
              onView={onPatternView}
              onChoose={(pattern) => choose({ pattern })}
              onFilter={() => setPage('patternFilter')}
            />
          ),
        }
      : page === 'patternFilter'
        ? {
            title: t('common:library.filters.sortTitle'),
            onBack: () => setPage('pattern'),
            content: (
              <PatternFilterPage
                view={patternView}
                chosen={figures.pattern}
                onView={onPatternView}
                onDone={() => setPage('pattern')}
              />
            ),
          }
        : page === 'rh'
          ? {
              title: t('rh'),
              onBack: toMain,
              content: (
                <FigurePage
                  hand="rh"
                  label={t('rh')}
                  ids={RIGHT_FIGURE_IDS}
                  sections={RIGHT_FIGURE_GROUPS.map((group) => ({
                    label: t(`rhGroup.${group.id}`),
                    ids: group.figures,
                  }))}
                  figures={RIGHT_FIGURES}
                  value={figures.rh}
                  fit={fit}
                  onChoose={(rh) => choose({ rh })}
                />
              ),
            }
          : page === 'lh'
            ? {
                title: t('lh'),
                onBack: toMain,
                content: (
                  <FigurePage
                    hand="lh"
                    label={t('lh')}
                    ids={LEFT_FIGURE_IDS}
                    sections={LEFT_FIGURE_GROUPS.map((group) => ({
                      label: t(`lhGroup.${group.id}`),
                      ids: group.figures,
                    }))}
                    figures={LEFT_FIGURES}
                    value={figures.lh}
                    fit={fit}
                    onChoose={(lh) => choose({ lh })}
                  />
                ),
              }
            : null
  return (
    <SettingsSheet
      page={page}
      onPage={(next) => {
        setPage(next)
        setOpened(null)
        setFrom('main')
      }}
      inner={inner}
      music={pages.filter((each) => each.listed !== false)}
    >
      <SetupContext value={{ figures, fit, openPage, onFigures }}>
        <div ref={main} className="flex flex-col gap-5 empty:hidden">
          {children}
        </div>
      </SetupContext>
    </SettingsSheet>
  )
}
