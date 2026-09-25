import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { ServicesProvider, useServices, type Services } from './index'

describe('useServices', () => {
  it('reads the services the app was handed', () => {
    const services: Services = { audio: createFakeAudio(), midi: createFakeMidi() }
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ServicesProvider services={services}>{children}</ServicesProvider>
    )
    const { result } = renderHook(() => useServices(), { wrapper })
    expect(result.current).toBe(services)
  })

  it('names the provider it was read outside of', () => {
    expect(() => renderHook(() => useServices())).toThrow('<ServicesProvider>')
  })
})
