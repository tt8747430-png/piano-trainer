import { Link } from '@tanstack/react-router'
import { CirclePlay } from 'lucide-react'
import { readProgression, type LessonLink } from '@/entities/lesson'
import { STEP_PAINT } from '@/entities/path'
import { pieceById } from '@/entities/piece'
import { keyParam, keyScale, noteParam, numeralsParam, parseChordSymbol } from '@/shared/lib/music'
import { qualityParams } from '@/shared/lib'
import { PAGE_TILES, RowLink } from '@/shared/ui'

/**
 * A row leading to what a lesson names, on the page or in the Player that shows it, with that page's
 * own tile.
 */
export function LessonLinkRow({ title, target }: { title: string; target: LessonLink }) {
  switch (target.place) {
    case 'chords': {
      const chord = parseChordSymbol(target.chord)
      return (
        <RowLink
          title={title}
          {...PAGE_TILES.chords}
          render={
            <Link
              to="/practice/chords"
              search={{ root: noteParam(chord.root), ...qualityParams(chord.quality) }}
            />
          }
        />
      )
    }
    case 'scales':
      return (
        <RowLink
          title={title}
          {...PAGE_TILES.scales}
          render={
            <Link
              to="/practice/scales"
              search={{
                root: noteParam(target.root),
                kind: target.scale,
                ...(target.show ? { show: target.show } : {}),
              }}
            />
          }
        />
      )
    case 'keys':
      return (
        <RowLink
          title={title}
          {...PAGE_TILES.keys}
          render={
            <Link
              to="/practice/scales"
              search={{
                root: noteParam(target.key.tonic),
                kind: keyScale(target.key),
                show: 'key',
              }}
            />
          }
        />
      )
    case 'intervals':
      return (
        <RowLink
          title={title}
          {...PAGE_TILES.intervals}
          render={
            <Link
              to="/practice/intervals"
              search={target.root ? { root: noteParam(target.root) } : {}}
            />
          }
        />
      )
    case 'tensions':
      return (
        <RowLink
          title={title}
          {...PAGE_TILES.tensions}
          render={
            <Link
              to="/practice/chords"
              search={{
                ...qualityParams(target.chord),
                ...(target.root ? { root: noteParam(target.root) } : {}),
              }}
            />
          }
        />
      )
    case 'lesson':
      return (
        <RowLink
          title={title}
          {...PAGE_TILES.lesson}
          render={<Link to="/learn/lessons/$lessonId" params={{ lessonId: target.lesson }} />}
        />
      )
    case 'progressions': {
      const { numerals, key, size } = readProgression(target)
      return (
        <RowLink
          title={title}
          {...PAGE_TILES.progressions}
          render={
            <Link
              to="/practice/progressions"
              search={{ key: keyParam(key), p: numeralsParam(numerals), size }}
            />
          }
        />
      )
    }
    case 'passing-chords':
      return (
        <RowLink
          title={title}
          {...PAGE_TILES.passingChords}
          render={
            <Link
              to="/practice/progressions/passing"
              search={{ key: keyParam(target.key), from: target.from, to: target.to }}
            />
          }
        />
      )
    case 'reharmonise':
      return (
        <RowLink
          title={title}
          {...PAGE_TILES.reharmonise}
          render={
            <Link
              to="/practice/progressions/reharmonise"
              search={{ key: keyParam(target.key), note: noteParam(target.note) }}
            />
          }
        />
      )
    case 'player': {
      const { numerals, key, size } = readProgression(target)
      return (
        <RowLink
          title={title}
          icon={CirclePlay}
          paint={PAGE_TILES.progressions.paint}
          render={
            <Link
              to="/play/progression"
              search={{
                p: numeralsParam(numerals),
                key: keyParam(key),
                ...(size === 'triads' ? {} : { chordSize: size }),
                ...(target.walk ? { walk: target.walk } : {}),
                ...(target.inversion === undefined ? {} : { inversion: target.inversion }),
              }}
            />
          }
        />
      )
    }
    case 'piece': {
      const piece = pieceById(target.piece)
      if (!piece) throw new RangeError(`A lesson links to "${target.piece}": no piece`)
      return (
        <RowLink
          title={title}
          icon={CirclePlay}
          paint={STEP_PAINT[piece.kind]}
          render={
            <Link
              to="/play/$pieceId"
              params={{ pieceId: target.piece }}
              search={target.pattern ? { pattern: target.pattern } : {}}
            />
          }
        />
      )
    }
  }
}
