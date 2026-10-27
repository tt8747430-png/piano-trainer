import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  fitInversion,
  midi,
  type Inversion,
  type KeyRange,
  type Midi,
  type RowPosition,
} from '@/shared/lib/music'
import { InversionChoice } from './InversionChoice'
import { KeyDiagram } from './KeyDiagram'
import { Labelled } from './Labelled'
import { SwitchRow } from './SwitchRow'

/** The keys the positions are drawn on: C4 to E5, a hand's reach over middle C. */
const REACH: KeyRange = { from: midi(60), to: midi(76) }
/** C major in each of its positions, the keys of each, bottom up. */
const C_POSITIONS: readonly {
  readonly name: 'root' | 'first' | 'second'
  readonly keys: readonly Midi[]
  readonly notes: string
}[] = [
  { name: 'root', keys: [60, 64, 67].map(midi), notes: 'C E G' },
  { name: 'first', keys: [64, 67, 72].map(midi), notes: 'E G C' },
  { name: 'second', keys: [67, 72, 76].map(midi), notes: 'G C E' },
]

/**
 * What a position is, drawn (ADR 0115): C major on the keys in root position, 1st and 2nd
 * inversion, each named with its notes bottom up, under a line saying what the choice is.
 */
function PositionsAbout() {
  const { t } = useTranslation('music')
  return (
    <div className="flex flex-col gap-3">
      <p>{t('position.startAbout')}</p>
      <ul className="grid grid-cols-3 gap-2">
        {C_POSITIONS.map(({ name, keys, notes }) => (
          <li key={name} className="flex flex-col items-center gap-1 text-center text-xs">
            <KeyDiagram
              keys={keys}
              range={REACH}
              label={`${t(`inversionName.${name}`)}: ${notes}`}
            />
            <span className="font-semibold">{t(`inversionName.${name}`)}</span>
            <span className="text-muted-foreground">{notes}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Where a row's hand stands (ADR 0047, 0115): the position its first chord starts in, each drawn as
 * its stack of `notes` notes, what a position is drawn on the keys in the ⓘ beside its name; and Move
 * smoothly: on, each chord after the first moves to the position nearest the one before; off, every
 * one stays in the first one's position. Where it is greyed, `info` says why beside its name (ADR
 * 0096), in place of the picture.
 */
export function PositionField({
  notes,
  position,
  disabled = false,
  info,
  onChange,
}: {
  notes: number
  position: RowPosition
  disabled?: boolean
  /** Why it is greyed, opened from the ⓘ beside its name. */
  info?: ReactNode
  onChange: (change: { inversion?: Inversion; nearest?: boolean }) => void
}) {
  const { t } = useTranslation('music')
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Labelled label={t('position.first')} info={info ?? <PositionsAbout />}>
        <InversionChoice
          notes={notes}
          label={t('position.first')}
          disabled={disabled}
          value={fitInversion(position.inversion, notes)}
          onChange={(inversion) => onChange({ inversion: inversion as Inversion })}
        />
      </Labelled>
      <SwitchRow
        className="border-b-0"
        label={t('position.nearest')}
        info={t('position.nearestInfo')}
        checked={position.nearest}
        disabled={disabled}
        onCheckedChange={(nearest) => onChange({ nearest })}
      />
    </div>
  )
}
