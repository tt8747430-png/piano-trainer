import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { useState, type CSSProperties, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  imageSource,
  readProgression,
  type LessonBlock as Block,
  type LessonLink,
  type LessonVariant,
} from '@/entities/lesson'
import { pieceById } from '@/entities/piece'
import {
  IntervalCard,
  NotesExample,
  ChordRow,
  RowRoles,
  symbolsRow,
  progressionRow,
  RowStaff,
  RowPlay,
  ScaleExample,
  VoicingsExample,
} from '@/features/play-example'
import { localText, useLocale } from '@/shared/i18n'
import { C_MAJOR, keyParam, noteParam, numeralsParam } from '@/shared/lib/music'
import { styleVars, type BlockStyle } from '@/shared/lib/style'
import { isProgressionRow } from '../model/chord-example'
import { gridSymbols } from '../model/chord-grid'
import { ChordExamples } from './ChordExamples'
import { LessonLinkRow } from './LessonLinkRow'
import { PatternExample } from './PatternExample'
import { ButtonLink, ChoiceChips, Segmented, type ShownKeys } from '@/shared/ui'

/** One link on its card, as a lesson's rows are. */
function LinkCard({ title, target }: { title: string; target: LessonLink }) {
  return (
    <ul className="card px-2">
      <li>
        <LessonLinkRow title={title} target={target} />
      </li>
    </ul>
  )
}

/**
 * One example in versions: a switch for two (an A/B pair, heard one chord apart), a chip each for
 * more. Choosing one redraws the example, its chips and its caption in place; the caption names the
 * version's shape, a line under it says more.
 */
function VariantsBlock({
  variants,
  onShow,
  onFollow,
}: {
  variants: readonly LessonVariant[]
  onShow: (shown: ShownKeys) => void
  onFollow: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const [chosen, setChosen] = useState(0)
  const variant = variants[chosen] ?? variants[0]
  if (!variant) return null
  const options = variants.map((each, at) => ({ value: at, label: localText(each.label, locale) }))
  const choice =
    variants.length === 2 ? (
      <Segmented label={t('variants')} value={chosen} options={options} onChange={setChosen} />
    ) : (
      <ChoiceChips label={t('variants')} value={chosen} options={options} onChange={setChosen} />
    )
  return (
    <div className="flex flex-col gap-3">
      {/* A new version is a new example: what the last one played stops with it. */}
      <LessonBlock key={chosen} block={variant.example} onShow={onShow} onFollow={onFollow} />
      {choice}
      <p aria-live="polite" className="flex flex-col text-base">
        <span className="font-semibold">{localText(variant.caption, locale)}</span>
        {variant.text ? (
          <span className="text-muted-foreground">{localText(variant.text, locale)}</span>
        ) : null}
      </p>
    </div>
  )
}

/** A block in a style of its own (R29 B9): its card drawn by the theme's `[data-block-style]`. */
export function StyledBlock({ style, children }: { style: BlockStyle; children: ReactNode }) {
  return (
    <div data-block-style="" style={styleVars(style) as CSSProperties}>
      {children}
    </div>
  )
}

/** A picture by its https address, its words for who cannot see it; nothing for any other address. */
function ImageBlock({ src, alt }: { src: string; alt: string }) {
  const shown = imageSource(src)
  if (!shown) return null
  return (
    <figure>
      <img src={shown} alt={alt} loading="lazy" className="w-full rounded-card object-cover" />
    </figure>
  )
}

/**
 * One block of a lesson in its own style where it has one (R29 B9): see `BlockBody`.
 */
export function LessonBlock(props: {
  block: Exclude<Block, { kind: 'question' }>
  onShow: (shown: ShownKeys) => void
  onFollow?: (shown: ShownKeys) => void
}) {
  const body = <BlockBody {...props} />
  return props.block.style ? <StyledBlock style={props.block.style}>{body}</StyledBlock> : body
}

/**
 * One block of a lesson: prose with its bold lead, numbered steps, a note on sand, an example that
 * plays on the lesson's keys (a pattern over its piece, a progression as Progressions' row, beside a
 * way into Progressions), or a link
 * into an explorer, a tool or the Player. A question is the view's, which keeps its state. What a
 * line of notes shows as it plays on goes to `onFollow`, `onShow` unless given.
 */
function BlockBody({
  block,
  onShow,
  onFollow = onShow,
}: {
  block: Exclude<Block, { kind: 'question' }>
  onShow: (shown: ShownKeys) => void
  onFollow?: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation(['learn', 'music'])
  const locale = useLocale()
  switch (block.kind) {
    case 'text':
      return (
        <p>
          {block.lead ? <strong>{localText(block.lead, locale)} </strong> : null}
          {localText(block.text, locale)}
        </p>
      )
    case 'steps':
      return (
        <ol className="flex list-decimal flex-col gap-1 pl-5">
          {block.steps.map((step) => (
            <li key={step.en}>{localText(step, locale)}</li>
          ))}
        </ol>
      )
    case 'note':
      return block.rule ? (
        <div className="flex flex-col gap-1 card p-4">
          <p className="font-display text-xl font-semibold text-balance">
            {localText(block.rule, locale)}
          </p>
          <p className="text-base text-muted-foreground">{localText(block.text, locale)}</p>
        </div>
      ) : (
        <p className="rounded-card bg-muted p-4">{localText(block.text, locale)}</p>
      )
    case 'variants':
      return <VariantsBlock variants={block.variants} onShow={onShow} onFollow={onFollow} />
    case 'chords':
      return !block.melody && isProgressionRow(block.symbols, block.apart) ? (
        <ChordRow chords={symbolsRow(block.symbols)} onShow={onShow}>
          <RowStaff />
          <RowPlay variant="soft" />
        </ChordRow>
      ) : (
        <ChordExamples symbols={block.symbols} melody={block.melody} onShow={onShow} />
      )
    case 'grid':
      return <ChordExamples symbols={gridSymbols(block.quality)} onShow={onShow} />
    case 'scale':
      return <ScaleExample root={noteParam(block.root)} kind={block.scale} onShow={onShow} />
    case 'interval':
      return <IntervalCard root={noteParam(block.root)} name={block.interval} onShow={onShow} />
    case 'notes':
      return (
        <NotesExample
          notes={block.notes}
          {...(block.bass ? { bass: block.bass } : {})}
          clef={block.clef}
          meter={block.meter ?? '4/4'}
          keyParam={keyParam(block.key ?? C_MAJOR)}
          onShow={onShow}
          onFollow={onFollow}
        />
      )
    case 'voicings':
      return (
        <VoicingsExample
          voicings={block.voicings}
          musicKey={block.key}
          satb={block.satb === true}
          onShow={onShow}
          onFollow={onFollow}
        />
      )
    case 'pattern': {
      const piece = pieceById(block.piece)
      if (!piece) throw new RangeError(`A lesson plays a pattern over "${block.piece}": no piece`)
      return <PatternExample pattern={block.pattern} piece={piece} onShow={onShow} />
    }
    case 'progression': {
      const { numerals, key, size } = readProgression(block)
      const motion = block.show === 'motion'
      return (
        <ChordRow chords={progressionRow(numerals, key, size)} onShow={onShow}>
          <RowStaff />
          <RowRoles />
          {/* Play here, and the same row in Progressions to take further: in any key, walked. */}
          <div className="flex flex-wrap items-center gap-2">
            <RowPlay variant="soft" {...(motion ? { label: t('music:harmony.playChain') } : {})} />
            <ButtonLink
              variant="outline"
              render={
                <Link
                  to="/practice/progressions"
                  search={{
                    key: keyParam(key),
                    p: numeralsParam(numerals),
                    size,
                  }}
                />
              }
            >
              {t('example.inProgressions')}
              <ArrowUpRight aria-hidden data-icon="inline-end" />
            </ButtonLink>
          </div>
        </ChordRow>
      )
    }
    case 'link':
      return <LinkCard title={localText(block.title, locale)} target={block.target} />
    case 'image':
      return <ImageBlock src={block.src} alt={localText(block.alt, locale)} />
  }
}
