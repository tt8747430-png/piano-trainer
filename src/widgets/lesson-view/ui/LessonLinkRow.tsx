import { Link } from '@tanstack/react-router'
import { CirclePlay, Layers } from 'lucide-react'
import { readProgression, type LessonLink } from '@/entities/lesson'
import { STEP_PAINT } from '@/entities/step'
import { pieceById } from '@/entities/piece'
import {
  keyParam,
  keyScale,
  note,
  noteParam,
  numeralsParam,
  parseChordSymbol,
} from '@/shared/lib/music'
import { qualityParams } from '@/shared/lib'
import { PAGE_TILES, RowLink } from '@/shared/ui'
import { typedSearch } from '@/widgets/progression-explorer'

/**
 * A row leading to what a lesson names, on the page or in the Player that shows it, with that page's
 * own tile.
 */
export function LessonLinkRow({ title, target }: { title: string; target: LessonLink }) {
  switch (target.opens) {
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
    case 'key':
      return (
        <RowLink
          title={title}
          {...PAGE_TILES.key}
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
          render={<Link to="/lessons/$lessonId" params={{ lessonId: target.lesson }} />}
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
    case 'between': {
      // The two chords as a typed line in their key: Between opens on the row's first change.
      const search = typedSearch(`${target.from} ${target.to}`, target.key)
      if (!search)
        throw new RangeError(`A lesson's chords "${target.from} ${target.to}" do not read`)
      return (
        <RowLink
          title={title}
          {...PAGE_TILES.progressions}
          render={<Link to="/practice/progressions" search={search} />}
        />
      )
    }
    case 'harmonise':
      return (
        <RowLink
          title={title}
          {...PAGE_TILES.key}
          render={
            <Link
              to="/practice/scales"
              search={{
                root: noteParam(target.key.tonic),
                kind: keyScale(target.key),
                show: 'key',
                melody: noteParam(target.note),
              }}
            />
          }
        />
      )
    case 'song-chords': {
      const search = typedSearch(target.chords, { tonic: note('C'), minor: false })
      if (!search) throw new RangeError(`A lesson's chords "${target.chords}" do not read`)
      return (
        <RowLink
          title={title}
          {...PAGE_TILES.progressions}
          render={<Link to="/practice/progressions" search={search} />}
        />
      )
    }
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
                // A lesson's inversion is every chord's: Nearest off.
                ...(target.inversion === undefined
                  ? {}
                  : { inversion: target.inversion, nearest: false }),
              }}
            />
          }
        />
      )
    }
    case 'exercise':
      return (
        <RowLink
          title={title}
          icon={Layers}
          paint="sky"
          render={
            <Link
              to="/play/exercise/$exerciseId"
              params={{ exerciseId: target.exercise }}
              search={{
                ...(target.root ? { root: noteParam(target.root) } : {}),
                ...(target.quality ? { quality: target.quality } : {}),
                ...(target.kind ? { kind: target.kind } : {}),
              }}
            />
          }
        />
      )
    case 'quiz':
      return (
        <RowLink
          title={title}
          {...PAGE_TILES.quiz}
          render={<Link to="/practice/quiz/$trainerId" params={{ trainerId: target.trainer }} />}
        />
      )
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
