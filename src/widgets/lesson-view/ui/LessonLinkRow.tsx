import { Link } from '@tanstack/react-router'
import {
  Blend,
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  CircleDot,
  CirclePlay,
  KeyboardMusic,
  Layers,
  ListMusic,
  Ruler,
  Waypoints,
} from 'lucide-react'
import type { LessonLink } from '@/entities/lesson'
import {
  keyParam,
  noteParam,
  numeralsParam,
  parseChordSymbol,
  parseNumerals,
  qualityParams,
} from '@/shared/lib/music'
import { RowLink } from '@/shared/ui'

/**
 * A row leading to what a lesson names, in the reference, tool or Player that shows it, with the tile
 * Learn gives that place.
 */
export function LessonLinkRow({ title: text, target }: { title: string; target: LessonLink }) {
  switch (target.place) {
    case 'chords': {
      const chord = parseChordSymbol(target.chord)
      return (
        <RowLink
          title={text}
          icon={KeyboardMusic}
          paint="sand"
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
          title={text}
          icon={ChartNoAxesColumnIncreasing}
          paint="sky"
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
          title={text}
          icon={CircleDot}
          paint="lilac"
          render={<Link to="/learn/keys" search={{ key: keyParam(target.key) }} />}
        />
      )
    case 'intervals':
      return (
        <RowLink
          title={text}
          icon={Ruler}
          paint="yellow"
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
          title={text}
          icon={Layers}
          paint="grass"
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
          title={text}
          icon={BookOpenText}
          paint="grass"
          render={<Link to="/learn/lessons/$lessonId" params={{ lessonId: target.lesson }} />}
        />
      )
    case 'progressions':
      return (
        <RowLink
          title={text}
          icon={ListMusic}
          paint="grass"
          render={
            <Link
              to="/learn/progressions"
              search={{
                key: keyParam(target.key),
                p: numeralsParam(parseNumerals(target.numerals) ?? []),
                size: target.size ?? 'triads',
              }}
            />
          }
        />
      )
    case 'passing-chords':
      return (
        <RowLink
          title={text}
          icon={Waypoints}
          paint="yellow"
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
          title={text}
          icon={Blend}
          paint="lilac"
          render={
            <Link
              to="/learn/reharmonise"
              search={{ key: keyParam(target.key), note: noteParam(target.note) }}
            />
          }
        />
      )
    case 'piece':
      return (
        <RowLink
          title={text}
          icon={CirclePlay}
          paint="sand"
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
