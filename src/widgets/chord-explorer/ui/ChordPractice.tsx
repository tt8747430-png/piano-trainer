import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { exerciseOf, isArpeggioQuality } from '@/entities/exercise'
import { chordsParam, walkOpening } from '@/features/practice'
import { localText, useKeyName, useLocale } from '@/shared/i18n'
import {
  isInversion,
  noteParam,
  printedNote,
  printedSymbol,
  qualitySuffix,
  spellChord,
  type Chord,
  type Key,
} from '@/shared/lib/music'
import { PractiseRow, PractiseRows } from '@/shared/ui'
import {
  chordChanges,
  diatonically,
  overTheRootDrill,
  shuffled,
  walkedLine,
  type ChordDrill,
} from '../model/chord-drills'

const ARPEGGIO = exerciseOf('arpeggio')
const INVERSIONS = exerciseOf('inversions')
/** The chord walked through every key: Chromatically, then round the Circle of fifths (canvas 160). */
const WALKS = ['up', 'fifths'] as const
/** Over the root: the left hand's root a whole note, the right hand's chord a whole note. */
const OVER_THE_ROOT = { lh: 'r', rh: 'x1' } as const

/** A drill the Player plays as a progression, by its numerals in a key. */
const progression = (drill: ChordDrill, extra: object = {}) => (
  <Link to="/play/progression" search={{ p: drill.numerals, key: drill.key, ...extra }} />
)

/**
 * The chosen chord's or the staff's chords' ways into the Player, as the canvas's PRACTISE lists them,
 * each row showing the music it plays. One chord: Inversions, Arpeggio, Over the root, Chromatically,
 * Circle of fifths, Diatonically (in the key it belongs to). Several: Chord changes, Inversions,
 * Arpeggio, Over the root, Chromatically, Circle of fifths, Shuffle.
 */
export function ChordPractice({
  chord,
  inversion,
  chords,
  staffKey,
}: {
  /** The chord chosen on the staff. */
  chord: Chord
  /** The inversion shown, where the Player's right hand plays it the same: a chord of up to four notes. */
  inversion: number
  /** Every chord on the staff, in order, and the key they are written in. */
  chords: readonly Chord[]
  staffKey: Key
}) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const keyName = useKeyName()
  const { root, quality } = chord
  const names = spellChord(root, quality).map((tone) => printedNote(tone.note))
  const symbol = printedNote(root) + printedSymbol(qualitySuffix(quality))
  const several = chords.length > 1
  const changes = several ? chordChanges(chords, staffKey) : null
  const over = several
    ? overTheRootDrill(chords, staffKey)
    : overTheRootDrill([chord], { tonic: root, minor: false })
  const home = several ? null : diatonically(chord)
  const shuffle = several ? shuffled(chords, staffKey) : null
  return (
    <PractiseRows
      title={several ? t('chords.practiseThese') : t('chords.practiseIn', { chord: symbol })}
    >
      {changes ? (
        <PractiseRow
          title={t('chords.changes')}
          detail={changes.line}
          render={progression(changes)}
        />
      ) : null}
      {isArpeggioQuality(quality) ? (
        <PractiseRow
          title={localText(INVERSIONS.name, locale)}
          detail={names
            .map((_, at) => [...names.slice(at), ...names.slice(0, at)].join(' '))
            .join(' · ')}
          render={
            <Link
              to="/play/exercise/$exerciseId"
              params={{ exerciseId: INVERSIONS.id }}
              search={{ root: noteParam(root), quality }}
            />
          }
        />
      ) : null}
      {isArpeggioQuality(quality) ? (
        <PractiseRow
          title={localText(ARPEGGIO.name, locale)}
          detail={`${names.join(' ')} ${names[0]} …`}
          render={
            <Link
              to="/play/exercise/$exerciseId"
              params={{ exerciseId: ARPEGGIO.id }}
              search={{ root: noteParam(root), quality }}
            />
          }
        />
      ) : null}
      {over ? (
        <PractiseRow
          title={t('chords.overRoot')}
          detail={over.line}
          render={progression(over, OVER_THE_ROOT)}
        />
      ) : null}
      {several && changes
        ? WALKS.map((direction) => (
            <PractiseRow
              key={direction}
              title={t(direction === 'up' ? 'chords.chromatic' : 'chords.fifths')}
              detail={walkedLine(chords, direction === 'up' ? 1 : 5)}
              render={progression(changes, {
                walk: direction === 'up' ? 'semitones-up' : 'fifths',
              })}
            />
          ))
        : WALKS.map((direction) => (
            <PractiseRow
              key={direction}
              title={t(direction === 'up' ? 'chords.chromatic' : 'chords.fifths')}
              detail={walkOpening(root, quality, direction)}
              render={
                <Link
                  to="/play/chromatic"
                  search={{
                    chords: chordsParam([quality]),
                    root: noteParam(root),
                    direction,
                    ...(isInversion(inversion) ? { inversion } : {}),
                    nearest: false,
                  }}
                />
              }
            />
          ))}
      {home ? (
        <PractiseRow
          title={t('chords.diatonically', { key: keyName(home.home) })}
          detail={home.line}
          render={progression(home)}
        />
      ) : null}
      {shuffle ? (
        <PractiseRow
          title={t('chords.shuffle')}
          detail={shuffle.line}
          render={progression(shuffle)}
        />
      ) : null}
    </PractiseRows>
  )
}
