import { useState } from 'react'

/**
 * What a field over the sheet holds (ADR 0096): what is written at its place (`shown`), afresh at each
 * place it goes to (`at`), the learner's typing kept until it goes on; and whether what was typed
 * could not be written there (`wrong`, `markWrong`), marked until it is typed again or it goes on.
 */
export function useFieldText(shown: string, at: string) {
  const fresh = { at, text: shown, wrong: false }
  const [typed, setTyped] = useState(fresh)
  // At another place, what is written there: the typing left at the last one is let go.
  if (typed.at !== at) setTyped(fresh)
  const here = typed.at === at ? typed : fresh
  return {
    text: here.text,
    wrong: here.wrong,
    setText: (text: string) => setTyped({ at, text, wrong: false }),
    markWrong: () => setTyped({ ...here, wrong: true }),
  }
}
