import { useEffect, useState } from 'react'
import { SILENCE_COUNTED_S } from '@/entities/progress'

/**
 * Whether the learner is at the keys, for the time practised (Metronaut: idle after a pause): while
 * the music runs on its own (`running`), or while it waits for them (`waiting`) up to
 * `SILENCE_COUNTED_S` after the last key (`touched` changes with each), the trainers' rule. A
 * learner who walks away from Wait mode adds no minutes.
 */
export function useAtTheKeys(running: boolean, waiting: boolean, touched: string): boolean {
  const [awake, setAwake] = useState(false)
  useEffect(() => {
    if (!waiting) {
      setAwake(false)
      return
    }
    setAwake(true)
    const timer = setTimeout(() => setAwake(false), SILENCE_COUNTED_S * 1000)
    return () => clearTimeout(timer)
  }, [waiting, touched])
  return running || awake
}
