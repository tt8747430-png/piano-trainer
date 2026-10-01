import { useTranslation } from 'react-i18next'
import { noteName } from '@/shared/lib/music'
import type { Finding } from '../model/finding'

/** What the keys make, in words for a screen reader: the note, the interval, or the chord and its kind. */
export function useFindingSaid(finding: Finding): string {
  const { t } = useTranslation(['learn', 'music'])
  switch (finding.kind) {
    case 'empty':
      return ''
    case 'note':
      return noteName(finding.note)
    case 'interval':
      return t(`music:interval.${finding.interval}.name`)
    case 'none':
      return t('learn:finder.none')
    case 'chord': {
      const { best } = finding
      return best.chord.quality
        ? `${best.symbol} · ${t(`music:quality.${best.chord.quality}`)}`
        : best.symbol
    }
  }
}
