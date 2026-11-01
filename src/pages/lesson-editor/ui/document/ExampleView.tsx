import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react'
import {
  ChevronRight,
  CircleHelp,
  Copy,
  FilePen,
  Piano,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react'
import {
  Component,
  use,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import type { LessonBlock, LessonExample } from '@/entities/lesson'
import { i18n, type LocalText } from '@/shared/i18n'
import { cn } from '@/shared/lib'
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
import { Dropdown, InfoTip, KeyChoice, NoteChoice, Segmented, TileMark } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Textarea } from '@/shared/ui/primitives/textarea'
import { LessonBlock as Shown, linkTile } from '@/widgets/lesson-view'
import {
  blockExampleProblem,
  blockExamples,
  blockReads,
  withBlockExample,
} from '../../model/block-examples'
import { blockName } from './block-names'
import { LinkFields, PatternFields, VoicingsFields } from './ExampleFields'
import { DocLocale } from './doc-locale'
import { blockActions } from './menus'
import { OpenScore } from './open-score'

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
  named,
  onChange,
}: {
  block: LessonBlock
  example: LessonExample
  /** Its name shown over it: where the block has more than one line (notes and the left hand). */
  named: boolean
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
      {named ? (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      ) : null}
      <div className="flex items-center gap-1">
        <Input
          id={id}
          aria-label={named ? undefined : label}
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
        {/* How it is written, behind its ⓘ at the field's end. */}
        <InfoTip name={label}>{t(`edit.example.${example.kind}Info`)}</InfoTip>
      </div>
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
  // As long as its words, wrapped as they print (round 26): one line grows, never cut off.
  return (
    <Textarea
      aria-label={label}
      lang={locale}
      rows={1}
      value={value[locale]}
      placeholder={placeholder}
      aria-invalid={value[locale].trim() === '' || undefined}
      className={cn('min-h-10 resize-none', className)}
      // Its words are one line: Enter ends them rather than breaking it.
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.preventDefault()
      }}
      onChange={(event) => onChange({ ...value, [locale]: event.target.value.replace(/\n/g, ' ') })}
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

/** How many examples of notes stand before `pos` in the document: an example's place among them. */
function notesBefore(doc: ReactNodeViewProps['editor']['state']['doc'], pos: number | undefined) {
  let count = 0
  doc.descendants((each, at) => {
    if (pos === undefined || at >= pos) return false
    const block = each.attrs['block'] as LessonBlock | null | undefined
    if (block?.kind === 'notes') count += 1
    return true
  })
  return count
}

/** One of an example's tools: a 44px button on a phone, its name its tooltip. */
function Tool({
  label,
  onClick,
  pressed,
  destructive,
  children,
}: {
  label: string
  onClick: () => void
  pressed?: boolean
  destructive?: boolean
  children: ReactNode
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={cn('size-11 md:size-9', destructive && 'text-destructive hover:text-destructive')}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

/**
 * An example of the lesson in the document (round 21, round 28 as Notion's and Craft's atoms): drawn
 * as the lesson shows it, its question's or link's words typed where they print. Chosen, it is
 * outlined with its small toolbar floating over its top edge: Edit (its fields in a panel opened in
 * place under it, the same on a phone and a laptop: the page never covered), Edit music for notes,
 * Duplicate, Delete. Its kind is not written over it: the example says what it is.
 */
export function ExampleView({
  node,
  updateAttributes,
  selected,
  editor,
  getPos,
}: ReactNodeViewProps) {
  const { t } = useTranslation('learn')
  const locale = use(DocLocale)
  const openScore = use(OpenScore)
  // As it reads until it is worked on (round 25): chosen, or a field of it focused.
  const [focused, setFocused] = useState(false)
  const block = node.attrs['block'] as LessonBlock | null
  // Its fields open: at once for one that does not read yet (one just put in).
  const [opened, setOpened] = useState(() => block !== null && !blockReads(block))
  const panelId = useId()
  const working = selected || focused
  // Its fields close once it is let go: chosen again, it reads until its Edit.
  const was = useRef(working)
  useEffect(() => {
    if (was.current && !working) setOpened(false)
    was.current = working
  }, [working])
  if (!block) return <NodeViewWrapper />
  const open = opened && working
  const words = i18n.getFixedT(locale, 'learn')
  const change = (next: LessonBlock) => updateAttributes({ block: next })
  const name = t(`edit.blocks.${blockName(block)}`)
  const examples = blockExamples(block)
  // Variants hold whole examples of their own: kept as written, moved, copied or deleted whole.
  const asWritten = block.kind === 'variants'
  const editable = !asWritten && (HAS_FIELDS.has(block.kind) || examples.length > 0)
  const pos = getPos()
  const index = pos === undefined ? null : editor.state.doc.resolve(pos).index(0)
  const actions = index === null ? [] : blockActions(editor, index, t)
  return (
    <NodeViewWrapper
      data-example={block.kind}
      data-working={working ? '' : undefined}
      // A tap takes it, as a block of the document: its toolbar shows.
      tabIndex={-1}
      onFocus={() => setFocused(true)}
      onBlur={(event: FocusEvent<HTMLElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
      className={cn(
        'relative my-5 flex cursor-pointer flex-col gap-3 rounded-3xl outline-offset-6 transition-[outline-color] duration-200 ease-out',
        working ? 'outline-2 outline-ring' : 'outline-2 outline-transparent hover:outline-border',
      )}
    >
      {working ? (
        <div
          role="toolbar"
          aria-label={name}
          className="absolute -top-7 right-3 z-10 flex items-center gap-0.5 rounded-xl border border-border bg-raised p-0.5 elevation-2"
        >
          {editable ? (
            <Button
              variant={open ? 'secondary' : 'ghost'}
              className="h-11 gap-1.5 px-3 md:h-9"
              aria-expanded={open}
              aria-controls={open ? panelId : undefined}
              onClick={() => setOpened(!open)}
            >
              <SlidersHorizontal data-icon="inline-start" aria-hidden />
              {t('edit.doc.editExample')}
            </Button>
          ) : null}
          {asWritten ? <InfoTip name={name}>{t('edit.doc.asWritten')}</InfoTip> : null}
          {block.kind === 'notes' && openScore ? (
            // Its music on its own score, the score editor's (round 27): its place among the
            // lesson's examples of notes names it there.
            <Tool
              label={t('edit.doc.editMusic')}
              onClick={() => openScore(notesBefore(editor.state.doc, getPos()))}
            >
              <FilePen aria-hidden />
            </Tool>
          ) : null}
          {actions
            .filter((action) => action.key === 'duplicate' || action.key === 'remove')
            .map((action) => (
              <Tool
                key={action.key}
                label={action.label}
                destructive={action.destructive}
                onClick={action.onSelect}
              >
                {action.key === 'duplicate' ? <Copy aria-hidden /> : <Trash2 aria-hidden />}
              </Tool>
            ))}
        </div>
      ) : null}
      {block.kind === 'question' ? (
        // The question's card as the lesson shows it, its words typed where they print.
        <div className="flex flex-col gap-3 card p-4 text-base">
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-full bg-paint-lilac text-on-paint-lilac"
            >
              <CircleHelp className="size-5" />
            </span>
            <WordsLine
              label={t('edit.doc.ask')}
              value={block.ask}
              placeholder={words('edit.doc.ask')}
              className="h-auto min-h-10 flex-1 rounded-lg border-transparent bg-transparent px-1 font-semibold shadow-none md:text-base dark:bg-transparent"
              onChange={(ask) => change({ ...block, ask })}
            />
          </div>
          <span
            aria-hidden
            className="ml-13 inline-flex h-10 w-fit items-center gap-2 rounded-full border border-border px-4 text-sm font-medium"
          >
            <Piano className="size-4" />
            {words('question.answer')}
          </span>
        </div>
      ) : block.kind === 'link' ? (
        // The link's row on its card as the lesson shows it (round 26), its title typed where it
        // prints: one card, never a field over a copy of it.
        <div className="card px-2">
          <div className="flex min-h-16 items-center gap-3 py-2 pr-2 pl-1">
            <TileMark {...linkTile(block.target)} />
            <WordsLine
              label={t('edit.doc.linkTitle')}
              value={block.title}
              placeholder={words('edit.doc.linkTitle')}
              className="h-auto min-h-10 flex-1 rounded-lg border-transparent bg-transparent px-1 text-lg font-semibold shadow-none md:text-lg dark:bg-transparent"
              onChange={(title) => change({ ...block, title })}
            />
            <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
          </div>
        </div>
      ) : blockReads(block) ? (
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
      {open ? (
        // Its fields in place under it, as Obsidian's embeds open their source: nothing covers the
        // page, the example drawn anew over them as they change.
        <div
          id={panelId}
          role="group"
          aria-label={t('edit.doc.fields', { name })}
          className="flex cursor-auto flex-col gap-4 rounded-2xl border border-border bg-raised p-4"
        >
          {examples.map((example) => (
            <ExampleLine
              key={example.key}
              block={block}
              example={example}
              named={examples.length > 1}
              onChange={change}
            />
          ))}
          <KindFields block={block} onChange={change} />
        </div>
      ) : null}
    </NodeViewWrapper>
  )
}
