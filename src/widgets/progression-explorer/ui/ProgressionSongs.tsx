import { Link } from '@tanstack/react-router'
import { useId, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PIECES, useRepertoire, type Piece } from '@/entities/piece'
import { heardLine, songsWith, type SongPlace } from '@/entities/progression-library'
import { loopParam } from '@/features/practice'
import { OPEN_PLAINLY } from '@/shared/lib'
import { numeralText, parseNumerals } from '@/shared/lib/music'
import { GroupLink, GroupRows } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEntryFace } from '@/widgets/piece-list'

/** The songs shown until the learner asks for all, as Search shows a group's. */
const FIRST_ROWS = 8

/**
 * The songs a line of numerals (as a URL holds it) is heard in (ADR 0112, Chordify's "songs using
 * it"), each in its own key, wherever it is written in a key of `minor`'s mode, the learner's own
 * songs after the catalog's: the board's SONGS62, a 14px heading over one card of rows, each the
 * song's name and the bars it is heard in; none for a line of one chord, or one no song uses.
 */
export function ProgressionSongs({
  line,
  minor,
  modal,
}: {
  line: string
  minor: boolean
  /** Read in a mode: heard only where it comes back round (`heardLine`). */
  modal: boolean
}) {
  const { t } = useTranslation('practice')
  const id = useId()
  const repertoire = useRepertoire()
  const numerals = useMemo(() => heardLine(parseNumerals(line) ?? [], modal), [line, modal])
  const songs = useMemo(() => {
    const pieces: Piece[] = [
      ...PIECES.flatMap((each) => repertoire.piece(each.id) ?? []),
      ...repertoire.ownSongs,
    ].filter((piece) => piece.kind === 'song')
    return songsWith(pieces, numerals, minor)
  }, [repertoire, numerals, minor])
  const [all, setAll] = useState(false)
  if (new Set(numerals.map(numeralText)).size < 2 || songs.length === 0) return null
  const shown = all ? songs : songs.slice(0, FIRST_ROWS)
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2">
      <h3 id={id} className="font-sans text-sm font-semibold text-foreground">
        {t('progressions.songs.title')}
      </h3>
      <GroupRows surface="sheet">
        {shown.map(({ piece, places }) =>
          places[0] ? <SongRow key={piece.id} piece={piece} place={places[0]} /> : null,
        )}
      </GroupRows>
      {songs.length > shown.length ? (
        <Button variant="soft" className="self-start" onClick={() => setAll(true)}>
          {t('progressions.songs.all', { count: songs.length })}
        </Button>
      ) : null}
    </section>
  )
}

/** A song's row: its name and the bars it is first heard in; it opens the Player there, looped. */
function SongRow({ piece, place }: { piece: Piece; place: SongPlace }) {
  const { t } = useTranslation('piece')
  const { face } = useEntryFace(piece)
  const { first, last } = place.bars
  return (
    <GroupLink
      label={face.title}
      value={
        first === last
          ? t('barOne', { n: first + 1 })
          : t('barsFromTo', { first: first + 1, last: last + 1 })
      }
      render={
        <Link
          to="/play/$pieceId"
          params={{ pieceId: piece.id }}
          search={{ bar: first + 1, loop: loopParam(place.played) }}
          state={OPEN_PLAINLY}
        />
      }
    />
  )
}
