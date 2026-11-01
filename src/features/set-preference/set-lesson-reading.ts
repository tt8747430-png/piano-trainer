import type { LessonReading, SettingsStore } from '@/entities/settings'

/** How a lesson reads (round 26): one page of its sections, or a section at a time. */
export function setLessonReading(store: SettingsStore, lessonReading: LessonReading): void {
  store.setState({ lessonReading })
}
