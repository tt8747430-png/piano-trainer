import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Link } from '@tanstack/react-router'
import { ChevronDown, Dices, Plus, Repeat, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { styleBook, styleVariations, usePatternBook } from '@/entities/pattern'
import { libraryParam, progressionMode } from '@/entities/progression-library'
import { selectChordPlayer, useSettings } from '@/entities/settings'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { localText, useKeyName, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import {
  barCount,
  duplicateSection,
  insertChord,
  moveChord,
  moveSection,
  MOST_SECTIONS,
  relayMeter,
  removeChord,
  removeSection,
  resizeChord,
  setChord,
  withSection,
  addSection,
  type ChordSheet,
  type SheetSection as Section,
} from '@/shared/lib/arrangement'
import {
  beatsPerBar,
  keyParam,
  numeralChord,
  numeralOf,
  numeralsParam,
  parseNumerals,
  printedChord,
  randomProgression,
  readChordSymbol,
  type Chord,
  type Numeral,
} from '@/shared/lib/music'
import { useShortcuts } from '@/shared/lib/shortcuts'
import {
  ButtonLink,
  confirm,
  FloatingActions,
  FloatingBar,
  FloatingBarButton,
  FloatingBarPlay,
  NO_KEYS,
  say,
  Stepper,
  OpensMark,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { SHEET_TEMPO } from '@/entities/chord-sheet'
import type { BoxPlace } from '../model/engine'
import type { ChordSheetInHand } from '../model/use-chord-sheet'
import { useChordTransport } from '../model/use-chord-transport'
import { ChordDialog } from './ChordDialog'
import { LibrarySheet } from './LibrarySheet'
import { SheetSection, type BoxActs } from './SheetSection'
import { StyleSheet } from './StyleSheet'

/** Where the Chord player's links go: a saved sheet opened, the sheet in hand, a progression put in hand. */
export interface ChordPlayerRoutes {
  /** One of My chord sheets opened (its id), or the sheet in hand (none). */
  openSheet(id: string | undefined): void
  /** A progression from the library put in hand as one Verse: its numerals, in a major or minor key. */
  openLine(numerals: readonly Numeral[], minor: boolean, name: string): void
}

/** Every chord of the sheet as a numeral in its key, or null where one is not (the Player's line). */
function sheetNumerals(sheet: ChordSheet): Numeral[] | null {
  const numerals = sheet.sections.flatMap((section) =>
    section.chords.map(({ chord }) => numeralOf(chord, sheet.key)),
  )
  return numerals.length > 0 && numerals.every((numeral) => numeral !== null)
    ? (numerals as Numeral[])
    : null
}

/**
 * The Chord player (R29 CP1–CP6): the head (the sheet's name opening the Library, its Style, Tempo
 * and key), the sheet's sections of bars and chord boxes, Randomize and Add section at its foot, the
 * on-screen piano, and the floating transport (Play on Space, Loop, Practise in the Player).
 */
export function ChordPlayer({
  hand,
  sheetId,
  name,
  routes,
}: {
  hand: ChordSheetInHand
  /** One of My chord sheets (`?sheet=`), or none: the sheet in hand. */
  sheetId: string | undefined
  /** Its name: a saved sheet's, or "New chord sheet". */
  name: string
  routes: ChordPlayerRoutes
}) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const keyName = useKeyName()
  const patterns = usePatternBook()
  const book = useMemo(() => styleBook(patterns), [patterns])
  const prefs = useSettings(selectChordPlayer)
  const { shown, entry } = hand
  const style = book.get(entry.style)
  const variations = styleVariations(style)
  const transport = useChordTransport({
    sheet: shown,
    style,
    tempo: entry.tempo,
    settings: entry.settings,
    block: prefs.voicing === 'block',
  })
  const [typing, setTyping] = useState<{ place: BoxPlace; text: string } | null>(null)
  const [dialog, setDialog] = useState<BoxPlace | null>(null)
  const [library, setLibrary] = useState(false)
  const [styles, setStyles] = useState(false)
  const meter = shown.meter

  const inSection = (section: number, change: (each: Section) => Section) =>
    hand.editShown((sheet) => withSection(sheet, section, change))
  const chordAt = (place: BoxPlace) => shown.sections[place.section]?.chords[place.index]
  const acts: BoxActs = {
    type(place, text) {
      const chord = readChordSymbol(text)
      if (!chord) {
        say(t('chordPlayer.unread', { text }))
        return false
      }
      inSection(place.section, (section) => setChord(section, place.index, chord))
      return true
    },
    open: setDialog,
    remove(place) {
      const gone = chordAt(place)
      if (!gone) return
      inSection(place.section, (section) => removeChord(section, place.index, meter))
      setDialog(null)
      say(t('chordPlayer.deleted', { chord: printedChord(gone.chord) }), {
        label: t('chordPlayer.undo'),
        onClick: hand.undo,
      })
    },
    resize: (place, beats) =>
      inSection(place.section, (section) => resizeChord(section, place.index, beats)),
    move: (section, from, to) => inSection(section, (each) => moveChord(each, from, to)),
    add(section) {
      const chords = shown.sections[section]?.chords ?? []
      const last = chords.at(-1)?.chord ?? {
        root: shown.key.tonic,
        quality: shown.key.minor ? 'min' : 'maj',
      }
      inSection(section, (each) => insertChord(each, each.chords.length, last, meter))
      setTyping({ place: { section, index: chords.length }, text: '' })
    },
  }

  const randomize = () => {
    hand.edit((sheet) => ({
      ...sheet,
      sections: sheet.sections.map((section) => {
        const bars = barCount(section, sheet.meter) || 4
        return {
          ...section,
          chords: randomProgression(sheet.key, bars, Math.random).map((numeral) => ({
            chord: numeralChord(numeral, sheet.key, 'triads'),
            beats: beatsPerBar(sheet.meter),
          })),
        }
      }),
    }))
    say(t('chordPlayer.randomized', { key: keyName(shown.key) }), {
      label: t('chordPlayer.undo'),
      onClick: hand.undo,
    })
  }

  const loopSection = transport.lit?.section ?? dialog?.section ?? 0
  const loopName = t(`chordPlayer.sections.${shown.sections[loopSection]?.kind ?? 'verse'}`)
  const numerals = sheetNumerals(shown)
  const hasChords = shown.sections.some((section) => section.chords.length > 0)
  const toggle = () => (transport.playing ? transport.stop() : transport.play())

  useShortcuts(t('chordPlayer.shortcuts.group'), [
    { label: t('chordPlayer.shortcuts.playStop'), combo: { key: ' ' }, run: toggle },
    { label: t('chordPlayer.shortcuts.undo'), combo: { code: 'KeyZ', mod: true }, run: hand.undo },
    {
      label: t('chordPlayer.shortcuts.redo'),
      combo: { code: 'KeyZ', mod: true, shift: true },
      run: hand.redo,
    },
  ])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const sectionIds = shown.sections.map((_, i) => `section-${i}`)
  const onSectionDrop = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    hand.edit((sheet) =>
      moveSection(
        sheet,
        sectionIds.indexOf(String(active.id)),
        sectionIds.indexOf(String(over.id)),
      ),
    )
  }
  const askDelete = async (index: number) => {
    const section = shown.sections[index]
    if (!section) return
    const named = t(`chordPlayer.sections.${section.kind}`)
    const yes =
      section.chords.length === 0 ||
      (await confirm({
        title: t('chordPlayer.deleteSection.title', { name: named }),
        body: t('chordPlayer.deleteSection.body'),
        action: t('chordPlayer.deleteSection.action'),
        destructive: true,
      }))
    if (yes) hand.edit((sheet) => removeSection(sheet, index))
  }
  const dialogChord = dialog ? chordAt(dialog) : undefined
  const dialogNext = dialog
    ? (shown.sections[dialog.section]?.chords[dialog.index + 1]?.chord ?? null)
    : null

  return (
    <div className="flex flex-col gap-5 pb-28">
      {/* The head: one row on a laptop, two on a phone. */}
      <div className="flex flex-col gap-3 rounded-card bg-card p-3 elevation-1 md:flex-row md:flex-wrap md:items-center md:gap-4">
        <HeadButton
          label={t('chordPlayer.libraryOf', { name })}
          onClick={() => setLibrary(true)}
          className="font-display text-2xl"
        >
          {name}
        </HeadButton>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <HeadButton
            label={t('chordPlayer.styleOf', { style: localText(style.name, locale) })}
            onClick={() => setStyles(true)}
            icon={<SlidersHorizontal aria-hidden className="size-4" />}
          >
            {localText(style.name, locale)}
          </HeadButton>
          <div className="flex items-center gap-2 [&_input]:w-16">
            <span className="text-sm text-muted-foreground">{t('chordPlayer.tempo')}</span>
            <Stepper
              label={t('chordPlayer.tempo')}
              value={entry.tempo}
              min={SHEET_TEMPO.min}
              max={SHEET_TEMPO.max}
              typed
              format={(count) => t('chordPlayer.bpm', { count })}
              decrease={t('chordPlayer.slower')}
              increase={t('chordPlayer.faster')}
              onChange={(tempo) => hand.setEntry({ tempo })}
            />
          </div>
          <Link
            to="/practice/chord-player/settings"
            search={sheetId === undefined ? {} : { sheet: sheetId }}
            aria-label={t('chordPlayer.keyLink', { key: keyName(shown.key) })}
            className="flex min-h-11 items-center gap-1 rounded-control px-2 font-semibold hover:bg-muted"
          >
            {t('chordPlayer.key', { key: keyName(shown.key) })}
            <OpensMark className="size-4 text-current" />
          </Link>
        </div>
      </div>

      {hasChords ? null : <p className="text-muted-foreground">{t('chordPlayer.emptySheet')}</p>}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={onSectionDrop}
      >
        <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-4">
            {shown.sections.map((section, index) => (
              <SheetSection
                key={sectionIds[index]}
                sortId={sectionIds[index] ?? ''}
                section={section}
                index={index}
                musicKey={shown.key}
                meter={meter}
                names={prefs.names}
                variations={variations}
                lit={transport.lit}
                typing={typing}
                onTyping={setTyping}
                acts={acts}
                onChange={(change) => inSection(index, (each) => ({ ...each, ...change }))}
                onDuplicate={() => hand.edit((sheet) => duplicateSection(sheet, index))}
                onDelete={() => void askDelete(index)}
                canDuplicate={shown.sections.length < MOST_SECTIONS}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex flex-wrap gap-2">
        {shown.sections.length < MOST_SECTIONS ? (
          <Button
            variant="outline"
            size="lg"
            onClick={() => hand.edit((sheet) => addSection(sheet))}
          >
            <Plus aria-hidden />
            {t('chordPlayer.addSection')}
          </Button>
        ) : null}
        <Button variant="outline" size="lg" onClick={randomize}>
          <Dices aria-hidden />
          {t('chordPlayer.randomize')}
        </Button>
        {numerals ? (
          <ButtonLink
            variant="outline"
            size="lg"
            render={
              <Link
                to="/practice/progressions/line"
                search={{ p: numeralsParam(numerals), key: keyParam(shown.key) }}
              />
            }
          >
            {t('chordPlayer.inProgressions')}
          </ButtonLink>
        ) : null}
      </div>

      <PinnedKeyboard shown={NO_KEYS} />

      <FloatingActions>
        <FloatingBar label={t('chordPlayer.transport')}>
          <FloatingBarPlay
            label={transport.playing ? t('chordPlayer.stop') : t('chordPlayer.play')}
            playing={transport.playing}
            named
            disabled={!hasChords}
            onClick={toggle}
          />
          <FloatingBarButton
            label={
              transport.looped === null
                ? t('chordPlayer.loop', { section: loopName })
                : t('chordPlayer.loopOff', {
                    section: t(
                      `chordPlayer.sections.${shown.sections[transport.looped]?.kind ?? 'verse'}`,
                    ),
                  })
            }
            aria-pressed={transport.looped !== null}
            className={cn(transport.looped !== null && 'bg-muted text-link')}
            onClick={() => transport.setLoop(transport.looped === null ? loopSection : null)}
          >
            <Repeat aria-hidden />
          </FloatingBarButton>
          {numerals ? (
            <FloatingBarButton
              label={t('chordPlayer.inPlayer')}
              render={
                <Link
                  to="/play/progression"
                  search={{ p: numeralsParam(numerals), key: keyParam(shown.key) }}
                />
              }
            >
              <ChevronDown aria-hidden className="-rotate-90" />
            </FloatingBarButton>
          ) : null}
        </FloatingBar>
      </FloatingActions>

      {dialog && dialogChord ? (
        <ChordDialog
          open
          onOpenChange={(open) => (open ? null : setDialog(null))}
          chord={dialogChord.chord}
          beats={dialogChord.beats}
          next={dialogNext}
          musicKey={shown.key}
          onChord={(chord) =>
            inSection(dialog.section, (each) => setChord(each, dialog.index, chord))
          }
          onBeats={(beats) => acts.resize(dialog, beats)}
          onInsert={(chords: readonly Chord[]) => {
            inSection(dialog.section, (each) =>
              chords.reduce(
                (section, chord, i) => insertChord(section, dialog.index + 1 + i, chord, meter),
                each,
              ),
            )
            setDialog(null)
          }}
          onRemove={() => acts.remove(dialog)}
        />
      ) : null}
      <LibrarySheet
        open={library}
        onOpenChange={setLibrary}
        current={sheetId}
        minor={shown.key.minor}
        onOpenSaved={(sheet) => {
          setLibrary(false)
          routes.openSheet(sheet.id)
        }}
        onOpenProgression={(progression) => {
          setLibrary(false)
          const minor = progressionMode(progression, shown.key.minor)
          routes.openLine(
            parseNumerals(libraryParam(progression, minor)) ?? [],
            minor,
            localText(progression.name, locale),
          )
        }}
      />
      <StyleSheet
        open={styles}
        onOpenChange={setStyles}
        book={book}
        value={style.id}
        onChoose={(chosen) => {
          setStyles(false)
          hand.setEntry({ style: chosen.id, tempo: chosen.tempo })
          if (chosen.meter !== hand.sheet.meter) {
            hand.edit((sheet) => relayMeter(sheet, chosen.meter))
            say(t('chordPlayer.laidOut', { meter: chosen.meter }), {
              label: t('chordPlayer.undo'),
              onClick: hand.undo,
            })
          }
        }}
      />
    </div>
  )
}

/** A head's value that opens its sheet: the value, a chevron. */
function HeadButton({
  label,
  onClick,
  icon,
  className,
  children,
}: {
  label: string
  onClick(): void
  icon?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'flex min-h-11 min-w-0 items-center gap-2 rounded-control px-2 text-left font-semibold text-pretty hover:bg-muted focus-visible:outline-3 focus-visible:outline-ring',
        className,
      )}
    >
      {icon}
      <span className="min-w-0">{children}</span>
      <ChevronDown aria-hidden className="size-4 shrink-0" />
    </button>
  )
}
