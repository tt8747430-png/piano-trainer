import { Fragment } from 'react'
import { hasAbout, type About } from '@/entities/lesson'
import { cn } from '@/shared/lib'
import { LessonBlock } from './LessonBlock'
import { SectionHeading, Takeaway } from './SectionParts'

const nothing = () => undefined

/**
 * A page's About as a learner reads it (R29 B9): its sections' headings, blocks and takeaways drawn
 * as a lesson draws them, each in its own style; a heading left blank is not drawn. Its examples play;
 * a question, which needs the lesson's keys, is not on an About. Nothing where it is empty.
 */
export function AboutView({
  about,
  label,
  className,
}: {
  about: About | undefined
  /** The region's name: "About this course". */
  label: string
  className?: string
}) {
  if (!hasAbout(about)) return null
  return (
    <section
      aria-label={label}
      className={cn('flex max-w-prose flex-col gap-4 text-lg leading-relaxed', className)}
    >
      {about.map((section, s) => (
        <Fragment key={s}>
          {section.heading.en.trim() || section.heading.ru.trim() ? (
            <SectionHeading text={section.heading} style={section.style} />
          ) : null}
          {section.blocks.map((block, b) =>
            block.kind === 'question' ? null : (
              <LessonBlock key={`${s}.${b}`} block={block} onShow={nothing} />
            ),
          )}
          {section.takeaway ? (
            <Takeaway text={section.takeaway} style={section.takeawayStyle} />
          ) : null}
        </Fragment>
      ))}
    </section>
  )
}
