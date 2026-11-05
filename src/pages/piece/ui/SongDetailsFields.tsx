import { X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { pieceStage } from '@/entities/course'
import {
  SONG_GENRES,
  SONG_LANGUAGES,
  TAG_MAX,
  tagOf,
  useLibraryStoreApi,
  type SongDetails,
  type SongGenre,
  type SongLanguage,
} from '@/entities/library'
import type { PieceId } from '@/entities/piece'
import { STAGES, StageMark, type Stage } from '@/entities/step'
import { useSongDetails, useSongLevel } from '../model/use-song-details'
import { setSongDetails } from '@/features/manage-library'
import { Dropdown } from '@/shared/ui'

/**
 * A song's details as its page reads them (R30 S5): its level by name and mark, its genre and the
 * language of its words, as chips beside its key, time and tempo; its tags as pills under its about.
 */
export function SongDetailChips({ id }: { id: PieceId }) {
  const { t } = useTranslation(['piece', 'common'])
  const details = useSongDetails(id)
  const level = useSongLevel(id)
  if (!level && !details.genre && !details.language) return null
  return (
    <ul aria-label={t('piece:details.label')} className="flex flex-wrap items-center gap-2">
      {level ? (
        <li className="flex h-8 items-center gap-2 rounded-pill border border-border bg-card px-3 text-sm">
          <StageMark stage={level} />
          {t(`common:stage.${level}`)}
        </li>
      ) : null}
      {details.genre ? (
        <li className="flex h-8 items-center rounded-pill border border-border bg-card px-3 text-sm">
          {t(`piece:details.genres.${details.genre}`)}
        </li>
      ) : null}
      {details.language ? (
        <li className="flex h-8 items-center rounded-pill border border-border bg-card px-3 text-sm">
          {t(`piece:details.languages.${details.language}`)}
        </li>
      ) : null}
    </ul>
  )
}

/** A song's tags, as pills under what is said about it. */
export function SongTags({ id }: { id: PieceId }) {
  const { t } = useTranslation('piece')
  const { tags } = useSongDetails(id)
  if (tags.length === 0) return null
  return (
    <ul aria-label={t('details.tags')} className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li key={tag} className="rounded-pill bg-muted px-2.5 py-0.5 text-sm text-muted-foreground">
          {tag}
        </li>
      ))}
    </ul>
  )
}

/**
 * A song's details in its page's Edit (R30 S5), each change kept as it is made: its level (a
 * built-in song's is its courses', said and not changed), its genre, the language of its words, and
 * its tags (typed and added with Enter, each removed by its ×).
 */
export function SongDetailsFields({ id }: { id: PieceId }) {
  const { t } = useTranslation(['piece', 'common'])
  const store = useLibraryStoreApi()
  const details = useSongDetails(id)
  const built = pieceStage(id)
  const [tag, setTag] = useState('')
  const set = (change: Partial<SongDetails>) => setSongDetails(store, id, change)
  const add = () => {
    const next = tagOf(tag)
    if (next) set({ tags: [...details.tags, next] })
    setTag('')
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {built ? null : (
          <Dropdown<Stage | ''>
            label={t('piece:details.level')}
            value={details.level ?? ''}
            onChange={(level) => set({ level: level === '' ? null : level })}
            options={[
              { value: '', label: t('piece:details.none') },
              ...STAGES.map((stage) => ({ value: stage, label: t(`common:stage.${stage}`) })),
            ]}
          />
        )}
        <Dropdown<SongGenre | ''>
          label={t('piece:details.genre')}
          value={details.genre ?? ''}
          onChange={(genre) => set({ genre: genre === '' ? null : genre })}
          options={[
            { value: '', label: t('piece:details.none') },
            ...SONG_GENRES.map((genre) => ({
              value: genre,
              label: t(`piece:details.genres.${genre}`),
            })),
          ]}
        />
        <Dropdown<SongLanguage | ''>
          label={t('piece:details.language')}
          value={details.language ?? ''}
          onChange={(language) => set({ language: language === '' ? null : language })}
          options={[
            { value: '', label: t('piece:details.noWords') },
            ...SONG_LANGUAGES.map((language) => ({
              value: language,
              label: t(`piece:details.languages.${language}`),
            })),
          ]}
        />
      </div>
      <div className="flex flex-col gap-2">
        {details.tags.length > 0 ? (
          <ul aria-label={t('piece:details.tags')} className="flex flex-wrap gap-1.5">
            {details.tags.map((each) => (
              <li
                key={each}
                className="flex items-center gap-1 rounded-pill bg-muted ps-2.5 text-sm text-muted-foreground"
              >
                {each}
                <button
                  type="button"
                  aria-label={t('piece:details.removeTag', { tag: each })}
                  onClick={() => set({ tags: details.tags.filter((kept) => kept !== each) })}
                  className="grid size-8 place-items-center rounded-pill hover:bg-chosen"
                >
                  <X aria-hidden className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <input
          aria-label={t('piece:details.addTag')}
          placeholder={t('piece:details.addTag')}
          value={tag}
          maxLength={TAG_MAX}
          enterKeyHint="done"
          autoComplete="off"
          onChange={(event) => setTag(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              add()
            }
          }}
          onBlur={add}
          className="h-11 w-full max-w-64 rounded-control border border-input bg-card px-3 text-base placeholder:text-muted-foreground"
        />
      </div>
    </div>
  )
}
