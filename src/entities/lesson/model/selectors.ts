import { LESSONS } from '../content'
import type { Lesson } from './types'

const LESSON_BY_ID = new Map(LESSONS.map((lesson) => [lesson.id, lesson]))

export const lessonById = (id: string): Lesson | undefined => LESSON_BY_ID.get(id)
