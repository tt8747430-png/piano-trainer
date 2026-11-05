# R32-E · Settings and Administration: audit and spec

Research: `settings-research.md`. Mockup: `../mockups/settings.html`. Shots of today: `../before/`.

## Source

- The owner, 2026-11-05: Settings has bugs, problems and bad UI; About's Back is broken and its layout broken; View as a
  learner is weirdly placed; Customise select toolbar opens a page with no Back and a bad UI; Settings is not done like
  the libraries (one pane scrolls with the other); check every setting's placement and usability; professional wording
  (en, ru); best-practice UI.
- The owner, later the same day: the Admin area and its features are in scope too.
- CLAUDE.md: Settings holds only what is app-wide; each screen's own settings are its gear's; every preference one home
  (`registry.ts`, `settings-homes.test.ts`); Back is Up.

## Today (walked at 402×874 and 1710×904, `.scratch/r32/before/`)

| # | Where | Bug | Cause (file) |
| --- | --- | --- | --- |
| B1 | Laptop, every Settings page | The list pane is ~1,300px in a 904px window, `sticky top-4` with no height limit: it scrolls with the page and its foot (About, Version, Admin) is out of reach until the page itself is scrolled | `widgets/settings-screen/ui/SettingsScreen.tsx` |
| B2 | Laptop, every Settings page | The list is the phone's cards (48px tiles, two-line rows): heavy, and nothing marks the page shown (`aria-current` is set by the router only on an exact link; the account card and sub-pages are never marked) | `SettingsList.tsx` |
| B3 | Laptop, Select toolbar and Swipe actions | No Back: they are pages under General, but `SettingsScreen` drops Back on a laptop unless `sub` is passed, and neither passes it; the list marks nothing, so the learner is stranded | `SelectToolbarPage.tsx`, `SwipeActionsPage.tsx` |
| B4 | Laptop, About | Its own centred column with no Settings list beside it; Back's parent is `settingsPage`, which is null on a laptop, so Back does nothing on a fresh visit | `pages/about/ui/AboutPage.tsx`, `app/routes/parents.ts` |
| B5 | Phone, About | Terms and Privacy are 24px text links at the foot (under 44px); the version and update rows live in the list, not on About | `AboutPage.tsx`, `UpdateRows.tsx` |
| B6 | Privacy, Terms | Back goes up to How to use, which does not link to them | `parents.ts` |
| B7 | Laptop, Privacy, Terms, Admin | The sidebar's Settings is not current (only `/settings*` is) | `widgets/app-nav/ui/AppNav.tsx` |
| B8 | Settings list | View as a learner is an untitled switch group under Help, between About and Admin, for an editor alone; the Admin area has a second way to it (a 🎓 button in its bar) | `SettingsList.tsx`, `pages/admin/ui/AdminPage.tsx` |
| B9 | Settings list | Report a problem opens a sheet from the list; in a laptop sidebar a row that is not a page breaks the pattern | `ReportProblem.tsx` |
| B10 | `/settings/player` | An orphan: no link reaches it (the Player's gear is its home, R29); on a laptop its Back is dead | `pages/settings/ui/PlayerSettingsPage.tsx` |
| B11 | Laptop, a Practice page's Settings without `from` | The app's Settings list stands beside a page Settings does not list: nothing is current | `SettingsScreen.tsx` |
| B12 | Admin | Nine sections in a pop-up menu at the content's head; no two panes on a laptop; no push navigation on a phone; a `max-w-3xl` column centred away from the bar | `AdminPage.tsx` |
| B13 | Admin › Groups, Switches, Reports | Confirmations built from raw `AlertDialog`s, not the one `ConfirmDialog` | `GroupsTab.tsx`, `SwitchesTab.tsx`, `ReportsTab.tsx` |
| B14 | Admin › Reports | A cast (`report.reason as 'spam'`) to translate a reason | `ReportsTab.tsx` |
| B15 | Admin › Accounts | A role change is applied on a tap, with no confirmation, even when it removes an admin (one's own access included) | `AccountsTab.tsx` |
| B16 | Admin › Errors | A learner's Report a problem is filed as an error ("Report: …") and mixed into the errors | `ErrorsTab.tsx`, `group-errors.ts` |
| B17 | Admin › Groups | Every account in the app drawn as a switch under every group, open | `GroupsTab.tsx` |
| B18 | Words | Plain or chatty wording across Settings and Admin ("How to use", "Connect a piano", "Keep them safe", "Stop them publishing", "Switches", "Made with", "The piano") | `locales/{en,ru}/settings.ts`, `admin.ts` |

## Every preference and page: where it belongs

| Today (where) | What | Belongs | Decided home | New name (en / ru) |
| --- | --- | --- | --- | --- |
| Settings › account card | Account, sync line | app-wide | Settings, first | (name, email, sync line) · guest: Sign in / "Sync your library across devices" |
| Account | Profile, email, password, privacy, sync, sign out, delete | app-wide | Account (unchanged order) | Account / Аккаунт |
| Settings › View as a learner (list) and Admin's 🎓 | Session preview for editors and admins | the account's role | **Account › Editorial access** (one switch; the Admin button goes) | Preview as learner / Просмотр глазами ученика |
| General › Appearance | `theme` | app-wide | General | Appearance: Match system · Light · Dark / Оформление: Как в системе · Светлое · Тёмное |
| General › Language | `locale` | app-wide | General | Language / Язык |
| General › Select toolbar (row) | `bars.select.songs` | Songs' and folders' selection, the owner's memory-palaces keeps it in Settings | **Settings › Library**, its own top-level page | Selection toolbar / Панель выделения |
| General › Swipe actions (row) | `bars.swipe.*` | as above (iOS Mail: Swipe Options in Settings) | **Settings › Library**, top-level | Swipe actions / Действия смахивания |
| Storage and backup | device storage, offline piano, backup, reset | app-wide | Settings › Data | Storage and backup / Хранилище и резервные копии |
| On-screen piano | `keyboard.*` (look, position, playing, pedals; computer keys on a computer) | app-wide (the keys are on Learn, Practice, the Player, the editor) | Settings › Piano | On-screen piano / Экранная клавиатура |
| Connect a piano | `midi.*`, devices, Bluetooth, MIDI log | app-wide | Settings › Piano | MIDI devices / MIDI-устройства |
| Help › How to use | the guide | app | Settings › Support | User guide / Руководство |
| Help › Report a problem (sheet) | feedback | app | **Settings › Support, its own page** | Report a problem / Сообщить о проблеме |
| Help › Privacy, Terms (rows) | legal | the app's facts | **About › Legal** | Privacy Policy, Terms of Service / Политика конфиденциальности, Условия использования |
| Help › Version (row, checks for an update) | software update | the app's facts | **About**, first group | Software update / Обновление ПО |
| Help › About | version, build, licence, credits | app | Settings › Support | About / О приложении; credits → Acknowledgements / Благодарности |
| Admin (row) | Administration | admins | Settings › Administration (phone: one row to its list; laptop: its sections in the sidebar) | Administration / Администрирование |
| `/settings/player` | the Player's preferences | the Player | the Player's gear (unchanged, owned by the Player's round); the orphan route goes | — |
| Score editor, Metronome, Tuner, each Practice page, Chord player, a lesson | their preferences | their screen | their gear (unchanged; not listed in Settings, R29) | — |

`SETTING_HOMES` keeps every key on the same page id; `select-toolbar` and `swipe-actions` stay page ids, their pages
now top-level. `settings-homes.test.ts` stays true unchanged.

## Administration

| Today | Decided | en / ru |
| --- | --- | --- |
| `/admin?tab=…`, a pop-up of nine | `/admin` (phone: the list; laptop: opens Overview) and `/admin/$section`, each a Settings page with the sidebar | — |
| Overview | six figures | Overview / Обзор |
| Accounts | search, role chips, joined/last sign-in; **a change that removes admin asks first** | Accounts / Аккаунты |
| Groups | create, members, delete (`ConfirmDialog`); **members folded** under "Members (n)" | Groups / Группы |
| Switches | create (key, description), state, groups, delete (`ConfirmDialog`) | Feature flags / Флаги функций |
| Reports | hide/restore, suspend publishing (`ConfirmDialog`), dismiss; no cast | Content reports / Жалобы на контент |
| Errors | learners' errors **without** feedback | Error log / Журнал ошибок |
| (inside Errors) | **learners' reports, its own section** | Feedback / Отзывы |
| Activity | admin actions | Audit log / Журнал действий |
| Drafts | unpublished and changed content | Drafts / Черновики |
| Components | the kit's gallery | Component gallery / Галерея компонентов |

No database change: Feedback reads the same `error_reports` rows by their prefix.

## Will build

### Layout (`widgets/settings-screen`)

- **One model** (`model/sections.ts`): the groups and their pages — each `{ to, title key, icon, paint, matches }` —
  read by the phone list and the laptop sidebar alike, and by `useSettingsPage()` (the page shown, by path).
- **Phone** (`< 64rem`): `/settings` is the grouped card list (`SettingsList`): the account card; **General** (General,
  Storage and backup); **Piano** (On-screen piano, MIDI devices · value Off/On/name); **Library** (Selection toolbar,
  Swipe actions); **Support** (User guide, Report a problem, About · value the version); **Administration** for an admin
  (one row, value nothing). Every page pushed with `‹` Back in its bar to where it came from, else its parent.
- **Laptop** (`≥ 64rem`): the bar (Back only on a sub-page) over a grid `17rem | minmax(0, 44rem)`. The left pane is
  `SettingsNav`: an `<aside>` `sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto` (Songs' tree exactly), rows as
  `TreeItem`s with a 28px painted square, the account first (its picture, its name, "Account"), the groups headed by
  `TreeHeading`, and for an admin **Administration** with its ten sections. The page shown is marked (`aria-current`),
  sub-pages marking their parent (Edit profile → the account; Legal → About; MIDI log → MIDI devices). The right pane
  scrolls with the document; the left never moves.
- A page Settings does not list (a Practice page's Settings, the Chord player's) draws one column with Back on every
  size: no sidebar beside a page it does not hold.

### Pages

- **General:** Appearance (`ChoiceCard`, Match system · Light · Dark), Language (`ChoiceCard`). Nothing else.
- **Selection toolbar:** the bar editor for songs and folders under "Songs and folders", footnote "Up to four actions
  appear when you select songs or folders."
- **Swipe actions:** Songs · Folders (`Segmented`), Leading swipe (right) and Trailing swipe (left), each up to two.
- **Storage and backup:** Device storage, Offline piano, Backup, then Reset progress / Remove downloaded piano samples.
- **On-screen piano / MIDI devices:** unchanged controls, titles renamed.
- **User guide:** unchanged parts; title renamed.
- **Report a problem:** a page: "Description" field (5 rows, 2,000 characters), the footnote "Reports are anonymous.
  Include what you were doing and the screen you were on.", Send (disabled while empty); "Report sent. Thank you." as a
  toast; offline it is queued with the error reports (the report port retries), said in the footnote.
- **About:** the app's mark, "Piano Trainer" and "Version 0.0.0 (dev)"; **Software update** row (status as its value;
  a tap checks; Install and restart under it when ready); Licence row; **Legal**: Privacy Policy, Terms of Service
  (rows, 44px+); **Acknowledgements**: the credits, each "Role · Author · Licence".
- **Privacy Policy, Terms of Service:** a Settings sub-page (About current in the sidebar), Back to About.
- **Account:** unchanged, plus **Editorial access** for an editor or admin: Role (value) and Preview as learner
  (switch, ⓘ: "Hides editing and administration controls for this session. Nothing is changed; the preview ends when you
  exit it, reload or sign out.").
- **Administration:** `/admin` on a phone a card list of the ten sections (icons as the sidebar's); each section its own
  page under Settings' layout. Not an admin: the page says "Administration requires an administrator account."

### Back (parents.ts)

| Route | Phone | Laptop |
| --- | --- | --- |
| `/settings/*` top-level pages (incl. select-toolbar, swipe-actions, feedback) | Settings | none (sidebar) |
| `/settings/account/*`, `/settings/privacy` | Account | Account |
| `/legal/privacy`, `/legal/terms` | About | About |
| `/admin` | Settings | (redirects to Overview) |
| `/admin/$section` | Administration | none (sidebar) |

### Tests

- `SettingsScreen`/`SettingsNav`: the sidebar is its own scroller (sticky, `max-h`, `overflow-y-auto`); the page shown
  is current; a sub-page keeps Back on a laptop; a page not in the list has no sidebar.
- Select toolbar and Swipe actions on a phone have Back to Settings; About has the sidebar on a laptop (B3, B4).
- `parents.test.ts` covers the new and changed routes; Legal goes up to About.
- Admin: the section routes, the confirm before removing an admin, Feedback separated from errors (`group-errors`).
- The Account shows Preview as learner to an editor and not to a learner; the Settings list no longer does.

## Mockup critiques (impeccable lens)

**Pass 1** (1400 light and dark, 393): the phone list's values (MIDI devices · Off, About · version) were missing — the
model's tuples were read at the wrong index; the Accounts search field grew to fill the phone (a flex child), leaving a
blank card under the dialog; the laptop sidebar with Administration hid the section shown below the window's foot, so
the highlight could not be seen; 1.4's caption promised a sidebar scroll the drawing (no Administration) did not need.
Fixed: values read, the field fixed in height, the sidebar drawn scrolled to its current row (as the build scrolls it
into view), 1.4 drawn for an administrator.

**Pass 2** (fresh read at 393 and 1400, both themes): one honey action per screen (Add flag, Send report) ✓; the
destructive rows red and alone ✓; every target ≥ 44px (Legal rows, sidebar rows 44px) ✓; no internal word on screen ✓;
the Russian longest string (Политика конфиденциальности) fits a phone row ✓; no overflow at 393 ✓. Nothing changed.

## Changed while building

- The first group is **App** (ru Приложение), not General: "General › General" read twice in the list (Pass 1, ru).
- ru Storage and backup is **Хранилище и копии** (the longer name was cut in the laptop sidebar); Software update is **Обновления · Актуальная версия** (it wrapped to four lines on a phone).
- `/settings/player` stays (the Player round owns it; `settings-pages.test` renders the Player's preferences there); it is not listed, so it stands alone with Back to Settings.

## Built pages: two impeccable passes

**Pass 1** (402×874 and 1710×904, en light, ru dark): a row's value stopped short of the chevron's column (Software update beside Licence) — values now end-aligned in every row (`RowFace`); "App › General" replaced "General › General"; the ru sidebar cut Хранилище и резервные копии, and Обновление ПО · Последняя версия wrapped to four lines — both shortened; the bar editor cut its tiles' names (Name an…, Переме…) — tiles grow to their name, Edit replaces Name and look; "The toolbar is full" read wrong on a swipe side — "All slots are in use"; the legal pages still pointed at Settings › Help.

**Pass 2** (fresh shots of every page, `.scratch/r32/pass2/`): the laptop sidebar holds still at the end of a scrolled Terms of Service with About marked; every page has its Back on a phone; no text cut; the only inspector lines are the bar editor's 24px − badges (their reach is 44px through a pseudo-element the inspector does not measure) and the choice cards' 16px radio dots inside 44px labels.
