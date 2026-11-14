import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { KEY_WALKS, parseNumerals, type Key } from '@/shared/lib/music'
import { PractiseRow, PractiseRows } from '@/shared/ui'
import type { InPlayer } from '../model/progressions-view'
import { walkPreview } from '../model/walk-preview'

/**
 * A progression practised through the keys in the Player (canvas 177), as the Scales page's Practise
 * rows: a row for each sequence the Player has, saying the chords it plays first; in the key shown it
 * is the floating bar's Practise. A progression of one chord has no sequence to practise, so none is
 * offered.
 */
export function ProgressionPractice({ musicKey, inPlayer }: { musicKey: Key; inPlayer: InPlayer }) {
  const { t } = useTranslation(['practice', 'player'])
  const numerals = parseNumerals(inPlayer.p) ?? []
  const size = inPlayer.chordSize ?? 'triads'
  return new Set(numerals.map((numeral) => numeral.degree)).size < 2 ? null : (
    <PractiseRows title={t('practice:progressions.throughKeys')}>
      {KEY_WALKS.map((walk) => (
        <PractiseRow
          key={walk}
          title={t(`player:keyWalk.${walk}`)}
          detail={walkPreview(numerals, musicKey, walk, size)}
          render={<Link to="/play/progression" search={{ ...inPlayer, walk }} />}
        />
      ))}
    </PractiseRows>
  )
}
