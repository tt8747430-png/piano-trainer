import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { VerdictShapes } from './VerdictShapes'

const head = (id: string, left: number) => ({
  id,
  staff: 'rh' as const,
  tick: 0,
  index: 0,
  left,
  right: left + 10,
  top: 40,
  bottom: 50,
})

describe('VerdictShapes', () => {
  it('draws each judged head’s shape beside it, and nothing by a head not judged', () => {
    const { container } = render(
      <VerdictShapes
        layout={{ heads: [head('n-rh-0-0', 20), head('n-rh-480-0', 60), head('n-rh-960-0', 100)] }}
        heads={
          new Map([
            ['n-rh-0-0', 'early'],
            ['n-rh-960-0', 'missed'],
          ])
        }
      />,
    )
    const shapes = [...container.querySelectorAll('[data-verdict]')]
    expect(shapes.map((shape) => [shape.getAttribute('data-verdict'), shape.textContent])).toEqual([
      ['early', '◂'],
      ['missed', '○'],
    ])
    expect((shapes[0] as HTMLElement).style.left).toBe('32px')
    expect((shapes[0] as HTMLElement).style.top).toBe('45px')
  })

  it('draws nothing without a verdict', () => {
    const { container } = render(<VerdictShapes layout={{ heads: [] }} heads={new Map()} />)
    expect(container).toBeEmptyDOMElement()
  })
})
