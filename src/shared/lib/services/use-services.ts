import { use } from 'react'
import { ServicesContext } from './services-context'
import type { Services } from './types'

/** The only way code reaches audio and MIDI (CODE_STYLE §8). */
export function useServices(): Services {
  const services = use(ServicesContext)
  if (!services) throw new Error('useServices was called outside <ServicesProvider>')
  return services
}
