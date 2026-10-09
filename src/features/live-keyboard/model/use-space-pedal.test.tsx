import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { ServicesProvider } from '@/shared/lib/services'
import { useSpacePedal } from './use-space-pedal'

function Spaced({ enabled }: { enabled: boolean }) {
  useSpacePedal({ enabled })
  return (
    <>
      <input aria-label="Search" />
      <button type="button">Play</button>
    </>
  )
}

function setUp(enabled = true) {
  const audio = createFakeAudio()
  const view = render(
    <ServicesProvider services={{ audio, midi: null }}>
      <Spaced enabled={enabled} />
    </ServicesProvider>,
  )
  const rerender = (on: boolean) =>
    view.rerender(
      <ServicesProvider services={{ audio, midi: null }}>
        <Spaced enabled={on} />
      </ServicesProvider>,
    )
  return { audio, rerender, unmount: view.unmount }
}

const space = { code: 'Space', key: ' ' }
const sustain = (down: boolean) => ({ kind: 'pedal', pedal: 'sustain', down })

describe('useSpacePedal', () => {
  it('holds the sustain while Space is held, the page not scrolled', () => {
    const { audio } = setUp()
    const down = fireEvent.keyDown(document.body, space)
    expect(down).toBe(false)
    expect(audio.pedals().sustain).toBe(true)
    expect(fireEvent.keyDown(document.body, { ...space, repeat: true })).toBe(false)
    fireEvent.keyUp(document.body, space)
    expect(audio.voice).toEqual([sustain(true), sustain(false)])
  })

  it('leaves Space to a text field and to a focused control', () => {
    const { audio } = setUp()
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Search' }), space)
    fireEvent.keyDown(screen.getByRole('button', { name: 'Play' }), space)
    expect(audio.voice).toEqual([])
  })

  it('does nothing while it is not enabled', () => {
    const { audio } = setUp(false)
    fireEvent.keyDown(document.body, space)
    expect(audio.voice).toEqual([])
  })

  it('lifts the pedal as the window loses the focus, it is switched off, or the screen goes', () => {
    const { audio, rerender, unmount } = setUp()
    fireEvent.keyDown(document.body, space)
    act(() => void window.dispatchEvent(new Event('blur')))
    fireEvent.keyDown(document.body, space)
    rerender(false)
    rerender(true)
    fireEvent.keyDown(document.body, space)
    unmount()
    expect(audio.voice).toEqual([
      sustain(true),
      sustain(false),
      sustain(true),
      sustain(false),
      sustain(true),
      sustain(false),
    ])
  })
})
