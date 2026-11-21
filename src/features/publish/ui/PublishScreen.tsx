import { Link, useNavigate } from '@tanstack/react-router'
import { AudioWaveform, Music, Plus, X } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DESCRIPTION_MAX,
  PUBLIC_LICENCES,
  PUBLIC_TYPES,
  TAG_MAX,
  TAGS_MAX,
  type PublicEntry,
  type PublicKind,
} from '@/shared/api/public-library'
import { cn, copyText, useMediaQuery, LAPTOP } from '@/shared/lib'
import {
  ButtonLink,
  ChoiceList,
  ConfirmDialog,
  GroupAction,
  GroupLink,
  GroupRows,
  PAINT,
  ProgressBar,
  Segmented,
  Sheet,
  SheetContent,
  ThingHead,
  say,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Textarea } from '@/shared/ui/primitives/textarea'
import { itemPaint } from '../model/item-paint'
import {
  DESCRIPTION_MIN,
  descriptionOf,
  describes,
  findability,
  tagOf,
  type PublishFace,
  type usePublish,
} from '../model/use-publish'
import { RightsCheck } from './PublishParts'
import { PublishSaid } from './PublishSaid'

/** What is published, as the Publish page heads it and previews it. */
export type PublishPreview = Pick<PublicEntry, 'kind' | 'title' | 'meta'> & {
  /** What its tile's paint is drawn from, as its row's will be: its own id among the learner's. */
  readonly id: string
  /** Its own tile where it has one, as the library wears it (a song's cover); else its kind's. */
  readonly mark?: ReactNode
  /** The line under its name, as its Settings head it (a song's who wrote it · Your song). */
  readonly line?: string
}

/** The tags offered beside the learner's own, one tap each (R72's suggested tags). */
const SUGGESTED = [
  'Easy',
  'Classical',
  'Folk',
  'Pop',
  'Hymn',
  'Study',
  'Jazz',
  'Christmas',
] as const

/** A kind's tile: a song's note, a pattern's wave. */
const KIND_ICON = { song: Music, pattern: AudioWaveform } as const

/** An item's tile in its own paint, as its row in the library will wear it. */
function Tile({ id, kind, size }: { id: string; kind: PublicKind; size: 'head' | 'card' }) {
  const Icon = KIND_ICON[kind]
  const paint = PAINT[itemPaint(id)]
  return (
    <span
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center',
        size === 'head' ? 'size-16 rounded-2xl' : 'size-18 rounded-[18px]',
        paint.fill,
        paint.ink,
      )}
    >
      <Icon className="size-7" />
    </span>
  )
}

/** A field's label over it in the small capitals every form's labels wear (canvas v550), its control under it. */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="mx-1 caps">{label}</span>
      {children}
    </div>
  )
}

/**
 * Publish (R72, Flat's discoverability form), for a learner's song (inside its Settings' window) or pattern (a window over it):
 * the item's head; then, before it is published, what others find it by (a meter of how easily it is
 * found, n of 5: its title, who wrote it, what it is, its tags, a description of 20 characters),
 * Title and Composer, Type (Original · Arrangement · Other), Tags as chips with × and suggestions with
 * +, Description with its count, Licence (a sheet of four); then As others will see it, the rights,
 * and Publish. On a laptop what the learner writes stands left and the preview, rights and Publish
 * right. Once published: In the Public library with its saves, Copy link, View in library, Publish new
 * version, and Unpublish apart. A pattern has no Composer or Type. Signed out: Sign in.
 */
export function PublishScreen({
  item,
  publishing,
}: {
  item: PublishPreview
  publishing: ReturnType<typeof usePublish>
}) {
  const { t } = useTranslation(['songs', 'editor'])
  const live = publishing.state === 'published' || publishing.state === 'changed'
  return (
    <div className="flex flex-col gap-2 lg:gap-6">
      <PublishSaid said={publishing.said} />
      <div className="flex w-full flex-1 flex-col gap-4 lg:gap-6">
        {/* The thing's head as its Settings', the boards' THINGHEAD (canvas v550). */}
        <ThingHead
          mark={item.mark ?? <Tile id={item.id} kind={item.kind} size="head" />}
          name={publishing.face.title || item.title}
          line={
            item.line ?? [publishing.face.composer, t('public.yours')].filter(Boolean).join(' · ')
          }
        />
        {!publishing.signedIn ? (
          <div className="flex flex-col items-start gap-3 card p-4">
            <p className="text-pretty text-muted-foreground">{t('public.publishSignIn')}</p>
            <ButtonLink render={<Link to="/account/sign-in" />}>{t('public.signIn')}</ButtonLink>
          </div>
        ) : live && publishing.publicId ? (
          <Published publishing={publishing} publicId={publishing.publicId} />
        ) : (
          <PublishForm
            // Each face the library holds starts the form afresh.
            key={JSON.stringify(publishing.face)}
            item={item}
            publishing={publishing}
          />
        )}
      </div>
    </div>
  )
}

/** Once in the Public library: where it stands, its link, its newer version, and Unpublish apart. */
function Published({
  publishing,
  publicId,
}: {
  publishing: ReturnType<typeof usePublish>
  publicId: string
}) {
  const { t } = useTranslation('songs')
  const navigate = useNavigate()
  const [unpublishing, setUnpublishing] = useState(false)
  const url = `${window.location.origin}/songs/public/${publicId}`
  return (
    <div className="flex w-full max-w-130 flex-col gap-4">
      <div className="flex items-center gap-3 card p-4">
        <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-paint-tile-grass" />
        <span className="flex-1 font-semibold">{t('public.inLibrary')}</span>
        <span className="text-sm text-muted-foreground">
          {publishing.saves > 0
            ? t('public.saves', { count: publishing.saves })
            : t('public.savesNone')}
        </span>
      </div>
      <GroupRows surface="sheet">
        <GroupAction
          label={t('public.copyLink')}
          onClick={() =>
            void copyText(url).then((copied) =>
              say(t(copied ? 'public.linkCopied' : 'public.linkNotCopied')),
            )
          }
        />
        <GroupLink
          label={t('public.viewInLibrary')}
          aria-haspopup={undefined}
          onClick={() =>
            void navigate({ to: '/songs/public/$itemId', params: { itemId: publicId } })
          }
        />
        {publishing.state === 'changed' ? (
          <GroupAction
            label={t('public.publishNew')}
            onClick={() => void publishing.publish(publishing.face)}
          />
        ) : null}
      </GroupRows>
      <GroupRows surface="sheet">
        <GroupAction
          destructive
          label={t('public.unpublishShort')}
          onClick={() => setUnpublishing(true)}
        />
      </GroupRows>
      <ConfirmDialog
        open={unpublishing}
        onOpenChange={setUnpublishing}
        title={t('public.unpublishTitle')}
        body={t('public.unpublishBody')}
        action={t('public.unpublishShort')}
        onConfirm={() => void publishing.unpublish()}
      />
    </div>
  )
}

function PublishForm({
  item,
  publishing,
}: {
  item: PublishPreview
  publishing: ReturnType<typeof usePublish>
}) {
  const { t } = useTranslation('songs')
  const id = useId()
  const laptop = useMediaQuery(LAPTOP)
  const [face, setFace] = useState<PublishFace>(publishing.face)
  const [tag, setTag] = useState('')
  const [licences, setLicences] = useState(false)
  // Unticked each time the page opens and after each publish (D3): the learner confirms every time.
  const [rights, setRights] = useState(false)
  const song = item.kind === 'song'
  const found = findability(face, item.kind)
  const length = descriptionOf(face.description).length
  const set = (next: Partial<PublishFace>) => setFace((was) => ({ ...was, ...next }))
  const addTag = (text: string) => {
    const each = tagOf(text)
    if (!each || face.tags.length >= TAGS_MAX) return
    if (!face.tags.some((had) => had.toLocaleLowerCase() === each.toLocaleLowerCase()))
      set({ tags: [...face.tags, each] })
    setTag('')
  }
  const suggested = SUGGESTED.filter(
    (each) => !face.tags.some((had) => had.toLocaleLowerCase() === each.toLocaleLowerCase()),
  )
  const publish = async () => {
    await publishing.publish(face)
    setRights(false)
  }
  const ready = describes(face.description) && rights && !publishing.busy
  const fields = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 card p-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-semibold">{t('public.findable')}</span>
          <span className="text-sm text-muted-foreground tabular-nums">
            {t('public.findableCount', { filled: found.filled, of: found.of })}
          </span>
        </div>
        <ProgressBar
          done={found.filled}
          total={found.of}
          label={t('public.findable')}
          tone="primary"
          className="flex-none"
        />
      </div>
      <Field label={t('public.titleField')}>
        <input
          value={face.title}
          maxLength={120}
          onChange={(event) => set({ title: event.target.value })}
          aria-label={t('public.titleField')}
          className="h-12 rounded-xl bg-card px-4 text-base ring-1 ring-border outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </Field>
      {song ? (
        <Field label={t('public.composer')}>
          <input
            value={face.composer}
            maxLength={TAG_MAX * 4}
            onChange={(event) => set({ composer: event.target.value })}
            aria-label={t('public.composer')}
            className="h-12 rounded-xl bg-card px-4 text-base ring-1 ring-border outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </Field>
      ) : null}
      {song ? (
        <Field label={t('public.type')}>
          <Segmented
            label={t('public.type')}
            value={face.type}
            options={PUBLIC_TYPES.map((value) => ({ value, label: t(`public.types.${value}`) }))}
            onChange={(type) => set({ type })}
          />
        </Field>
      ) : null}
      <Field label={t('public.tags')}>
        <div className="flex flex-wrap items-center gap-x-1.5 rounded-xl bg-card px-2 ring-1 ring-border">
          {face.tags.map((each) => (
            <button
              key={each}
              type="button"
              onClick={() => set({ tags: face.tags.filter((had) => had !== each) })}
              aria-label={t('public.tagRemove', { tag: each })}
              className="flex h-11 items-center gap-2 rounded-pill border-y-4 border-transparent bg-foreground bg-clip-padding px-3 text-sm font-semibold text-background"
            >
              {each}
              <X aria-hidden className="size-3.5 opacity-70" />
            </button>
          ))}
          <input
            value={tag}
            maxLength={TAG_MAX}
            placeholder={t('public.addTag')}
            aria-label={t('public.addTag')}
            enterKeyHint="done"
            onChange={(event) => setTag(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter' && event.key !== ',') return
              event.preventDefault()
              addTag(tag)
            }}
            onBlur={() => addTag(tag)}
            className="h-11 min-w-30 flex-1 bg-transparent px-1 text-base outline-none"
          />
        </div>
        {suggested.length > 0 && face.tags.length < TAGS_MAX ? (
          <div className="-mt-1 flex flex-wrap gap-x-1.5">
            {suggested.map((each) => (
              <button
                key={each}
                type="button"
                onClick={() => addTag(each)}
                aria-label={t('public.tagAdd', { tag: each })}
                className="flex h-11 items-center gap-1.5 rounded-pill border-y-4 border-transparent bg-muted bg-clip-padding px-3 text-sm font-semibold"
              >
                <Plus aria-hidden className="size-3.5" />
                {each}
              </button>
            ))}
          </div>
        ) : null}
      </Field>
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className="mx-1 caps">
          {t('public.description')}
        </label>
        <Textarea
          id={id}
          value={face.description}
          maxLength={DESCRIPTION_MAX}
          rows={4}
          placeholder={t(song ? 'public.aboutSong' : 'public.aboutPattern')}
          aria-describedby={`${id}-count`}
          onChange={(event) => set({ description: event.target.value })}
          className="min-h-28 rounded-xl bg-card px-3 py-3 text-base ring-1 ring-border md:text-base"
        />
        <p
          id={`${id}-count`}
          aria-live="polite"
          className="mx-1 flex justify-between gap-3 text-footnote text-muted-foreground tabular-nums"
        >
          <span>
            {length < DESCRIPTION_MIN
              ? t('public.descriptionLeft', { count: DESCRIPTION_MIN - length })
              : null}
          </span>
          <span>{t('public.descriptionCount', { count: length, max: DESCRIPTION_MAX })}</span>
        </p>
      </div>
      <Field label={t('public.licence')}>
        <GroupRows surface="sheet">
          <GroupLink
            label={t(`public.licences.${face.licence}`)}
            onClick={() => setLicences(true)}
          />
        </GroupRows>
      </Field>
      <Sheet at={{}} open={licences} onOpenChange={setLicences}>
        <SheetContent title={t('public.licence')}>
          <ChoiceList
            label={t('public.licence')}
            value={face.licence}
            options={PUBLIC_LICENCES.map((value) => ({
              value,
              label: t(`public.licences.${value}`),
            }))}
            onChange={(licence) => {
              set({ licence })
              setLicences(false)
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
  const preview = (
    <div className="flex flex-col gap-4">
      <section aria-label={t('public.preview')} className="flex flex-col gap-2">
        <h2 className="mx-1 caps">{t('public.preview')}</h2>
        <div className="flex items-center gap-4 card p-3">
          <Tile id={item.id} kind={item.kind} size="card" />
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="font-bold text-balance break-words">
              {face.title.trim() || item.title}
            </span>
            <span className="text-footnote text-muted-foreground">
              {[face.composer.trim(), publishing.authorName].filter(Boolean).join(' · ')}
            </span>
            {descriptionOf(face.description) ? (
              <span className="line-clamp-2 text-footnote text-muted-foreground">
                {descriptionOf(face.description)}
              </span>
            ) : null}
            <span className="text-footnote font-semibold">
              {[song ? t(`public.types.${face.type}`) : '', ...face.tags]
                .filter(Boolean)
                .join(' · ')}
            </span>
          </span>
        </div>
      </section>
      <RightsCheck checked={rights} onChange={setRights} />
      <Button size="lg" className="w-full" disabled={!ready} onClick={() => void publish()}>
        {t('public.publishConfirm')}
      </Button>
    </div>
  )
  return laptop ? (
    <div className="grid grid-cols-2 items-start gap-10">
      {fields}
      <div className="sticky top-4">{preview}</div>
    </div>
  ) : (
    <div className="flex flex-col gap-6">
      {fields}
      {preview}
    </div>
  )
}
