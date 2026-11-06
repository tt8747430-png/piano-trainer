# R32-E · Settings: research

How the reference apps lay out and word their settings, and what Piano Trainer takes from each. Read before
`settings.md` (the audit and spec) and `../mockups/settings.html`.

## The owner's words (2026-11-05)

> the settings also should be refactored as they have a lot of bugs and problems and bad ui. also the back buttons in
> the about page is broken and its layout is also broken and the view as a learner is also weirdly placed there and all
> other options. bugs also like clicking customize select toolbar in the general settings goes to its page and has no
> back buttons and the ui is also bad. the settings ui is not done like the libraries and the one section scrolls with
> the right sections and such things. … refactor the words and sentences with the same rule as above …

> this refactoring also includes the admin settings and their features and so on.

Wording rule: professional, precise, concise — Apple's Settings, Chordify, Notion — in English and Russian.

## iOS Settings (iPhone)

- **Push navigation.** One grouped list; a row with a chevron pushes its page, whose bar has `‹ Settings` (Back to the
  list). A page under a page (General › About › Legal & Regulatory) pushes again and Back returns one level. Back is
  never missing and never dead.
- **The account first.** The Apple Account card (picture, name, "Apple Account, iCloud, and more") heads the list.
- **Groups of 2–6 rows,** each row a coloured rounded-square icon, a title in Title Case, an optional value before the
  chevron ("Wi-Fi  Home ›"). No descriptions under rows; explanations sit in a group's footer or behind ⓘ.
- **About** is a page of value rows (Name, iOS Version, Model) then rows to Legal & Regulatory; Software Update is its
  own row in General with its status as the value.
- **Destructive acts** (Sign Out, Erase) red, alone, at the end of their page.

## macOS System Settings (laptop)

- **Two panes that scroll independently.** The sidebar (search, the account, then grouped sections, each a small
  coloured icon and a name) has its own scroll; the detail pane scrolls on its own. Scrolling a long detail never moves
  the sidebar and the sidebar's foot stays reachable however long the detail is.
- **No Back at the top level:** the sidebar is the navigation; the section shown is highlighted. A pushed sub-page
  inside the detail pane (General › About, Wi-Fi › Details…) gets a `‹` Back in its title bar.
- **The detail pane's title names the section shown.** Sidebar rows are compact (28px icon, one line), not cards.

## Notion settings (web, desktop and mobile)

- A modal with a left sidebar in two headed groups (**Account**: My account, My settings, My notifications;
  **Workspace**: Settings, People, Teamspaces, Security, Identity, Connections, Import), each page titled with its name
  and a short subtitle. Admin-only items appear only to admins, inside the same sidebar under their own heading.
- Professional, terse labels: "Appearance", "Language & Time", "Open on start", "Delete my account".

## Linear settings

- A full-page settings area: the left sidebar replaces the app's navigation, grouped **Account** (Preferences, Profile,
  Notifications, Security & access) and **Administration** (Workspace, Teams, Members, Billing, Import/export, API).
  The administration group is visible to admins only. "Back to app" sits at the sidebar's top.
- Each page: title, one-line description, then sections of rows with a label, a one-line hint and a control at the
  right. Wording is precise ("Display full names", "Convert text emoticons into emojis").

## memory-palaces (the owner's app, `src/pages/settings*`)

- Settings is one list on a phone: the profile card (avatar, name, handle) first; then sections **Preferences**
  (notifications, haptics, reduced motion, daily goal, theme, language), **Library** (Swipe actions, Select toolbar),
  **Data** (Sync), **Help** (Help, About), Sign out last.
- Swipe actions and Select toolbar are **Settings' own pages** (`settings-swipe`, `settings-select`), each with a
  `ScreenHeader` and Back — the owner's reference for keeping them in app Settings, as iOS keeps Mail's Swipe Options in
  Settings.
- **About** (`SettingsAboutPage`): the app's icon and name centred with a tagline; a group of value rows (Version,
  Build, License); a **Legal** group of rows (Terms, Privacy Policy, Licenses); credits and copyright in small type at
  the foot. Back at the top-left as on every page.

## This app's libraries (Songs on a laptop)

- `pages/songs/ui/LibraryScreen.tsx`: the bar spans both panes; under it a grid `17rem | 1fr`; the tree is an
  `<aside class="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto">`, so it **scrolls on its own** while the
  list scrolls with the page. Tree rows are `TreeItem`s (40px, an icon or a 22px painted square, the name, a count;
  the open place marked `aria-current` with the chosen fill).
- Settings today puts its phone list (48px tiles, cards, two-line rows) in a `sticky top-4` column with **no height
  limit**: on a 904px-high laptop the list is ~1,300px, so it is taller than the window, sticks, and its lower rows
  (About, Version, Admin) are unreachable until the page itself scrolls — the two panes scroll together, the owner's
  "one section scrolls with the right sections".

## What we take

| From | Taken |
| --- | --- |
| macOS, Songs | Laptop: a compact sidebar of `TreeItem`-style rows (painted 28px square, one line), sticky under the bar, its own scroll (`max-h` + `overflow-y-auto`), the page scrolling with the document; the page shown highlighted; no Back for a top-level page, Back for a sub-page. |
| iOS | Phone: the grouped card list; every page pushed with a working Back to where it came from; values before chevrons; Software Update's status as a value; destructive acts red and last. |
| Notion, Linear | Admin-only sections in the same sidebar under an **Administration** heading, one page per section with a title; on a phone one row to an Administration list. |
| memory-palaces | Library group (Selection toolbar, Swipe actions) in app Settings; About as value rows + a Legal group + acknowledgements. |
| Apple, Linear wording | Nouns for pages ("Appearance", "Storage & Backup" style kept sentence-case to match the app), verbs for acts ("Send", "Check for Updates"), one-line ⓘ explanations, no chatty sentences. |
