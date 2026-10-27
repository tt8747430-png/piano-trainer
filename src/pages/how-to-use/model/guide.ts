import type { ParseKeys } from 'i18next'
import {
  Archive,
  ArrowUpDown,
  Cable,
  Check,
  CircleCheck,
  Drum,
  Eye,
  Feather,
  Folder,
  FolderInput,
  Gauge,
  Heart,
  Keyboard,
  ListMusic,
  Metronome,
  Music,
  Palette,
  PencilLine,
  Piano,
  Repeat,
  Replace,
  Settings,
  Volume2,
  type LucideIcon,
} from 'lucide-react'

/** A step of the guide: its words, and the icon the app wears for what it names. */
export interface GuideStep {
  readonly key: ParseKeys<'settings'>
  readonly icon: LucideIcon
}

/**
 * How to use (ADR 0113): its parts in the order a learner meets them, each a few plain steps, every
 * step beside the icon its control wears in the app, its words under `settings:howToUse.<part>`.
 */
export const GUIDE = [
  {
    id: 'songs',
    steps: [
      { key: 'howToUse.songs.library', icon: Music },
      { key: 'howToUse.songs.folder', icon: Folder },
      { key: 'howToUse.songs.select', icon: CircleCheck },
      { key: 'howToUse.songs.move', icon: FolderInput },
      { key: 'howToUse.songs.archive', icon: Archive },
      { key: 'howToUse.songs.favourite', icon: Heart },
    ],
  },
  {
    id: 'player',
    steps: [
      { key: 'howToUse.player.view', icon: Eye },
      { key: 'howToUse.player.transpose', icon: ArrowUpDown },
      { key: 'howToUse.player.simplify', icon: Feather },
      { key: 'howToUse.player.sound', icon: Volume2 },
      { key: 'howToUse.player.loop', icon: Repeat },
      { key: 'howToUse.player.wait', icon: Gauge },
    ],
  },
  {
    id: 'learn',
    steps: [
      { key: 'howToUse.learn.sections', icon: Music },
      { key: 'howToUse.learn.lessons', icon: ListMusic },
      { key: 'howToUse.learn.pass', icon: Gauge },
      { key: 'howToUse.learn.learned', icon: Check },
    ],
  },
  {
    id: 'editor',
    steps: [
      { key: 'howToUse.editor.open', icon: PencilLine },
      { key: 'howToUse.editor.modes', icon: Replace },
      { key: 'howToUse.editor.palette', icon: Palette },
      { key: 'howToUse.editor.transpose', icon: ArrowUpDown },
    ],
  },
  {
    id: 'midi',
    steps: [
      { key: 'howToUse.midi.connect', icon: Cable },
      { key: 'howToUse.midi.settings', icon: Settings },
      { key: 'howToUse.midi.play', icon: Piano },
    ],
  },
  {
    id: 'metronome',
    steps: [
      { key: 'howToUse.metronome.open', icon: Metronome },
      { key: 'howToUse.metronome.choose', icon: Drum },
      { key: 'howToUse.metronome.keys', icon: Keyboard },
    ],
  },
] as const satisfies readonly { id: string; steps: readonly GuideStep[] }[]

export type GuidePart = (typeof GUIDE)[number]
