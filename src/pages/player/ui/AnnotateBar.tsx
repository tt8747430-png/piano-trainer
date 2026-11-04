import { Check, Eraser } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ANNOTATION_TEXT_MAX, type Annotation, type AnnotationKind } from '@/entities/piece'
import type { StaffId } from '@/shared/lib/notation'
import { Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'

/** The dynamics a learner marks, softest first. */
const DYNAMICS = ['pp', 'p', 'mp', 'mf', 'f', 'ff'] as const
const FINGERS = [1, 2, 3, 4, 5] as const

/** Each mark's face on its button: what it prints. */
const FACE: Readonly<Record<AnnotationKind, string>> = {
  text: 'Aa',
  fingering: '1–5',
  dynamic: 'mf',
  breath: '’',
  pause: '𝄐',
  circle: '◯',
}

/**
 * Annotate (R29 B8, D7: typed, not drawn): a bar floating over the score's head while it is on. The
 * cursor's place (a note or a beat tapped moves it) on the staff chosen takes the mark picked: Text,
 * Fingering 1–5, a dynamic (pp to ff), a breath mark, a pause (fermata) or a circle; Clear takes the
 * place's marks away; Done ends it.
 */
export function AnnotateBar({
  at,
  staves,
  onMark,
  onClear,
  onDone,
}: {
  /** The cursor's tick: where a mark goes. */
  at: number
  /** The staves a mark may go on, top down. */
  staves: readonly StaffId[]
  onMark: (mark: Annotation) => void
  onClear: (at: number, staff: StaffId) => void
  onDone: () => void
}) {
  const { t } = useTranslation('player')
  const [staff, setStaff] = useState<StaffId>(staves[0] ?? 'treble')
  const [text, setText] = useState('')
  const [open, setOpen] = useState<AnnotationKind | null>(null)
  const mark = (made: Annotation) => {
    onMark(made)
    setOpen(null)
  }
  const chooser = (kind: 'text' | 'fingering' | 'dynamic') => (
    <Popover open={open === kind} onOpenChange={(next) => setOpen(next ? kind : null)}>
      <PopoverTrigger
        render={
          <Button
            variant="tool"
            aria-label={t(`annotate.kind.${kind}`)}
            title={t(`annotate.kind.${kind}`)}
          />
        }
      >
        {FACE[kind]}
      </PopoverTrigger>
      <PopoverContent aria-label={t(`annotate.kind.${kind}`)} className="w-64 gap-2 p-2">
        {kind === 'text' ? (
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              const value = text.trim()
              if (value) mark({ at, staff, kind: 'text', value })
              setText('')
            }}
          >
            <Input
              aria-label={t('annotate.kind.text')}
              value={text}
              maxLength={ANNOTATION_TEXT_MAX}
              onChange={(event) => setText(event.target.value)}
            />
            <Button type="submit">{t('annotate.add')}</Button>
          </form>
        ) : (
          <div className="flex flex-wrap gap-1">
            {(kind === 'fingering' ? FINGERS : DYNAMICS).map((value) => (
              <Button
                key={value}
                variant="outline"
                className="min-w-11"
                onClick={() =>
                  kind === 'fingering'
                    ? mark({ at, staff, kind, value: value as (typeof FINGERS)[number] })
                    : mark({
                        at,
                        staff,
                        kind: 'dynamic',
                        value: value as (typeof DYNAMICS)[number],
                      })
                }
              >
                {value}
              </Button>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
  return (
    <div
      role="toolbar"
      aria-label={t('annotate.label')}
      className="card absolute inset-x-0 top-[calc(var(--tools-room,0px)+0.5rem)] z-20 mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-1 p-1 shadow-md"
    >
      {staves.length > 1 ? (
        <Segmented
          label={t('annotate.staff')}
          value={staff}
          options={staves.map((value, place) => ({
            value,
            label: t(place === 0 ? 'annotate.upper' : 'annotate.lower'),
          }))}
          onChange={setStaff}
        />
      ) : null}
      {chooser('text')}
      {chooser('fingering')}
      {chooser('dynamic')}
      {(['breath', 'pause', 'circle'] as const).map((kind) => (
        <Button
          key={kind}
          variant="tool"
          aria-label={t(`annotate.kind.${kind}`)}
          title={t(`annotate.kind.${kind}`)}
          onClick={() => mark({ at, staff, kind })}
        >
          {FACE[kind]}
        </Button>
      ))}
      <Button
        variant="tool"
        size="icon"
        aria-label={t('annotate.clear')}
        title={t('annotate.clear')}
        onClick={() => onClear(at, staff)}
      >
        <Eraser aria-hidden />
      </Button>
      <Button variant="tool" onClick={onDone}>
        <Check data-icon="inline-start" />
        {t('annotate.done')}
      </Button>
    </div>
  )
}
