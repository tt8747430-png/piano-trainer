import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LEFT_FIGURES, PATTERNS, RIGHT_FIGURES } from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import { useSetup } from './setup-context'

/** A row on the sheet's first page that opens one of its lists. */
function SetupRow({
  label,
  value,
  onClick,
}: {
  label: string
  value: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-14 w-full items-center gap-3 border-b border-border text-left transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"
    >
      <span className="flex-1 text-lg">{label}</span>
      <span className="truncate text-muted-foreground">{value}</span>
      <ChevronRight aria-hidden className="size-5 text-muted-foreground" />
    </button>
  )
}

/** The pattern and each hand's figure, each opening its list as a page of the Setup sheet. */
export function FigureRows() {
  const { t } = useTranslation('player')
  const locale = useLocale()
  const { figures, openPage } = useSetup()
  return (
    <div>
      <SetupRow
        label={t('pattern')}
        value={
          figures.pattern === 'chart'
            ? t('fromChart')
            : localText(PATTERNS[figures.pattern].name, locale)
        }
        onClick={() => openPage('pattern')}
      />
      <SetupRow
        label={t('rh')}
        value={figures.rh ? localText(RIGHT_FIGURES[figures.rh].name, locale) : t('ownFigure')}
        onClick={() => openPage('rh')}
      />
      <SetupRow
        label={t('lh')}
        value={figures.lh ? localText(LEFT_FIGURES[figures.lh].name, locale) : t('ownFigure')}
        onClick={() => openPage('lh')}
      />
    </div>
  )
}
