import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PIECES, useRepertoire, type Piece } from '@/entities/piece'
import { songsWith, type SongPlace } from '@/entities/progression-library'
import { loopParam } from '@/features/practice'
import { OPEN_PLAINLY } from '@/shared/lib'
import { numeralText, parseNumerals, printedSymbol } from '@/shared/lib/music'
import { FoldSection, RowGroup, RowLink } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEntryFace } from '@/widgets/piece-list'

/** The songs shown until the learner asks for all, as Search shows a group's. */
const FIRST_ROWS = 8

/** Between a row's chords: an en space, as a song's row spaces its chords. */
const CHORD_SPACE = ' '

/**
 * The songs a line of numerals (as a URL holds it) is heard in (ADR 0112, Chordify's "songs using
 * it"), each in its own key, wherever it is written in a key of `minor`'s mode: the learner's own
 * songs after the catalog's. None for a line of one chord.
 */
export function ProgressionSongs({ line, minor }: { line: string; minor: boolean }) {
  const { t } = useTranslation('practice')
  const repertoire = useRepertoire()
  const numerals = useMemo(() => parseNumerals(line) ?? [], [line])
  const songs = useMemo(() => {
    const pieces: Piece[] = [
      ...PIECES.flatMap((each) => repertoire.piece(each.id) ?? []),
      ...repertoire.ownSongs,
    ].filter((piece) => piece.kind === 'song')
    return songsWith(pieces, numerals, minor)
  }, [repertoire, numerals, minor])
  const [all, setAll] = useState(false)
  if (new Set(numerals.map(numeralText)).size < 2) return null
  const title = t('progressions.songs.title')
  if (songs.length === 0)
    return (
      <FoldSection title={title} headingClassName="text-2xl">
        <p className="text-muted-foreground">{t('progressions.songs.none')}</p>
      </FoldSection>
    )
  const shown = all ? songs : songs.slice(0, FIRST_ROWS)
  return (
    <RowGroup
      title={title}
      footer={
        songs.length > shown.length ? (
          <Button variant="soft" className="self-start" onClick={() => setAll(true)}>
            {t('progressions.songs.all', { count: songs.length })}
          </Button>
        ) : null
      }
    >
      {shown.map(({ piece, places }) =>
        places[0] ? <SongRow key={piece.id} piece={piece} place={places[0]} /> : null,
      )}
    </RowGroup>
  )
}

/**
 * A song as its row is everywhere (its title, kind's tile and key), the bars it is first heard in and
 * the chords it is heard on there under them; it opens the Player at those bars, looped.
 */
function SongRow({ piece, place }: { piece: Piece; place: SongPlace }) {
  const { t } = useTranslation('piece')
  const { face, kind } = useEntryFace(piece)
  const { first, last } = place.bars
  return (
    <li>
      <RowLink
        title={face.title}
        detail={
          first === last
            ? t('barOne', { n: first + 1 })
            : t('barsFromTo', { first: first + 1, last: last + 1 })
        }
        trailing={face.trailing}
        {...kind}
        render={
          <Link
            to="/play/$pieceId"
            params={{ pieceId: piece.id }}
            search={{ bar: first + 1, loop: loopParam(place.played) }}
            state={OPEN_PLAINLY}
          />
        }
      >
        {/* As a song's row lists its chords: a symbol read aloud says little. */}
        <span
          aria-hidden
          className="block truncate font-display text-sm font-medium text-muted-foreground"
        >
          {place.chords.map(printedSymbol).join(CHORD_SPACE)}
        </span>
      </RowLink>
    </li>
  )
}
