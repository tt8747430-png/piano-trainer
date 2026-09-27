import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LEFT_FIGURE_IDS,
  LEFT_FIGURES,
  needsMelody,
  PATTERN_GROUP_NAMES,
  PATTERN_GROUPS,
  PATTERNS,
  patternsIn,
  RIGHT_FIGURE_IDS,
  RIGHT_FIGURES,
  type PatternId,
} from '@/entities/pattern'
import { hasMethodCodes, melodyOf, type Piece } from '@/entities/piece'
import type { PracticeChoice } from '@/features/practice'
import { localText, useLocale } from '@/shared/i18n'
import { Sheet, SheetContent } from '@/shared/ui'
import type { SetupChange } from '../model/setup-params'
import { ChoiceList } from './ChoiceList'
import { FigurePage } from './FigurePage'
import { ListPage } from './ListPage'
import { SetupMain, type SetupPage } from './SetupMain'

/**
 * The piece's own choices in one sheet, then how any piece plays (`children`); the pattern and figure
 * lists open as its pages, so a sheet never opens over a sheet.
 */
export function PlayerSetup({
  open,
  onOpenChange,
  piece,
  choice,
  onChange,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  piece: Piece
  choice: PracticeChoice
  onChange: (change: SetupChange) => void
  /** How the piece plays, under its own choices on the main page. */
  children: ReactNode
}) {
  const { t } = useTranslation('player')
  const locale = useLocale()
  const [page, setPage] = useState<SetupPage | 'main'>('main')
  const noMelody = melodyOf(piece) === undefined ? t('needsMelody') : undefined
  const title = page === 'main' ? t('setup') : t(page)
  const choose = (change: SetupChange) => {
    onChange(change)
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
      <SheetContent title={title}>
        {page === 'main' ? (
          <div className="flex flex-col gap-5">
            <SetupMain piece={piece} choice={choice} onChange={onChange} onOpenPage={setPage} />
            {children}
          </div>
        ) : null}
        {page === 'pattern' ? (
          <ListPage onBack={toMain}>
            {hasMethodCodes(piece) ? (
              <ChoiceList<PatternId | 'chart'>
                items={[
                  { value: 'chart', label: t('fromChart'), description: t('fromChartDescription') },
                ]}
                value={choice.pattern}
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
                      ...(needsMelody(id) && noMelody ? { disabledNote: noMelody } : {}),
                    }
                  })}
                  value={choice.pattern}
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
            value={choice.rh}
            noMelody={noMelody}
            onChoose={(rh) => choose({ rh })}
            onBack={toMain}
          />
        ) : null}
        {page === 'lh' ? (
          <FigurePage
            ids={LEFT_FIGURE_IDS}
            figures={LEFT_FIGURES}
            value={choice.lh}
            noMelody={noMelody}
            onChoose={(lh) => choose({ lh })}
            onBack={toMain}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
