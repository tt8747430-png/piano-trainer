import { ChevronLeft } from 'lucide-react'
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
  type LeftFigureId,
  type PatternId,
  type RightFigureId,
} from '@/entities/pattern'
import { hasMethodCodes, melodyOf, type Piece } from '@/entities/piece'
import type { PracticeChoice } from '@/features/practice'
import { localText, useLocale } from '@/shared/i18n'
import type { Hands } from '@/shared/lib/schedule'
import { Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { SetupChange } from '../model/setup-params'
import { ChoiceList } from './ChoiceList'
import { SetupMain, type SetupPage } from './SetupMain'

/** One of the sheet's lists, as a page of it, with the way back to the first page. */
function ListPage({ onBack, children }: { onBack: () => void; children: ReactNode }) {
  const { t } = useTranslation('player')
  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" className="-ml-3 self-start" onClick={onBack}>
        <ChevronLeft data-icon="inline-start" />
        {t('back')}
      </Button>
      {children}
    </div>
  )
}

/**
 * Everything about how the Player plays, in one sheet; the pattern and figure lists open as its
 * pages, so a sheet never opens over a sheet.
 */
export function PlayerSetup({
  open,
  onOpenChange,
  piece,
  choice,
  tempo,
  hands,
  onChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  piece: Piece
  choice: PracticeChoice
  tempo: number
  hands: Hands
  onChange: (change: SetupChange) => void
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
          <SetupMain
            piece={piece}
            choice={choice}
            tempo={tempo}
            hands={hands}
            onChange={onChange}
            onOpenPage={setPage}
          />
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
          <ListPage onBack={toMain}>
            <ChoiceList<RightFigureId | null>
              items={[
                { value: null, label: t('ownFigure') },
                ...RIGHT_FIGURE_IDS.map((id) => ({
                  value: id,
                  label: localText(RIGHT_FIGURES[id].name, locale),
                  ...(RIGHT_FIGURES[id].figure.kind === 'melody' && noMelody
                    ? { disabledNote: noMelody }
                    : {}),
                })),
              ]}
              value={choice.rh}
              onChoose={(rh) => choose({ rh: rh ?? undefined })}
            />
          </ListPage>
        ) : null}
        {page === 'lh' ? (
          <ListPage onBack={toMain}>
            <ChoiceList<LeftFigureId | null>
              items={[
                { value: null, label: t('ownFigure') },
                ...LEFT_FIGURE_IDS.map((id) => ({
                  value: id,
                  label: localText(LEFT_FIGURES[id].name, locale),
                })),
              ]}
              value={choice.lh}
              onChoose={(lh) => choose({ lh: lh ?? undefined })}
            />
          </ListPage>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
