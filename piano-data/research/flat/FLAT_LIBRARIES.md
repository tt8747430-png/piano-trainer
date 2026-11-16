# Flat 26.11.0 Desktop: Libraries (Public / Community library and My Library)

How the extracted ASAR was read: static reading only (grep and local Python parsing). Nothing from Flat was executed and no network call was made.
Paths are relative to `app/out/`. `R:` means `renderer/assets/`, `M:` means `main/`.

**Evidence tags**
- **[exact]**: the string, identifier, path or logic appears literally in the cited chunk.
- **[inferred]**: my interpretation, based on how the code is wired together.

**English strings.** English UI copy (the "default" locale) is inlined in `R:vue-data-D9mDxW5Z.js` as minified objects. I rebuilt it into a flat key table, so a key such as `flat:privacy-mode.public` = "Public on the Internet" is the i18next key plus its exact English value.
- The rebuilt object is near offset ~813064–833542.
- `R:loadTranslations-CazXXh_F.js` maps `locales/default/*.json`. `en/*.json` is empty and falls back to the default locale.
- The en-GB copies are `flat-CZTB7TE2.js` and `edu-KcYRJmCs.js`.

---

## 0. Key architectural finding (read this first)

1. **The desktop "Library" window contains only the user's own library.** [exact] `R:library-CzysOtuK.js`:
   - It builds a `vue-router` with memory history.
   - The only route is `/library` (from `R:routes-CzUJg4Cd.js`) plus a catch-all that redirects to `/library/allScores`.
   - A `beforeEach` guard blocks any path that does not start with `/library`. It logs `Blocked navigation attempt: …` with Sentry tag `desktop-library`.
2. **Public / community pages are web-only from the desktop app.** This covers Explore/Browse, Popular/Discover, Community feed, public score page, user profiles, publishing dialog and stats.
   - [exact] `setOpenScoreUrlHandler` in `library-CzysOtuK.js`:
     - A URL matching `/score/<hex>(-slug)(/edit)` goes to `flatDesktopAPI.openCloudScore(id)`, which opens the desktop editor.
     - Every other URL goes to `flatDesktopAPI.openInBrowser(pathname)`.
   - [exact] `M:index.js` registers `library:openInBrowser` and `library:openCloudScore`. The web base is `d0="https://flat.io"`, and `bl(e)` returns `${d0}/score/${e}`.
   - [exact] For any `target=_blank` link, `setWindowOpenHandler` calls `shell.openExternal` for http(s) URLs and denies the in-app window.
3. **Even so, the bundle ships all of Flat's community UI copy and API client code.** This is the shared `flat.json` locale and the shared `vue-data` API layer.
   - Several public-library components do run inside the desktop library, mainly for **liked / others' scores**:
     - public score rows
     - author cards
     - Follow
     - Like
     - Add to playlist
     - Pin to profile
     - Embed
     - Publish / Unpublish
     - Share & privacy dropdown
     - Community-profile onboarding
     - "Make a copy" (fork)
   - Section A documents both:
     - (a) what the desktop renders [exact]
     - (b) what the shared strings and API show about the web community library. The strings and API are [exact]; their placement on web pages is [inferred].

---

# PART A: PUBLIC / COMMUNITY LIBRARY (primary)

## A1. Information architecture of the community (from shared nav strings)

The web community IA, shown as `flat:nav.*`. Values are [exact] from the `flat.json` default locale in `R:vue-data-D9mDxW5Z.js`.

| Key | English | Notes |
|---|---|---|
| `nav.community` | Community | Also used in desktop: `R:ScoresLibrary-C3WZy1FZ.js` ("Created by → Community" filter) and `App-BpSv0vpB.js` (community onboarding) [exact] |
| `nav.explore` / `nav.exploreMobile` | Browse & Explore / Explore | Not referenced by any desktop component chunk [exact by grep] |
| `nav.discover` | Discover | |
| `nav.popular` | Popular | |
| `nav.featured` | Featured | |
| `nav.recent` | Recent | |
| `nav.search` | Search | |
| `nav.my-profile` | My Profile | |
| `nav.analytics` | My Stats | |
| `nav.classes` | Classes | Education product |
| `nav.learn` | Learn | |
| `nav.my-library` / `nav.my-scores` | Your Library | |

**Community landing page** (`flat.community.page.*`) [exact strings; the web page is inferred]:
- Title: "Explore scores, publish yours, and get featured".
- Tabs: "People" and "Scores".
- Search fields:
  - "Search users"
  - "Search music scores"
  - "See results"
  - "View all"
  - "See details"
- Challenge block: "Challenge", "Submit my score".
  - Empty state: "No challenges have been submitted yet." / "Start the fun by submitting the first one and sharing it with your friends to get them involved!"
- Feed empty state: "Apologies, there are no scores to display at the moment."
- Feed error: "An error occurred while loading the scores. Please try again later."
- People search empty state: "Oops... No results found" / `We couldn't find a match for "{{searchQuery}}". Please try another search.`
- Meta description: "A global community of 5M+ music lovers. Flat is the biggest community of creators driven by the love of music."
- Also: `flat.joinTheChallenge` = "Join the challenge" [exact].

**Popular feed** (`flat.popular.*`) [exact]:
- Title: "Popular music scores and guitar tabs".
- Period selector: "All time" | "This past week" | "This past month".
- `flat.discover.title` = "Discover".

**Offline copy for community surfaces** (`flat.scoresTableEmpty.offlineMode.content.*`) [exact; used by `R:ScoresTableEmpty-BMWU3u6Z.js`]:
- `community`: "Connect to the internet to discover the latest from the Flat Community."
- `browseExplore`: "Connect to the internet to browse and explore music scores on Flat."
- `customPlaylists`: "Connect to the internet to discover thousands of scores in our Community and add your favorites to playlists."
- `flat.search.users.offlineMode`: "Connect to the internet to search for users."

## A2. Finding public scores: Browse/Explore, search, filters

### A2.1 Browse & Explore filters [exact strings, `flat.browse-explore.*`]
- Panel title "Filters", with "Reset filters".
- Facets:
  - "Date published"
  - "Popular instruments" and "Other instruments". This means **instrument** is a facet, split into a popular list and an "other" list. [exact strings; split inferred]
- Empty result: "Sorry, we couldn't find anything. Please search again using different criteria." with the button "Reset search parameters".
- Generic filter bar (`flat.filters.*`): "Filters:", "Apply filters", "Clear filters".
- **Not present anywhere in the bundle** [exact by grep]:
  - No genre facet.
  - No difficulty facet. The only "difficult" strings belong to surveys and layout warnings.
  - No license facet.
  - The only taxonomy fields are **tags**, **instruments**, **creation type**, **publication date**, plus users.

### A2.2 Global community search [exact strings, `flat.search.*`]
- Placeholders:
  - "Search for music scores and people"
  - "Search in Flat"
  - "Search for a score"
  - "Search for a private score"
  - "Search for a public score"
  - "Search music scores"
- Result groups: "Music Scores", "People" (also "Users"), "Help".
- Tag page title: "Scores with the tag: {{tag}}". This shows tags are clickable and lead to a tag listing [inferred].
- Publication-date filter: "Publication date" with "Anytime" | "This year" | "This month" | "This week".
- States:
  - Loading: "We're currently loading your search..."
  - Empty: "Apologies, but no music scores match your search."
  - No results: "No results found for your search. <a>Click here to start over and discover new content</a>."
- Sorting (`flat.sort.*`): "Sort", "Sort by {{sort}}", "Sort by". Options:
  - "Alphabetical"
  - "Recent"
  - "Popular"
- Also: `flat.newestFirst` "Newest first", `flat.oldFirst` "Oldest first", `flat.order` "Order", `flat.ascending` / `flat.descending`.
- People search: `flat.searchPeople` "Search people", `flat.searchResults` "Search results", `flat.searchResultsFor` "Search results for:".

### A2.3 Search API (paths only) [exact]

| Operation (createOperation name) | Method + path | Where |
|---|---|---|
| `unifiedSearch` | POST `/v2/search/unified` (base `apiv2baseurl`) | `R:search-BzK_C_lp.js`, `M:search-C_zGBXGo.js` |
| `searchScores` | GET `/search/scores` (query params passed through) | `R:vue-data-D9mDxW5Z.js` (exported as `searchScores`, `vse`); no desktop component caller found |
| `listPublicScores` | GET (paginated) `/scores` | `R:vue-data` (`yse`); no desktop caller found |
| `searchUsers` | GET `/search/users` | `R:vue-data`, `M:searchUsers-CSOEKDsb.js` |

**`unifiedSearch` request body shape** [exact, `R:scoresLibraryUI-CNmWFhb0.js` and `R:App-BpSv0vpB.js`]:
- `query`
- `contentTypes`: for example `["scores"]`, `["help"]`, or `[]`
- `filters`, either:
  - `{scores:{location:["scoreLibrary"], privacy, createdBy, collections}, common:{creationDate|modificationDate:{preset}}}`, or
  - `{help:{type:["article"], nav:["editor"]}}`
- `searchSessionId`
- `highlightPreTag:"[[hl]]"` and `highlightPostTag:"[[/hl]]"`
- `pagination:{page:0, limit:100}`
- `expand:["help.related"]`
- `source:"quickSearch"`
- `localResultCounts`

**Response** [exact]: `{hits:[{contentType, data, highlight}], searchSessionId}`.

**Desktop use** [exact]: the desktop app uses `unifiedSearch` only for:
- the user's own library (`location:["scoreLibrary"]`), and
- editor Quick Search / help.

It does not use it for community scores. The `contentType:"scores"` support and the `privacy`/`createdBy:"community"` filters show the same engine serves public results on the web [inferred].

## A3. Public score row / card (rendered in the desktop library) [exact, `R:ScoresLibrary-C3WZy1FZ.js`]

These rows render public or others' scores. In the desktop window they appear on the **Liked scores** virtual collections (`myScoresLiked`, `othersScoresLiked`). Constants are in `R:vue-data` collections store: `fc="myScoresLiked"`, `UP="othersScoresLiked"`, `MP="likes"` [exact].

Liked-page sections: `flat.scores.liked.title` "Liked scores", with "Your Library" (`liked.private`) and "Others' scores" (`liked.public`). Also `flat.library.playlist.likedScores.sections.*` [exact].

### `ScoresTableHeaderPublic`
Column headers [exact]:
1. "Score name" (`flat:score-name`)
2. "Score type" (`flat:score-type`)
3. "Creators" (`flat:score-creators`)
4. stats column (no label)
5. actions column (no label)

### `ScoresTableRowPublic`
Wrapper that switches between `ScoresTableRowPublicDesktop` and `ScoresTableRowPublicMobile` by screen size [exact component names; switch inferred].

**`ScoresTableRowPublicDesktop`** (`<article data-cy="ScoresTableRowPublicDesktop" role="option" aria-selected>`). UI pieces, left to right [exact]:
1. **Inline play button**, aria-label "Play/Pause" (`flat:play.cta`).
   - Streams `${apiv2baseurl}/scores/{id}/revisions/last/mp3?defaultTrack=true`.
   - Only one row plays at a time (`setCurrentPlayingScoreId`).
   - Stops when the page visibility changes (`stopPlayWhenVisibilityChange`).
   - Plays are tracked through `trackScorePlayed` → POST `/scores/{id}/played` [exact op; link from the row inferred].
2. **Title**.
   - Optional pin icon when `pinned`.
   - Link to `score.htmlUrl` with `target=_blank`, so it opens in the system browser.
   - Search-hit segments are highlighted (`highlightedText`).
3. **Instruments** line from `score.instrumentsNames`. It truncates to the available width, with "+ {{number}} more" / `flat:n-items-more` "{{count}} more".
4. **Creation-type tag** (`ScoreTypeTag` / `FTag`): text = `score.creationType`. Colour:
   - `arrangement` → purple
   - `original` → blue
   - anything else → grey
5. **Creators / privacy** (`ScoreCollaborationStatusWithDropdown`): privacy icon plus collaborator avatars.
   - Hover opens a popover with a `PublicUserCard` for a single creator, or a `PublicUserSmallList` for several.
   - Both include Follow buttons.
6. **Stats**: views (eye icon) → link to page; likes (heart toggle `aria-label="like"`); comments (bubble) → link to page. Zero renders as "0".
7. **"Add to playlist" (+ / ✓) button** with tooltip "Add to playlist".
   - ✓ when `score.me.isInLibrary` or the score was just added.
8. **Kebab menu** `ScoreMenuPublic` (title "More actions").

**`ScoresTableRowPublicMobile`**: same data, arranged as privacy and menu on top, then play + title + instruments, then stats + type tag [exact].

**States** [exact]:
- Offline (`is-offline`): row gets the `offline` class. Links have `aria-disabled`. Clicking shows the toast "This score is not available offline on this device. Please try again when you are back online." (`flat:offline.err-unavailable-score`). Play, like and menu are disabled.
- Not signed in: Like and Add redirect to `/auth/signin?next=<path>`.

**Shared row logic** (`Ll(...)` composable) [exact]:
- `onClickLikeScore`:
  - If not liked: `likeScoreById(id,{collectionId:"myScoresLiked"})` → POST `/scores/{id}/likes`.
  - Else: `unlikeScoreById` → DELETE `/scores/{id}/likes`.
  - Updates `score.me.isLiked` and the liked-collection counts.
  - Unliking on a Liked page removes the row.
- `onAddToPlaylist`: opens `dialogAddToPlaylist` with `{scores:[score], isHandlingPublicScores:true}`. On `"addedToMyPlaylist"` it marks the row as in the library and emits `updateScoreCollections`.
- `pinScore` → PUT `/users/me/pinnedScores/{id}`. `unpinScore` → DELETE same path.

### `ScoreMenuPublic` (context menu for others' or public scores) [exact]
Items in order:
1. "Unpin score" (`flat:publicProfile.unpinScore`): only if pinned and `canUnpinScore`.
2. "Pin score": if `canPinScore`.
3. "View comments" (`flat:scoreMenu.view-comments`): opens `/score/{id}?sharingKey=…` through `openScoreUrl`, so it goes to the browser.
4. "Like" / "Dislike". The unlike label is literally `flat:unlikeScore` = "Dislike".
5. "Share", a submenu (`DialogShare`, `R:dialog-D1nDt1c6.js`):
   - "Publish to the community": hidden when already public.
   - "Get embed code": for developers this opens `/developers/embed/generator?score=…&sharingKey=…`; otherwise it opens the `embed` dialog.
6. "Add to playlist".

## A4. Public score page (web; strings in the bundle) [exact strings, `flat.sv.*` "score viewer", `flat.score.comments.*`, `flat.publicScore.*`]

- **Header and meta**:
  - "By" … "and" (multiple creators)
  - author line "{{count}} followers" / "1 follower", "{{count}} scores"
  - "Published" (date) / "Modified"
  - "Show more" / "Show less" (description)
  - "Edit with {{product}}"
  - "Download or Print"
  - "Add to a collection"
  - "Share"
- **Counters**: "{{count}} view(s)", "{{count}} like(s)", "{{count}} play(s)".
  - Mobile labels: "Play/Plays", "Like/Likes", "Comment/Comments".
  - Buttons: "Play"/"Playing", "Like"/"Liked", "Comment".
- **Layout switch**: "Page" | "Flexible" | "Horizontal" (`sv.layoutPage`, `layoutResponsive`, `layoutTrack`).
- **Copy / fork attribution**: "This score is based on the following work" (`sv.forkedFrom`). So a fork stores and shows its source score [inferred: field name not seen].
- **Like onboarding tooltip** [exact, `R:PublicScoreInteraction-TOfU6RUD.js`]:
  - Text: "Enjoying the score? Give it a like or add it to your collection for later!"
  - Anchored to `[data-cy='like-btn']`.
  - Shown 15 s (`P=15e3`) after playback starts, only if the viewer is not admin of the score.
  - Disabled once the experience keys `score.like` or `dashboard.add-others-score-to-collection` are recorded.
- **Comments** (`flat.score.comments.*`):
  - Title "Comments".
  - Empty states: "Be the first one to comment on this score!" (viewer: "Be the first to share your thoughts about this score").
  - Inputs: "Add a comment...", "Reply...", with action "Post".
  - Actions: "Edit", "Delete", "Reply", "edited", "Display older comments".
  - Replies: "Show {{number}} reply/replies", "Hide replies", "Replying to: {{username}}".
  - Mentions: `To mention someone, type "@" followed by the name of the user.`
  - Notify note: "Comments will notify the collaborators of this score."
  - Resolve: "Mark as resolved and hide discussion".
  - Moderation feedback:
    - "Your comment seems spammy and won't be shown to our community."
    - "Your comment seems inappropriate and won't be shown to our community."
    - "Please only share constructive feedback and positive vibes on {{product}}."
  - Owner control (mobile): "Block all comments".
  - Mobile: "Published {{time}} ago", "Open score", "Delete comment" / "Do you really want to delete this comment?"
- **Comment API** [exact, `M:scoresComments-BdVjZyPu.js` and `R:vue-data`]:
  - GET `/scores/{id}/comments`
  - POST `/scores/{id}/comments`
  - PUT `/scores/{id}/comments/{cid}`
  - DELETE `/scores/{id}/comments/{cid}`
  - PUT `/scores/{id}/comments/{cid}/resolved`
  - Body field `rawComment` [exact, `R:EduAssignmentSidebarToggle-dL1C6BPS.js`].
- **Comment gate** [exact, same chunk]: posting a comment on a **public** score (not edu, no context) needs `account.community.acceptedCodeOfConduct && publicProfile`. Otherwise the `communityOnboarding` dialog opens.
- **Private score access** (`flat.score.request-access.*`): "This score is private" / "If you want to collaborate on it, request access from its owner." with button "Request Access". Not found: "Score not found" / "This score might have been deleted."

## A5. "Make a copy" (fork) [exact]
- **Route**: `/score/:score/fork`, component `ScoreFork` (`R:routes-CzUJg4Cd.js`, `R:ScoreFork-BblnKfbf.js`).
  - On mount it calls `scores.fork(scoreId, {classroom?, assignment?})` → **POST `/scores/{id}/fork`**.
  - Then it redirects to `/score/{newId}/edit`, adding `ltiFocusMode`/`assignment`/`classroom` query params when present.
  - UI:
    - Spinner and "Opening your score".
    - On error, an `FBanner` with the server message or "We couldn't open your score. Please try again, or contact your teacher if the problem continues.", plus "Retry" and "Cancel" (link `/`).
- **Entry points**:
  - Editor File menu "Duplicate" (`editor:file-menu.duplicate`) navigates to `/score/{id}/fork` (with `sharingKey`). Available when `isCloudScore` [exact, `R:ScoreEditorTopBar-ClpGW5BC.js`].
  - AI assistant read-only notice "make a copy" links to the same route [exact, `R:AssistantRailPanel-C8yPBAsD.js`].
  - Library "Duplicate" calls `duplicateScoreById(id, currentPlaylist)` → `forkScore(id,{collection})`, the same endpoint (see B5).
- **Copy naming**: `flat.default-score.title-copy` = "Copy of {{title}}" [exact string; applied server-side, inferred].
- **Upsell copy** (`flat.score.copy.*`):
  - "Copy this score"
  - "Copy music scores with one click"
  - "Make private copies of any music score with one click and modify them without altering the original documents."
  - "The 1-click copy is a Power feature. Upgrade your account today to easily manage your music scores on Flat!"
  - [exact strings; gating by plan inferred from copy]
- **Editor-level label**: `flat.collec.nav.copy` = "Make a copy"; `flat.score.read-only` …; `editor … make-copy`: "Make a copy to edit" [exact strings].

## A6. Publishing a score, privacy levels, licence

### A6.1 Privacy model [exact, `R:SharingDropdown-BlJ2R7XR.js` and `flat.privacy-mode.*`]

| `score.privacy` value | Label | Description | Notes |
|---|---|---|---|
| `private` | "Private" | "Only you and the chosen collaborators can access it" | Default (local DB default `'private'`, `M:index.js`) |
| `privateLink` | "Private sharing link" | "Anyone with the link can view" | Flat's equivalent of **unlisted**; requires `sharingKey` |
| `organizationPublic` | "Public in my school" | "Anyone in your Flat organization can view" | Edu only (`isEdu`) |
| `public` | "Public on the Internet" | "Anyone on the Internet can view" | Choosing it triggers **Publish** (button "Publish"), not a direct change |

- There is no literal "Unlisted" or "Public domain" anywhere in the bundle [exact by grep].
- Short or other labels:
  - "Public" (`score.public-short`)
  - "Public score"
  - "Public: Anyone can see this score."
  - "Public in your school" / "Your school can see the score."
  - "Only me" (`privacy-mode.onlyMe`)
  - "{{count}} group(s)"
  - "Change" / "Choose"
  - "This privacy mode has been changed successfully"

**Logic** [exact]:
- `changePrivacy(e)` → `updateScore({scoreId, payload:{privacy}})`, which is PUT `/scores/{id}` (`editScore`).
- Switching to `privateLink` adds `sharingKey: newSharingKey || generateSharingKey()`.
- `generateSharingKey` (`x$` in `vue-data`) returns **128 random hex characters**.
- `prepareCopiableLink`:
  - For public, privateLink or organizationPublic: the link is `htmlUrl`.
  - For private: it creates a new key and the link becomes `htmlUrl?sharingKey=…`. Copying it upgrades the score to `privateLink`.
- Copy feedback: "Creating your private sharing link", "Copy link", "Copied", "Link copied to your clipboard", "The link has been copied to your clipboard. Paste it anywhere to share this content."

### A6.2 Share dropdown ("Share" / "Score sharing options") [exact, `SharingDropdown`]
**Easy-share mode.** It is the default for non-edu private or privateLink scores with a single collaborator. Options:
1. "Copy private shareable link" / "Anyone with this link can view".
2. "Share publicly with the Flat community" / "Make the score accessible on the Internet with a public link".
   - Warning when the code of conduct is not accepted: "You must accept <u>Flat's Code of Conduct</u> to publish your scores."
3. "Add collaborators to view or edit" / "Collaborate online and in real time with other people".
4. "Embed on the web" / "In a few clicks, embed this score on your website or blog" (also "Copy HTML code" / "Code copied").
5. "Advanced": switches to the full mode.

**Default (advanced) mode**:
- Header "Share".
- Embed.
- **Share to Microsoft Teams**: opens `https://teams.microsoft.com/share?href=<link>&preview=true` in a 700×600 popup.
- Current privacy row (icon, name, description) with "Copy link" • "Change". "Change" is shown only if `rights.aclAdmin`.
- Collaborator list (`SharingCollaboratorItem`).
- Invite field:
  - Placeholder "Type a Flat username or an email address". In edu: "Select a student or teacher from the list", with groups "Students" and "Teachers".
  - Button "Invite" / "Sending invitation".
  - Not found: "No user found for this search. You can add your collaborator using an email address."

**Privacy mode** (heading "Change the privacy", hard-coded English): the four options in A6.1. "Public" is hidden when `hasAccessToken`.

**Roles** (`flat.right-mode.*` and `flat.score.*`) [exact]:

| Role | Label | Description | ACL |
|---|---|---|---|
| read | "Can read" | "People can view, comment and download" | `aclRead` only |
| write | "Can write" | "People can make modifications" | `aclWrite` |
| admin | "Can administer" | "People can change sharing and privacy settings" | `aclAdmin` (+write) |
| — | "Remove" | | DELETE `/scores/{id}/collaborators/{collabId}` |

- Other states: "Owner", "Invited". The default for a new collaborator is write (`newCollab={aclAdmin:false, aclWrite:true, aclRead:true}`).
- Add collaborator: POST `/scores/{id}/collaborators` with body `{user | group | userEmail, aclWrite, aclAdmin}`.
- Edu shares to class `studentsGroup` / `teachersGroup` loaded through `loadClasses` [exact].

### A6.3 Publish flow
- **Trigger points**:
  - Library score menu "Publish" / "Unpublish": the label is `scoreMenu.publish` when `privacy==="private"`, otherwise `scoreMenu.unpublish`.
  - Share dropdown "Publish".
  - Library URL param `?m=publish&score=<id>` [exact, `ScoresLibrary` / `SharingDropdown`].
- **Desktop behaviour** [exact, `ScoresLibrary-C3WZy1FZ.js`]: when `flatSettings.isDesktopLibrary` is set, publish calls `openScoreUrl('/library/allScores?m=publish&score=<id>')`, which goes through `openInBrowser`. **The publish form is completed on flat.io in the browser.** Inside the web app (`flatappname` includes `vue-consumer`) it opens the `publish` dialog.
- **Community gate before publishing** [exact]: if `account.community.acceptedCodeOfConduct` is false, the `communityOnboarding` dialog opens first. On "ok", publishing resumes.
- **Unpublish** [exact]:
  - Calls `updateScorePrivacy({privacy:"private"})`.
  - Toast: "Unpublished successfully. {{scoreName}} is no longer visible to the Flat Community."
- **Publish dialog copy** (`flat.credits.*`). The strings are [exact]; the field order is [inferred]:
  - Title "Publish your creation on Flat" (edit mode: "Edit the publication information").
  - Section "Discoverability of your creation".
  - Warning: "You are about to make your creation public on the Internet. As a reminder of our terms of service, please make sure that publishing this work does not infringe others' copyright. If you only want to …" with link "private sharing link".
  - Hint: "Complete as much information as you can about your sheet music, especially the tags and description. This will enhance its discoverability and visibility."
  - Fields:
    - "Title"
    - "Subtitle"
    - "Composer"
    - "Lyricist"
    - "Arranger"
    - "Description"
    - "Tags (for search and categorization)" / "Tags"
    - **"Creation type"**: "Original" / "Original composition" | "Arrangement" | "Other"
    - "Copyright"
    - **"License"**
    - "License text" (custom copyright mention: "You can also add a <strong>custom copyright mention</strong>.")
  - Credits hint: "You can also add a Subtitle, the Composer, the Lyricist and the Arranger."
  - CTA "Publish".
  - After publish: "The publication information (description, tags, etc.) can be directly updated in <em>My Library</em>. Click here to edit it." The library score menu shows "Update publication".
  - Success sheet (`flat.share.*`): "Congrats, your score has been published on Flat!" / "You can now share it on your social networks to make it famous." / "Share your masterpiece".
- **Licence values**: the dropdown options (CC variants and so on) are **not in this bundle** [exact by grep: no `cc-by`, `cc0` or `public-domain` tokens]. Only the labels "License", "License text" and "Copyright" exist. The values presumably come from the web-only publish dialog or the server [inferred].

## A7. Author profiles, following, stats

### A7.1 Profile page copy [exact strings, `flat.profile.*`, `flat.publicProfile.*`, `flat.emptyStates.*`]
- **Tabs and sections**:
  - "Published scores"
  - "Liked scores"
  - "Followers"
  - "Following"
  - "About" (with "show more" / "show less")
  - "Find me on" / "Social links"
  - "View stats"
  - "See all"
  - "Publish score"
- Profile score list: "Search scores", "Filter scores" ("All"), "Pinned scores", "Pin score" / "Unpin score", "{{name}}'s scores".
- Sidebar: "Likes", "Location", "Links", "0 following", "0 followers".
- Badges [exact, used in `R:user-DRs0wafU.js`]:
  - "Composer of the Month"
  - "Flat Community Ambassador"
  - "Challenge Winner"
  - plus "Flat Power" and "Flat Team" avatar badges (`UserPicture` / `FAvatar`, power badge SVG).
- **Social link types**: YouTube, SoundCloud, Spotify, TikTok, Instagram, Website. Each has "Confirm/Edit/Delete {{social}} link".
- Share profile: modal "Share profile". Social text: "Discover {{username}}'s music creations at flat.io/{{username}}".
- **Private profile**: "This profile is private" / "Only people followed by this user can access their profile and view their public scores."
  - Own profile not public: "Your profile is currently private" → "Create a community profile".
- Not found: "Profile not found", `No results for: "{{query}}"`.
- **Empty states**:
  - Own published: "You haven't published any scores yet." / "Get feedback, views, and likes. Public scores can be featured by our curators."
  - Own liked: "…Let's support each other and show appreciation for the scores of fellow composers." Button "Browse scores".
  - Own followers: "You don't have any followers yet."
  - Own following: "Seems lonely out here" / "Start following users and grow your community". Button "Browse people".
  - Other users' variants also exist, for example "This user hasn't published any scores yet." / "Check back later to see their contributions to the community!"
- **Guest**: "Unlock your profile!" / "Explore your stats, track your scores, and build your musical network — connect, follow, and be followed!"
- Username rule (profile edit): "The username should contain only capital letters, lowercase letters, numbers, dashes, and dots, and be at least 3 characters long."

### A7.2 Profile components in the desktop bundle [exact, `R:ScoresLibrary-C3WZy1FZ.js`]

**`PublicUserCard`**:
- Cover picture with an editable variant: "Replace banner image", plus a picker using "Unsplash", "Upload", "Recents", "Colors", "Uploaded files".
- Avatar, 82 px big / 64 px.
- Printable name (with search highlight) and `@username` linking to `user.htmlUrl` in a new window.
- Stat trio: **Scores** (`allPublicScoresCount ?? ownedPublicScoresCount`), **Plays** (`playsCount`), **Followers** (`followersCount`).
- Follow button, hidden on your own card and disabled for `user.disabled.reason` or offline.

**`PublicUserCardHorizontal`**: 48 px / 40 px avatar with power badge, name, @username, Follow.

**`UserFollowButton`**:
- Labels "Follow" / "Following".
- Follow → POST `/users/me/following/{userId}`. Success means HTTP 204.
- Unfollow → DELETE `/users/me/following/{userId}`.
- Updates the following-ids store.
- Not a user or guest → redirect to `/auth/signin?next=/<profile>`.
- No community profile → the `communityOnboarding` dialog opens first.
- **`UserProfilePopover`** (hover card) lives in `R:user-DRs0wafU.js`, with `FUser`, `FAvatar`, `UserPicture` and `FlatLink`.

### A7.3 Stats (`flat.stats.*`) [exact strings]
- "Profile statistics"
- "Notes dropped"
- "Published scores"
- "Plays", "Views", "Likes"
- "Insights"
- "Top Scores", "Top Followers"
- "Your audience", "Score performance"
- Periods: "Last 7 days", "Last 30 days", "All time", "Weekly", "Monthly", "Yearly".

### A7.4 User / community API [exact, `M:users-B58uPcLd.js` and `R:vue-data`]
- GET `/users/{id}`
- GET `/users/{id}/scores` (paginated: `limit`=25, `paginate`, `next`)
- GET `/users/{id}/followers` (paginated, 25)
- GET `/users/{id}/following` (and `?ids=true`)
- GET `/users/{id}/likes` (paginated)
- GET `/users/me/likes`
- GET `/users/me/following`
- GET, POST, DELETE `/users/me/following/{id}`
- GET `/users/{id}/pinnedScores`
- PUT, DELETE `/users/me/pinnedScores/{scoreId}`
- GET `/users/me/statistics/overview`
- GET `/users/me/statistics/scores/top`
- GET `/users/me/statistics/fans/top`
- GET `/users/me/statistics/scores/charts/{metric}?period=`
- POST `/me/community/acceptCodeOfConduct`
- POST, PUT, DELETE `/me/community/profile` with body `{username, bio, links}`

### A7.5 Community onboarding dialog (`communityOnboarding`) [exact, `R:App-BpSv0vpB.js` component `T3`]
- Title: "Start by creating a community profile, and be able to share, like, follow, and comment on any music score."
- Username field:
  - "Up to 30 characters (letters, numbers, or '_')"
  - Errors: "Your username must be shorter than 30 characters." / "Your username can only contain letters, numbers, and '_'." / "That username has been taken. Please choose another."
- Checkbox: "I have read and agree to Flat's Community Code of Conduct".
- Success: "You're now a member of our community! 🎉" (with confetti).
- Calls `acceptCodeOfConduct` and `createProfile`. Then it sets `community:{acceptedCodeOfConduct:true, customizedUsername, publicProfile:true}` and resolves `"ok"` (cancel resolves `"cancel"`).
- Delete community profile:
  - "Delete your community profile" / "Your profile will no longer be accessible on the internet by other users. Your Flat account will be made private. If you have any published scores, they will be unpublished…"
  - Confirm: "Are you absolutely sure?" / "Please type <strong>DELETE</strong> to confirm."

## A8. Reporting / moderation [exact strings, `flat.reportModal.*`; no desktop component references it, so web-only]
- Titles: "Report score", "Report profile", "Report comment". Button "Report".
- "Category" dropdown ("Choose a category"):
  - "Spam or false information"
  - "Hate speech, bullying, or harassment"
  - "Inappropriate comment"
  - "Intellectual property violation (copyright)"
- Choosing copyright shows: "We apologize in advance, but it seems like we aren't able to help you directly with this issue. Please make a formal DMCA takedown request instead."
- "Additional feedback" textarea ("Leave your feedback here...").
- Sent: "Thank you for your report" / "Thank you for giving us your feedback. We will carefully review your report."
- No report endpoint appears in the desktop bundle [exact by grep].
- Automated comment moderation messages: see A4. Curation: "Public scores can be featured by our curators."

## A9. Notifications tied to the public library [exact, `flat.notifications.*`]
- "{{actorName}} liked "{{attachmentName}}"" (`scoreStar`)
- "… commented on …"
- "… published: …"
- "… followed you"
- "… invited you to collaborate on …"
- Preference toggles: "Score Like", "User Follow", "Score Comment", "Score Invitation". Email equivalents exist.

## A10. Groups / classes / education sharing (brief)
- Privacy `organizationPublic` and the edu share targets (class student/teacher groups) live in `SharingDropdown` [exact].
- Shared API client (`R:vue-data`) [exact]:
  - `/classes`, `/classes/{id}` (`sync`, `archive`), `/classes/enroll/{code}`, `/classes/{id}/users/{uid}`
  - `/groups` (+ `bulk`, `bulkDelete`, `bulkRename`, `users/bulkAdd|bulkRemove`)
  - `/organizations/users`
- Fork accepts `{classroom, assignment}` [exact].
- The desktop app targets consumer accounts. Desktop string `incompatibleProductMessage`: "Flat Desktop requires a Flat consumer account to enable cloud sync and library features." [exact, `R:desktop-DIs4v9Ek.js`]
- Edu wording swaps in the library [exact, `flat.scoresTableEmpty.*`, `PlaylistMenu`]:
  - "Playlists" → "Collections"
  - "Shared with me" → "No shared files" / "Files shared with you by teachers or students will show up in this folder."
  - Edu sort labels (`edu.sort.*`): "Latest creation date", "Oldest creation date", "Latest update date", "Oldest update date", "Name A-Z", "Name Z-A".

---

# PART B: MY LIBRARY (desktop library window, secondary)

## B1. Shell and routes [exact, `R:library-CzysOtuK.js`, `R:routes-CzUJg4Cd.js`]
- **Window**: `out/renderer/library/index.html`, title "Flat — Library". Background is `#fff`, or `#141d39` in dark mode.
- **Boot sequence** [exact]:
  1. Gets config and boot data. If there is no user, it shows "Failed to load library — please sign in again."
  2. API calls are proxied through `flatDesktopAPI.apiDispatch` (main-process `createOperation` handlers).
  3. Storage uses `DesktopStorageProvider`.
  4. i18n namespaces: `flat`, `auth`, `editor`.
- **Routes**:

| Route | Name | Component | Analytics `screenRoute` |
|---|---|---|---|
| `/library` | ScoresLibraryLayout | `ScoresLayout-DJgx4dgh.js` | — |
| `/library` (child "") | LibraryHome | `ScoresLibraryHome-CAYCK6l3.js` | `library/home` |
| `/library/playlists` | ScoresLibraryPlaylists | `ScoresLibraryPlaylists-B4rAfyeO.js` | `library/playlists` |
| `/library/:collectionId` | ScoresLibrary | `ScoresLibrary-C3WZy1FZ.js` | `library/{allScores,collaborations,trash,playlists}`, otherwise `library/otherPlaylist` |

- **Virtual collection ids** [exact, `R:vue-data`]: `allScores`, `collaborations`, `likes`, `othersScoresLiked`, `myScoresLiked`, `trash`, `playlists`. Everything else is a real collection (playlist) id.
- **Main-process event hooks** [exact]:
  - `onConnectivityChanged` → `isOnline`
  - `onSyncMetadataUpdated` and `onLibraryRefresh` → silently refetch the current playlist (limit 100)
  - `onImportStatusUpdate`
  - `onBootDataRefreshed`
  - New score → `requestNewScore()`
  - Import → `requestOpenFile()`
  - PDF/OMR → `openOmrImportWindow({entry:"library"})`
  - `score:imported` → `syncTrigger()`

## B2. Layout components [exact, `R:ScoresLayout-DJgx4dgh.js`]
Component list: `DesktopLayout`, `MobileLayout`, `NavigationSidebar`, `LibraryBreadcrumb`, `HeaderPlaylists`, `TopBanner`, `TopbarOffline`, `StorageQuota`, `SyncStatusWidget`, `TrashPowerBannerMobile`. Dialogs:
- `DialogAddToPlaylist`
- `DialogPlaylistCreate`
- `DialogRenamePlaylist`
- `DialogDeletePlaylist`
- `DialogRemoveScoresFromPlaylist`
- `DialogDeleteScore`
- `DialogPermanentlyDeleteScore`
- `DialogRestoreScore`
- `BottomSheetSort`
- `BottomSheetPlaylistMenu`
- `BottomSheetMoreInstruments`

**NavigationSidebar**, top to bottom:
1. Header "Your Library" (`flat:score.my-scores`).
2. Link "Your Scores" (`collec.all`) with the total count. It is a drag-and-drop target.
3. Create button "Create a score" (`nav.new-score`), with create / import score / import PDF.
4. `StorageQuota`: "You have used {{current}}/{{total}} scores." plus "Get unlimited storage with Flat Power".
5. "Playlists" ("Collections" in edu) section:
   - Sort menu (aria "Sort by").
   - "+" button, tooltip "Create a new playlist". It creates the playlist and navigates with `?editTitle=true`.
   - Pinned playlists (the `collaborations` "Shared with me" collection, plus pinned ones), then unpinned ones. Each is a drop target.
   - "load more" through `fetchNextUserAccountCollections`.
6. Trash.

**SyncStatusWidget** labels [exact]:
- "All synced"
- "Syncing..."
- "{{count}} score(s) pending sync"
- "Offline"
- "Offline — {{count}} pending"

**TopbarOffline**: "You are offline. Some features may be unavailable."

**Breadcrumb / title**: "Score Library", "Shared with me", "Trash".

## B3. Home (`ScoresLibraryHome`) [exact]
- Header "Score Library" with "See all scores".
- "New" menu: create score, import score, import PDF, new collection.
- **Recent Scores**: the first 8 of `allScores`, fetched with limit 8, shown as `ScoreCardCompact` (desktop) or `ScoreItemMobile`.
- **Playlists** section ("See all"): pinned playlists (up to 6), then the others, as `CollectionCardCompact` / `DataCard` with subtitle "{{count}} scores" and a "More actions" menu. Trash link.
- **Empty state**: "Let's make some music!" with "Create your first score".
- **Offline**: unavailable scores are disabled and show the toast "This score is not available offline on this device…".

## B4. Score list (`ScoresLibrary` / `ScoresLibraryContent`) [exact]

**Desktop table header** (`ScoresTableHeader`):
- "Name" (`collec.tr.name`)
- "Modified" / "Updated"
- "Status"
- "Actions"
- With a selection, the header shows "Selected {{count}}/{{total}}".

**Row** (`ScoresTableRow`):
- Thumbnail
- Title
- Instruments (`instrumentsNames`)
- Modification date (`RelativeTime`)
- `ScoreCollaborationStatus`: privacy icon (private / privateLink / public / organization) plus collaborator avatars. "Only me" when private and solo.
- Kebab "More actions".
- Trash rows show "Restore" and a red trash icon "Permanently delete".

**Mobile header** (`ScoresTableHeaderMobile`): "{{total}} scores" | "{{total}} playlists", sort "Recents" / "Alphabetical", "Select".

**Context menu `ScoreMenu`** [exact labels, order as in the code]:
1. "Open" or "View". The label is `scoreMenu.${privacy==="private"?"open":"view"}`.
2. "Remove from this playlist": only inside a playlist.
3. "Add to playlist" (submenu: "Create new playlist" / "New playlist").
4. "Duplicate".
5. "History" (`collec.nav.history`): opens `/score/{id}/history?sharingKey=` in the editor.
6. "Rename": admin/write only. Inline rename; mobile uses the bottom sheet "Rename score" / "Score name".
7. "Publish" / "Unpublish", plus "Update publication" when public.
8. "Share and Collaborate": opens `SharingDropdown` inside the menu with a back option.
9. "Delete..." (owner) or "Leave the score" (collaborator).

Edu variant: `ScoreMenuEdu`. Trash variant: "Restore" and "Permanently delete".

**Bulk selection toolbar** (`hasSomethingSelected`):
- Normal view: "Duplicate", "Move" (`mt.title-move` "Move to a collection"), "Add to playlist", "Delete".
- Trash view: "Restore selected scores", "Permanently delete".
- Playlist view: "Remove from playlist".

**Keyboard selection** [exact, `scoresLibraryUI` store]: next/previous, shift range (`selectRange`, `selectUpTo`), select all, unselect. Focus moves to `#tr-{id}`.

**Drag & drop** [exact]:
- Rows are `draggable` unless renaming. Data type `application/x-flat-score`, `effectAllowed:"move"`, custom drag image.
- Dropping on a sidebar link calls `dropItemsToCollection`:
  - on a playlist: add (if `capabilities.canAddScores`)
  - on "Your Scores": remove from the current playlist, or restore from trash
  - on Trash: opens the delete dialog
- Toasts:
  - "Score added to {{playlist}}" / "All scores added to {{playlist}}", with **Undo**.
  - "This score is already in {{playlist}}".
  - Restore: "This score has been restored" with link "Go to All scores".
- Files dropped from the OS are queued for import into that collection (`queueFromDrop`).

**Pagination** [exact]:
- Collection scores are cursor-paginated (`links.next`). The default page limit is 20–25 (store `fetchScoresForCollection(id, limit||20)`; API `listCollectionScoresDetailed` default 25, `"max"` means 100).
- Playlists: limit 50, `parent:"user"`.
- Liked/public lists: 25.
- More pages load on demand (`loadMore`) [inferred: infinite scroll vs button not determined].

## B5. Actions → API [exact, `R:vue-data` collections store `Le("collections")`]

| Action | Call |
|---|---|
| Rename | `editScore` PUT `/scores/{id}` `{title}` |
| Duplicate | `forkScore` POST `/scores/{id}/fork` `{collection}`. Toast "Duplicating..." → "Score duplicated successfully" + link "Open copy" |
| Delete (to trash) | `deleteScore` DELETE `/scores/{id}` (404 ignored) |
| Delete permanently | DELETE `/scores/{id}?now=true` |
| Restore | `untrashScore` POST `/scores/{id}/untrash` |
| Leave shared score | `deleteScore` on own access, adds to collaborations count |
| Add to playlist | `addScoreToCollection` PUT `/collections/{cid}/scores/{sid}?sharingKey=` |
| Remove from playlist | `deleteScoreFromCollection` DELETE `/collections/{cid}/scores/{sid}` |
| Playlist CRUD | GET, POST `/collections`; GET, PUT, DELETE `/collections/{id}`; POST `/collections/{id}/untrash`; PUT, DELETE `/collections/{id}/pin`; GET `/collections/trash/scores/_visibility` |
| Like / Unlike | POST / DELETE `/scores/{id}/likes` |
| Privacy | PUT `/scores/{id}` `{privacy, sharingKey?}` |

**Dialog copy** [exact]:
- Delete:
  - "Delete score?" / "Delete {{count}} scores?"
  - Free plan: "…will be removed from your profile. Restore it within 24 hours, or upgrade to Flat Power to keep it for an additional 90 days."
  - Power plan: "…You have 90 days to restore it from Trash."
  - Public score: "Public score information will be permanently deleted, including likes, statistics, and comments."
- Restore: "Restore selected score?" / "The restored score will be automatically moved to the All scores section."
- Leave: "Are you sure you want to leave this score?"
- Playlist delete:
  - "Delete {{playlistName}}?"
  - Checkbox "Delete this playlist along with its {{count}} scores"
  - Toast "{{playlist}} deleted" with "Restore".
- Rename playlist: "Rename" / "Playlist name" → "Playlist renamed to "{{title}}"".
- Playlist menu (`PlaylistMenu`): "Pin playlist" / "Unpin playlist" ("Pin collection" / "Unpin collection" in edu), "Rename", "Delete", "Manage playlist".

## B6. Sorting and filters (my library) [exact]
- **Score sort**:
  - Default `modificationDate desc`, persisted in local storage keys `scoreLibrary.sortProperty` and `scoreLibrary.sortDirection`.
  - Clicking the active field toggles direction. Switching to `title` sets asc; switching to `modificationDate` sets desc.
  - Event `scores_sorted`, experience `dashboard.sort`.
- **Playlist sort**:
  - Default `creationDate desc` (edu: `title asc`).
  - Menu items "Recents" (`creationDate`) and "Alphabetical" (`title`), with a direction arrow (`PlaylistMenu-Bmp5rIpt.js`).
- **Filters** (`FSearchWithFilters` + `ScoreFilter*`; mobile `BottomSheetSearchFilter*`). Default state is `{privacy:null, createdBy:null, playlists:[], dateRange:null, dateField:"creationDate"}`.
  - **Privacy**: "Public" | "Private" | "Shared".
  - **Created by**: "Me" | "Community".
  - **Playlists**: playlist ids, plus "No playlist" (`noPlaylist`) and "Collaborations".
  - **Date** type: "Created" | "Last edited". Range: "Last 7 days" | "Last month" | "Last year".
  - Buttons: "Apply filters", "Clear filters", "Clear".
  - Inside a playlist, that playlist is pre-selected as a filter (`setDefaultPlaylistFilter`).

## B7. Search (my library) [exact, `R:scoresLibraryUI-CNmWFhb0.js`]
- **Placeholder** by context:
  - "Search scores" (all)
  - "Search in Collaborations" / "Search shared scores" (edu)
  - "Search in playlist" / "Search in collection" (edu)
- **Instant search**: a 200 ms debounce on query and filter changes.
- **Backend search** is used when online, a query or filter is active, and "No playlist" is not selected:
  - Calls `unifiedSearch` with `location:["scoreLibrary"]`, mapping privacy, createdBy, collections and the date presets `last7Days` / `lastMonth` / `lastYear`.
  - Maximum 100 hits, with highlight tags `[[hl]]…[[/hl]]`.
  - Out-of-order responses are discarded using a sequence counter.
- **Local fallback** (`filterScoresBySearch`) when offline or "noPlaylist" is selected:
  - Case-insensitive title substring.
  - Privacy (`shared` means more than one collaborator).
  - `createdBy` (`me`: `user.id === account.id`; `community`: otherwise).
  - Playlist membership.
  - Date ≥ now − range.
- **Analytics**: `library_search_used`, fired 5 s after the last change once the query is at least 2 characters, or when filters are active.
- **No results**: "No results" / "No scores match your search. Try adjusting the filters or keywords."

## B8. Empty states (`ScoresTableEmpty`) [exact]
- All scores: "Let's make some music!" / "Cooking up a chart-topper or just strumming along? Dive in and start creating!" → "Create your first score".
- Shared with me: "Join forces with collaborators worldwide!" / "Create music online together with anyone, anywhere." → "Create a score".
- Custom playlist: "Let's get organized!" / "Add scores to this playlist to keep them grouped for quick access." → "Go to your scores".
- Playlists list: "Let's get organized!" / "Start organizing your scores into playlists for quick access." → "Create your first playlist".
- Liked: "Keep your favorite music close at hand!" / "Save scores to your 'Liked scores' with one click…".
- Saved-scores playlist: "A new home for all your favorite scores." → "Explore the community".
- Trash:
  - Free: "Your deleted scores will be available here." / "Upgrade to Flat Power for unlimited scores and 90 days of Trash storage."
  - Power: "Deleted scores are securely stored for 90 days for recovery…"
  - Banner: "Deleted scores are kept for 90 days." / "Unlock storage".
- Offline: "You are currently offline." plus context-specific lines (see A1).

## B9. Offline, local index, sync, Spotlight [exact, `M:index.js`, `M:SpotlightIndexer-B7XPtmg9.js`]

**Local SQLite tables**:
- `scores` (`id`, `cloud_id`, `title`, `privacy` default `'private'`, `sync_status` default `'local'`, `file_path`, `cloud_revision_id`, `creation_date`, `modification_date`, `data` JSON, `session_active`, `cache_tier` default `'cloud-only'`)
- `collections` (`id`, `cloud_id`, `title`, `type`, `privacy`, `sync_status`, `parent_id`, dates, `data`)
- `score_collections`
- `score_revisions` (`id`, `score_id`, `creation_date`, `data`, `cache_path`, `user_id`, `description`, `autosave`, `event`)
- `sync_queue` (`operation`, `entity_type`, `entity_id`, `payload`, `retry_count`)
- `sync_metadata` (key/value)
- `custom_instruments`, `score_layouts`, `kv_store`, `local_groups`, `ack_groups`

**Values**:
- Cache tiers seen: `cloud-only`, `recent`, `pinned`.
- `sync_status`: `local`, `synced`.

**Inbound sync**:
- Collections are listed with `parent:"user"`, limit 100, at most 50 pages, delta via `modifiedSince` (`collections_list:last_sync`).
- The virtual collections synced are only `["allScores","trash"]`. Per-collection `collection:{id}:last_sync`; delta is used only for `allScores`.
- Deletions: GET `/me/deletedResources?deletedSince=` (`deleted_resources:last_sync`).
- Flag `initial_sync_complete`.

**IPC channels**:
- `sync:cycle`, `sync:inbound`, `sync:outbound(:upload)`
- `sync:revision*`
- `sync:getStatus`, `sync:getOverview`, `sync:triggerNow`, `sync:metadataUpdated`, `sync:stateChanged`, `sync:connectivity`
- `library:getBootData`, `library:refresh`, `library:openCloudScore`, `library:openInBrowser`
- Health check every 60 s (`Yg=6e4`).

**Offline setting** `storage.offlineMode` (default `"all"`) [exact strings, `R:desktop-DIs4v9Ek.js`]:
- "Keep available offline": "All" ("Download all scores and instruments for offline use") | "On demand" ("Only download when you open a score").
- Other strings:
  - "Available offline"
  - "Sync & Storage"
  - "Sync now", "Last sync: {{time}}", "Never synced", "All scores are synced"
  - "Sync Conflict"
  - "Upgrade to Power to sync your whole library to this Mac and edit it here, even offline."

**Renderer side**:
- `offlineAvailableScores` comes from `getAllScoresAvailableOffline()`. Unavailable rows are disabled while offline.
- Offline actions give the toast "Unable to perform this action offline. Please try again when you are back online."
- A one-time local cleanup is flagged by `flat_cleanup_done`.

**macOS Spotlight** (`SpotlightIndexer`):
- Indexes per score: `id`, `title`, `contentDescription` (subtitle, composer, instruments joined with " — ", falling back to description), `creator` (`printableName`/`username`), `modificationDate`, and `keywords` (tags, subtitle, composer, arranger, lyricist).
- Full refresh at most every 336 h (14 days), key `spotlight:last_full_refresh`. It also removes items and can clear all.

---

# PART C: DATA MODEL HINTS

**Score**. Fields seen in the library, share, Spotlight and sync code [exact]:
- `id`, `title`, `subtitle`, `composer`, `arranger`, `lyricist`, `description`, `tags[]`
- `privacy` (`private|privateLink|organizationPublic|public`), `sharingKey` (128-hex)
- `htmlUrl`, `editHtmlUrl`
- `creationDate`, `modificationDate`
- `creationType` (`original|arrangement|…`)
- `instrumentsNames[]`
- `collections[]` (ids including `allScores`)
- `collaborators[]`: `{id, user, group, userEmail, searchEmail, aclRead, aclWrite, aclAdmin, collaboratorType:"owner"…, invited, date}`
- `rights.{aclRead, aclWrite, aclAdmin}`
- `user` (owner)
- `me.{isLiked, isInLibrary}`
- `views.total`, `likes.total`, `comments.total`

**Fork attribution** [inferred from `sv.forkedFrom`; field name not seen].

**User** [exact]:
- `id`, `username`, `name`, `printableName`, `picture`, `htmlUrl`
- `badges[]` (`power`, `ambassador`, …), `disabled.reason`
- `followersCount`, `playsCount`, `likedScoresCount`, `ownedPublicScoresCount`, `allPublicScoresCount`

**Account** [exact]: `community.{acceptedCodeOfConduct, publicProfile, customizedUsername}`, `isPowerUser`, `isDeveloper`, `type` (`user|guest`).

**Collection / playlist** [exact]:
- `id`, `title`, `type` (`regular|app|collaborations|trash|likes…`), `privacy`, `isPinned`
- `contents.scoresCount`, `capabilities.canAddScores`
- `parent` (`root`/`user`)
- `creationDate`, `modificationDate`

**Other API paths** used by the library and public features, not already listed [exact]:
- GET `/scores/{id}`
- POST `/scores` (create)
- `/scores/{id}/revisions`, `/scores/{id}/revisions/{rev}/history`, `/scores/{id}/revisions/last/{format}`
- POST `/scores/{id}/played`
- GET `/scores/{id}/submissions`
- PUT `/me/session`
- `/me/notifications/*`

---

## Coverage notes
- No explore, browse, community-feed, public-profile, publish or report **components** exist in the desktop renderer. Grep for `community.page`, `browse-explore`, `reportModal`, `publicScore.`, `credits.pub-title`, `search.filters` and `popular.` found no use outside the locale chunks.
- Their behaviour above is reconstructed from strings plus the shared API client, and the page structure is marked inferred.
- Library window motion is out of scope. The only library-specific motion noted is the custom drag image, the drop-zone highlight `dz-active`, and toast + Undo.
