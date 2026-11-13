import { Link } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import { stepLink, type LinkedStep } from '../model/step-link'

/** A step's way to where it is done (`stepLink`). */
export function StepLink({
  step,
  ...props
}: { step: LinkedStep } & Omit<ComponentProps<'a'>, 'href'>) {
  return <Link {...stepLink(step)} {...props} />
}
