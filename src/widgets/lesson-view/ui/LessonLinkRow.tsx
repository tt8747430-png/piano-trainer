import { Link } from '@tanstack/react-router'
import {
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  CircleDot,
  KeyboardMusic,
  Layers,
  Ruler,
} from 'lucide-react'
import type { LessonLink } from '@/entities/lesson'
import { localText, useLocale, type LocalText } from '@/shared/i18n'
import { keyParam, noteParam, parseChordSymbol, qualityParams } from '@/shared/lib/music'
import { RowLink } from '@/shared/ui'

/** A row leading to what a lesson names, in the reference that shows it, with that reference's tile. */
export function LessonLinkRow({ title, target }: { title: LocalText; target: LessonLink }) {
  const locale = useLocale()
  const text = localText(title, locale)
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
  }
}
