# Round 29 plan: Part B (B1–B11)

The plan for Part B, one block per item, before any of it is built (D20: the owner reads it first). Source:
`prompt.md` "## Part B: features" (lines 1830–1990), Decided 1–23 (lines 330–607; D20–D23 and later owner
corrections win), the rulings in `progress.md`. Each "Today" was checked in the code on `claude/keen-gates-q9bnit`
at d1bd6477.

Screenshot sizes everywhere below: **402** (phone upright), **393**, **320**, **874×402** (phone on its side),
**1280** (laptop), light and dark, into `.scratch/r29/shots/after/`.

- [B1: the Profile](#b1-the-profile-as-complete-as-memory-palaces)
- [B2: professional copy](#b2-professional-copy)
- [B3: Explore in Songs](#b3-explore-in-songs)
- [B4: Edit in place](#b4-edit-in-place)
- [B5: Learner view](#b5-learner-view)
- [B6: one publishing model](#b6-one-publishing-model)
- [B7: real settings for the Player and the editor](#b7-real-settings-for-the-player-and-the-editor)
- [B8: the Player's practice flow](#b8-the-players-practice-flow)
- [B9: customisable pages and cards](#b9-customisable-pages-and-cards)
- [B10: customisable bars](#b10-customisable-bars-as-memory-palaces-does)
- [B11: Tools](#b11-tools-as-a-group-of-their-own)
- [Build order](#build-order)
- [Owner's to-dos](#owners-to-dos)

---

## B1: the Profile, as complete as memory-palaces'

- **Source:** prompt lines 1831–1869 (B1.1–B1.10), D2, D12, D17. `profile/spec.md` (the plan wins where they
  differ). Built so far (`progress.md` B1): ef48f266, 00c8af17, 5baac640.
- **Today:**
  - `/profile` (`pages/profile/ui/ProfilePage.tsx`): the name in the bar with a Settings gear (phone), a hero with
    an initial `Avatar`, the **email**, three figures **Streak · Songs played · Steps learned** (not links), a row
    to Activity, a Record card (Lessons done, Skills known), then `Badges.tsx`: the "Almost there" card and the six
    badges as a grid (no See all, no Badges page, no detail page).
  - `/profile/activity` (`ActivityPage.tsx`): run, best run, days practised, the month's calendar.
  - `entities/progress/model/badges.ts`: `BADGES` (six, four tiers), `badgesOf`, `nextMilestone`, tested. No tier
    dates are kept. Scale Master counts scales learned (1·3·6·12), not keys practised (the audit's ruling).
  - `pt-progress` has no practice time and no MIDI-session or recording milestone; takes live in `entities/take`.
  - Server: `learner_profiles` (name, handle `^[a-z0-9_]{3,24}$`, bio ≤ 160, avatar, `public` default false),
    `handle_available()`, the `avatars` bucket readable when public; `supabase/tests/profile-access.sql` green. No
    client adapter: `learner_profiles` appears only in `database.types.ts`.
  - `/settings/account` (`AccountSettingsPage.tsx`): a Profile group (name), Email, Password (a link), Sync, Sign
    out, Delete account (a `DangerRow` and a dialog; `requestDeletion` / `cancelDeletion` and the deletion gate).
  - No notifications, no Privacy page, no Streak page, no Achievements, no skeletons.
- **Will build** (each sub-item one commit or a few):
  1. **Profile port.** `shared/api/profile`: `ProfilePort` with `read(): NetResult<LearnerProfile>`,
     `save(patch)`, `handleAvailable(handle)`, `uploadAvatar(blob)`, `removeAvatar()`; the Supabase adapter over
     `learner_profiles` and `avatars`; a fake. The image is cropped square and made a 256×256 WebP ≤ 200 KB in
     the browser (`shared/lib/image`). `createProfile()` in `composition-root.ts`; `useLearnerProfile()` in
     `shared/lib/account`, offline-first (the last read kept in memory, the initial while it loads).
  2. **Practice time.** `pt-progress` gains `seconds: Record<day, number>` (version bumped, no migration): the
     Player, a lesson's example and the trainers add the seconds they played (counted while the transport runs or
     a key is pressed, capped at 30 s of silence). `practiceRecord` gains `practiceSeconds` and `songsLearned`
     (pieces marked Learned). Shown as "2 h 15 min" / "2 ч 15 мин".
  3. **Hero.**
     - Avatar (hero size): the uploaded picture, else the chosen built-in avatar, else the initial. A round
       "Edit photo" button on its lower right ("Edit profile photo" / "Изменить фото профиля", the label for screen
       readers) opens Edit profile.
     - Name (display face), then "@handle · Joined 2026" / "@handle · С нами с 2026" (the handle part left out
       until one is set: "Joined 2026").
     - Three tiles: **Day streak** / "Дней подряд" (links to `/profile/streak`), **Songs learned** / "Выучено
       песен", **Practice time** / "Время занятий".
     - The bar: name as the title, a bell (`RoundLink`, "Notifications, 3 unread" / "Уведомления, непрочитанных:
       3", a count badge), the Settings gear (phone only, as today).
     - Guest: the initial avatar, "Exploring as a guest" / "Вы зашли как гость", **Sign in** / "Войти"; the tiles
       still show the device's figures.
  4. **Next milestone card** (built): "Almost there" / "Почти у цели", "3 more songs to your next Repertoire
     badge", a progress bar; it opens the badge's page. Unchanged but for the link.
  5. **Badges.**
     - Thresholds stay in `badges.ts`. Scale Master becomes **keys practised** (of 24): a key counts once a scale
       or a key's chords were played in it (`pt-progress.keys: Record<KeyId, day>`), tiers 3 · 8 · 15 · 24, as the
       spec says.
     - Tier dates: `pt-progress.earned: Record<"badgeId:tier", day>` written when a tier is first reached (a pure
       `withEarned(state, today)` run after every progress write).
     - On the Profile: a section "Badges" / "Значки" of the first three, then **See all** / "Все" (a `RowLink`).
     - `/profile/badges`: every badge as a card: its picture tinted by tier, its name, "Silver, 2 of 4" / "Серебро,
       2 из 4", a bar to the next tier.
     - `/profile/badges/$badgeId`: the badge, "Tier 2 of 4", **How to earn it** (one line), **Tiers**: each tier a
       row with its goal, "Reached 3 Nov 2026" or "4 to go" or "Locked", and "You: 11".
     - Names (en / ru): Streak Keeper / Без пропусков; Repertoire / Репертуар; Lesson Finisher / Уроки пройдены;
       Scale Master / Знаток тональностей; Daily Devotion / Каждый день; Library Builder / Своя библиотека.
  6. **Achievements** (one-time; `entities/progress/model/milestones.ts`, earned dates in `pt-progress.earned`):
     First song learned, First lesson done, First recording, First published song, First MIDI session (a
     connected piano played for a minute), A perfect take (100 % accuracy). Each earned or locked.
     - On the Profile: a section "Achievements" / "Достижения", the earned ones first, **See all**.
     - `/profile/achievements`: **Personal records** / "Личные рекорды" (Level, Longest streak, Practice time,
       Best take accuracy, Songs learned, Days practised) and **Milestones** / "Вехи" ("Earn these once.").
     - `/profile/achievements/$achievementId`: earned date or "Not earned yet", **How to earn it** (a line naming
       the screen and the act).
     - Level: from the record (one table in `milestones.ts`: level n at n² × 10 practice minutes), shown as
       "Level 4". Owner's question below.
  7. **Streak** (`/profile/streak`, replaces `/profile/activity`; the old path is removed and its links
     updated, `parents.ts` names `/profile`): the day streak large with a flame, "Keep the flame alive: practise
     today to extend your streak." or "Practise today to start a streak.", the month's calendar (‹ › months,
     practised days filled, today ringed), **Longest streak**, **Days this month**. Activity's content moves here;
     `ActivityPage.tsx` goes.
  8. **Notifications** (`pt-notifications`, a new `createSavedStore`, version 1, synced through `SYNCED_SAVES`):
     `{ id, kind: 'level' | 'tier' | 'milestone' | 'streak' | 'accuracy', ref, at, read }`, at most 100. A pure
     `noticesOf(before, after)` in `entities/progress/model` adds one per crossing, never twice.
     `/profile/notifications`: groups Today / Yesterday / Earlier (Сегодня / Вчера / Ранее); each row an icon, a
     title ("Level 4 reached", "Silver Repertoire", "New longest streak: 12 days", "Best accuracy: 96 %") and its
     time; a row swiped or its × removes it; the bar's ⋯ menu **Mark all read** / "Отметить всё прочитанным",
     **Clear all** / "Очистить всё" (Clear all through `ConfirmDialog`). Opening the page marks nothing; opening a
     row marks it read and goes to the badge or the record. Empty: "No notifications yet" and memory-palaces'
     line in our words.
  9. **Edit profile** (`/settings/account/profile`, reached from the Account page's first row and the hero's
     Edit photo):
     - the avatar large; **Change photo** / "Изменить фото" opens a sheet: **Upload photo**, the 12 built-in
       avatars (`shared/ui/avatars/`, SVG, note and instrument motifs in the palette), **Remove photo**;
     - **Name** (≤ 60); **Username** / "Имя пользователя" (`@` prefix, lower case, 3–24, checked as typed:
       "Available" / "Taken" / "Use 3–24 letters, digits or _"); **Bio** (≤ 160, a counter); **Email** (a row:
       a change sends a confirmation link, "Check your inbox to confirm the new address.");
     - **Save changes** / "Сохранить" in the bar (disabled until something changed; "Saving…", "Profile saved.");
     - offline: the fields read-only with "Available when online".
     - **Change password** (`/settings/account/password`): Current password, New password, Confirm new password,
       **Update password**. The Account page's Password row links here.
     - **Delete account** stays the Account page's last `DangerGroup`, now a sheet confirmed by typing DELETE /
       "УДАЛИТЬ", run by a pure machine `deleteAccountMachine` (confirm → deleting → done | failed | offline) in
       `pages/settings/model`, copied from memory-palaces' `delete-account-machine.ts` with its tests.
  10. **Privacy** (`/settings/privacy`, the Account group's row "Privacy" / "Конфиденциальность"): one
      `SwitchRow` **Show my profile** / "Показывать мой профиль": "Your name and picture on songs you publish, and
      your profile in Explore. Off: published songs show “Piano Trainer learner”." (D12: one switch, the server's
      `public`). Nothing else (rule 3: only what works).
  11. **States:** a skeleton for the hero and each section while the server profile loads; each section's empty
      state (no badges started, no achievements, no notifications) and a guest state (the device's figures, the
      server parts replaced by Sign in).
- **Server:** nothing new. The table, the function, the bucket and `profile-access.sql` exist. The author name on
  published songs (D12) reads `learner_profiles` when `public`, else "Piano Trainer learner": a view
  `public_authors` (a new migration, no `drop`) and a line in `public-access.sql`. Owner's to-do: apply it.
- **Not in this item:** the Explore profile page (B3); friends or following; push notifications; XP.
- **Done when:**
  - `badges.test.ts`: "Scale Master counts keys practised"; "keeps the day each tier was first reached".
  - `milestones.test.ts`: "each milestone earned once, with its day"; "level from practice minutes".
  - `notices.test.ts`: "one notice per crossing, none twice"; "keeps at most 100".
  - `notifications/store.test.ts`: "reads its version only"; "follows another tab".
  - `record.test.ts`: "counts practice seconds and songs learned".
  - `delete-account-machine.test.ts`: confirm → deleting → done / failed / offline.
  - `ProfilePage.test.tsx`: "shows @handle · Joined", "the streak tile opens Streak", "See all opens Badges",
    "a guest sees Exploring as a guest and Sign in", "shows a skeleton while loading".
  - `StreakPage.test.tsx`, `BadgePage.test.tsx`, `AchievementsPage.test.tsx`, `NotificationsPage.test.tsx` ("Mark
    all read", "Clear all asks first"), `EditProfilePage.test.tsx` ("a taken handle disables Save", "offline
    reads only"), `PrivacyPage.test.tsx`.
  - `parents.test.ts` and `settings-homes.test.ts` pass with the new routes.
  - Screenshots side by side with memory-palaces' Profile, Badges, Streak and Notifications at 402 and 1280;
    ours also at 393, 320 and 874×402.
- **Owner's question:** the Level in Personal records has no XP to count from. Default: level from practice
  minutes (n² × 10). Alternative: drop Level.

---

## B2: professional copy

- **Source:** prompt lines 1870–1876 (B2), D3 (the rights checkbox's wording), D18 (every text may be
  rewritten; old and new of each legal paragraph in `copy.md`; any change of meaning in the report), A6 (words).
- **Today:**
  - `.scratch/r29/copy.md` is a title line only. a8e46a3a changed one Privacy paragraph ("Sync and data" →
    "Storage and backup") and it is not recorded (audit D18).
  - Legal: `src/shared/i18n/locales/{en,ru}/legal.ts`, drawn by `pages/legal/ui/LegalPage.tsx`: Privacy (On your
    device, With an account, What syncs, What you publish, When something goes wrong, Where it is kept, Taking it
    with you and deleting it) and Terms (Using the app, Your account, What you publish, The app's own content,
    Changes).
  - Publishing: `songs.ts:336` `rights: 'Publish only music you wrote or may share.'`; the Publish page's why-publish
    text behind ⓘ.
  - ⓘ texts: 63 `info` keys across the namespaces (drawn by `InfoTip`, `SwitchRow`, `ChoiceCard`,
    `SettingsGroup`); empty states: about 46 `empty`/`hint` keys, 16 of them in `songs.ts`.
  - Help: `/settings/how-to-use` (`pages/how-to-use`).
- **Will build:**
  1. **Research note** (`.scratch/r29/research/copy.md`, not shipped): how App Store Review Guidelines (5.1
     privacy, 1.2 user content), Spotify, MuseScore, Flat, Klangio, Quizlet and Noji word: a privacy policy's
     sections, terms for user uploads (licence granted, takedown, the rights you confirm), publishing rules,
     empty states (one line what it is, one act), ⓘ help (one sentence, what it does, never how it is built).
     Only their structure and tone are taken; no sentence is copied.
  2. **Inventory.** A node script (`scripts/copy-inventory.mjs`, scratch output) lists every legal, publishing,
     empty-state, `info`, `hint` and help key in en and ru with its file and line, into `copy.md` as a table:
     key · en before · en after · ru before · ru after.
  3. **Legal pages.** Rewrite Privacy and Terms paragraph by paragraph in plain words, in both languages. Added
     where the references all have one and the app does it: **Children** (no account under 13), **Content you
     publish** (you keep your rights; you grant the app a licence to show it in Explore; it can be removed on a
     report), **Third-party content** (Salamander Grand Piano, Verovio, fonts: a link to About, B9), **Contact**
     (the owner's address, see the question). Each paragraph's before and after in `copy.md`; each change of
     meaning listed for the report. The "last changed" date moves to the day it merges.
  4. **Publishing.** The rights checkbox (D3), en: "I confirm that the title and composer are correct and that I
     have the rights to share digital and modified versions of this music. The [Terms of Use] apply." ru: "Я
     подтверждаю, что название и композитор указаны верно и что у меня есть права делиться цифровыми и изменёнными
     версиями этой музыки. Действуют [Условия использования]." (the checkbox itself is B6.) The why-publish ⓘ,
     the Unpublish confirmation, the published song's author line ("Piano Trainer learner" / "Ученик Piano
     Trainer", D12).
  5. **Empty states, by namespace** (one commit each: songs, learn, practice, player, editor, account, admin,
     search, settings): each a title and one line saying what will be here and how it gets here, and the one act
     (Noji's and Quizlet's pattern). Offline lines say "Available when online" / "Доступно онлайн", never an
     error.
  6. **ⓘ texts and help**, by namespace likewise: one or two sentences, the musician's term (`piano-data/books`,
     `UBIQUITOUS_LANGUAGE.md`), no developer words; the How to use page's sections reworded the same way.
  7. Each commit runs the humanizer and writing-guidelines skills over its strings first.
- **Not in this item:** the wording of new screens (each B item writes its own); A6's term renames (done).
- **Done when:**
  - `copy.md` has every changed key, before and after, en and ru; each legal paragraph's old and new text; a
    "Meaning changed" list (empty if none).
  - `npm run typecheck` (ru typed against en) and the tests that read strings (`LegalPage.test.tsx`,
    `settings-pages.test.tsx`, the pages' own tests updated where a string they find changed).
  - Screenshots of Privacy, Terms, the Publish page and three empty states (Songs folder, Notifications, Search
    no results) at 402 and 1280.
- **Owner's question:** a Contact paragraph needs an address the app may show. Default: no address; the paragraph
  says "Use Report a problem in Settings › Help" (the existing error report). Give an address to add one.

---

## B3: Explore in Songs

- **Source:** prompt lines 1877–1883 (B3), D1 (the switch, Explore is Noji's library page, the bottom row goes,
  Patterns behind a chip), D12 (author shown only when public), standing rule 28 (Songs on a wide screen).
  `progress.md` ruling P1 ("Songs keeps its Public library row; no switcher") was an agent's ruling the owner may
  change; D1 is the owner's and wins, so this item reverses P1.
- **Today:**
  - `/songs` (`pages/songs/ui/LibraryScreen.tsx:48-57`) draws a "Public library" `RowLink` card above the rows.
  - `/songs/public` (`pages/public-library/ui/PublicLibraryPage.tsx`): its own page with Back, a search field,
    Songs · Patterns chips (`?kind=`), shelves Newest and Most saved (`PublicShelf`), then results with a sort
    menu. `/songs/public/$itemId` (`PublicSongPage.tsx`): a preview (`widgets/song-preview`), Report, Save to my
    songs / my patterns.
  - `PublicEntry` (`shared/api/public-library/types.ts`): title, authorName, saves, publishedAt, meta (key,
    meter, hands, description). No rating, no category. `public_items.kind` allows `song` (patterns came in
    `20261029190000_public_patterns.sql`).
  - Learn's "Lessons · Courses" is a `Segmented` in its bar (`pages/learn/ui/LearnPage.tsx:54`).
- **Will build:**
  1. **The switch.** Songs' bar gets a `Segmented` **My songs · Explore** / "Мои песни · Обзор", the same control
     and place as Learn's. The URL holds it: `/songs?view=mine|explore` (`routes/songs-search.ts`, default `mine`,
     written with `useSetSearch`, remembered in `pt-views` as Learn's is). The Public library row goes.
     `/songs/public` is removed; its links (Search palette, the Publish page's View in library, `parents.ts`) go to
     `/songs?view=explore`. The bar keeps one height (D21).
  2. **Explore** (Noji's library page), in order:
     - search field "Search songs and patterns" / "Искать песни и паттерны" (`?q=`);
     - category chips (`ChoiceChips`, one selected, `?cat=`): **All · Classical · Folk · Pop · Studies ·
       Patterns** / "Все · Классика · Народные · Поп · Этюды · Паттерны"; Patterns shows patterns, the rest songs;
     - with no search: shelves, each a heading and **See all** / "Все" (to the same view with `?shelf=`):
       **New** / "Новое", **Most saved** / "Чаще сохраняют", **Top rated** / "Лучшие по оценкам"; a shelf scrolls
       sideways on a phone and is a grid of 4–6 on a laptop (rule 28);
     - with a search or See all: a grid of cards and the sort menu (New, Most saved, Top rated).
     - States: a skeleton of cards while loading; offline "Explore is available when online"; empty search "No
       songs match “x”" with Clear; empty library "Nothing published yet".
  3. **Card** (`widgets/song-preview` gains `ExploreCard`): the first bars drawn small (the existing preview at
     card size), title, author ("Piano Trainer learner" unless public, D12), ★ average with one decimal (hidden
     under 3 ratings), saves ("12 saves" / "12 сохранений").
  4. **Item page** (`/songs/public/$itemId`, path kept so published links still work; parent now
     `/songs?view=explore`): the preview, title, **Shared by** / "Опубликовал" (avatar and name, D12), ★ rating
     and count with the learner's own five stars to rate (signed in only), saves, **About** / "Об этой песне"
     (the description), key and time; the bar keeps Report. A sticky bottom button **Add to my library** /
     "Добавить в мою библиотеку" (one label for both bullets of the brief); once added it reads **Open in my
     library** / "Открыть в библиотеке".
  5. **An Explore song opened on the song page** reads as not yours: the song page's overview card shows "From
     Explore · not in your library" / "Из обзора · не в вашей библиотеке" and its primary act is **Add to my
     library** (Practise is secondary); no Learned, ♡ or Settings until added.
  6. **Server** (one migration, no `drop`): `public_items.category text check (category in ('classical',
     'folk', 'pop', 'studies'))` (null for patterns), chosen on the Publish page (B6); `public_ratings
     (item_id, user_id default auth.uid(), stars 1–5, primary key both)` with RLS (a learner writes only their
     own row, anyone reads the averages through a view `public_item_ratings (item_id, average, count)`);
     `public_item_ratings` joined in `browse`. Access lines added to `supabase/tests/public-access.sql`: a
     learner rates once and changes only their own; anon reads averages, never who rated. `database.types.ts`
     regenerated; `PublicEntry` gains `category`, `rating: { average, count } | null`; the fake and the contract
     test follow. Owner's to-do: apply it.
- **Not in this item:** an author's public profile page (B1 leaves it out); comments; publishing lessons and
  courses (B6).
- **Done when:**
  - `songs-search.test.ts`: "reads view mine|explore, default mine".
  - `LibraryScreen.test.tsx`: "no Public library row"; "My songs · Explore switches without pushing history".
  - `ExplorePage.test.tsx` (through `renderApp`): "chips filter by category"; "Patterns shows patterns"; "See all
    opens the shelf"; "offline says when online"; "a search with no match offers Clear".
  - `PublicSongPage.test.tsx`: "Add to my library copies it and then reads Open in my library"; "rates once".
  - `public-library.contract.test.ts`: category and rating, fake and adapter alike.
  - `parents.test.ts`: the item's parent is Explore.
  - Screenshots: Explore and an item at 402, 393, 320, 874×402, 1280, beside Noji 4875 and Quizlet 4876.
- **Owner's question:** the categories. Default: Classical, Folk, Pop, Studies (what the built-in catalog holds),
  chosen by the publisher. Say if you want others.

---

## B4: Edit in place

- **Source:** prompt lines 1884–1894 (B4), D6 (pencil ⇄ Done), D8 (built-in folders, one permission function in
  `entities/library`), D10 (Archive means "hide from me", "Archived (n)"), rules 16 (show only what can be done
  here) and 17 (confirm before losing or hiding work), D21 (one confirmation dialog).
- **Today:**
  - **Manage lessons** is a page: `/journeys/$journeyId/edit` (`pages/lesson-editor/ui/JourneyEditorPage.tsx`,
    `JourneyEditor.tsx`, 306 lines): a `DraftScreen` (status, Publish, menu) with the level's name and goal, its
    chapters as cards (`RowGroups`) of rows dragged by handles, a row's menu Remove (with Undo), + a lesson, +
    a chapter (`AddRow`), over `useJourneyDraft` (`features/edit-original`).
  - **Manage courses** is a page: `/courses/manage` (`CourseOrderEditorPage.tsx`, `CourseOrderEditor.tsx`): each
    shelf a card of courses dragged into order, over `useCourseOrderDraft`.
  - Learn (`pages/learn/ui/LearnPage.tsx:35-48`) shows an editor a `LibraryBig` `RoundLink` to either page, and a
    + `Fab` for New course on Courses.
  - Permissions are scattered: `editsContent(account)` (`shared/lib/account/roles.ts`) is called in 13 files;
    Songs decides per screen (`row-actions.ts` `isOwnSongId`, `use-library-page.ts:190` `deletable`,
    `NewSongSheet` `builtIn`, `LibraryDialogs` `collection`). `entities/library/model` has `builtIn` on a shelved
    folder (`arrangement.ts:23`) and no permission function. No "Archived (n)".
- **Will build:**
  1. **One permission function** `entities/library/model/permissions.ts`:
     `can(actor: { role: 'learner' | 'editor' | 'admin' }, act: LibraryAct, target: LibraryTarget): boolean`,
     where `LibraryAct` is `open | sort | favourite | editScore | archiveSong | addSong | importSong |
     saveFromExplore | moveIn | moveOut | renameFolder | recolourFolder | archiveFolder | deleteFolder |
     deleteSong | reorder | rename | remove | add` and `LibraryTarget` is a folder (own or built-in), a song (own or
     built-in, in which folder), a level, a chapter, the Courses shelf. The table is D8's: a learner in a built-in
     folder may open, sort, favourite, edit a score (their version) and archive a song for themselves; an editor
     may also add, move in and out; Learner view gives the learner's role (B5 already swaps the role the app
     reads). Exported from `entities/library` with `useCan(act, target)` reading the account.
  2. **Songs use it everywhere:** the + (New song, Import), ⋯ (a learner's built-in folder: Sort only), Select's
     bar (a learner in a built-in folder: Favourite and Archive only), the drag targets (`LibraryDnd`: a drop the
     function refuses is not offered as a target and a dragged row snaps back), row menus, the folder's Settings
     page. The scattered checks above are replaced by calls to `can`.
  3. **Archived (n)** (D10): a learner's Archive of a built-in song hides it for them (`pt-library` already keeps
     the learner's changes over the catalog; an `archived` set, version bumped if the shape changes). The folder
     ends with a row **Archived (n)** / "В архиве (n)" opening the folder's archived songs, each with
     **Unarchive** / "Вернуть". Archive asks first through `ConfirmDialog` ("Hide “x” from this folder? You can
     bring it back from Archived." / ru likewise).
  4. **A level's Edit mode** (replaces `/journeys/$journeyId/edit`): on Learn's Lessons, an editor's pencil **Edit**
     / "Изменить" (`EditToggle`, `widgets/mode-switch`) at the bar's end. In Edit mode, in place on the same page:
     the level's name and goal editable as text, each chapter's card with a drag handle, a rename field and ⋯
     (Remove chapter, confirmed); each row a drag handle and ⋯ (Remove, with Undo as today); **+ Add lesson** at a
     chapter's end, **+ Add chapter** at the level's end; the draft's status and **Publish** in the bar beside
     **Done** / "Готово" (`DraftStatus`, `DraftActions`). `JourneyEditor`'s parts move to `widgets/curriculum`
     (an `editing` prop on its level view); the route and `JourneyEditorPage` go; their links (Admin's Drafts tab,
     Learn) open `/?view=lessons&journey=<id>&edit=1`. `edit` is a search param written with `useSetSearch`.
  5. **The Courses shelf's Edit mode** (replaces `/courses/manage`): the same pencil on Courses; each shelf's
     courses with drag handles, ⋯ (Remove from shelf, confirmed), + New course (the existing sheet) at a shelf's
     end; Publish and Done in the bar. `/courses/manage` and `CourseOrderEditorPage` go.
  6. The `LibraryBig` links go from Learn's bar. Outside Edit mode a learner and an editor see the same page.
- **Not in this item:** a lesson's own editor and a course's editor (they stay pages: they edit a document);
  Songs' Select mode (it stays as is, with the permission function).
- **Done when:**
  - `permissions.test.ts`: the D8 table, row by row, for learner, editor and admin.
  - `BuiltInFolder.test.tsx` (through `renderApp`), learner in a built-in folder: "no +"; "⋯ shows Sort only";
    "Select shows Favourite and Archive only"; "a drag onto the folder is refused"; "sorting works and is saved";
    "editing a song's score saves their version"; "an archived song shows under Archived (n) and comes back".
  - Editor in the same folder: "+ → New song creates it in the folder".
  - Editor in Learner view: "sees exactly what a learner sees" (the same assertions run with the editor's role
    and Learner view on).
  - `LearnPage.test.tsx`: "an editor's Edit shows handles, rename, remove and + in place, Done leaves"; "a learner
    sees no Edit"; "/journeys/x/edit and /courses/manage are not routes".
  - `parents.test.ts` passes without the two routes.
  - Screenshots: a level and the Courses shelf in Edit mode, a built-in folder as a learner, at 402 and 1280.
- **Owner's question:** none.

---

## B5: Learner view

- **Source:** prompt lines 1895–1900 (B5), D5 (for admins and editors).
- **Today (built, 8eb79c26):** Settings' list offers an editor or admin a **View as a learner** switch
  (`widgets/settings-screen/ui/SettingsList.tsx`); `useLearnerView()` (`shared/lib/account/hooks.ts`) holds it in
  memory (`account.tsx`), and the account the app reads carries a learner's role while it is on, so every
  `editsContent` check hides its control. `app/learner-view/LearnerViewNotice.tsx`, in `RootLayout`, is a pill
  "Viewing as a learner" with **Exit**. `learner-view.test.tsx`: "shows an editor the app as a learner sees it,
  with Exit, and saves nothing"; "is not offered to a learner".
- **Will build (what is left):**
  1. **From the Admin area:** Admin's bar (`pages/admin`) gets a button **View as a learner** / "Смотреть как
     ученик" that turns it on and opens Learn.
  2. **The banner's words**, as the brief writes them: "Viewing as learner · Exit"; ours stays "Viewing as a
     learner" + Exit (en), "Вы смотрите как ученик" + "Выйти" (ru). No change.
  3. **Proof that no editor control shows:** a test that walks the screens with editor controls (Learn Lessons
     and Courses, a lesson, a course, Songs in a built-in folder, a song's page and Settings, Progressions,
     Accompaniment's patterns, the Admin link) with Learner view on and finds none of their labels.
- **Not in this item:** the permission function (B4) — once it exists, Learner view feeds it the learner's role
  with no other change.
- **Done when:** `learner-view.test.tsx` gains "turns on from the Admin area"; "no editor or admin control on any
  screen" (the walk above); "a reload ends it" (a fresh `renderApp` on the same storage). Screenshot of the
  banner at 402 and 1280.
- **Owner's question:** none.

---

## B6: one publishing model

- **Source:** prompt lines 1901–1905 (B6), D3 (the rights checkbox; Publish disabled until ticked), D21 (one
  confirmation dialog, Unpublish and Remove included; one icon one meaning), rule 9 (an item's settings on its
  Settings page), rule 17.
- **Today:** two models.
  - **Public library** (a learner's own song or pattern): `features/publish/ui/PublishScreen.tsx`, a page
    (`/songs/$pieceId/publish`, `/practice/accompaniment/patterns/$patternRef/publish`): a description and the
    row as others see it, the rights as a line (`songs.ts:336`, no checkbox), Publish; once published its link
    with Copy, View in library, saves, Unpublish, Publish new version. Reached from the song's Settings.
  - **Catalog drafts** (an editor's built-in song, lesson, course, progression, a level, the course order):
    `features/edit-original/ui/DraftBar.tsx` — `DraftStatus` and `DraftActions` (Publish, the bar's accent; ⋯
    Versions and Discard), in `DraftScreen` (`widgets/content-editor`), the score editor and the song's Settings
    (`ChangesGroup`). Unpublish and Delete of an item made in the app: `RemoveGroup.tsx` on the lesson's,
    course's and song's Settings pages (`editor.ts:652-664`). Share link: the song's Settings and Export…
    (`features/share-song`); lessons and courses have none.
- **Will build:**
  1. **The table** (written into `docs/adr/` as an amendment to 0116, and as `features/publish/model/acts.ts`, a
     typed table the screens read). Rows are acts; cells say where the act lives (all items alike):

     | Act | Song | Pattern | Lesson | Course | Progression |
     |---|---|---|---|---|---|
     | Edit (✎ in the item's bar) | score editor | pattern editor | lesson editor | course editor | progression editor |
     | Settings (⚙ in the item's bar) | its Settings page | its Settings page | its Settings page | its Settings page | its Settings page (new) |
     | Publish | Settings › Publish… → Publish page | same | same | same | same |
     | Unpublish | Publish page's foot, `ConfirmDialog` | same | same | same | same |
     | Delete | Settings' last `DangerGroup`, `ConfirmDialog` | same | same | same | same |
     | Share link | Settings › Share link (copy) | same | same | same | same |
     | Versions | Publish page › Versions (restore, `ConfirmDialog`) | same | same | same | same |

     Who may: a learner publishes their own song or pattern to Explore; an editor publishes built-in items to
     everyone (B4's permission function decides; a lesson, course or progression is an editor's only).
  2. **One Publish page** `PublishPage` (`features/publish/ui`, from `PublishScreen`), reached as
     `/<item route>/publish` (`/lessons/$lessonId/publish`, `/courses/$courseId/publish`,
     `/practice/progressions/$progressionId/publish` new; the song's and pattern's kept). In order:
     - the bar: Back, title **Publish** / "Опубликовать", ⓘ why publish;
     - status line: "Not published" · "Published 3 Nov" · "Changed since it was published" (`DraftStatus`'s
       words);
     - for Explore items: Description (as today) and Category (B3); for catalog items: **What changed** (the
       draft's changes, from `ChangesGroup`);
     - a preview: the row or card as learners will see it;
     - the rights checkbox (D3, words in B2), unticked each time; **Publish** / **Publish new version** disabled
       until ticked (and, for Explore, until the description is long enough);
     - once published: the link with Copy, **View** (in Explore or in Learn), saves (Explore), **Versions** ›
       (the draft's kept versions, restore asks first), then **Unpublish** last and alone in red.
  3. **The bars:** `DraftActions`' Publish becomes a link to the item's Publish page (the same accent button); its
     ⋯ keeps Discard. Versions moves to the Publish page.
  4. **Settings pages:** each item's Settings gets the same three rows in the same order: **Publish…** (a
     `RowLink` with the status as its value), **Share link** (an `ActionRow` that copies; lessons and courses get a
     link `/lessons/$id`, `/courses/$id`), then the `DangerGroup` with Delete (Unpublish leaves `RemoveGroup` for
     the Publish page). A progression gets a Settings page (`/practice/progressions/$progressionId/settings`)
     holding these.
  5. Every confirmation through `ConfirmDialog` (shared): Unpublish, Delete, Discard, restore a version.
- **Not in this item:** Explore itself (B3); learners publishing lessons or courses (not asked); the wording
  (B2).
- **Done when:**
  - `acts.test.ts`: "every item has every act, in the same place".
  - `PublishPage.test.tsx`: "Publish is disabled until the rights are ticked"; "published shows the link, View,
    Versions and Unpublish last"; "Unpublish asks first"; one run per item kind (`it.each` over the five).
  - `LessonSettingsPage.test.tsx`, `CourseSettingsPage.test.tsx`, `SongSettingsPage.test.tsx`: "Publish…,
    Share link, then Delete, in that order".
  - `parents.test.ts`: the new routes' parents are their item's Settings.
  - Screenshots of the Publish page for a song, a lesson and a course, unpublished and published, at 402 and 1280.
- **Owner's question:** should an editor's one-tap Publish in the bar stay? Default: no, the bar's Publish opens
  the Publish page (the rights checkbox is ticked every time, D3).

---

## B7: real settings for the Player and the editor

- **Source:** prompt lines 1906–1912 (B7), A35's last bullet (the Player's list), A40 (the score's Layout), A14
  and A39 (the on-screen piano's and the metronome's one home), D20–D23 (one Settings page each, Flat's cards,
  "Play notes while editing"). Audit (`compliance/part-b.md`, B7 rows): Clef, Replace/Insert, the palette's
  side, the score's Layout link and the On-screen piano link were missing; "Hear notes" was on two pages.
- **Today:**
  - **The Player** (`widgets/player-setup/ui/SettingsSheet.tsx`, one gear, a sheet on a phone and a panel at
    the right on a laptop): the music's choices, then **While you play** (the screen's pages and acts), This
    song, Share; Audio playback, Count-in, Pedal, Cursor, Speed training, The other hand, a Metronome row. The
    registry (`entities/settings/model/registry.ts:99-113`) homes `scoreView.*`, `otherHand.*` and
    `playback.*` on `player`. No Clef. No row to the On-screen piano. `/settings/player` keeps volumes and
    playback.
  - **The editor:** the score's Settings (`pages/score-editor/ui/ScoreSettingsPage.tsx`,
    `ScoreSettingsPages.tsx`, `?page=`): Title and credits; Music (Staves, Key, Time, Tempo, Bars); How the
    editor works: **Layout** (Staff size, Bars per line), **Note input** (only "Play notes while editing",
    `editing.hearNotes`, now on this page alone), **Recording** (metronome, tune). Settings › Score editor is gone,
    so the duplicate the audit found is gone.
  - The editor has Replace · Insert · Chord as a mode (`features/score-editor/model/state.ts:61`), chosen in the
    toolbar per session; the palette always docks at the left (`EditorPalette.tsx:200`).
  - Notation knows a staff's clef and clef changes (`shared/lib/notation/types.ts:79-87`, `clefOf`), not a
    learner's override.
  - `pt-settings` is version 20.
- **Will build (what is left):**
  1. **The Player's Display gets Clef** (a `ChoiceCard`, "Clef" / "Ключ"): **Original** / "Как в нотах" ·
     **Treble** / "Скрипичный" · **Bass** / "Басовый", each with a small picture of the clef; per staff of a
     single-staff song, the piano's two staves kept as written (Original only for a grand staff, the card hidden).
     Saved per song in the learner's view of it (`pt-views`), not app-wide. `notation` gains
     `withClef(score, staff, clef)`: the notes re-placed on the staff, clef changes inside dropped. The same Display
     page B8 builds on.
  2. **A row to the On-screen piano** in the Player's Settings, How the Player works: **On-screen piano** ›
     (a `RowLink` to `/settings/on-screen-piano`, rule 18: its one home), beside the existing Metronome row.
  3. **The editor's Note input page**, in order:
     - **Play notes while editing** / "Проигрывать ноты при вводе" (`SwitchRow`, as today);
     - **Input mode on opening** / "Режим ввода при открытии" (`ChoiceCard`): **Replace** / "Замена" ·
       **Insert** / "Вставка", each with a one-bar example; default Replace. `editing.startMode`; the toolbar
       still switches it during the session (Dorico's Insert is a toolbar toggle; its default is a preference);
     - **Palette side** / "Сторона панели" (`ChoiceCard`, from 48rem only): **Left** / "Слева" · **Right** /
       "Справа", default Left. `editing.paletteSide`; `EditorPalette` docks by it.
     `pt-settings` version 21; the registry gains `editing.startMode` and `editing.paletteSide` on
     `score-editor`.
  4. **Lesson and course Settings** keep only their own (A10 done): no change, checked by the test below.
- **Not in this item:** the Player's Modes, Version and Tools sheets and the rest of Display (B8); the bars'
  customisation (B10).
- **Done when:**
  - `notate.test.ts` / `clef.test.ts`: "withClef re-places every note and drops the clef changes".
  - `SettingsSheet.test.tsx`: "Clef shows for a single staff and draws the chosen clef"; "On-screen piano opens
    its page".
  - `ScoreSettingsPage.test.tsx`: "Note input has Play notes while editing, Input mode on opening and Palette
    side"; "the editor opens in Insert when chosen"; "the palette docks at the right when chosen".
  - `settings-homes.test.ts` and `settings-pages.test.tsx` pass (each new setting drawn on its home only).
  - `store.test.ts` (settings): "reads version 21; a field added later reads as its default".
  - Screenshots: the Player's Settings and Display, the editor's Note input, at 402, 874×402 and 1280.
- **Owner's question:** none.

---

## B8: the Player's practice flow

- **Source:** prompt lines 1913–1938 (B8), the reference's screenshots (prompt lines 536–566:
  `scratchpad/r29/owner/45–50.webp`), D7 (typed annotations), D11 (one help line per mode), D20 (Transpose as the
  editor's), D23 (the Player as drawn: ✕ · title · ✎ · MIDI · ⚙; tools row Sheet ⌃ · Transpose · Simplify; one
  Settings page with Display, Playback, Metronome, One hand). D23 is later than B8 and wins where they differ: the
  bar stays D23's, and Display stays a page of the Player's Settings (the Tools sheet links to it).
  B11's "Tools sheet over any screen" is this item's Tools sheet: one sheet, built here.
- **Today:**
  - Modes: `features/practice/practice-mode.ts` has **listen** and **wait** only; Wait mode is a switch in the
    Tempo popover (`widgets/practice-player/ui/TempoButton.tsx`, `player.ts:272` "Wait mode"). Hands (Left · Both
    · Right) and "Hear the other hand" are in the transport (`HandsButton.tsx`). No Interpret (the cursor
    following the learner's tempo).
  - Simplify is one on/off (`features/practice/choice.ts`, `simple`); a song has no other versions besides the
    learner's own version of a built-in song.
  - The transport pill (`Transport.tsx`): tempo, ‹, Play, ›, then loop, Sound and hands. No Restart, no
    progress bar, no coach line, no labelled bottom bar.
  - Takes: recorded in the score editor only (`features/record-take`, `/edit/$pieceId/takes/$takeId`,
    `widgets/take-roll`); nothing compares a take with the score. No annotations, no tuner, no print from the
    Player (Print is a Settings row, D23), no voice commands, no rhythm game.
  - Display today: count-in, cursor, the view's layout, keys, fingering (`SettingsSheet.tsx`, registry
    `playback.*`, `scoreView.*`); Clef comes with B7.
- **Will build** (each sub-item one or more commits):
  1. **Modes sheet** "What would you like to do?" / "Чем займёмся?", opened from the bottom bar's **Modes**. Four
     cards (`ChoiceCard` look, a coloured icon, a radio, one line under each, D11):
     - **Listen** / "Слушать": "The app plays; follow the score.";
     - **Sight-read** / "С листа": "The cursor waits for the right note or chord from your piano." (today's wait);
     - **Practice** / "Разучивать": "One hand at a time, the other heard or not." Opens inline: **Left · Both ·
       Right** (`Segmented`) and **Hear the other hand** (`SwitchRow`) — A35's one-hand rule, the same state as
       the transport's hands control, which leaves the transport;
     - **Interpret** / "Играть в своём темпе": "The cursor follows your tempo." New in the practice machine: a
       `follow` mode that moves the cursor on each matched onset and sets the playback tempo of the accompaniment
       (if any) from the last two beats' inter-onset times, clamped 40–200 %.
     `PRACTICE_MODES` becomes `listen | wait | practice | follow`; the mode is in the Player's URL (`?mode=`,
     `useSetSearch`); Wait mode leaves the Tempo popover. Sight-read, Practice and Interpret need a piano or the
     on-screen piano; without a connected one the card says "Connect a piano or use Piano keys."
  2. **Version sheet** "Choose your version" / "Выберите версию", from **Change version ›** under the title (a
     pill on the score) and from the Tools sheet: groups by instrumentation, each folding — **Piano solo** /
     "Фортепиано соло", **Piano and voice** / "Фортепиано и голос" (only where the song has a tune staff) — then
     by level with a three-dot marker: **Original** / "Оригинал", **Simplified** / "Упрощённая" (today's Simplify:
     triads), **Easy** / "Лёгкая" (new: the tune and each chord's root, `easyChart` in `shared/lib/arrangement`);
     each row "Difficulty n · accompaniment"; the chosen row has a check. Where the learner has their own version
     of a built-in song, a first group **Your version** / "Ваша версия". The tools row's Simplify button becomes
     this sheet's entry (`?simple=` becomes `?version=original|simple|easy`).
  3. **Tools sheet** (one sheet, also B11's): a **Tools** button / "Инструменты" (a grid icon) in the Player's
     bar before ⚙; groups of rows with coloured icons:
     - quick tools (B11): **Metronome**, **Recorder**, **Tuner**;
     - **Annotations** (sub-item 4), **Print** (opens the existing print, `widgets/song-print`), **My
       recordings** (the song's takes, a list opening a take with its feedback);
     - **Voice commands** › Off / On; **Rhythm game** (a switch);
     - **Audio/MIDI** › (`/settings/connect-piano`), **Transpose** (the tools row's popover), **Change version**
       (sub-item 2), **Display** › (the Player's Settings › Display; one home).
  4. **Annotations** (D7, typed, not drawn): an Annotate mode from the Tools sheet: tap a note or a beat, then
     choose a mark from a bar: **Text**, **Fingering** (1–5), **Dynamic** (pp p mp mf f ff), **Breath** (’),
     **Pause** (𝄐), **Circle** (around the note). Saved with the learner's copy of the song
     (`pt-pieces` gains `annotations: { at: beat, staff, kind, value }[]`, version bumped), drawn by Verovio as
     the matching MEI elements (`dir`, `fing`, `dynam`, `breath`, `fermata`, a circle as an `annot` rendered by
     our overlay). **Show annotations** / "Показывать пометки" is a Display switch.
  5. **Display** (the Player's Settings page, D23): **Clef** (B7), **Count-in** None · Audible · Visual (today's
     count-in gains Visual: the beats counted on the score), **Cursor** None · Beats · Continuous, **Scroll** Page
     · Continuous (today's `scoreView.layout`), **Piano keys** (`SwitchRow`, today's `scoreView.keys`), **Show
     fingerings**, **Show annotations**. One card of rows, the label left and the control right.
  6. **On the score:** a big floating **Play** with **Restart** beside it (the transport's Play keeps its place,
     D23; Restart is new: to bar 1, or to the loop's start); a thin progress bar under the bar; a one-line coach
     line under the tools row ("Tap Play to listen to the song." / "Play the highlighted note." per mode,
     dismissable, at most one line); a **labelled bottom tool bar**: **Recordings · Loop · Tempo · Feedback ·
     Modes** (icon over label), replacing the transport's end controls; customisable in B10.
  7. **Feedback** after a take (from a connected piano; the Recorder in the Player records a take as the editor
     does): `entities/take/model/feedback.ts`, a pure `feedbackOf(performance, take, tolerance)` matching played
     notes to written ones by pitch and nearest onset: **right**, **wrong** (a different pitch), **missed**,
     **early**, **late** (beyond ±80 ms at the take's tempo). Shown on the score as coloured note heads (right
     grass, wrong rose, early/late honey with an arrow) and a summary card "92 % right · 3 wrong · 2 late". The
     bottom bar's **Feedback** toggles it for the last take.
  8. **Tuner** (B11 uses it too): `shared/api/audio` gains a microphone input and `shared/lib/music/pitch-detect.ts`
     (YIN, pure, tested on generated tones); a sheet with the note name, a needle ±50 cents and the frequency;
     A4 = 440 (a stepper 415–466 on its Settings).
  9. **Voice commands** (Web Speech API, `SpeechRecognition`, on only where the browser has it; otherwise the row
     says "Not available in this browser"): Play, Stop, Again, Slower, Faster, Next, Back, in en and ru.
  10. **Rhythm game:** with the switch on, the notes' heads hide their pitch and any key counts: the take is
      scored on timing alone (the same `feedbackOf`, pitch ignored).
- **Not in this item:** freehand drawing (D7 rules it out); the bars' customisation (B10); the Tools group on
  Practice (B11).
- **Done when:**
  - `practice-machine.test.ts`: "follow moves on each matched onset"; "follow sets the tempo from the last two
    beats, clamped".
  - `easy-chart.test.ts`: "keeps the tune and each chord's root".
  - `feedback.test.ts`: right, wrong, missed, early, late, and the rhythm-only scoring.
  - `pitch-detect.test.ts`: "finds A4 and C2 within 2 cents on generated tones".
  - `annotations` store test: "reads its version only".
  - `PlayerPage.test.tsx` / `ModesSheet.test.tsx` / `VersionSheet.test.tsx` / `ToolsSheet.test.tsx`: each sheet
    opens from its control, the chosen mode or version is in the URL without a history entry, Practice opens its
    hands inline, the bottom bar's five tools are labelled.
  - Screenshots side by side with the reference at 402 for the Modes, Version, Tools and Display sheets and the
    score with the coach line and bottom bar; also 874×402 and 1280.
- **Owner's questions:**
  - The reference puts Tools at the top right and Display inside Tools; D23 has ⚙ at the right and Display in
    Settings. Default: both — Tools before ⚙, and Tools' Display row opens Settings › Display.
  - Voice commands and Rhythm game are large and the brief gives no more than their names. Default: built last,
    as described above; say if either should go.

---

## B9: customisable pages and cards

- **Source:** prompt lines 1939–1953 (B9), D4 (presets for roundness, border, shadow, colour and layout; free
  CSS-like styling of every part of a card and block; a live preview), D8 (built-in folders), rule 17, the
  Constraints' "free styles" line (a whitelist, no `url()`, nothing that breaks the layout). memory-palaces:
  `src/pages/deck-card-style`, `deck-settings` (`DeckAppearanceSheet`, `DeckCoverPicker`, `DeckSettingsDialogs`),
  `settings-about`.
- **Today:**
  - The lesson editor has the block toolbar (`pages/lesson-editor/ui/document/LessonDocument.tsx`, TipTap,
    `SlashMenu.tsx`, Insert, drag handles). Course pages (`pages/course/ui/CoursePage.tsx`), the Courses overview
    and the song overview have fixed layouts; the course editor edits title, summary, properties and the lesson
    order only.
  - No style model: cards take the kit's look; no cover on a song or folder. A folder has a name and a look
    (colour) on "Name and look" (`FolderSettingsPage.tsx:66`).
  - Song Settings (`pages/piece/ui/SongSettingsPage.tsx`): Details; Library (Folder, Archive); Share (Export…,
    Share link, Publish); Delete or Reset. Folder Settings: Name and look; In library (Move to, Archive); Delete.
    No Duplicate, no Rename row, no Reset progress.
  - No About page: credits are one footnote line (`settings.ts:100` `about.madeWith`). `pt-library` is version 3.
- **Will build:**
  1. **The style model** `shared/lib/style`: `BlockStyle` = `{ radius: 0–4 (the shape scale's steps),
     border: 0–3 px, shadow: 0–3 (the elevations), surface: paint token | hex, text: paint token | hex, padding:
     compact | normal | roomy, layout: list | card | grid }`, every value checked by one `sanitiseStyle` (unknown
     keys dropped, hex only `#rrggbb`, no `url()` or any free string reaching CSS). `styleVars(style)` gives CSS
     custom properties; components read only those. **Presets** (en / ru): Plain / Обычный, Soft / Мягкий, Bold /
     Яркий, Paper / Бумага, Night / Ночь, each a full `BlockStyle`.
  2. **The style editor** `widgets/style-editor`: Presets (a row of picture chips), then each property with its
     control (Roundness: a 5-step `Segmented`; Border, Shadow: steppers; Surface and Text colour: the paint
     swatches and a custom colour field; Padding, Layout: `ChoiceCard`), a **live preview** at the top that sticks
     while scrolling, **Reset** / "Сбросить" at the foot. Opened as a page from the thing it styles.
  3. **Card style** (`/songs/folders/$folderId/card-style`, from the folder's Settings › Appearance › **Card style**
     / "Вид карточек"; Home's from Songs' ⋯): the style editor plus **What cards show**: **Cover**, **Key**,
     **Level**, **Progress** (`SwitchRow`s) and **Density** (Compact · Comfortable · Large); a live preview of
     three rows from the folder; **Reset**; **Apply to…** / "Применить к…": **This folder only** · **This folder
     and its n subfolders** · **Every folder (n)** (the last through `ConfirmDialog`: "Apply to every folder?").
     Saved per folder in `pt-library` (`cardStyle`, version 4); a built-in folder's for a learner is theirs, an
     editor's (outside Learner view) the folder's for everyone (catalog content, published as content is).
     Lesson rows: a level's Edit mode (B4) gets the same **Card style** for editors, saved in the level's content.
  4. **Appearance** (a group on the song's and the folder's Settings): **Cover** (Add cover / Change cover /
     Remove: an image cropped to 3:2, a 600 px WebP ≤ 150 KB), **Colour** (the eight paints), **Icon** (24 music
     icons). The folder's "Name and look" splits: Rename is an act (5), the look is Appearance. Covers are kept on
     the device (`shared/api/device-storage`) and, signed in, in a private `covers` bucket (`<uid>/<id>.webp`, a
     migration, `supabase/tests/covers-access.sql`: a learner reads and writes only their own); the library
     stores the cover's id.
  5. **Every act on the song's and folder's Settings**, each a row with an ⓘ hint, in this order (memory-palaces'
     deck settings):
     - **Duplicate** / "Создать копию" (a learner's copy as their own song; a folder with its songs), confirmed;
     - **Move** / "Переместить" (the existing Move to folder…);
     - **Rename** / "Переименовать" (a sheet with the name);
     - **Export** (MusicXML / MIDI, the existing Export… sheet; a folder exports a .zip of its songs' MusicXML);
     - **Reset progress** / "Сбросить прогресс" (Learned, tempos, takes' marks; `features/reset-progress`),
       confirmed;
     - **Archive** / **Unarchive** ("В архив" / "Вернуть из архива"), confirmed;
     - **Delete** last and alone (or Reset to the original for a built-in song), confirmed.
     B4's permission function decides each row in a built-in folder (D8): a learner sees Duplicate, Export,
     Reset progress and Archive only.
  6. **Customisable pages:** the course page, the Courses overview and the song overview get the lesson
     editor's document: an **About** document under their head, edited in place in Edit mode (✎ ⇄ Done) with
     Insert, `/`, drag handles and the lesson's block kinds (text, heading, callout, example of notes, image,
     custom section). A course's and the Courses overview's are content (an editor's, drafts and Publish, B6); a
     song's is its own for a learner's song (`pt-pieces`, version bumped) and the song's content for an editor's
     built-in song. Every block takes a `BlockStyle` (the block's ⋯ › Style opens the style editor in a sheet).
  7. **About** (`/settings/about`, in Help): **Version** (with the update state, `shared/lib/app-update`),
     **Build** (date and commit, from Vite's `define`), **Licence**, **Credits**: Verovio (LGPL-3.0), Salamander
     Grand Piano (Alexander Holm, CC BY 3.0), the metronome's sounds (from `public/samples/metronome/SOURCES.md`),
     the fonts (Noto, OFL), Bobrova (the book the lessons cite, `entities/book/content/books.ts`), Savchenko's *Called to Play*
     (the Studies, D22); then **Terms** and **Privacy** links. The footnote line goes.
- **Not in this item:** a theme for the whole app (Appearance in General stays); the lesson editor's own blocks
  (done).
- **Done when:**
  - `style.test.ts`: "drops unknown keys and any url()"; "a preset is a whole style"; "styleVars only sets
    custom properties".
  - `CardStylePage.test.tsx`: "the preview follows each change"; "Apply to every folder asks first"; "Reset
    restores the default".
  - `SongSettingsPage.test.tsx` and `FolderSettingsPage.test.tsx`: "every act in order with its hint"; "a learner
    in a built-in folder sees Duplicate, Export, Reset progress and Archive only"; "Delete asks first".
  - `CoursePage.test.tsx`: "an editor's Edit adds a block with /"; "a learner sees the styled blocks".
  - `AboutPage.test.tsx`: "shows version, build, licence and every credit".
  - `covers-access.sql` run green.
  - Screenshots: Card style, Appearance, a styled course page, About, beside memory-palaces' deck card style and
    deck settings, at 402 and 1280.
- **Owner's question:** the licence the About page names. Default: "All rights reserved" until you choose one
  (`package.json` has none).

---

## B10: customisable bars, as memory-palaces does

- **Source:** prompt lines 1954–1970 (B10), D9 (the Player's and editor's toolbars: 4–5 kept, the rest in More,
  Reset, the same for every song), rules 16, 17 and 18. memory-palaces: `src/pages/settings-select`,
  `shared/config/select-toolbar.ts` (`SELECT_ACTIONS`, `SELECT_TOOLBAR_MAX = 4`, `selectToolbarHasRoom`,
  `selectToolbarCanShrink`, `normalizeSelectToolbar`, `DEFAULT_SELECT_TOOLBAR`), `SelectToolbar*.tsx`,
  `src/pages/settings-swipe`, `shared/config/actions.ts` ("nothing is menu-only or swipe-only").
- **Today:**
  - Songs' Select bar (`pages/songs/ui/SelectionBar.tsx`): Favourite, Move, Export, Archive, Delete, fixed, plus
    the drag zones. Lessons and Courses have no Select mode. Takes are rows on the editor's take list
    (`TakeRow.tsx`) with no Select.
  - Swipes: `SwipeRow` (`shared/ui`) on `SongRow` and `FolderRow` (`widgets/song-library`): right Favourite, left
    Move then Archive at the edge (`row-actions.ts` `swipeOf`), fixed. No swipes on lessons.
  - The Player's tools row (Sheet ⌃ · Transpose · Simplify) and the transport's end controls, and the editor's
    tools row (`EditorToolsRow.tsx`) and palette (`EditorPalette.tsx`), are fixed. Nothing in `pt-settings`.
- **Will build:**
  1. **The action catalog** `entities/settings/model/bars.ts` (from memory-palaces' `select-toolbar.ts`, its
     tests copied and renamed): per surface the acts it has and the defaults.
     - `select.songs`: favourite, move, duplicate, export, archive, delete; default **Favourite, Move, Archive,
       Delete**.
     - `select.takes`: rename, export, delete; default **Export, Delete**.
     - `swipe.songs`, `swipe.folders`: per side (`leading`, `trailing`) up to 2: favourite, move, archive, delete
       (folders: move, archive, delete); defaults today's.
     - `swipe.lessons`: mark learned, reset progress; default leading **Mark learned**, trailing none.
     - `bar.player`: recordings, loop, tempo, feedback, modes, metronome, tuner, transpose, version, annotations;
       default B8's five **Recordings, Loop, Tempo, Feedback, Modes**.
     - `bar.editor`: the editor's tools row's tools; default today's order.
     Limits: Select 1–4; a swipe side 0–2; a bar 4–5 (D9), the rest under **More** / "Ещё". `normaliseBar`
     keeps only known, allowed, unique ids within the limits, else the default.
  2. **Stored** in `pt-settings.bars: Record<Surface, ActId[]>` (version bumped once for all of B10), synced like
     the rest. Each surface's home in the registry is its page (rule 18).
  3. **Select toolbar** (`/settings/select-toolbar`, General › **Select toolbar** / "Панель выбора"): tabs
     (`Segmented`) **Songs and folders** · **Takes** (one per kind that has a Select mode); the live bar at the top
     as tiles — drag a tile to reorder, its − badge takes it off; below, **Available** / "Доступно": every act of
     that kind not on the bar, a tap adds it; "The bar is full: take one off first." when at 4; the last tile's
     badge is disabled; **Reset to defaults** / "Сбросить" at the foot.
  4. **Swipe actions** (`/settings/swipe-actions`, General › **Swipe actions** / "Действия при смахивании"): tabs
     **Songs · Folders · Lessons**; for each, **Swipe right** and **Swipe left** rows of tiles arranged the same
     way (0–2 each), a live row preview that can be swiped; Reset. Archive and Delete still ask first when swiped
     (rule 17, `ConfirmDialog`). Lesson rows (`widgets/curriculum`) get `SwipeRow`.
  5. **The Player's bottom tool bar** and **the editor's toolbar** (D9): their own Settings pages hold them
     (rule 18: a bar of a screen lives on that screen's Settings): the Player's Settings › **Tool bar** /
     "Панель инструментов", the score's Settings › How the editor works › **Toolbar**; the same tile editor; 4–5
     on the bar, the rest under More on the screen; Reset. The same layout for every song.
  6. **On screen:** `SelectionBar`, `SongRow`, `FolderRow`, lesson rows, the Player's bottom bar and the editor's
     tools row read the stored list through one `useBar(surface)` and draw each act from the catalog, then drop
     any act that can't be done here (B4's permission function, the selection's contents): even customised, a bar
     shows only what works (rule 16); More holds the rest.
- **Not in this item:** new acts (each kind keeps the acts it has; Duplicate for songs comes with B9); a Select
  mode for lessons and courses.
- **Done when:**
  - `bars.test.ts` (from memory-palaces' tests): "adds up to the limit"; "keeps at least one on Select";
    "reorders"; "normalise drops unknown, duplicate and disallowed ids"; "Reset gives the defaults".
  - `SelectToolbarPage.test.tsx`, `SwipeActionsPage.test.tsx`: add, remove, reorder by drag, the full hint, Reset.
  - `SelectionBar.test.tsx`: "the bar on screen matches the page tile for tile"; "a learner's built-in folder drops
    Move and Delete even when chosen".
  - `SongRow.test.tsx`: "a swipe to Archive asks first".
  - `PlayerBar.test.tsx`, `EditorToolsRow.test.tsx`: "shows the chosen tools in order, the rest under More".
  - `settings-homes.test.ts`: each surface on its one page.
  - Screenshots: each page and its bar on screen, at 402 and 1280, beside memory-palaces' Select toolbar and
    Swipe pages.
- **Owner's question:** the brief lists Lessons and Courses tabs on the Select toolbar, but neither has a Select
  mode. Default: those two tabs wait until they have one (rule 3: only what works here); Lessons get swipes.

---

## B11: Tools, as a group of their own

- **Source:** prompt lines 1971–1990 (B11; notes in the session scratchpad's `r29/tools-fingering-refs.md`: Ultimate
  Piano's metronome and record over every screen, the journey app's one tool layout, piano.org's grouped tools),
  D21 (the Metronome is a tool with its own page and its own Settings page; no circle of fifths for picking a
  key), D22–D23 (Flat's key-signature grid wherever a key is chosen; a root is a keyboard with a ♯/♭ switch).
  D21–D23 are later than B11 and win: the circle of fifths becomes a **tool page only**, never the key picker.
  B8's Tools sheet is the one sheet this item puts over every screen.
- **Today:**
  - Practice (`pages/practice/ui/PracticePage.tsx`, `widgets/practice-pages/model/practice-pages.ts:26`): groups
    Theory (Chords, Scales, Intervals, Progressions), Playing (Accompaniment, Chord finder), Training (Exercises,
    Quiz, Metronome). The Chord player (agent worktree, `briefs/chord-player.md`, `plan/practice-redesign.md`
    CP) replaces Progressions and Accompaniment with one tile in a Harmony group when it merges.
  - The Metronome (`/practice/metronome`, `pages/metronome`) has Tap tempo inside it (`practice.ts:555`); its
    settings home is the page itself (registry `metronome.*`). The Player's count-in and click come from the same
    engine (093e86b9).
  - The circle of fifths is a picture on Scales' Key view (`widgets/scale-explorer/ui/CircleOfFifths.tsx`,
    `KeyCircle.tsx`). No Drone, no Tuner, no Recorder page; recording is the score editor's
    (`features/record-take`). Nothing opens a tool from inside a song or a lesson.
- **Will build:**
  1. **A Tools group, first on Practice** / "Инструменты": **Metronome** / "Метроном", **Chord finder** /
     "Определитель аккордов", **Circle of fifths** / "Квинтовый круг", **Tap tempo** / "Темп касанием",
     **Recorder** / "Запись", **Drone** / "Бурдон", **Tuner** / "Тюнер". The Metronome and Chord finder leave
     their groups. `PRACTICE_GROUPS` gains `tools` first; Search's index and `parents.ts` follow.
  2. **One tool layout** `widgets/tool-page` (`ToolPage`): the bar (Back, title, ⚙ to the tool's Settings page,
     Part A 24), the readout or picture in the middle (fills the height, rule 28), the controls under it, a
     floating Play/Start where the tool has one (rule 5). Every tool page uses it; the Metronome and Chord finder
     move onto it.
  3. **Each tool's page and its Settings page** (`/practice/<tool>` and `/practice/<tool>/settings`):
     - **Metronome:** as today on the new layout; its Settings page takes the sound, accents, subdivision, Silent
       bars and speed trainer (what is not the tempo and beats).
     - **Circle of fifths:** the wheel large (majors outside, relative minors inside, the key signature on each
       sector); tap a sector: its key's name, signature, relative key and diatonic chords as chips that play;
       **Open in Scales and keys** (the key opened there). Not a picker (D21–D22).
     - **Tap tempo:** a large pad; the tempo of the last taps (the Metronome's tap code, one implementation), its
       Italian word, **Use in Metronome**.
     - **Recorder** (My recordings): records from a connected piano (MIDI) as the editor's takes do, without a song;
       the list of every recording (free ones and each song's takes, grouped), each to play, rename, export MIDI,
       or **Make a song from it** (quantised into a new song, `entities/take/model/quantise.ts`); Delete asks.
     - **Drone:** a root (the keyboard with ♯/♭, D23) and **Note · Fifth · Major · Minor** (`ChoiceCard`), volume,
       octave; Start/Stop floating; a sustained synthesised tone until a recorded one is found (the sound brief's
       rules apply).
     - **Tuner:** B8's tuner on the tool layout: note, needle, frequency; Settings: A4 reference.
  4. **Over any screen:** a **Tools** button (B8's grid icon) in the bar of the Player, the score editor, a lesson
     and the explorers (Chords, Scales and keys, Intervals, the Chord player) opens the **Tools sheet** without
     leaving the page: **Metronome** (Start/Stop, tempo −/+, beats; it follows the song's tempo and time where
     there is one, else the Metronome's own), **Recorder** (Record/Stop; on a song it records a take of that song),
     **Tuner** (live). On the Player and editor the sheet's lower groups are B8's; elsewhere only these three and
     **All tools ›** (to Practice's Tools group).
  5. **One engine, one set of settings:** the quick metronome, the Metronome page, and the Player's count-in and
     click read `metronome.*` and drive the one engine (already shared, 093e86b9); the quick metronome writes the
     same tempo only when no song's tempo applies.
- **Not in this item:** the Chord player itself (its own plan, CP1–CP6); the key-signature grid (P2, done).
- **Done when:**
  - `practice-pages.test.ts`: "Tools is the first group, in this order".
  - `ToolPage.test.tsx`: "the gear opens the tool's Settings"; each tool's page test (Circle: "a sector shows its
    key and plays its chords"; Tap tempo: "taps set the tempo and Use in Metronome keeps it"; Recorder: "records
    a free take and makes a song of it"; Drone: "starts and stops the chosen drone").
  - `ToolsSheet.test.tsx`: "opens from the Player, the editor, a lesson and each explorer"; "its metronome takes
    the song's tempo"; "the page under it does not change".
  - `metronome-engine.test.ts`: "count-in, click and quick metronome read one settings object".
  - `parents.test.ts`: each tool's parent is Practice; each Settings page's parent its tool.
  - Screenshots: every tool opened from Practice and from inside a song, at 402 and 1280.
- **Owner's question:** Tap tempo as its own page while the Metronome keeps its Tap button. Default: both, one
  piece of code (the Metronome's Tap stays; the page is the larger pad).

---

## Build order

Dependencies first; each step one item or sub-items, committed one task at a time ("R29-B4: …").

1. **B5** (what is left: the Admin entry and the screen walk). Small, and B4's tests use it.
2. **B7** (Clef, the On-screen piano row, Note input's two settings). B8's Display builds on it.
3. **B4** (the permission function first, then Songs, Archived (n), the level's and the Courses shelf's Edit
   mode). B6, B9 and B10 read the permission function.
4. **B2, part 1** (research, inventory, legal pages, the publishing words). B6 needs the rights text.
5. **B6** (the acts table, one Publish page, the Settings rows). B3's category is chosen on it.
6. **B3** (the switch, Explore, the card, the item page). Its migration is the owner's to apply (below); the
   device side is built against the fake first.
7. **B1** (port, practice time, hero, badges and achievements pages, Streak, notifications, Edit profile,
   Privacy, states). Its one migration (`public_authors`) is the owner's to apply.
8. **B8** (Modes, Version, Tools sheet, Display, the score's layout, Feedback, Tuner, Annotations; Voice commands
   and Rhythm game last).
9. **B10** (the catalog, the pages, the bars on screen). Needs B8's bottom bar and B4.
10. **B9** (style model and editor, Card style, Appearance, the acts, customisable pages, About). Needs B4 and B6.
11. **B11**, after the Chord player's worktree (CP1–CP6) is merged: the Tools group, the tool layout, each tool,
    the Tools sheet over every screen. Needs B8's Tools sheet and Tuner.
12. **B2, part 2** (empty states, ⓘ and help, by namespace), last, so it covers every screen Part B added.

After each item: typecheck, lint, `test:related`; after B4, B6 and B10 (shared code) the full suite once before
the push; `npm run build` after any route change (B1, B3, B4, B6, B9, B10, B11).

## Owner's to-dos

- **Migrations to apply with your Supabase session** (written here, no `drop`, each with its access test run
  after):
  - B1: the `public_authors` view (a public profile's name and avatar, else "Piano Trainer learner"); lines in
    `supabase/tests/public-access.sql`.
  - B3: `public_items.category`, `public_ratings` and the `public_item_ratings` view; lines in
    `supabase/tests/public-access.sql`.
  - B9: the private `covers` bucket and its policies; `supabase/tests/covers-access.sql`.
  - Then `database.types.ts` regenerated and an ADR 0116 history line for each.
- **Answers** (each has a default the build takes if you say nothing): B1 the Level (from practice minutes); B2 a
  contact address (none, Report a problem instead); B3 the categories (Classical, Folk, Pop, Studies); B6 the
  bar's one-tap Publish (goes; the Publish page every time); B8 Tools and Display placement (Tools before ⚙;
  Display stays in Settings), Voice commands and Rhythm game (built last); B9 the licence on About (All rights
  reserved); B10 Lessons and Courses tabs (wait for a Select mode); B11 Tap tempo (its own page and the
  Metronome's button).
- **A ruling reversed:** `progress.md` P1 kept the Public library row and no switch; B3 follows D1 (your words)
  and builds the My songs · Explore switch. Say if P1 should stand instead.
- **Reseed** the built-in content after B4's, B6's and B9's content changes (`scripts/export-content.mjs`, then
  `scripts/seed-content.mjs` with an editor's login).
