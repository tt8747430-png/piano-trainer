import { useTranslation } from 'react-i18next'
import { beatUnit, tempoMark, unitNote, type Meter, type TempoUnit } from '@/shared/lib/music'

/**
 * A piece's tempo as its facts say it (ADR 0114): beats a minute where its mark counts the meter's
 * beat (`90 BPM`), else its mark as printed, in the note it counts (`𝅘𝅥𝅮 = 180`).
 */
export function useTempoText(piece: {
  readonly meter: Meter
  readonly tempo: number
  readonly tempoUnit?: TempoUnit | undefined
}): string {
  const { t } = useTranslation('music')
  const unit = piece.tempoUnit ?? beatUnit(piece.meter)
  const mark = tempoMark(piece.tempo, unit, piece.meter)
  return unit === beatUnit(piece.meter) ? t('bpm', { tempo: mark }) : `${unitNote(unit)} = ${mark}`
}
