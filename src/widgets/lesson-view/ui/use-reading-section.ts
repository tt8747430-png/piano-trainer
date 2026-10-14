import { useEffect, useState } from 'react'

/**
 * The section being read: the first of `ids` whose part of the page crosses the reading line, a
 * band under the pinned keys (the upper third of the screen). None until one is laid out.
 */
export function useReadingSection(ids: readonly string[]): string | null {
  const [reading, setReading] = useState<string | null>(null)
  const key = ids.join(' ')
  useEffect(() => {
    const across = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) across.add(entry.target.id)
          else across.delete(entry.target.id)
        }
        const first = key.split(' ').find((id) => across.has(id))
        if (first) setReading(first)
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    for (const id of key.split(' ')) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [key])
  return reading
}
