import {
  AudioWaveform,
  Disc3,
  Drum,
  Guitar,
  Headphones,
  Mic,
  Music,
  Music2,
  Music3,
  Music4,
  Piano,
  Radio,
  type LucideIcon,
} from 'lucide-react'
import type { Paint } from './paint'

/** The built-in profile pictures (B1): note and instrument motifs, each on a paint of the palette. */
export const BUILT_IN_AVATARS = {
  note: { icon: Music, paint: 'yellow' },
  quavers: { icon: Music2, paint: 'sky' },
  beamed: { icon: Music3, paint: 'grass' },
  semiquavers: { icon: Music4, paint: 'lilac' },
  piano: { icon: Piano, paint: 'sand' },
  guitar: { icon: Guitar, paint: 'grass' },
  drum: { icon: Drum, paint: 'yellow' },
  mic: { icon: Mic, paint: 'lilac' },
  headphones: { icon: Headphones, paint: 'sky' },
  wave: { icon: AudioWaveform, paint: 'sand' },
  record: { icon: Disc3, paint: 'lilac' },
  radio: { icon: Radio, paint: 'yellow' },
} as const satisfies Readonly<Record<string, { icon: LucideIcon; paint: Paint }>>

export type BuiltInAvatar = keyof typeof BUILT_IN_AVATARS

export const isBuiltInAvatar = (value: unknown): value is BuiltInAvatar =>
  typeof value === 'string' && Object.hasOwn(BUILT_IN_AVATARS, value)
