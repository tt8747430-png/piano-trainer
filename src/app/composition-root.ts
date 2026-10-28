import {
  createDiagramInversionsStore,
  type DiagramInversionsStore,
} from '@/entities/diagram-inversion'
import { createLibraryStore, type LibraryStore } from '@/entities/library'
import { createPatternsStore, type PatternsStore } from '@/entities/pattern'
import { createPiecesStore, type PiecesStore } from '@/entities/piece'
import { createProgressStore, type ProgressStore } from '@/entities/progress'
import { createSettingsStore, type SettingsStore } from '@/entities/settings'
import { createTakesStore, type TakesStore } from '@/entities/take'
import { createViewsStore, type ViewsStore } from '@/entities/views'
import { createWebAudioOutput } from '@/shared/api/audio'
import { createWebMidi, hasWebMidi } from '@/shared/api/midi'
import type { SavingOptions } from '@/shared/lib'
import type { Services } from '@/shared/lib/services'

/** The app's one audio output and MIDI port, built once at startup. */
export function createServices(): Services {
  return {
    audio: createWebAudioOutput(),
    midi: hasWebMidi() ? createWebMidi() : null,
  }
}

/** Every saved store of the learner's, one of each: the screens read them, the router asks them. */
export interface Stores {
  readonly settings: SettingsStore
  readonly progress: ProgressStore
  readonly patterns: PatternsStore
  readonly pieces: PiecesStore
  readonly takes: TakesStore
  readonly views: ViewsStore
  readonly library: LibraryStore
  readonly diagramInversions: DiagramInversionsStore
}

/**
 * Every saved store, built once on one storage (ADR 0116): the browser's at startup, memory in a
 * test. Where the saves are kept changes here, and only here.
 */
export function createStores(
  saving: SavingOptions = {},
  device: { languages?: readonly string[]; finePointer?: boolean } = {},
): Stores {
  return {
    settings: createSettingsStore({ ...saving, ...device }),
    progress: createProgressStore(saving),
    patterns: createPatternsStore(saving),
    pieces: createPiecesStore(saving),
    takes: createTakesStore(saving),
    views: createViewsStore(saving),
    library: createLibraryStore(saving),
    diagramInversions: createDiagramInversionsStore(saving),
  }
}
