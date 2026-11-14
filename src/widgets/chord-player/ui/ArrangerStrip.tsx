import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ARRANGER_NUMBERS, MAINS, mainOf, SECTION } from '@/shared/lib/arrangement'
import { cn } from '@/shared/lib'
import type { ArrangerFollow } from '../model/use-arranger-follow'

const ROMAN = { 1: 'I', 2: 'II', 3: 'III' } as const

/** A panel button and its lamp, as the Genos lights it: on (chosen), or off. */
function Lamp({
  on,
  label,
  spoken,
  onClick,
}: {
  on: boolean
  label: string
  spoken?: string
  onClick(): void
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={spoken}
      title={spoken}
      onClick={onClick}
      className={cn(
        'relative h-9 min-w-11 flex-none rounded-[9px] px-[9px] text-[13px] font-bold whitespace-nowrap transition-colors duration-150 ease-out before:absolute before:inset-x-0 before:-inset-y-1 before:content-[""]',
        on
          ? 'bg-destructive text-destructive-foreground'
          : 'bg-card text-foreground shadow-[0_0_0_1px_var(--color-border)] hover:bg-muted',
      )}
    >
      {label}
    </button>
  )
}

/** A group of the panel's buttons under its name, as the Genos prints it. */
function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-none flex-col gap-1">
      <span
        aria-hidden
        className="text-[11px] font-semibold tracking-[.04em] text-muted-foreground uppercase"
      >
        {label}
      </span>
      <div className="flex gap-1">{children}</div>
    </div>
  )
}

/**
 * The arranger's style controls (canvas 171), over the dock while the Chord player follows it, laid out
 * and named as the Genos's panel: Start/Stop, Intro I–III, Main A–D (pressed again, its Fill-in) and
 * Break, Ending/rit. I–III (pressed again, rit.); each lamp lit as the panel's. Only what the Genos
 * takes over MIDI is here (Yamaha's Rhythm Start and Stop, Section Control).
 */
export function ArrangerStrip({ follow, device }: { follow: ArrangerFollow; device: string }) {
  const { t } = useTranslation('practice')
  const section = follow.section
  const main = section === null ? null : mainOf(section)
  const title = follow.running
    ? main
      ? t('chordPlayer.arranger.playingMain', { device, main })
      : t('chordPlayer.arranger.playing', { device })
    : t('chordPlayer.arranger.waiting', { device })
  return (
    <div
      role="toolbar"
      aria-label={t('chordPlayer.arranger.strip', { device })}
      className="flex w-full min-w-0 flex-col gap-1.5 rounded-[14px] bg-card py-2 pb-2.5 shadow-[0_0_0_1px_var(--color-border),0_10px_24px_-18px_rgb(51_41_33/0.45)]"
    >
      <div className="flex items-center gap-2 px-4">
        <span
          aria-hidden
          className={cn(
            'size-2 rounded-full',
            follow.running ? 'bg-learned' : 'bg-muted-foreground',
          )}
        />
        <span className="truncate text-[13px] font-semibold" aria-live="polite">
          {title}
        </span>
      </div>
      <div className="flex gap-3.5 overflow-x-auto px-4 [scrollbar-width:none]">
        <Group label={t('chordPlayer.arranger.style')}>
          <Lamp
            on={follow.running}
            label={t('chordPlayer.arranger.startStop')}
            onClick={follow.toggle}
          />
        </Group>
        <Group label={t('chordPlayer.arranger.introLabel')}>
          {ARRANGER_NUMBERS.map((n) => (
            <Lamp
              key={n}
              on={section === SECTION.intro[n]}
              label={ROMAN[n]}
              spoken={t('chordPlayer.arranger.intro', { n: ROMAN[n] })}
              onClick={() => follow.press(SECTION.intro[n])}
            />
          ))}
        </Group>
        <Group label={t('chordPlayer.arranger.mainLabel')}>
          {MAINS.map((each) => (
            <Lamp
              key={each}
              on={main === each}
              label={each}
              spoken={t('chordPlayer.arranger.main', { main: each })}
              onClick={() =>
                follow.press(
                  main === each && follow.running ? SECTION.fill[each] : SECTION.main[each],
                )
              }
            />
          ))}
          <Lamp
            on={section === SECTION.break}
            label={t('chordPlayer.arranger.into.break')}
            onClick={() => follow.press(SECTION.break)}
          />
        </Group>
        <Group label={t('chordPlayer.arranger.endingRit')}>
          {ARRANGER_NUMBERS.map((n) => (
            <Lamp
              key={n}
              on={section === SECTION.ending[n]}
              label={ROMAN[n]}
              spoken={t('chordPlayer.arranger.ending', { n: ROMAN[n] })}
              onClick={() => follow.press(SECTION.ending[n])}
            />
          ))}
        </Group>
      </div>
    </div>
  )
}
