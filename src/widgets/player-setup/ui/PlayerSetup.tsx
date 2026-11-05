import type { LucideIcon } from 'lucide-react'
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
import { BackButton, RowButton, SettingsGroup } from '@/shared/ui'
import type { FigureChange } from '../model/setup-params'
import { FigurePage } from './FigurePage'
import { PatternPage } from './PatternPage'
import { SettingsSheet } from './SettingsSheet'
import { SetupContext, type SetupPage } from './setup-context'

/** A page of the music's own choices (R31-P: a song's Staves, its Accompaniment), a row on the first. */
export interface MusicPage {
  readonly id: string
  readonly label: string
  readonly icon: LucideIcon
  /** What it is set to, under its name (Staves: the ones playing). */
  readonly detail?: string | undefined
  readonly content: ReactNode
}

/**
 * The Player's Settings with an accompaniment (`SettingsSheet`): its first page is the music's own
 * pages (`pages`, R31-P), each a row opening it with Back, then `children`, composed by the page: the
 * music's own choices, `PatternCard`, how it plays. The pattern and figure lists open as the sheet's
 * pages, so a sheet never opens over a sheet, and close back to the page they were opened from; each
 * closes a pattern or figure the music cannot play (`fit`).
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
  const { t } = useTranslation('player')
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
  const own = pages.find((each) => each.id === page)
  const inner = own
    ? {
        title: own.label,
        content: (
          <SetupContext value={{ figures, fit, openPage, onFigures }}>
            <div className="flex flex-col gap-5">
              <BackButton onClick={() => setPage('main')} />
              {own.content}
            </div>
          </SetupContext>
        ),
      }
    : page === 'pattern'
      ? {
          title: t('pattern'),
          content: (
            <PatternPage
              value={figures.pattern}
              fit={fit}
              onChoose={(pattern) => choose({ pattern })}
              onBack={toMain}
            />
          ),
        }
      : page === 'rh'
        ? {
            title: t('rh'),
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
                onBack={toMain}
              />
            ),
          }
        : page === 'lh'
          ? {
              title: t('lh'),
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
                  onBack={toMain}
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
    >
      <SetupContext value={{ figures, fit, openPage, onFigures }}>
        <div ref={main} className="flex flex-col gap-5">
          {pages.length > 0 ? (
            <SettingsGroup flush>
              {pages.map(({ id, label, icon, detail }) => (
                <RowButton
                  key={id}
                  title={label}
                  detail={detail}
                  icon={icon}
                  paint="lilac"
                  onClick={() => {
                    setOpened(null)
                    setPage(id)
                  }}
                />
              ))}
            </SettingsGroup>
          ) : null}
          {children}
        </div>
      </SetupContext>
    </SettingsSheet>
  )
}
