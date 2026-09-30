import { isStepId, type StepId } from '@/entities/path'
import type { Input, Raw } from './read-search'

// The Check: the step it checks; none is not found, so nothing is left out of the URL.
export interface CheckSearch {
  readonly of?: StepId
}
export function validateCheckSearch(input: Input<CheckSearch>): CheckSearch {
  const raw: Raw = input
  return { of: isStepId(raw.of) ? raw.of : undefined }
}
