import type { PracticeMode } from '@/features/practice'
import type { SetupParams } from '@/widgets/player-setup'

/** The Player's URL: the setup, and the mode it practises in. */
export type PlayerSearch = SetupParams & { readonly mode: PracticeMode }
