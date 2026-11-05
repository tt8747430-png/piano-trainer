import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import type { Question } from '@/features/trainer'
import { qualityParams } from '@/shared/lib'
import { keyParam, noteParam } from '@/shared/lib/music'

/**
 * A missed round's link to its page, on the thing it asked (A41): a chord in Chords, an interval's
 * lower note in Intervals, a scale in Scales and a key in Scales' Key, a key's line in Progressions.
 */
export function ReviewLink({
  question,
  ...props
}: {
  question: Question
  className?: string
  children?: ReactNode
}) {
  switch (question.mode) {
    case 'build-chord':
      if (question.cadence)
        return (
          <Link
            to="/practice/progressions/line"
            search={{ key: keyParam(question.cadence.key) }}
            {...props}
          />
        )
      return chordLink(question, props)
    case 'name-chord':
    case 'chord-card':
      return chordLink(question, props)
    case 'name-interval':
    case 'build-interval':
    case 'interval-card':
      return (
        <Link to="/practice/intervals" search={{ root: noteParam(question.lowNote) }} {...props} />
      )
    case 'build-scale':
    case 'name-scale':
      return (
        <Link
          to="/practice/scales"
          search={{ root: noteParam(question.root), kind: question.kind }}
          {...props}
        />
      )
    case 'key-signature':
    case 'key-degrees':
      return (
        <Link
          to="/practice/scales"
          search={{
            root: noteParam(question.key.tonic),
            kind: question.key.minor ? 'natural' : 'major',
            show: 'key',
          }}
          {...props}
        />
      )
    case 'name-progression':
      return (
        <Link
          to="/practice/progressions/line"
          search={{ key: keyParam(question.key), p: question.line }}
          {...props}
        />
      )
    case 'chord-role':
    case 'name-cadence':
    case 'cadence-card':
      return (
        <Link
          to="/practice/progressions/line"
          search={{ key: keyParam(question.key) }}
          {...props}
        />
      )
    case 'read-note':
      return null
  }
}

function chordLink(
  question: Extract<Question, { mode: 'build-chord' | 'name-chord' | 'chord-card' }>,
  props: { className?: string; children?: ReactNode },
) {
  return (
    <Link
      to="/practice/chords"
      search={{
        root: noteParam(question.root),
        ...qualityParams(question.quality),
        ...(question.inversion ? { inversion: question.inversion } : {}),
      }}
      {...props}
    />
  )
}
