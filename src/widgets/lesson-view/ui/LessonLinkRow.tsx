import { Link } from '@tanstack/react-router'
import { CirclePlay } from 'lucide-react'
import { readProgression, type LessonLink } from '@/entities/lesson'
import { STEP_PAINT } from '@/entities/path'
import { pieceById } from '@/entities/piece'
import { keyParam, noteParam, numeralsParam, parseChordSymbol } from '@/shared/lib/music'
import { qualityParams } from '@/shared/lib'
import { LEARN_TILES, RowLink } from '@/shared/ui'

/**
 * A row leading to what a lesson names, in the reference, tool or Player that shows it, with the tile
 * Learn gives that page.
 */
export function LessonLinkRow({ title, target }: { title: string; target: LessonLink }) {
  switch (target.place) {
    case 'chords': {
      const chord = parseChordSymbol(target.chord)
      return (
        <RowLink
          title={title}
          {...LEARN_TILES.chords}
          render={
            <Link
              to="/learn/chords"
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
          {...LEARN_TILES.scales}
          render={
            <Link
              to="/learn/scales"
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
          {...LEARN_TILES.keys}
          render={<Link to="/learn/keys" search={{ key: keyParam(target.key) }} />}
        />
      )
    case 'intervals':
      return (
        <RowLink
          title={title}
          {...LEARN_TILES.intervals}
          render={
            <Link
              to="/learn/intervals"
              search={target.root ? { root: noteParam(target.root) } : {}}
            />
          }
        />
      )
    case 'tensions':
      return (
        <RowLink
          title={title}
          {...LEARN_TILES.tensions}
          render={
            <Link
              to="/learn/tensions"
              search={{
                chord: target.chord,
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
          {...LEARN_TILES.lesson}
          render={<Link to="/learn/lessons/$lessonId" params={{ lessonId: target.lesson }} />}
        />
      )
    case 'progressions': {
      const { numerals, key, size } = readProgression(target)
      return (
        <RowLink
          title={title}
          {...LEARN_TILES.progressions}
          render={
            <Link
              to="/learn/progressions"
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
          {...LEARN_TILES.passingChords}
          render={
            <Link
              to="/learn/passing-chords"
              search={{ key: keyParam(target.key), from: target.from, to: target.to }}
            />
          }
        />
      )
    case 'reharmonise':
      return (
        <RowLink
          title={title}
          {...LEARN_TILES.reharmonise}
          render={
            <Link
              to="/learn/reharmonise"
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
          paint={STEP_PAINT.progression}
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
