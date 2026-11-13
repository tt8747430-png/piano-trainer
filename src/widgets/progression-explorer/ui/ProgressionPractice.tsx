import { Link } from '@tanstack/react-router'
import {
  ArrowDownRight,
  ArrowUpDown,
  ArrowUpRight,
  ChevronsDown,
  ChevronsUp,
  RotateCcw,
  RotateCw,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFold } from '@/features/fold-section'
import { KEY_WALKS, parseNumerals, type Key, type KeyWalk } from '@/shared/lib/music'
import { RowGroup, RowLink } from '@/shared/ui'
import type { InPlayer } from '../model/progressions-view'
import { walkPreview } from '../model/walk-preview'

/** Each sequence by the way it goes (R21): rising, falling, up and back, round the circle. */
const WALK_ICONS: Readonly<Record<KeyWalk, LucideIcon>> = {
  'semitones-up': ArrowUpRight,
  'semitones-down': ArrowDownRight,
  'semitones-up-down': ArrowUpDown,
  'tones-up': ChevronsUp,
  'tones-down': ChevronsDown,
  fifths: RotateCcw,
  'fifths-up': RotateCw,
  'minor-thirds': ArrowUpRight,
  'major-thirds': ChevronsUp,
}

/**
 * A progression practised in the Player through the keys (A23): a row for each sequence the Player
 * has, saying the chords it plays first; in the key shown it is the floating bar's Practise. A
 * progression of one chord has no sequence to practise, so none is offered (R30).
 */
export function ProgressionPractice({ musicKey, inPlayer }: { musicKey: Key; inPlayer: InPlayer }) {
  const { t } = useTranslation(['practice', 'music', 'player'])
  const walks = useFold('progressions.walks')
  const numerals = parseNumerals(inPlayer.p) ?? []
  const size = inPlayer.chordSize ?? 'triads'
  return new Set(numerals.map((numeral) => numeral.degree)).size < 2 ? null : (
    <RowGroup title={t('practice:progressions.throughKeys')} fold={walks}>
      {KEY_WALKS.map((walk) => (
        <li key={walk}>
          <RowLink
            title={t(`player:keyWalk.${walk}`)}
            detail={walkPreview(numerals, musicKey, walk, size)}
            icon={WALK_ICONS[walk]}
            paint="lilac"
            render={<Link to="/play/progression" search={{ ...inPlayer, walk }} />}
          />
        </li>
      ))}
    </RowGroup>
  )
}
