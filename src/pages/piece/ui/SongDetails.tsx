import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { pieceStage } from '@/entities/course'
import {
  SONG_GENRES,
  SONG_LANGUAGES,
  tagSuggestions,
  useLibrary,
  useLibraryStoreApi,
  type SongDetails as Details,
} from '@/entities/library'
import {
  HEADER_MAX,
  SONG_CREDITS,
  songCredit,
  songFacts,
  useCreditNames,
  usePiecesStoreApi,
  withSongCredit,
  withSongFacts,
  type ChartPiece,
  type OwnSongId,
  type Piece,
  type SongCredit,
  type SongFacts,
} from '@/entities/piece'
import { STAGES, StageMark, type Stage } from '@/entities/step'
import { useOriginalDraft } from '@/features/edit-original'
import { setSongCredit, setSongFacts } from '@/features/edit-piece'
import { setSongDetails } from '@/features/manage-library'
import { useLocale } from '@/shared/i18n'
import { InfoTip, RowFace, SettingsGroup } from '@/shared/ui'
import { useSongDetails } from '../model/use-song-details'
import { ChoiceEditor, TagsEditor, TextEditor } from './PropertyEditors'
import { PropertyRow } from './PropertyPicker'

/** The longest a title is written. */
const TITLE_MAX = 80
/** The longest an about is written. */
const ABOUT_MAX = 2000

/** How the song's own words are written: its facts and credits, where the learner may write them. */
interface SongWrites {
  readonly song: ChartPiece
  readonly facts: (patch: Partial<SongFacts>) => void
  readonly credit: (field: SongCredit, text: string) => void
}

/**
 * A song's Details (R32-C, MuseScore's score info, Notion's properties): every property of the song
 * as a row of its name and value, a tap on one editing it in place. Its title, about and credits are
 * the learner's on an own song and an editor's on the app's original, else read as printed; its
 * level (a course's song's is its course's), genre, language and tags are every learner's.
 */
export function SongDetails({
  piece,
  own,
  original,
}: {
  piece: Piece
  /** The learner's own song, which they write. */
  own: { readonly piece: ChartPiece; readonly id: OwnSongId } | null
  /** The app's song an editor writes, into its draft. */
  original: ChartPiece | null
}) {
  if (own) return <OwnSongDetails piece={own.piece} id={own.id} />
  if (original) return <OriginalSongDetails piece={original} />
  return <DetailsCard piece={piece} writes={null} />
}

function OwnSongDetails({ piece, id }: { piece: ChartPiece; id: OwnSongId }) {
  const locale = useLocale()
  const store = usePiecesStoreApi()
  return (
    <DetailsCard
      piece={piece}
      writes={{
        song: piece,
        facts: (patch) =>
          setSongFacts(store, id, { ...songFacts(piece, locale), ...patch }, locale),
        credit: (field, text) => setSongCredit(store, id, field, text),
      }}
    />
  )
}

/** An editor's built-in song: its words written into its draft, published from its Settings. */
function OriginalSongDetails({ piece }: { piece: ChartPiece }) {
  const locale = useLocale()
  const draft = useOriginalDraft(piece)
  const [edited, setEdited] = useState<ChartPiece | null>(null)
  const song = edited ?? (draft.load.state === 'ready' ? draft.load.value : null)
  const keep = (next: ChartPiece) => {
    setEdited(next)
    draft.save(next)
  }
  return (
    <DetailsCard
      piece={piece}
      writes={
        song
          ? {
              song,
              facts: (patch) =>
                keep(withSongFacts(song, { ...songFacts(song, locale), ...patch }, locale)),
              credit: (field, text) => keep(withSongCredit(song, field, text)),
            }
          : null
      }
    />
  )
}

/** The credit rows' names and keys, in the order a score prints them. */
const CREDIT_NAME = {
  composer: 'piece:details.composer',
  lyricist: 'piece:details.lyricist',
  arranger: 'piece:details.arranger',
} as const satisfies Record<SongCredit, string>

function DetailsCard({ piece, writes }: { piece: Piece; writes: SongWrites | null }) {
  const { t } = useTranslation(['piece', 'common'])
  const locale = useLocale()
  const store = useLibraryStoreApi()
  const details = useSongDetails(piece.id)
  const library = useLibrary((state) => state.songDetails)
  const course = pieceStage(piece.id)
  const set = (change: Partial<Details>) => setSongDetails(store, piece.id, change)
  const said = useCreditNames()
  const empty = t('piece:details.notSet')
  const shown = writes?.song ?? piece
  const facts = songFacts(shown, locale)
  const level = course ?? details.level
  return (
    <SettingsGroup flush title={t('piece:details.label')}>
      {writes ? (
        <>
          <PropertyRow title={t('piece:details.title')} value={facts.title} empty={empty}>
            {(tools) => (
              <TextEditor
                label={t('piece:details.title')}
                initial={facts.title}
                maxLength={TITLE_MAX}
                tools={tools}
                onSave={(title) => writes.facts({ title })}
              />
            )}
          </PropertyRow>
          <PropertyRow title={t('piece:details.about')} value={facts.about} empty={empty}>
            {(tools) => (
              <TextEditor
                label={t('piece:details.about')}
                initial={facts.about}
                maxLength={ABOUT_MAX}
                multiline
                placeholder={t('piece:details.aboutPlaceholder')}
                tools={tools}
                onSave={(about) => writes.facts({ about })}
              />
            )}
          </PropertyRow>
        </>
      ) : null}
      {SONG_CREDITS.map((field) => {
        const name = t(CREDIT_NAME[field])
        const value = songCredit(shown, field)
        // A song the learner cannot change has its credits once, in its byline under the cover.
        if (!writes) return null
        return (
          <PropertyRow key={field} title={name} value={said(value)} empty={empty}>
            {(tools) => (
              <TextEditor
                label={name}
                initial={value}
                maxLength={HEADER_MAX}
                tools={tools}
                onSave={(text) => writes.credit(field, text)}
              />
            )}
          </PropertyRow>
        )
      })}
      {course ? (
        <ReadRow
          title={t('piece:details.level')}
          value={t(`common:stage.${course}`)}
          info={t('piece:details.levelOfCourse')}
        />
      ) : (
        <PropertyRow
          title={t('piece:details.level')}
          value={level ? t(`common:stage.${level}`) : ''}
          empty={empty}
        >
          {(tools) => (
            <ChoiceEditor<Stage | 'none'>
              label={t('piece:details.level')}
              value={details.level ?? 'none'}
              tools={tools}
              choices={[
                { value: 'none', label: t('piece:details.none') },
                ...STAGES.map((stage) => ({
                  value: stage,
                  label: t(`common:stage.${stage}`),
                  mark: <StageMark stage={stage} />,
                })),
              ]}
              onChoose={(chosen) => set({ level: chosen === 'none' ? null : chosen })}
            />
          )}
        </PropertyRow>
      )}
      <PropertyRow
        title={t('piece:details.genre')}
        value={details.genre ? t(`piece:details.genres.${details.genre}`) : ''}
        empty={empty}
      >
        {(tools) => (
          <ChoiceEditor
            label={t('piece:details.genre')}
            value={details.genre ?? 'none'}
            tools={tools}
            choices={[
              { value: 'none', label: t('piece:details.none') },
              ...SONG_GENRES.map((genre) => ({
                value: genre,
                label: t(`piece:details.genres.${genre}`),
              })),
            ]}
            onChoose={(chosen) => set({ genre: chosen === 'none' ? null : chosen })}
          />
        )}
      </PropertyRow>
      <PropertyRow
        title={t('piece:details.language')}
        value={details.language ? t(`piece:details.languages.${details.language}`) : ''}
        empty={empty}
      >
        {(tools) => (
          <ChoiceEditor
            label={t('piece:details.language')}
            value={details.language ?? 'none'}
            tools={tools}
            choices={[
              { value: 'none', label: t('piece:details.noWords') },
              ...SONG_LANGUAGES.map((language) => ({
                value: language,
                label: t(`piece:details.languages.${language}`),
              })),
            ]}
            onChoose={(chosen) => set({ language: chosen === 'none' ? null : chosen })}
          />
        )}
      </PropertyRow>
      <PropertyRow title={t('piece:details.tags')} value={details.tags.join(', ')} empty={empty}>
        {(tools) => (
          <TagsEditor
            tags={details.tags}
            suggestions={(typed) => tagSuggestions(library, details.tags, typed)}
            tools={tools}
            onChange={(tags) => set({ tags: [...tags] })}
          />
        )}
      </PropertyRow>
    </SettingsGroup>
  )
}

/**
 * A property the learner reads and does not change here: as printed, or a course's. Its value stands
 * where an editable row's does, the chevron's room kept.
 */
function ReadRow({ title, value, info }: { title: string; value: string; info?: string }) {
  return (
    <div className="flex min-h-16 min-w-0 items-center gap-3 py-2 pr-3 pl-4">
      <RowFace
        title={title}
        value={value}
        info={info ? <InfoTip name={title}>{info}</InfoTip> : undefined}
        end={<span aria-hidden className="size-5 shrink-0" />}
      />
    </div>
  )
}
