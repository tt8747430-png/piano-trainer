import type { Register } from 'claude-code'

import { registerCleanView } from './clean-view'
import { registerLeanOutput } from './lean-output'

export const register: Register = on => {
  registerCleanView(on)
  registerLeanOutput(on)
}
