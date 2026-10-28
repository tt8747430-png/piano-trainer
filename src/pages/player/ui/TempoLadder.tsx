import { useTranslation } from 'react-i18next'
import { rungOf, TEMPO_LADDER } from '@/entities/exercise'
import { Labelled, Segmented } from '@/shared/ui'
import type { PracticePlayer } from '@/widgets/practice-player'

/**
 * An exercise's tempo ladder: its rungs from ♩ = 60 to 132, the one it plays at chosen, a tap on
 * another plays it there. How to climb it is in its ⓘ.
 */
export function TempoLadder({ player }: { player: Pick<PracticePlayer, 'tempo' | 'setTempo'> }) {
  const { t } = useTranslation('player')
  return (
    <Labelled label={t('tempoLadder.label')} info={t('tempoLadder.info')}>
      <Segmented
        label={t('tempoLadder.label')}
        value={rungOf(player.tempo)}
        options={TEMPO_LADDER.map((rung) => ({ value: rung, label: String(rung) }))}
        onChange={player.setTempo}
      />
    </Labelled>
  )
}
