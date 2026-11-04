import { useTranslation } from 'react-i18next'
import {
  beatUnit,
  feltBeatUnit,
  tempoMark,
  unitNote,
  type Meter,
  type TempoUnit,
} from '@/shared/lib/music'

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
  // Read in the beat a player feels (R29 A28): 𝅗𝅥 = 80 in ¢, ♩. = 60 in 6/8; a quarter beat as BPM.
  const unit = piece.tempoUnit ?? feltBeatUnit(piece.meter)
  const mark = tempoMark(piece.tempo, unit, piece.meter)
  return unit === '4' && unit === beatUnit(piece.meter)
    ? t('bpm', { tempo: mark })
    : `${unitNote(unit)} = ${mark}`
}
