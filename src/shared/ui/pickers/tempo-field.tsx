import { Minus, Play, Plus } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { unitNote, type TempoUnit } from '@/shared/lib/music'
import { useServices } from '@/shared/lib/services'
import { Button } from '../primitives/button'
import { Input } from '../primitives/input'
import { MenuPicker } from './MenuPicker'

/** The tempo words Flat offers, as a score prints them (Italian in every language). */
const TEMPO_TERMS = ['Largo', 'Adagio', 'Andante', 'Moderato', 'Allegro', 'Presto'] as const

/** A tempo mark as the score writes it: its number, the note it counts, its words (none: null). */
export interface TempoValue {
  readonly mark: number
  readonly unit: TempoUnit
  readonly text: string | null
}

/** How long a held − or + waits before it repeats, then how often it steps, in ms. */
const HOLD = 400
const REPEAT = 70

/** A − or + that steps once on a press and again and again while it is held. */
function HeldStep({
  label,
  disabled,
  onStep,
  children,
}: {
  label: string
  disabled: boolean
  onStep: () => void
  children: React.ReactNode
}) {
  const timer = useRef<number | null>(null)
  const step = useRef(onStep)
  useEffect(() => {
    step.current = onStep
  })
  const stop = () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = null
  }
  useEffect(() => stop, [])
  const repeat = (wait: number) => {
    timer.current = window.setTimeout(() => {
      step.current()
      repeat(REPEAT)
    }, wait)
  }
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={label}
      title={label}
      disabled={disabled}
      className="size-11 shrink-0 rounded-control"
      onPointerDown={(event) => {
        if (event.button !== 0) return
        step.current()
        repeat(HOLD)
      }}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      // A key press (Enter, Space) steps once; a pointer's press stepped already.
      onClick={(event) => (event.detail === 0 ? step.current() : undefined)}
    >
      {children}
    </Button>
  )
}

/**
 * The tempo control (A34, Flat's tempo popover): Beat, the note the mark counts (a dotted quarter
 * first in a compound meter); BPM, typed, ↑ ↓ a beat, ⇧ ten, − and + stepping while held; Tempo text,
 * Largo to Presto or the writer's own words, printed with the mark; ▶ Hear the tempo, four clicks at
 * it. `units` null leaves Beat out, `words` false the text (a mark mid-song counts the song's beat).
 */
export function TempoField({
  value,
  onChange,
  units,
  low,
  high,
  words = true,
}: {
  value: TempoValue
  onChange: (value: TempoValue) => void
  units: readonly TempoUnit[] | null
  low: number
  high: number
  words?: boolean
}) {
  const { t } = useTranslation(['music', 'editor'])
  const { audio } = useServices()
  const [typed, setTyped] = useState<string | null>(null)
  const kept = (mark: number) => Math.min(high, Math.max(low, Math.round(mark)))
  const set = (mark: number) => onChange({ ...value, mark: kept(mark) })
  const commit = () => {
    if (typed === null) return
    const read = Number.parseInt(typed, 10)
    if (Number.isFinite(read)) set(read)
    setTyped(null)
  }
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const by = { ArrowUp: 1, ArrowDown: -1 }[event.key]
    if (by !== undefined) {
      event.preventDefault()
      setTyped(null)
      set(value.mark + by * (event.shiftKey ? 10 : 1))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      commit()
    }
  }
  const custom = value.text !== null && !(TEMPO_TERMS as readonly string[]).includes(value.text)
  const [ownWords, setOwnWords] = useState(custom)
  const textChoice = value.text === null ? '' : ownWords || custom ? 'own' : value.text
  const hear = () => {
    void audio.unlock()
    const gap = 60 / value.mark
    audio.play(
      [0, 1, 2, 3].map((beat) => ({ kind: 'click', at: beat * gap, accent: beat === 0 })),
      audio.now() + 0.05,
    )
  }
  return (
    <div className="flex flex-col gap-3">
      {units ? (
        <Row name={t('tempoField.beat')}>
          <MenuPicker
            label={t('tempoField.beat')}
            value={value.unit}
            face={(unit) => (
              <span className="font-music text-2xl leading-none">{unitNote(unit)}</span>
            )}
            options={units.map((unit) => ({
              value: unit,
              label: t(`editor:tempo.units.${unit}`),
            }))}
            onChange={(unit) => onChange({ ...value, unit })}
          />
        </Row>
      ) : null}
      <Row name={t('tempoField.bpm')}>
        <div className="flex items-center gap-2">
          <HeldStep
            label={t('tempoField.slower')}
            disabled={value.mark <= low}
            onStep={() => set(value.mark - 1)}
          >
            <Minus aria-hidden />
          </HeldStep>
          <Input
            inputMode="numeric"
            enterKeyHint="done"
            aria-label={t('tempoField.bpm')}
            value={typed ?? String(value.mark)}
            onChange={(event) => setTyped(event.target.value.replace(/\D/g, '').slice(0, 3))}
            onBlur={commit}
            onKeyDown={onKeyDown}
            className="h-11 w-20 min-w-0 rounded-control bg-card text-center text-base font-semibold tabular-nums"
          />
          <HeldStep
            label={t('tempoField.faster')}
            disabled={value.mark >= high}
            onStep={() => set(value.mark + 1)}
          >
            <Plus aria-hidden />
          </HeldStep>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t('tempoField.hear')}
            title={t('tempoField.hear')}
            className="size-11 shrink-0 rounded-pill text-link"
            onClick={hear}
          >
            <Play aria-hidden />
          </Button>
        </div>
      </Row>
      {words ? (
        <>
          <Row name={t('tempoField.text')}>
            <MenuPicker
              label={t('tempoField.text')}
              value={textChoice}
              options={[
                { value: '', label: t('tempoField.noText') },
                ...TEMPO_TERMS.map((term) => ({ value: term, label: term })),
                { value: 'own', label: t('tempoField.ownText') },
              ]}
              onChange={(choice) => {
                setOwnWords(choice === 'own')
                onChange({
                  ...value,
                  text:
                    choice === '' ? null : choice === 'own' ? (custom ? value.text : '') : choice,
                })
              }}
            />
          </Row>
          {textChoice === 'own' ? (
            <Input
              aria-label={t('tempoField.ownText')}
              value={value.text ?? ''}
              maxLength={40}
              onChange={(event) => onChange({ ...value, text: event.target.value })}
              className="h-11 rounded-control bg-card text-base"
            />
          ) : null}
        </>
      ) : null}
    </div>
  )
}

/** A control's name at its left, as a settings row has it. */
function Row({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-11 items-center gap-3">
      <span aria-hidden className="w-24 shrink-0 text-sm">
        {name}
      </span>
      <div className="flex min-w-0 flex-1 justify-end">{children}</div>
    </div>
  )
}
