import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LEFT_FIGURE_IDS,
  LEFT_FIGURES,
  needsKey,
  needsMelody,
  PATTERN_GROUP_NAMES,
  PATTERN_GROUPS,
  PATTERNS,
  patternsIn,
  RIGHT_FIGURE_IDS,
  RIGHT_FIGURES,
  type PatternId,
} from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import { Sheet, SheetContent } from '@/shared/ui'
import type { FigureChange, FigureChoice } from '../model/setup-params'
import { ChoiceList } from './ChoiceList'
import { FigurePage } from './FigurePage'
import { ListPage } from './ListPage'
import { SetupContext, type SetupPage } from './setup-context'

/**
 * The Player's Setup sheet. Its first page is `children`, composed by the page: the source's own
 * choices, `FigureRows`, how it plays. The pattern and figure lists open as the sheet's pages, so a
 * sheet never opens over a sheet.
 */
export function PlayerSetup({
  open,
  onOpenChange,
  figures,
  methods,
  melody,
  keyed,
  onFigures,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  figures: FigureChoice
  /** The chart names its own methods: the pattern list offers "From the chart". */
  methods: boolean
  /** There is a tune for a figure that plays it. */
  melody: boolean
  /** The source is in a key, for a figure that plays its triads. */
  keyed: boolean
  onFigures: (change: FigureChange) => void
  children: ReactNode
}) {
  const { t } = useTranslation('player')
  const locale = useLocale()
  const [page, setPage] = useState<SetupPage | 'main'>('main')
  const noMelody = melody ? undefined : t('needsMelody')
  const noKey = keyed ? undefined : t('needsKey')
  const choose = (change: FigureChange) => {
    onFigures(change)
    setPage('main')
  }
  const toMain = () => setPage('main')
  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) setPage('main')
      }}
    >
      <SheetContent title={page === 'main' ? t('setup') : t(page)}>
        {page === 'main' ? (
          <SetupContext value={{ figures, openPage: setPage }}>
            <div className="flex flex-col gap-5">{children}</div>
          </SetupContext>
        ) : null}
        {page === 'pattern' ? (
          <ListPage onBack={toMain}>
            {methods ? (
              <ChoiceList<PatternId | 'chart'>
                items={[
                  { value: 'chart', label: t('fromChart'), description: t('fromChartDescription') },
                ]}
                value={figures.pattern}
                onChoose={() => choose({ pattern: 'chart' })}
              />
            ) : null}
            {PATTERN_GROUPS.map((group) => (
              <section key={group} className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {localText(PATTERN_GROUP_NAMES[group], locale)}
                </h3>
                <ChoiceList<PatternId | 'chart'>
                  items={patternsIn(group).map((id) => {
                    const { name, description } = PATTERNS[id]
                    return {
                      value: id,
                      label: localText(name, locale),
                      ...(description ? { description: localText(description, locale) } : {}),
                      ...(needsMelody(id) && noMelody
                        ? { disabledNote: noMelody }
                        : needsKey(id) && noKey
                          ? { disabledNote: noKey }
                          : {}),
                    }
                  })}
                  value={figures.pattern}
                  onChoose={(pattern) => choose({ pattern })}
                />
              </section>
            ))}
          </ListPage>
        ) : null}
        {page === 'rh' ? (
          <FigurePage
            ids={RIGHT_FIGURE_IDS}
            figures={RIGHT_FIGURES}
            value={figures.rh}
            noMelody={noMelody}
            noKey={noKey}
            onChoose={(rh) => choose({ rh })}
            onBack={toMain}
          />
        ) : null}
        {page === 'lh' ? (
          <FigurePage
            ids={LEFT_FIGURE_IDS}
            figures={LEFT_FIGURES}
            value={figures.lh}
            noMelody={noMelody}
            noKey={noKey}
            onChoose={(lh) => choose({ lh })}
            onBack={toMain}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
