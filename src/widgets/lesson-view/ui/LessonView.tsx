import { useState } from 'react'
import type { Lesson } from '@/entities/lesson'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { localText, useLocale } from '@/shared/i18n'
import type { Midi } from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'
import { placeExample } from '../model/chord-example'
import { LessonBlock } from './LessonBlock'

const NO_MARKS: ReadonlyMap<Midi, KeyMark> = new Map()

/** A lesson read top to bottom under a pinned keyboard that shows the chord last played from it. */
export function LessonView({ lesson }: { lesson: Lesson }) {
  const locale = useLocale()
  const [shown, setShown] = useState<string | null>(null)
  const example = shown === null ? null : placeExample(shown)
  return (
    <div className="flex flex-col gap-8">
      <ExplorerKeyboard keys={example?.keys ?? []} marks={example?.marks ?? NO_MARKS} />
      {lesson.sections.map((section) => (
        <section
          key={section.heading.en}
          className="flex max-w-prose flex-col gap-3 text-lg leading-relaxed"
        >
          <h2 className="text-2xl">{localText(section.heading, locale)}</h2>
          {section.blocks.map((block, i) => (
            <LessonBlock key={i} block={block} onShow={setShown} />
          ))}
        </section>
      ))}
    </div>
  )
}
