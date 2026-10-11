import { useEffect, useState } from 'react'
import { localDay } from '@/entities/progress'

/**
 * Today on the learner's calendar, moving on at midnight and when the app comes back into view: an
 * installed app left open overnight says the new day's.
 */
export function useToday(): string {
  const [today, setToday] = useState(() => localDay(new Date()))
  useEffect(() => {
    const look = () => setToday(localDay(new Date()))
    let timer: ReturnType<typeof setTimeout>
    const untilMidnight = () => {
      const now = new Date()
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1)
      timer = setTimeout(() => {
        look()
        untilMidnight()
      }, midnight.getTime() - now.getTime())
    }
    untilMidnight()
    document.addEventListener('visibilitychange', look)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', look)
    }
  }, [])
  return today
}
