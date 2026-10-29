import {
  createDiagramInversionsStore,
  DIAGRAM_INVERSIONS_STORAGE_KEY,
  type DiagramInversionsStore,
} from '@/entities/diagram-inversion'
import { createLibraryStore, LIBRARY_STORAGE_KEY, type LibraryStore } from '@/entities/library'
import { createPatternsStore, PATTERNS_STORAGE_KEY, type PatternsStore } from '@/entities/pattern'
import { createPiecesStore, PIECES_STORAGE_KEY, type PiecesStore } from '@/entities/piece'
import { createProgressStore, PROGRESS_STORAGE_KEY, type ProgressStore } from '@/entities/progress'
import { createSettingsStore, SETTINGS_STORAGE_KEY, type SettingsStore } from '@/entities/settings'
import { createTakesStore, TAKES_STORAGE_KEY, type TakesStore } from '@/entities/take'
import { createViewsStore, VIEWS_STORAGE_KEY, type ViewsStore } from '@/entities/views'
import {
  createSupabaseAdmin,
  createSupabaseFeatures,
  type AdminPort,
  type FeaturesPort,
} from '@/shared/api/admin'
import { createSupabaseContentEditing, type ContentEditingPort } from '@/shared/api/content-editing'
import { createSupabaseErrorReporter, type ErrorReporter } from '@/shared/api/errors'
import { createWebAudioOutput } from '@/shared/api/audio'
import { createSupabaseAuth, type AuthGateway } from '@/shared/api/auth'
import {
  createBrowserContentCache,
  createSupabaseContentRemote,
  filesContent,
  type ContentCache,
  type ContentPort,
  type ContentRemote,
} from '@/shared/api/content'
import { createWebMidi, hasWebMidi } from '@/shared/api/midi'
import { lazyBackend, type Backend } from '@/shared/api/supabase'
import { createSupabasePublicLibrary, type PublicLibrary } from '@/shared/api/public-library'
import { createSupabaseCloud, type CloudSync } from '@/shared/api/sync'
import { safeLocalStorage, type SavingOptions } from '@/shared/lib'
import { createSyncRunner, type SyncedSave, type SyncRunner } from '@/shared/lib/sync'
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

/** Where content's bodies come from (ADR 0116): written into the app until the database serves them. */
export const createContent = (): ContentPort => filesContent()

/**
 * The database's content updates (ADR 0116): where the device keeps them (IndexedDB), and what the
 * project publishes.
 */
export const createContentUpdates = (
  backend: Backend,
): { readonly cache: ContentCache; readonly remote: ContentRemote } => ({
  cache: createBrowserContentCache(),
  remote: createSupabaseContentRemote(backend),
})

/**
 * The app's one Supabase client (ADR 0116), on the project `.env` names: loaded on the first call that
 * needs it, after the first paint, so supabase-js is not in the app's first chunk.
 */
export const createBackend = (): Backend =>
  lazyBackend(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)

/** Accounts, on the backend's auth. */
export const createAuth = (backend: Backend): AuthGateway => createSupabaseAuth(backend)

/** Each saved store that follows the learner to their other devices, and its table (ADR 0116). */
export const SYNCED_SAVES: readonly SyncedSave[] = [
  { table: 'settings', key: SETTINGS_STORAGE_KEY },
  { table: 'progress', key: PROGRESS_STORAGE_KEY },
  { table: 'pieces', key: PIECES_STORAGE_KEY },
  { table: 'patterns', key: PATTERNS_STORAGE_KEY },
  { table: 'takes', key: TAKES_STORAGE_KEY },
  { table: 'library', key: LIBRARY_STORAGE_KEY },
  { table: 'views', key: VIEWS_STORAGE_KEY },
  { table: 'diagram_inversions', key: DIAGRAM_INVERSIONS_STORAGE_KEY },
]

/**
 * The sync of the saved stores over `storage` (the browser's, or a test's): the stores save through
 * its watched storage, and a save it brings in reaches its store as another tab's would.
 */
export function createSync(
  cloud: CloudSync,
  storage: Storage = safeLocalStorage(),
  tabs: EventTarget = window,
): SyncRunner {
  return createSyncRunner({
    cloud,
    saves: SYNCED_SAVES,
    storage,
    announce: (key) =>
      tabs.dispatchEvent(new StorageEvent('storage', { key, newValue: storage.getItem(key) })),
  })
}

/** The cloud the sync talks to: the backend's tables. */
export const createCloud = (backend: Backend): CloudSync => createSupabaseCloud(backend)

/** The Public library: the project's tables (ADR 0116). */
export const createPublicLibrary = (backend: Backend): PublicLibrary =>
  createSupabasePublicLibrary(backend)

/** The admin's tools: the project's `admin` function and tables (ADR 0116). */
export const createAdmin = (backend: Backend): AdminPort => createSupabaseAdmin(backend)

/** Editing the built-in content, an editor's: the project's drafts and `publish_content` (ADR 0116). */
export const createContentEditing = (backend: Backend): ContentEditingPort =>
  createSupabaseContentEditing(backend)

/** Where what went wrong is reported: the project's `error_reports` (ADR 0116). */
export const createErrorReporter = (backend: Backend): ErrorReporter =>
  createSupabaseErrorReporter(backend)

/** The feature switches on for whoever is signed in. */
export const createFeatures = (backend: Backend): FeaturesPort => createSupabaseFeatures(backend)
