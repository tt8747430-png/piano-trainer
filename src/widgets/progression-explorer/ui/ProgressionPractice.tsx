import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import { KEY_WALKS, numeralChord, parseNumerals, printedChord, type Key } from '@/shared/lib/music'
import { PractiseRow, PractiseRows } from '@/shared/ui'
import type { InPlayer } from '../model/progressions-view'
import { walkPreview } from '../model/walk-preview'

/**
 * A progression practised in the Player (canvas 177; "a progression is practised one way", loop round
 * 58), as the Scales page's Practise rows: first in the key shown, round and round, then a row for each
 * sequence through the keys the Player has, saying the chords it plays first. A progression of one
 * chord has no sequence to practise, so none is offered.
 */
export function ProgressionPractice({ musicKey, inPlayer }: { musicKey: Key; inPlayer: InPlayer }) {
  const { t } = useTranslation(['practice', 'player'])
  const numerals = parseNumerals(inPlayer.p) ?? []
  const size = inPlayer.chordSize ?? 'triads'
  const keyName = useKeyName()
  const chords = numerals.map((numeral) => printedChord(numeralChord(numeral, musicKey, size)))
  return new Set(numerals.map((numeral) => numeral.degree)).size < 2 ? null : (
    <PractiseRows title={t('practice:progressions.practiseRows')}>
      <PractiseRow
        title={t('practice:progressions.inKeyRow', { key: keyName(musicKey) })}
        detail={t('practice:progressions.roundAndRound', { chords: chords.join(' ') })}
        render={<Link to="/play/progression" search={inPlayer} />}
      />
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
