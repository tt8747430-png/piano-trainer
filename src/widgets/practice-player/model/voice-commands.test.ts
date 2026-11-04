import { describe, expect, it } from 'vitest'
import { voiceCommand } from './voice-commands'

describe('voiceCommand (R29 B8)', () => {
  it.each([
    ['Play', 'play'],
    ['stop', 'stop'],
    ['again please', 'again'],
    ['a bit slower', 'slower'],
    ['Faster!', 'faster'],
    ['next', 'next'],
    ['go back', 'back'],
    ['Играй', 'play'],
    ['стоп', 'stop'],
    ['ещё раз', 'again'],
    ['медленнее', 'slower'],
    ['быстрее', 'faster'],
    ['дальше', 'next'],
    ['назад', 'back'],
  ] as const)('hears “%s” as %s', (heard, command) => {
    expect(voiceCommand(heard)).toBe(command)
  })

  it('takes the last command said, and nothing from other words', () => {
    expect(voiceCommand('play, no, stop')).toBe('stop')
    expect(voiceCommand('hello there')).toBeNull()
  })
})
