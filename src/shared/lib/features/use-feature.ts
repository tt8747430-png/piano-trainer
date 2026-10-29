import { use } from 'react'
import { Context } from './context'

/** Whether a switched feature is on for this learner: off until the switches are known. */
export const useFeature = (key: string): boolean => use(Context).has(key)
