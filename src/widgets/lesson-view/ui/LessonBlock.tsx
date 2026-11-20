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
import { ExampleKeys } from '@/features/live-keyboard'
import {
  intervalExample,
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
import { C_MAJOR, keyParam, noteFromParam, noteParam, numeralsParam } from '@/shared/lib/music'
import { styleVars, type BlockStyle } from '@/shared/lib/style'
import { isProgressionRow } from '../model/chord-example'
import { gridSymbols } from '../model/chord-grid'
import { ChordExamples } from './ChordExamples'
import { LessonLinkRow } from './LessonLinkRow'
import { PatternExample } from './PatternExample'
import { ButtonLink, ChoiceChips, NO_KEYS, Segmented, type ShownKeys } from '@/shared/ui'

/**
 * An example that sounds and shows no keys of its own: its staff or its row is its picture (the
 * Lesson boards draw keys under a scale, an interval, a chord on every root, voicings and a question
 * alone).
 */
const SOUNDS_ONLY: (shown: ShownKeys) => void = () => {}

/**
 * An example over its own keys (the Lesson boards' PKEYS under it): they show what it played last,
 * `first` until it has played.
 */
function OwnKeys({
  first = NO_KEYS,
  children,
}: {
  first?: ShownKeys
  children: (onShow: (shown: ShownKeys) => void) => ReactNode
}) {
  const [shown, setShown] = useState(first)
  return (
    <div className="flex flex-col gap-3">
      {children(setShown)}
      <ExampleKeys shown={shown} />
    </div>
  )
}

/**
 * One link as the Lesson boards draw it: on the paper with no card, a 60 row from the column's edge,
 * its 44 tile, its title and the chevron.
 */
function LinkCard({ title, target }: { title: string; target: LessonLink }) {
  return (
    <ul className="[&_a]:min-h-15 [&_a]:px-0 [&_[data-slot=row-tile]_svg]:size-5">
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
function VariantsBlock({ variants }: { variants: readonly LessonVariant[] }) {
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
      <LessonBlock key={chosen} block={variant.example} />
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
export function LessonBlock(props: { block: Exclude<Block, { kind: 'question' }> }) {
  const body = <BlockBody {...props} />
  return props.block.style ? <StyledBlock style={props.block.style}>{body}</StyledBlock> : body
}

/**
 * One block of a lesson: prose with its bold lead, numbered steps, a note on sand, an example (a
 * scale, an interval, a chord on every root or voicings over their own keys; a pattern over its
 * piece, a progression as Progressions' row beside a way into Progressions), or a link into an
 * explorer, a tool or the Player. A question is the view's.
 */
function BlockBody({ block }: { block: Exclude<Block, { kind: 'question' }> }) {
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
        // As a writing app sets a numbered list (the canvas's .steps): indented 8, each number muted
        // and right-aligned in its own 28 column so the words hang on one edge, 6 between items, each
        // 65ch at most and wrapped with no word alone on its last line.
        <ol className="flex flex-col gap-2 ps-2 [counter-reset:step]">
          {block.steps.map((step) => (
            <li
              key={step.en}
              className="grid max-w-[65ch] grid-cols-[1.75rem_minmax(0,1fr)] text-pretty [counter-increment:step] before:pe-2 before:text-right before:text-muted-foreground before:tabular-nums before:content-[counter(step)'.']"
            >
              {localText(step, locale)}
            </li>
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
        // The boards' aside: on its wash, sized to its words, "Note" in the soft caps over them.
        <aside className="flex max-w-[65ch] flex-col gap-0.5 self-start rounded-xl bg-muted px-4 py-3">
          <span className="text-xs font-bold tracking-[0.04em] text-muted-foreground uppercase">
            {t('example.note')}
          </span>
          <span className="text-base/[1.45]">{localText(block.text, locale)}</span>
        </aside>
      )
    case 'variants':
      return <VariantsBlock variants={block.variants} />
    case 'chords':
      return !block.melody && isProgressionRow(block.symbols, block.apart) ? (
        <ChordRow chords={symbolsRow(block.symbols)} onShow={SOUNDS_ONLY}>
          <RowStaff />
          <RowPlay variant="soft" />
        </ChordRow>
      ) : (
        <ChordExamples symbols={block.symbols} melody={block.melody} onShow={SOUNDS_ONLY} />
      )
    case 'grid':
      return (
        <OwnKeys>
          {(onShow) => <ChordExamples symbols={gridSymbols(block.quality)} onShow={onShow} />}
        </OwnKeys>
      )
    case 'scale':
      return <ScaleExample root={noteParam(block.root)} kind={block.scale} />
    case 'interval': {
      const root = noteParam(block.root)
      return (
        <OwnKeys first={intervalExample(noteFromParam(root), block.interval).shown}>
          {(onShow) => <IntervalCard root={root} name={block.interval} onShow={onShow} />}
        </OwnKeys>
      )
    }
    case 'notes':
      return (
        <NotesExample
          notes={block.notes}
          {...(block.bass ? { bass: block.bass } : {})}
          clef={block.clef}
          meter={block.meter ?? '4/4'}
          keyParam={keyParam(block.key ?? C_MAJOR)}
          onShow={SOUNDS_ONLY}
        />
      )
    case 'voicings':
      return (
        <OwnKeys>
          {(onShow) => (
            <VoicingsExample
              voicings={block.voicings}
              musicKey={block.key}
              satb={block.satb === true}
              onShow={onShow}
            />
          )}
        </OwnKeys>
      )
    case 'pattern': {
      const piece = pieceById(block.piece)
      if (!piece) throw new RangeError(`A lesson plays a pattern over "${block.piece}": no piece`)
      return <PatternExample pattern={block.pattern} piece={piece} onShow={SOUNDS_ONLY} />
    }
    case 'progression': {
      const { numerals, key, size } = readProgression(block)
      const motion = block.show === 'motion'
      return (
        <ChordRow chords={progressionRow(numerals, key, size)} onShow={SOUNDS_ONLY}>
          <RowStaff />
          <RowRoles />
          {/* Play here, and the same row in Progressions to take further: in any key, walked. */}
          <div className="flex flex-wrap items-center gap-2">
            <RowPlay variant="soft" {...(motion ? { label: t('music:harmony.playChain') } : {})} />
            <ButtonLink
              variant="outline"
              render={
                <Link
                  to="/practice/progressions/line"
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
