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
import { Sheet, SheetContent } from '@/shared/ui'
import type { FigureChange } from '../model/setup-params'
import { FigurePage } from './FigurePage'
import { PatternPage } from './PatternPage'
import { SetupTrigger } from './SetupTrigger'
import { SetupContext, type SetupPage } from './setup-context'

/**
 * The Player's Setup: its button, and the sheet it opens. The sheet's first page is `children`,
 * composed by the page: the music's own choices, `PatternCard`, how it plays. The pattern and figure
 * lists open as the sheet's pages, so a sheet never opens over a sheet; each closes a pattern or
 * figure the music cannot play (`fit`).
 */
export function PlayerSetup({
  figures,
  fit,
  onFigures,
  children,
}: {
  figures: AccompanimentChoice
  fit: PatternFit
  onFigures: (change: FigureChange) => void
  children: ReactNode
}) {
  const { t } = useTranslation('player')
  const [page, setPage] = useState<SetupPage | 'main'>('main')
  const main = useRef<HTMLDivElement>(null)
  /** The list page last open: back on the first page, its row takes the focus again. */
  const [opened, setOpened] = useState<SetupPage | null>(null)
  useEffect(() => {
    if (page !== 'main' || opened === null) return
    main.current?.querySelector<HTMLElement>(`[data-setup-page="${opened}"]`)?.focus()
  }, [page, opened])
  const openPage = (next: SetupPage) => {
    setOpened(next)
    setPage(next)
  }
  const choose = (change: FigureChange) => {
    onFigures(change)
    setPage('main')
  }
  const toMain = () => setPage('main')
  return (
    <Sheet
      onOpenChange={(open) => {
        if (open) return
        setPage('main')
        setOpened(null)
      }}
    >
      <SetupTrigger />
      <SheetContent title={page === 'main' ? t('setup') : t(page)}>
        {page === 'main' ? (
          <SetupContext value={{ figures, fit, openPage, onFigures }}>
            <div ref={main} className="flex flex-col gap-5">
              {children}
            </div>
          </SetupContext>
        ) : null}
        {page === 'pattern' ? (
          <PatternPage
            value={figures.pattern}
            fit={fit}
            onChoose={(pattern) => choose({ pattern })}
            onBack={toMain}
          />
        ) : null}
        {page === 'rh' ? (
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
        ) : null}
        {page === 'lh' ? (
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
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
