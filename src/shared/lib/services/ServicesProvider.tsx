import type { ReactNode } from 'react'
import { ServicesContext } from './services-context'
import type { Services } from './types'

/** Hands the app's audio and MIDI to every screen below it. Tests hand in fakes. */
export function ServicesProvider({
  services,
  children,
}: {
  services: Services
  children: ReactNode
}) {
  return <ServicesContext value={services}>{children}</ServicesContext>
}
