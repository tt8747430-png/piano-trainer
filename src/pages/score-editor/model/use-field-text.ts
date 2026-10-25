import { useState } from 'react'

/**
 * What a field over the sheet holds (ADR 0096): what is written at its place (`shown`), afresh at each
 * place it goes to (`at`), the learner's typing kept until it moves on.
 */
export function useFieldText(shown: string, at: string) {
  const [typed, setTyped] = useState({ at, text: shown })
  const text = typed.at === at ? typed.text : shown
  return [text, (next: string) => setTyped({ at, text: next })] as const
}
