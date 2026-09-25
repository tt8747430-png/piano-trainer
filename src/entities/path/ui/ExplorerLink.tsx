import { Link } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import { qualitiesIn } from '@/shared/lib/music'
import type { PathStep } from '../model/types'

export type ExplorerStep = Exclude<PathStep, { readonly kind: 'piece' }>

/** A chord or scale step's way into its explorer (spec §4.1), with the step panel open. */
export function ExplorerLink({
  step,
  ...props
}: { step: ExplorerStep } & Omit<ComponentProps<'a'>, 'href'>) {
  if (step.kind === 'scale') {
    return (
      <Link
        to="/theory/scales"
        search={{ kind: step.scale, step: `scale:${step.scale}` }}
        {...props}
      />
    )
  }
  const [quality] = qualitiesIn(step.family)
  return (
    <Link
      to="/theory/chords"
      search={{ ...(quality ? { quality } : {}), step: `chords:${step.family}` }}
      {...props}
    />
  )
}
