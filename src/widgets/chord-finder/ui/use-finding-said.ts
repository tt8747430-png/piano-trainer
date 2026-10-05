import { useTranslation } from 'react-i18next'
import { noteName } from '@/shared/lib/music'
import type { Finding } from '../model/finding'
import { useChordAbout } from './use-chord-about'

/** What the keys make, in words for a screen reader: the note, the interval, or the chord and what it is. */
export function useFindingSaid(finding: Finding): string {
  const { t } = useTranslation(['learn', 'music'])
  const aboutOf = useChordAbout()
  switch (finding.kind) {
    case 'empty':
      return ''
    case 'note':
      return noteName(finding.note)
    case 'interval':
      return t(`music:interval.${finding.interval}.name`)
    case 'none':
      return t('learn:finder.none')
    case 'chord':
      return [finding.best.symbol, ...aboutOf(finding.best)].join(' · ')
  }
}
