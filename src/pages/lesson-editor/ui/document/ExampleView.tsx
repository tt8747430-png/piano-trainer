import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react'
import { SlidersHorizontal } from 'lucide-react'
import { Component, use, useId, useState, type FocusEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { LessonBlock, LessonExample } from '@/entities/lesson'
import { i18n, type LocalText } from '@/shared/i18n'
import { cn, useMediaQuery } from '@/shared/lib'
import {
  C_MAJOR,
  CHORD_QUALITIES,
  INTERVAL_GROUPS,
  keyFromParam,
  keyParam,
  noteFromParam,
  noteParam,
  SCALE_KINDS,
} from '@/shared/lib/music'
import {
  Dropdown,
  InfoTip,
  KeyChoice,
  NoteChoice,
  Segmented,
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { LessonBlock as Shown } from '@/widgets/lesson-view'
import {
  blockExampleProblem,
  blockExamples,
  blockReads,
  withBlockExample,
} from '../../model/block-examples'
import { blockName } from './block-names'
import { LinkFields, PatternFields, VoicingsFields } from './ExampleFields'
import { DocLocale } from './doc-locale'

const nothing = () => undefined

/** An example drawn as the lesson shows it; where it cannot be drawn, nothing (its fields say why). */
class Drawn extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  override state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  override render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/**
 * An example written as a line of text in the block itself (a row of chords, a line of notes,
 * numerals, a question's answer): its name over a field, its format behind an ⓘ, and where it does
 * not read, the word at fault under it.
 */
function ExampleLine({
  block,
  example,
  onChange,
}: {
  block: LessonBlock
  example: LessonExample
  onChange: (block: LessonBlock) => void
}) {
  const { t } = useTranslation('learn')
  const id = useId()
  // What is typed, spaces and all: a row of chords keeps a symbol a word.
  const [typed, setTyped] = useState(example.text)
  const problem = blockExampleProblem(block, example)
  const label = t(`edit.example.${example.kind}`)
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <InfoTip name={label}>{t(`edit.example.${example.kind}Info`)}</InfoTip>
      </div>
      <Input
        id={id}
        value={typed}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        aria-invalid={problem !== null || undefined}
        aria-describedby={problem === null ? undefined : `${id}-problem`}
        className="font-mono"
        onChange={(event) => {
          setTyped(event.target.value)
          onChange(withBlockExample(block, example, event.target.value))
        }}
      />
      {problem === null ? null : (
        <p id={`${id}-problem`} className="text-xs text-destructive">
          {problem === '' ? t('edit.example.empty') : t('edit.example.unread', { word: problem })}
        </p>
      )}
    </div>
  )
}

/** An example's words in the document's language (a question's, a link's), written in place. */
function WordsLine({
  label,
  value,
  placeholder,
  onChange,
  className,
}: {
  label: string
  value: LocalText
  placeholder: string
  onChange: (text: LocalText) => void
  className?: string
}) {
  const locale = use(DocLocale)
  return (
    <Input
      aria-label={label}
      lang={locale}
      value={value[locale]}
      placeholder={placeholder}
      aria-invalid={value[locale].trim() === '' || undefined}
      className={className}
      onChange={(event) => onChange({ ...value, [locale]: event.target.value })}
    />
  )
}

/** The fields an example's kind has beyond its line of text: its key, clef, chord, scale or interval. */
function KindFields({
  block,
  onChange,
}: {
  block: LessonBlock
  onChange: (block: LessonBlock) => void
}): ReactNode {
  const { t } = useTranslation(['learn', 'music'])
  switch (block.kind) {
    case 'notes':
      return (
        <>
          <Segmented
            label={t('learn:edit.doc.clef')}
            value={block.clef === 'bass' ? 'bass' : 'treble'}
            options={[
              { value: 'treble' as const, label: t('learn:edit.doc.treble') },
              { value: 'bass' as const, label: t('learn:edit.doc.bass') },
            ]}
            onChange={(clef) => onChange({ ...block, clef })}
          />
          <KeyChoice
            value={keyParam(block.key ?? C_MAJOR)}
            onChange={(key) => onChange({ ...block, key: keyFromParam(key) })}
          />
        </>
      )
    case 'progression':
      return (
        <KeyChoice
          value={keyParam(block.key)}
          onChange={(key) => onChange({ ...block, key: keyFromParam(key) })}
        />
      )
    case 'grid':
      return (
        <Dropdown
          label={t('learn:edit.doc.quality')}
          value={block.quality}
          options={CHORD_QUALITIES.map((quality) => ({
            value: quality,
            label: t(`music:quality.${quality}`),
          }))}
          onChange={(quality) => onChange({ ...block, quality })}
        />
      )
    case 'scale':
      return (
        <>
          <NoteChoice
            label={t('learn:edit.doc.root')}
            value={noteParam(block.root)}
            onChange={(root) => onChange({ ...block, root: noteFromParam(root) })}
          />
          <Dropdown
            label={t('learn:edit.doc.scale')}
            value={block.scale}
            options={SCALE_KINDS.map((scale) => ({
              value: scale,
              label: t(`music:scaleKind.${scale}`),
            }))}
            onChange={(scale) => onChange({ ...block, scale })}
          />
        </>
      )
    case 'interval':
      return (
        <>
          <NoteChoice
            label={t('learn:edit.doc.root')}
            value={noteParam(block.root)}
            onChange={(root) => onChange({ ...block, root: noteFromParam(root) })}
          />
          <Dropdown
            label={t('learn:edit.doc.interval')}
            value={block.interval}
            options={[...INTERVAL_GROUPS.simple, ...INTERVAL_GROUPS.compound].map((interval) => ({
              value: interval,
              label: t(`music:interval.${interval}.name`),
            }))}
            onChange={(interval) => onChange({ ...block, interval })}
          />
        </>
      )
    case 'voicings':
      return <VoicingsFields block={block} onChange={onChange} />
    case 'pattern':
      return <PatternFields block={block} onChange={onChange} />
    case 'link':
      return <LinkFields block={block} onChange={onChange} />
    default:
      return null
  }
}

const HAS_FIELDS = new Set<LessonBlock['kind']>([
  'notes',
  'progression',
  'grid',
  'scale',
  'interval',
  'voicings',
  'pattern',
  'link',
])

/** An example's fields, opened from its button: a popover on a laptop, a bottom sheet on a phone. */
function FieldsPanel({ name, children }: { name: string; children: ReactNode }) {
  const { t } = useTranslation('learn')
  const wide = useMediaQuery('(min-width: 48rem)')
  const title = t('edit.doc.fields', { name })
  const trigger = (
    <Button variant="ghost" size="icon" className="ms-auto" aria-label={title} title={title} />
  )
  const body = <div className="flex flex-col gap-4">{children}</div>
  if (wide)
    return (
      <Popover>
        <PopoverTrigger render={trigger}>
          <SlidersHorizontal aria-hidden />
        </PopoverTrigger>
        <PopoverContent aria-label={title} align="end" className="w-96 p-4">
          {body}
        </PopoverContent>
      </Popover>
    )
  return (
    <Sheet>
      <SheetTrigger render={trigger}>
        <SlidersHorizontal aria-hidden />
      </SheetTrigger>
      <SheetContent title={title}>{body}</SheetContent>
    </Sheet>
  )
}

/**
 * An example of the lesson in the document (round 21): its name, drawn live as the lesson shows it,
 * its line of text typed in place under it with what does not read, its words in the document's
 * language, and its other fields behind its button (a popover, or a sheet on a phone).
 */
export function ExampleView({ node, updateAttributes, selected }: ReactNodeViewProps) {
  const { t } = useTranslation('learn')
  const locale = use(DocLocale)
  // As it reads until it is worked on (round 25): chosen, or a field of it focused.
  const [focused, setFocused] = useState(false)
  const block = node.attrs['block'] as LessonBlock | null
  if (!block) return <NodeViewWrapper />
  const working = selected || focused
  const words = i18n.getFixedT(locale, 'learn')
  const change = (next: LessonBlock) => updateAttributes({ block: next })
  const name = t(`edit.blocks.${blockName(block)}`)
  const examples = blockExamples(block)
  // Variants hold whole examples of their own: kept as written, moved, copied or deleted whole.
  const asWritten = block.kind === 'variants'
  return (
    <NodeViewWrapper
      data-example={block.kind}
      data-working={working ? '' : undefined}
      // A tap takes it, as a block of the document: its fields open.
      tabIndex={-1}
      onFocus={() => setFocused(true)}
      onBlur={(event: FocusEvent<HTMLElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
      className={cn(
        'my-5 flex cursor-pointer flex-col gap-3 rounded-3xl outline-offset-8 transition-[outline-color] duration-200 ease-out',
        working ? 'outline-2 outline-ring' : 'outline-2 outline-transparent hover:outline-border',
      )}
    >
      {/* What the example is and its fields: shown while it is worked on, the page reading as the
          lesson otherwise. */}
      <div className={cn('flex min-h-11 items-center gap-2', !working && 'hidden')}>
        <span className="text-sm font-semibold text-muted-foreground">{name}</span>
        {asWritten ? (
          <InfoTip name={name}>{t('edit.doc.asWritten')}</InfoTip>
        ) : HAS_FIELDS.has(block.kind) ? (
          <FieldsPanel name={name}>
            <KindFields block={block} onChange={change} />
          </FieldsPanel>
        ) : null}
      </div>
      {block.kind === 'question' ? (
        <WordsLine
          label={t('edit.doc.ask')}
          value={block.ask}
          placeholder={words('edit.doc.ask')}
          className="font-semibold"
          onChange={(ask) => change({ ...block, ask })}
        />
      ) : block.kind === 'link' ? (
        <WordsLine
          label={t('edit.doc.linkTitle')}
          value={block.title}
          placeholder={words('edit.doc.linkTitle')}
          onChange={(title) => change({ ...block, title })}
        />
      ) : null}
      {block.kind === 'question' ? null : blockReads(block) ? (
        <Drawn
          key={JSON.stringify(block)}
          fallback={<p className="text-sm text-muted-foreground">{t('edit.doc.notShown')}</p>}
        >
          <Shown block={block} onShow={nothing} />
        </Drawn>
      ) : (
        <p className="rounded-3xl bg-muted p-4 text-sm text-muted-foreground">
          {t('edit.doc.notShown')}
        </p>
      )}
      {working
        ? examples.map((example) => (
            <ExampleLine key={example.key} block={block} example={example} onChange={change} />
          ))
        : null}
    </NodeViewWrapper>
  )
}
