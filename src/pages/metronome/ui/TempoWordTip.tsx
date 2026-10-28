import { useTranslation } from 'react-i18next'
import { tempoTerm, tempoWord } from '@/shared/lib/music'
import { InfoTip } from '@/shared/ui'

/**
 * The tempo's Italian word under its number, as a tempo dial names it (ADR 0114): what it asks and
 * its beats a minute behind its ⓘ.
 */
export function TempoWordTip({ bpm }: { bpm: number }) {
  const { t } = useTranslation('music')
  const word = tempoWord(bpm)
  const { from, to } = tempoTerm(word)
  const name = t(`tempoWord.${word}.name`)
  return (
    <p className="flex items-center gap-1.5 text-base font-semibold tracking-wider text-muted-foreground uppercase">
      {name}
      <InfoTip name={name}>
        <span className="flex flex-col gap-1 normal-case">
          <span>{t(`tempoWord.${word}.meaning`)}</span>
          <span className="text-muted-foreground">
            {to === undefined ? t('tempoRangeFrom', { from }) : t('tempoRange', { from, to })}
          </span>
        </span>
      </InfoTip>
    </p>
  )
}
