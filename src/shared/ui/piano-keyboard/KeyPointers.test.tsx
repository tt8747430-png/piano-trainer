import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { midi } from '@/shared/lib/music'
import { stubBox } from '@/shared/test/layout'
import { PianoKeyboard } from './PianoKeyboard'

// The keys' group is 520 × 100: each of the 52 white keys is 10px wide, and C4 (white key 23)
// spans 230–240.
const C4 = midi(60)
const ONE_OCTAVE = { from: C4, to: midi(71) }
const x = (whiteIndex: number) => whiteIndex * 10 + 5
const touch = (pointerId: number, clientX: number, clientY = 90) => ({
  pointerId,
  pointerType: 'touch',
  clientX,
  clientY,
})

function setUp(props: Partial<ComponentProps<typeof PianoKeyboard>> = {}) {
  const onKeyPress = vi.fn()
  render(<PianoKeyboard range={ONE_OCTAVE} onKeyPress={onKeyPress} {...props} />)
  const keys = screen.getByRole('group', { name: 'Keyboard' })
  stubBox(keys, { width: 520, height: 100 })
  const key = (name: string) => screen.getByRole('button', { name })
  return { onKeyPress, keys, key }
}

describe('touching the keys', () => {
  it('plays a key the instant a pointer touches it, and draws it down until it lifts', () => {
    const { onKeyPress, key } = setUp()
    fireEvent.pointerDown(key('F sharp 4'), touch(1, 270, 30))
    expect(onKeyPress).toHaveBeenCalledExactlyOnceWith(66)
    expect(key('F sharp 4')).toHaveAttribute('data-down')
    fireEvent.pointerUp(key('F sharp 4'), touch(1, 270, 30))
    expect(key('F sharp 4')).not.toHaveAttribute('data-down')
  })

  it.each(['scroll', 'glissando'] as const)(
    'plays a tap once, its click included (%s)',
    async (swipe) => {
      const user = userEvent.setup()
      const { onKeyPress, key } = setUp({ swipe })
      await user.click(key('G4'))
      expect(onKeyPress).toHaveBeenCalledExactlyOnceWith(67)
    },
  )

  it('plays the focused key on Enter and Space, and a click no pointer made', async () => {
    const user = userEvent.setup()
    const { onKeyPress, key } = setUp({ swipe: 'glissando' })
    key('C4').focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    fireEvent.click(key('D4'))
    expect(onKeyPress.mock.calls).toEqual([[60], [60], [62]])
  })

  it.each(['scroll', 'glissando'] as const)(
    'holds the keys still under a finger, so a key that plays never scrolls (%s)',
    (swipe) => {
      const { keys } = setUp({ swipe })
      expect(keys).toHaveClass('touch-none')
    },
  )

  it('in Scroll, plays nothing more as the pointer moves, and lifts a press the browser cancels', () => {
    const { onKeyPress, keys, key } = setUp()
    fireEvent.pointerDown(key('C4'), touch(1, x(23)))
    fireEvent.pointerMove(keys, touch(1, x(25)))
    expect(onKeyPress).toHaveBeenCalledExactlyOnceWith(60)
    fireEvent.pointerCancel(keys, touch(1, x(25)))
    expect(key('C4')).not.toHaveAttribute('data-down')
  })

  it('in Glissando, plays each key a swipe enters, once per entry', () => {
    const { onKeyPress, keys, key } = setUp({ swipe: 'glissando' })
    fireEvent.pointerDown(key('C4'), touch(1, x(23)))
    for (const white of [23, 24, 24, 25, 24]) fireEvent.pointerMove(keys, touch(1, x(white)))
    expect(onKeyPress.mock.calls).toEqual([[60], [62], [64], [62]])
    expect(key('D4')).toHaveAttribute('data-down')
  })

  it('in Glissando, plays each pointer’s own keys', () => {
    const { onKeyPress, keys, key } = setUp({ swipe: 'glissando' })
    fireEvent.pointerDown(key('C4'), touch(1, x(23)))
    fireEvent.pointerDown(key('G4'), touch(2, x(27)))
    fireEvent.pointerMove(keys, touch(1, x(24)))
    fireEvent.pointerMove(keys, touch(2, x(28)))
    expect(onKeyPress.mock.calls).toEqual([[60], [67], [62], [69]])
  })

  it('in Glissando, forgets a mouse released outside the keys', () => {
    const { onKeyPress, keys, key } = setUp({ swipe: 'glissando' })
    const mouse = { pointerId: 1, pointerType: 'mouse', clientY: 90 }
    fireEvent.pointerDown(key('C4'), { ...mouse, button: 0, buttons: 1, clientX: x(23) })
    fireEvent.pointerMove(keys, { ...mouse, buttons: 0, clientX: x(24) })
    expect(onKeyPress).toHaveBeenCalledExactlyOnceWith(60)
    expect(key('C4')).not.toHaveAttribute('data-down')
  })
})
