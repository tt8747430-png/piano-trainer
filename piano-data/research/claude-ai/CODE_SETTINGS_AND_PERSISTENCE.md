# claude.ai code: settings dialog, setting storage and persistence

Read from the production bundles (build `0d4c697ee92cd073dd85742c468e4621a7382bc3`, minified Vite/rolldown chunks, no source maps). Every identifier below is **minified**: it is the name in this build only. Chunk names are shortened to their hash, so `shared-8` means `shared-8-Df3Tue2p.js`.

Tags: **exact** means the cited file contains the snippet. **inferred** means it is a reading of the code that was not fully traced.

This file covers code behaviour. For what the screens look like and which values were seen live, see `SETTINGS.md` (one section per page) and `UI_FLOWS_AND_MENUS.md` §6 (settings dialog) and §8 (language dialog).

---

## 0. Shared storage primitives (read this first)

Most client-side settings use one of three helpers.

| Helper (minified) | Where | What it stores | Format |
|---|---|---|---|
| `Ho(key, default, sync=true)` → `rF({key, defaultValue, sync})` | `shared-l-p-m-w-8` | `localStorage["LSS-" + key]` | JSON `{"value": <v>, "tabId": "", "timestamp": <ms>}` |
| `qk` = `Zy("localStorage", true)` | `shared-l-p-m-w-0` | a raw `localStorage` string (no prefix) | plain string; every call is wrapped in try/catch |
| zustand `persist(..., {name, storage: j0})` | `shared-l-p-m-w-3` and `shared-m-10` | `localStorage[name]` | zustand's own `{state, version}` JSON (**inferred** from the zustand API) |

**How it works (exact):**
- Prefix: `TO=(function(e){return`LSS-${e}`})` (`shared-l-p-m-w-8`).
- Write: `JSON.stringify({value:t,tabId:"",timestamp:Date.now()})` (`sP` in `shared-l-p-m-w-8`). Writing `undefined` or the sentinel `cw` removes the key.
- Read: `"value"in e?e.value:n(t)` (`nk`). A bare JSON value is also accepted.
- Cross-tab sync: the first subscriber adds a `window.addEventListener("storage",dv)` listener (`LJ`).
- Same-tab sync: after a write, the code dispatches a synthetic `new StorageEvent("storage",{key:e,newValue:a,oldValue:i,...})` (`EJ`). Every `useLocalStorage` hook in the tab therefore updates.
- Values are memoised per key with a "moves" counter (`V9` Map), so reading the same key repeatedly returns the same object.
- Failed reads log `Error reading localStorage key “…”` and fall back to the default.

**Server-side settings** use three endpoints, all **exact**:
- `PATCH /api/account/settings`: the `KM` mutation in `shared-l-p-m-w-3`; snippet `` r=`/api/account/settings${...}` `` … `s4(r,"PATCH",`.
- `PATCH /api/organizations/{org}/notification/preferences`: the `N2` mutation in `shared-m-2`; snippet `Zw(o,"PATCH",p)`.
- `PUT /api/account_profile`: the `Nz` mutation in `shared-l-0`; snippet `s4("/api/account_profile","PUT"`. It is used for locale and profile fields.

**Piano Trainer takeaway (Settings):** write one `useLocalStorage(key, default)` hook. It should store a `{value, timestamp}` envelope under a namespaced prefix, listen to `storage` events, and dispatch a synthetic `StorageEvent` after its own writes so every component re-renders.

---

## 1. Settings dialog

### 1.1 Route and section table

**What it does:** `x4({forModal, forNav})` in `shared-8` builds the list of nav items. Each item has `{id, href, label, name, icon, testId?, searchHints?}`, and the code pushes it only when its gate is true.

Evidence (**exact**, `shared-8`): `e.push({id:"time-limits",href:"/settings/time-limits",label:n,icon:"MoonStars"})`.

In the table, `r` is `forModal`. `k = Tq() && r`, where `Tq` checks the gate `"__gb__2503656110"`. `k` is the "simple nav" variant, which uses grouped rows.

| id | href | Icon | testId | Shown when (minified hook → what it checks) |
|---|---|---|---|---|
| general | /settings/general | Settings | general-settings | always |
| personalization ("Instructions") | /settings/account | Styles | — | `k` (simple nav only) |
| notifications | /settings/general | Notification | — | `k && A`, where `A=!hY()` and `hY` is `uH("taint:hybrid_3p")` |
| account | /settings/account | User | account-settings | always |
| data-privacy-controls ("Privacy") | /settings/data-privacy-controls | LockShield | data-privacy-controls | `c = OA().show` |
| billing | /settings/billing | CreditCard | billing-settings | `h = D7()`: `mJ()` (BillingView permission and merchant_of_record "anthropic") and `!nS()` |
| usage | /settings/usage | `UsageGaugeMiddle` if `AJ(forNav)`, else `Chart` | usage-settings | `_ = Yo()`: `!yI() && (fu() \|\| fR())` |
| insights | /settings/insights | ChartLine | — | `W = y && !1`, which is always false (dead code) |
| sys-prompt ("System prompt") | /settings/sys-prompt | Prompt | — | `pP()`: `a9("system_prompt_editor")` |
| capabilities | /settings/capabilities | Tool | — | `Xw` = `!hY()`. `searchHints: Object.values(p1)`, where `p1` = "features", "abilities", "permissions" |
| memory | /customize/memory | Memory | memory-settings | `r && hE()` (memory is available, `bE()`) |
| design-systems | /settings/design-systems | Palette | design-systems-settings | `P = Sm().show` (hook `KK`) |
| reflect | /settings/reflect | Sunset | — | `N = Bu()`: `a9("cardinal") && !hY()` |
| time-limits | /settings/time-limits | MoonStars | — | same `N` |
| connectors | /customize/connectors | Connectors | — | `g && !r` (outside the modal only). `g=Sd()`; `searchHints: Object.values(xI)` |
| claude-code | /settings/claude-code | Code | claude-code-settings | `u = Zi()`: `GK("claude_code").isAvailable` |
| cowork | /settings/cowork | Tasks | — | `d && !O`: `d=YN().show` (reads flags `yukon_silver_settings` and `dramatic_shrimp`), `O=wb()` |
| import | /settings/import | Download | settings-nav-import | `p = Cz()` (desktop `getImportCapabilities().showSettingsPage`) |
| browser-extension ("Claude in Chrome") | /settings/browser-extension | Cursor | — | `m = _0()`: `a9("public_api_crochet")` and plan is `claude_pro` or `claude_max` |
| claude-security | /settings/claude-security | Lock | — | `C = aU()`: status of `claude_code_security` |
| teachers | /settings/teachers | Book | — | `S = ym()` (chalk verification) |
| join-proposal | /settings/join-proposal | Organization | — | `k && yH("iam:sso:update")` |
| desktop ("System") | /settings/desktop | Computer | — | `T = Xd()` (desktop app); `exactMatch: true`; `searchHints: ["desktop"]` |
| desktop/extensions | /settings/desktop/extensions | Plugin | — | `T && AQ() && onThisDevice` |
| desktop/developer | /settings/desktop/developer | Wrench | — | `T && Yx() !== false` |
| gimlet | /settings/gimlet | custom | — | `$u() && r`: `v6("__gb__3358001861")`; shows an "Ant only" badge |
| cozy-bubble | /settings/cozy-bubble | custom | — | `r && ux()`: `v6("cai_cozy_bubble")` |
| customize-skills / customize-connectors / customize-plugins | `#customize/<x>/yours` | — | — | come from `Pw().sections` (server-driven) |

**Labels:** most labels are `formatMessage({defaultMessage, id})`. Reflect (`id:"1idxixu"`), Time limits (`id:"pahdnx"`) and Insights use `gl(Io,{id})` **with no defaultMessage**. Their text is a *gated message* the server delivers, so the English label is not in the bundle (**exact**).

**Nav groups (exact, `shared-8`):**
- **Non-simple nav** (`k` false; this is the layout seen live):
  1. "Preferences" (`id:"OoAC4E"`), holding all the items above.
  2. "This computer" (`YY998h`), holding the desktop items. Shown only when `T`.
  3. "Customize" (`Fx/koR`), holding the customize sections. Shown when in the modal and (`o.length>0 || pluginsDisabledReason`).
  4. The organization name (or "Organization"), holding the org sections.
- **Simple nav** (`k` true): rows are grouped with the table `Pi` and the group order `G$=["account","claude","apps","more"]`.
  - `Pi` assigns "general" to group claude with the name "Appearance".
  - "personalization" and "sys-prompt" share one row.
  - Customize merges connectors, skills and plugins.
  - Drill-ins are defined by `Oo`: memory is a drill-in of personalization, reflect of time-limits, design-systems of capabilities, and so on. `import`, `browser-extension`, `meetings` and `desktop/developer` are "shown-on-another-page".
- The live "Plattform → API keys ↗" link is not built in `x4`. It is added somewhere else (**inferred**).

**Lazy loading of pages (exact, `cc011544b`):** `dr` maps each section id to `Q(id, loader)`. Each loader is a dynamic `import("./c71860c77-….js")`. For example, `"time-limits"` → `c71860c77-DHpqqlEo.js`.
- `ur` maps ids to error copy such as "Couldn’t load the Teachers page.".
- Sections marked `"section"` show an inline error instead.

**Piano Trainer takeaway (Settings):** build the section list in one function that returns `{id, href, icon, label, searchHints}[]` with plain boolean gates. Lazy-import each page with a per-page "Couldn't load …" fallback.

### 1.2 Hash and path routing, open and close

| Form | Meaning | Evidence (exact) |
|---|---|---|
| `#settings/<section>[/<subpath>]` | opens the **modal** over the current page | `gy=(function(e){return e==="#settings"\|\|e.startsWith("#settings/")\|\|e==="#customize"\|\|...` (`shared-m-1`) |
| `#customize/<x>/yours` | opens the modal on a customize section | same `gy` |
| `/settings/<section>` | a full-page route (nav `href`s use this form) | `$M=(function(e){let t=e.toLowerCase();return t==="/settings"\|\|t.startsWith("/settings/")\|\|D9(t)})` |
| `/customize/...` | a full-page customize route | `D9` |

- The hash is parsed by `Z9` in `shared-33`. It strips `?…` from `#customize` hashes and turns `#settings/x` into the path `/settings/x`.
- `Ua` (in `shared-m-1`) rewrites legacy `#settings/customize-connectors…` hashes to `#customize/...`.

**Modal state:** a zustand store `jX` in `shared-m-1` (**exact**, `export var jX = CT((e, t) => ({ section: null, … openCount: 0, …`). Its fields:
- `section` (`null` means closed), `subpath`, `openCount` (increments on each open), `previousSection`.
- `dismissalLocked`: while true, `open()` returns early.
- `returnSection` / `returnSubpath`: used for "back".
- `pendingAnchor`: the scroll-to-row target.
- `open(section="untargeted", subpath, opts)`:
  1. resolves the section against `visibleSections`;
  2. resets every intent field;
  3. sets `openCount: t().openCount + 1`.

**Hash listeners (exact, `shared-59`):** `window.addEventListener("hashchange", …)` and `popstate`.
- When the hash is a settings hash, the store is closed (`section===null`), and `e.oldURL!==""` (`zO`), the modal opens.
- On close, if the store is closed but the URL still has a settings hash, the code removes it with `window.history.replaceState(window.history.state,"",e+t)` (pathname + search).
- When code navigates programmatically, it fires `window.dispatchEvent(new HashChangeEvent("hashchange"))` itself (`shared-0`).

**Keyboard shortcut (exact, `shared-1`):** command `settings` is defined as:
`settings:{description:gQ.description,group:"settings",shortcut:{bindings:[{key:",",modifiers:["cmd","shift"],platform:"mac"},{key:",",modifiers:["ctrl","shift"],platform:"non-mac"},{key:"<",modifiers:["ctrl","shift"],platform:"non-mac",app:"web"}]},icon:nJ("Settings"),hiddenFromCommandPalette:!0}`
- The bindings are ⇧⌘, on Mac and Ctrl+⇧+, elsewhere.
- On non-Mac web there is also Ctrl+⇧+<, because Shift+comma produces "<" on many layouts.
- The command is hidden from the ⌘K palette.
- Its description is "General" with the search hint "settings", so it opens the General page (**inferred**).
- `Esc` and the × button close the dialog (live, see UI_FLOWS §6).

**Piano Trainer takeaway (Settings):**
- Keep the open state in a store.
- Mirror it to `#settings/<id>` so deep links and Back work.
- On close, `replaceState` the hash away. Do not `pushState` it.
- Bind ⇧⌘, / Ctrl+⇧+, and add the `<` alias.

### 1.3 Settings search

**What it does:** a "Search settings" box (`id:"pyTWlk"`) in the modal nav searches:
1. section names;
2. per-setting **row labels** from a static index, with extra search phrases;
3. live items (your connectors, skills, plugins and plugin skills);
4. per-section keywords.

**How (exact, `cc011544b` and `ca25db325`):**

- **Normaliser** `tn` (`c727027f5`):
  - `normalize("NFKD")`, then lowercase;
  - strip combining marks `[̀-ͯ]`;
  - unify curly quotes;
  - collapse `[\s\-_]+` to one space, then trim.
  - `vr` then removes every space before comparing.
  - For phrases, `_r` re-segments CJK text with `Intl.Segmenter(void 0,{granularity:"word"})`.
- **Ranking** `yr(query).rank(text)`:

| Rank | Rule |
|---|---|
| 0 | the space-less text equals the space-less query |
| 1 | the text starts with the query |
| −1 | not every query word is a substring of the text |
| 2 | every query word is the prefix of some word-suffix of the text |
| 3 | otherwise (a plain substring match) |

- **Section score** `Sr`:

| Score | When |
|---|---|
| min rank | the section name or `otherNames` match |
| rank | a merged section name matches (`shownSectionNames`), or, with queries of 2+ characters, `alsoFoundBy` |
| `5 + best row rank` | only rows match |
| `10` | only a keyword (`wr`) matches |

  Results sort by score.
- **Rows shown:** 3 child rows per section (`let i = n?.has(e.section.id) ? t.length : 3`). Extra rows collapse into "{count, plural, one {+# more} other {+# more}}". A child row reads "{row} in {section}". Phrase-only matches get rank 4 and drop if their rank is above 2. Duplicate rows collapse by `display` + `subpathId`.
- **Keywords** `wr`:
  - browser-extension → extension, browser
  - connectors → mcp, integrations
  - usage → overage, extra usage, spend limit, usage credits
  - members → invite, seats
  - customize-connectors → mcp, integrations, tools
  - customize-skills → custom instructions, agent skills
  - customize-plugins → marketplace, extensions
  - desktop/extensions → mcp
- **Row index** `Ot()` (exported as `n` from `ca25db325`) lists `{section, label, keyword?, searchPhrases?, rowId?, subpage?}`. Examples:
  - `general`: Theme (phrases "dark mode", "light mode", "dark theme", "light theme", "color", "colour"), Interface font (alias "UI font"), Response font ("Chat font"), Transcript width, Motion, Voice, Language, Speed, Notifications, Response completions, Scheduled tasks, Code notifications, Code permission requests, Dispatch messages.
  - `data-privacy-controls`: Help improve our AI models (phrases "AI model training data", "opt out of AI model training"), Location metadata, Export data.
  - `billing`: Your plan (phrases "subscriptions", "upgrade", "change plan"), Invoices (receipts), Cancellation (cancel subscription).
- Selecting a row opens its section with `pendingAnchor` set, so the page scrolls to that row (**inferred** from `pendingAnchor: d7(n, r)`).

**Piano Trainer takeaway (Settings):** keep a static `settingsIndex: {section, label, aliases[]}[]` next to the pages, normalise with NFKD and strip marks (this matters for Russian "ё/е"-style folding too), and rank exact > prefix > word-prefix > substring.

---

## 2. Every setting: where it lives, default, values, effect

### 2.1 General → Appearance

| Setting | Storage (exact) | Default | Values | Effect |
|---|---|---|---|---|
| Theme | `localStorage["LSS-userThemeMode"]` (`QX="userThemeMode"`, `X9="auto"`) | `auto` | `auto` (icon Computer), `light` (Sun), `dark` (Moon) | sets `<html data-mode="light\|dark">` and `data-theme="claude"`; see §3 |
| Interface font | raw `localStorage["persisted.interface-font"]` via `qk.setItem`, plus field `interfaceFont` in the persisted sidebar store `nH` | `anthropic`, or `system` when `HN()` (UA check `wq(navigator.userAgent)`) | `default`, `anthropic`, `system`, `dyslexic`, `atkinson` (atkinson only when gate `__gb__936258914` is on, or it is already chosen) | html attrs from `EL(e)` (see below) and CSS vars `--font-ui` / `--font-system` / `--font-ui-dyslexic` / `--font-atkinson-hyperlegible` |
| Response font | `localStorage["LSS-customStyles:chatFont"]` (`Ho("customStyles:chatFont","default")`) plus server `account.settings.chat_font` through `PATCH /api/account/settings {chat_font}`; flag `LSS-customStyles:chatFontSynced` | `default` | `sans` ("Match interface"), `serif` ("Anthropic Serif"), `system`, `atkinson`, `dyslexia` (`BB=["serif","sans","system","atkinson","dyslexia"]`, `mT=["default",...BB]`) | `<html data-reply-face>`; see below |
| Transcript width | zustand store `Au`, name `"epitaxy-editor-prefs"` in `localStorage`, field `transcriptWidthChoice` | `s` (`bP=…transcriptWidthChoice??"s"`) | `s` Narrow, `m` Medium, `l` Wide | Tailwind class `w0={s:"max-w-3xl",m:"max-w-240",l:"max-w-7xl"}`, which is 48rem (768 px), 60rem (960 px) and 80rem (1280 px); numeric map `eF=new Map([["m",60],["l",80]])` in rem. Tracks `claudeai.code.transcript_width.changed` |

The same store `Au` also holds Claude Code's `editorFont`, `codeFontSize` (default `null`), `codeThemeLight` (`claude-light`) and `codeThemeDark` (`claude-dark`) (**exact**, `shared-m-10`).

**Interface font → html (exact, `EL` in `shared-l-p-m-w-3`):**
- `data-font="system"` only when the value is system.
- `data-system-font=""` when the value is `system`.
- `data-dyslexic-font=""` when the value is `dyslexic`.
- `data-atkinson-font=""` when the value is `atkinson`.
- The list of managed attributes is `jX=["data-font","data-system-font","data-dyslexic-font","data-atkinson-font"]`.
- On boot, `Lk()` reads the attributes back to recover the current font.

**Reply font → html (exact, `uo` in `shared-l-p-m-w-5`):** `data-reply-face` is set to:
- `"interface"` when `$n(v)`, meaning the value is `sans`, or `default` on a UA where `wq(UA)` holds;
- otherwise `dH(v)`: `default` becomes `serif`, and any other value maps to itself.

The resulting attribute values are `interface`, `serif`, `system`, `atkinson` and `dyslexia`. The reply-font CSS vars are `Pz` (`serif.claude:"--font-serif"`, `sans:"--font-ui"`, `system:"--font-system"`, `atkinson:"--font-atkinson-hyperlegible"`, `dyslexia:"--font-ui-dyslexic"`).

### 2.2 General → Accessibility

| Setting | Storage (exact) | Default | Values | Effect |
|---|---|---|---|---|
| Motion | `localStorage["LSS-appearance:reduceMotion"]` (`_f="appearance:reduceMotion"`, `Ho(_f,"system")`) | `system` | `system`, `reduce` | `shouldReduceMotion = mode==="reduce" \|\| matchMedia("(prefers-reduced-motion: reduce)")`; when true, `document.documentElement.dataset.reduceMotion="true"` (`<html data-reduce-motion="true">`), otherwise the attribute is deleted |
| Contrast | `localStorage["LSS-persisted.kind-breeze"]` | `off` | `off`, `on`, `held` (the UI shows `on`/`held` as "Increased"; options System / Increased) | when `on`, or when the route matcher `My({select:GJ})` matches: `setAttribute("data-cds-contrast","more")`, otherwise the attribute is removed (`ED` in `shared-l-p-m-w-14`). Shown only with gate `__gb__163688626` |
| Pop-ups (toasts) | `localStorage["LSS-persisted.snazzy-globe"]` | `true` (auto-dismiss) | UI `on-screen` → false, `auto-dismiss` → true | toast auto-hide. Gate `__gb__1069680821`. After a change, the hook holds a timestamp for `3e4` ms (30 s) (`setTimeout(()=>a(0),3e4)`) |
| Dynamic conversations (virtualization) | `localStorage["LSS-persisted.velvet-rocket"]` | `true` | boolean switch | turns long-chat virtualization on or off. Gate `__gb__3042869911` |

"System" contrast reads the OS preference (**inferred**: the static code only shows the `on`/`held` branch and a route matcher).

### 2.3 General → Voice and Tasks

| Setting | Storage | Default | Values |
|---|---|---|---|
| Voice (style) | `account.settings.voice_preference` (**exact**, `n?.settings.voice_preference ?? r` in `c0db37792`) | none ("Select") | server voice ids `{value:e.id,label:e.displayName}` |
| Speed | synced through `setSyncedVoiceSpeed` (hook in `cd0747b23`; endpoint not traced) | `normal` | `A=[{id:"slow",value:.8},{id:"normal",value:1},{id:"fast",value:1.2},{id:"faster",value:1.5}]`. The cap is `k(s("__gb__1887526938"))`: a gate number above 1.2 capped at 1.5, otherwise 1.2, so "faster" is hidden unless the gate allows it. The nearest id comes from `j()` |
| Language (voice) | `Tt()` items in `cd0747b23` | — | a select. It becomes searchable when there are more than 8 items |
| Preferred browser (Tasks) | not traced | Built-in browser (live) | — |

### 2.4 General → Notifications

Every row is a switch component `Z` with `{enabled, apply}`. `vr(enabled, apply)` turns it into an optimistic toggle (§6).

| Row | Storage (exact) | Default |
|---|---|---|
| Response completions | `PATCH /api/organizations/{org}/notification/preferences` with `{preferences:{feature_preference:{compass:{enable_push:v},completion:{enable_push:v}}}}` (`oi=["compass","completion"]`, `r3`). Turning it on first asks for browser `Notification` permission (`_r`) | on when every key has push on (`rn`) |
| Scheduled tasks (push / email) | same endpoint, `feature_preference.routines.enable_push` / `.enable_email` | `effective_preferences` from the server |
| Code notifications | `feature_preference.bogosort.enable_push` / `enable_email` | off |
| Code permission requests | `feature_preference.code_requires_action.enable_push` | — |
| Projects | `feature_preference.hearth_project.enable_push` | `?? !0` (true) |
| Claude Security activity | `feature_preference.code_security_scan.enable_email` | — |
| Dispatch messages | `feature_preference.dispatch.enable_push` | — |
| Chat prompt push | `feature_preference.tool_notification.enable_push` | — |
| Artifact emails | features `frame_comment_mention`, `frame_comment_owner` (follows mention), `frame_shared`, `pancakesort` (when `pancakesort_available`), each with `enable_email` (`er` list) | `enable_email ?? !0` |
| Admin alerts | `admin_spend_alerts`, `admin_usage_credit_alerts`, `admin_join_request_alerts` → `enable_email` | `!== !1` (true) |

- Read model: `preferences.feature_preference[feature]` holds the user's explicit choice. `effective_preferences[feature]` holds the resolved value, including `email_source: "explicit" | "default"`.
- Query key: `["notificationPreferences",{orgUuid}]`.

### 2.5 Other pages (server fields)

| Page / setting | Storage (exact unless marked) |
|---|---|
| Capabilities → Tool access mode | `account.settings.tool_search_mode`; options "Load tools when needed" / "Tools already loaded" |
| Capabilities → Connector search | `enabled_connector_suggestions` |
| Capabilities → Switch models when a message is flagged | `enabled_model_auto_fallback` (chat) and `ccr_switch_models_on_flag` (Claude Code page) |
| Capabilities → Artifacts | `settings.preview_feature_uses_artifacts` |
| Capabilities → Allow network egress / Domain allowlist | `enabled_wiggle_egress`. The allowlist placeholder is "example.com or *.example.com" |
| Capabilities → Inline visualizations, Run code in the cloud | near `enabled_mcp_tools` / `settings.preview_feature`; the exact field was not resolved (**inferred**) |
| Capabilities → experimental previews | `enabled_turmeric`, `enabled_sourdough`, `enabled_foccacia`, `enabled_bananagrams`, `enabled_monkeys_in_a_barrel` ("Preview and provide feedback on upcoming enhancements") |
| Privacy → Location metadata | `enabled_geolocation` |
| Privacy → Help improve our AI models | `grove_enabled` (save path option `opt_in_only_if_unset=grove_enabled`) |
| Memory → Search and reference chats | `enabled_saffron_search` (`a({enabled_saffron_search:n})`, `c1ade1796`) |
| Memory → Generate memory from chats | `enabled_saffron` (`await t({enabled_saffron:n})`, `c6bba3086`). Turning it off also calls a local reset `vt(accountUuid)` and tracks `claudeai.memory.account_setting_toggled` |
| Memory → Sensitive topics | a row in `c6bba3086`; the field was not resolved |
| Conversation-level overrides | sent with each message: `paprika_mode`, `compass_mode`, `tool_search_mode`, `enabled_web_search`, `enabled_mcp_tools`, `enabled_imagine`, `chat_memory_mode` (`shared-1`) |
| Account → language | §4 |
| Claude Code → code themes, font, size, transcript width | `epitaxy-editor-prefs` (§2.1) |

All `enabled_*` / `settings.*` fields above are saved with `PATCH /api/account/settings` (the `KM` mutation, §6). This is **exact** for `chat_font`, `enabled_saffron` and `enabled_saffron_search`, and **inferred** for the capability flags, which use the same `te()`-style mutation.

---

## 3. Theme resolution

**How (exact, `CI` and helpers in `shared-l-p-m-w-4`):**
- **Stored mode:** `[f,p]=Rv(QX,X9)` stores `LSS-userThemeMode`.
  - `Jj` normalises the value: `e==="light"||e==="dark"||e==="auto"?e:X9`.
  - Bootstrap reads it with `cX(QX,{acceptBareValue:!0})`, so a bare string also works.
- **System listener:** `pdT` subscribes with `window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",e)`. `zU` returns `.matches`. Both feed `useSyncExternalStore` (`hr(pdT,zU,Y3)`).
- **Resolved mode:** `_ = m==="auto" ? (systemDark?"dark":"light") : m`. A `forceMode` prop or a `heldMode` override wins.
- **Writing to the DOM:** `Rw("theme", s)` sets `dataset.theme` (`"claude"`). `Rw("mode", …)` sets `dataset.mode`.
  - Before mount, `_p(stored)` resolves `auto` with matchMedia.
  - On a real change, when the old value existed, was not `system`, and `<html>` lacks `data-boot-ui-hold`, `ww()` runs. It schedules a rAF pass, `AU`, that finishes colour transitions. It is cancelled while the tab is hidden.
- **theme-color meta:** `tQ()` reads the computed `background-color` of `body`/`html` and writes it into a single `<meta name="theme-color">`. It removes any `media` attribute and any duplicates.
- **Desktop:** `window.electronWindowControl.setThemeMode(m==="auto"?"system":m)`.
- **Context value:** `{theme, mode, setMode, setTheme, resolvedMode, ownMode, mounted}`. The default when no provider exists is `ih={theme:"claude",mode:"auto",resolvedMode:"light",...}`.
- **Pre-paint inline script:** not available. `index.html` was not captured, only JS chunks. Its existence is **inferred** from `data-boot-ui-hold` and from `$2()`, which reads the stored mode synchronously before React mounts.

**Font options (exact):** see the table in §2.1.
- Interface font: Anthropic Sans, System, OpenDyslexic, Atkinson Hyperlegible Next, plus "Default · {font}".
- Reply font: Match interface, Anthropic Serif, System, Atkinson Hyperlegible Next, OpenDyslexic.

**Transcript widths (exact):** Narrow `max-w-3xl` (768 px), Medium `max-w-240` (60rem, 960 px), Wide `max-w-7xl` (1280 px).

**Piano Trainer takeaway (Settings → Appearance):**
- Store `"auto"|"light"|"dark"`.
- Resolve it with `matchMedia` plus a `change` listener.
- Write `data-mode` on `<html>` in an inline `<head>` script before paint.
- Update `<meta name="theme-color">` from the computed body background.

---

## 4. Language

**What it does:** the language dialog (`tv` in `shared-19`, title "Choose your language", size `lg`) lazy-loads its body from `c49da61a8` (`LanguagePickerLazyBody`, tier T2).
- Search: the "Search languages" field matches label, description or value, after NFD normalisation and removing `\p{M}` marks.
- Picking a language switches it **without a page reload**.

**How (exact):**
- **Locale list:** the dialog shows `offeredLocales` (`Dq()` → `Xe()` in `shared-39`). These come from a store filled by the server, not from a list in the bundle. The live list of 35 is in UI_FLOWS §8.
  - `ln` in `shared-19` holds the word "Language" in each UI language for the menu entry, e.g. `["ru","Язык"]`.
  - `cea4d5694` holds names for 13 core locales: en-US, de-DE, fr-FR, ko-KR, ja-JP, es-419, es-ES, it-IT, hi-IN, pt-BR, pt-PT, id-ID, zh-Hans, zh-Hant.
  - The dialog passes `showPseudoLocales: !0`.
- **Switch flow** (`y` in `c12f1cf7e`):
  1. `beginLocaleSwitch()` increments `localeSwitchSeq`.
  2. `PUT /api/account_profile {locale}` runs through `Nz`, with `networkMode:"always"` for a non-current locale.
  3. On success, `applyLocaleSwitch(seq)` runs only if `seq >= localeAppliedSeq`. A late reply can therefore not undo a newer pick.
  4. `setLocaleOverride(locale)` and `recordLocalePick()` follow; the pick also sets the source `Pp("user_choice")`.
  5. The code tracks `claudeai.language.picked` with `{from_locale, to_locale, from_source: picked|account|browser, is_repick, entry_point}`.
- **Message bundles:**
  - Gated per-org messages are fetched with react-query key `mG(locale)` = `["i18n_public", locale]`, `staleTime: Infinity`, `retry: 1`.
  - Public catalogs come from `/i18n/s/…` (`sr="/i18n/s/"`). If that fails, the code falls back to `` `/i18n/${encodeURIComponent(e)}.json` `` and marks `i18n:catalog_short_fallback`.
  - `Kg` is the i18n store: `messages`, `messagesLocale`, `localeOverride`, `localeChoice`, `localePickCount`, `localeSwitchSeq`, `localeAppliedSeq`, `publicCatalog{locale,status:"applied"|"failed"}`.
- **Persistence:**
  - `localStorage["spa:locale"]` holds the chosen locale.
  - `localStorage["spa:locale-source"]` is `"user_choice"` after a manual pick. `q7()` checks both.
  - `localStorage["spa:account-locale"]` is set when the account locale equals the chosen one, and removed otherwise (`Vj`).
  - `document.documentElement.lang` is updated.
  - Initial locale: `sA()`. If `spa:locale` is unset it uses `navigator.languages`, matched case-insensitively against the known locales, with `"en-US"` as the fallback.
  - API calls send `Accept-Language` from the current override (`T9`).
- **Error:** the toast is "This isn’t working right now. You can try again later." (`id:"5QspGK"`, `uniqueKey:"language-switch-failed"`). It is skipped when the user has already moved to another pick.

**Piano Trainer takeaway (Settings → Language, en/ru):**
- Persist `locale` plus `localeSource: "user" | "browser"` in localStorage.
- Lazy-import `ru.json` with dynamic `import()`, swap it in React state with no reload, and set `<html lang>`.
- Guard races with a sequence number.

---

## 5. Notifications, time limits, usage, memory

### 5.1 Time and focus (break reminders, quiet hours)

The settings UI and Reflect page are **server-gated code**. `c71860c77-DHpqqlEo` only renders `h2.__built("cardinal")` with `variant:"time-limits"`, so the form itself is not in the static bundles (**exact**: `var o=i.__built("cardinal")`). The data model is visible from the runtime that enforces it (`shared-l-m-0`, **exact**).

**Settings endpoint:** `GET/POST /api/organizations/{org}/reflections/settings?timezone=<IANA>` (`zQ`).
- The timezone comes from `Intl.DateTimeFormat().resolvedOptions().timeZone`.
- Known fields: `time_alert_daily_minutes` (number), `quiet_hours` (array), `snoozed_until` (ISO string, sent by POST from the snooze action).
- `o5(s)` says limits are active when `time_alert_daily_minutes>0 || quiet_hours.length>0 || resolved has threshold or quiet windows`.

**Heartbeat:** `POST /api/organizations/{org}/reflections/time_spent` with body `{ms, unfocused_ms, date, timezone}` and `keepalive` when the page unloads. A 404 means the server gate is off (`nz` symbol).

**Response schema (zod):**
```ts
// paraphrased from zod schemas Y1 / sQ
type TimeSpent = { total_ms: number; date: string; resolved?: Resolved };
type Resolved = {
  local_date: string;
  total_ms: number | null;
  threshold_ms: number | null;      // daily alert threshold
  quiet_until_ms: number | null;
  quiet_windows: { start_ms: number; end_ms: number }[];
  snoozed_until_ms: number | null;
  resets_at_ms: number;
};
```

**Behaviour:**
- **Break-reminder threshold:** `resolved.threshold_ms`, or `time_alert_daily_minutes * 6e4` (`cd4a6bab5`). The alert fires when `total_ms >= threshold_ms` (`t2`), unless snoozed.
- **"Snooze break":** sets `Date.now()+9e5` (15 min). Other actions use `resets_at_ms`.
- **Refetch:** at `resets_at_ms + mS`, where `mS=Math.random()*10*6e4` is 0–10 min of jitter.
- **"Continue during quiet hours":** stored per tab in `sessionStorage["cardinal:quietHoursContinued"]="1"`.
- Live UI: hours and minutes selects, plus 7 day toggles starting on Sunday (SETTINGS.md "Zeit und Fokus"). The day toggles feed `quiet_hours` (**inferred**).
- Flags: `a9("cardinal")` and `a9("cardinal_time_spent")`.

### 5.2 Usage page (`c71860c77-9KwfkNrt`, exact)

- **Data:** `GET /api/organizations/{org}/usage?...` with variants `skip_spend=1`, `at_wall=1` and `source=`. React-query key `["unified_limits_utilization", org]`; `refetchInterval: 3e5` (5 min) on the page.
- **Windows** in the response: `five_hour` (shown as "Current session"), `seven_day` ("All models", the weekly limit), `seven_day_opus`, `seven_day_sonnet`, `seven_day_cowork`, `seven_day_oauth_apps`, `seven_day_omelette`, promo grants and `limits[]`. Each window has `utilization` (percent) and `resets_at`.
- **Bar colour:** `iv(p) = p>=90?"critical":p>=75?"warning":"normal"`, mapped to `fH={normal:"accent",warning:"warning",critical:"danger"}`.
- **Percent text:** `yF(e)=Math.floor(e+1e-9)`, so values round down ("{percent}% used").
- **Forecast** `Ji({percent, resetsAt, nowMs})`, for the weekly window (604 800 000 ms = `6048e5`):

| State | Condition | Message |
|---|---|---|
| `limit_hit` | `p >= 100` | "Limit hit…" |
| `zero` | `p == 0` | "No usage yet. 100% of your weekly limit is available." |
| `fresh` | `p < 10` | "Fresh week. {percent}% of your weekly limit used." |
| `early` | `elapsed = now − (reset − 7 d)`; elapsed `< 432e5` (12 h) or no reset time | no forecast |
| `heads_up` | `runsOut = now + (100−p) × elapsed / p`, and `runsOut < reset` | "Heads up. At this pace you’ll run out {runOut}, before {weekday}’s reset." |
| `on_track` | otherwise | "On track. You should reach {weekday}’s reset with room to spare." |

- **Time words:** `rs(hour)`: before 5 → night, before 12 → morning, before 17 → afternoon, before 21 → evening, else night. Day names come from `is` (today, tomorrow or other) and from weekday plus part, e.g. "Monday evening".
- **Footer:** "Last updated: just now" / "less than a minute ago" / "{n} minutes ago", with a Refresh button.

### 5.3 Memory toggles

See §2.5: `enabled_saffron_search` and `enabled_saffron` go through `PATCH /api/account/settings`. If saving the memory search toggle fails, the handler calls `.catch(e=>s(e,l))`, which shows an error toast through the shared handler (**exact**, `c1ade1796`).

---

## 6. Optimistic updates and error handling

**Notification switches** (`vr` + `Z` in `c0db37792`, **exact**):
1. On click, the switch disables itself while saving (`disabled: p && !enabledWhileSaving`). `Ie(setPending, fn)` wraps the save in try/finally.
2. Turning a push row on first runs `_r()`. If `Notification.permission` is not already granted, it requests permission.
3. Errors map to toasts:

| Error | Toast | Kind |
|---|---|---|
| `PushUnavailableError` | "Notifications can’t be turned on here. Open Claude in its own browser tab and try again." | info |
| `NoNotificationApiError` | "Couldn’t turn on notifications here." | warning |
| permission `denied` | "Notifications are blocked. Allow them in your browser or system settings, then try again." | error |
| permission `default` | "To turn this on, try again and allow notifications when your browser asks." | info |
| any other error | "Couldn’t save your change. Try again." | error |

4. Mutation `N2`, `onMutate`: cancel the query, snapshot `previous`, then `setQueryData` the merged `feature_preference` and recomputed `effective_preferences`.
5. `onError`: restore `previous` (`aI(a,e)`) when the org still matches, otherwise invalidate.
6. `onSuccess`: merge the server response, and invalidate if the effective prefs changed.

**Account settings** (`KM`, `PATCH /api/account/settings`, **exact**):
- `onMutate`:
  1. cancel `["current_account"]` queries;
  2. snapshot each cached `account.settings`;
  3. apply the patch to every cached copy (`setQueriesData`);
  4. record a per-field write sequence (`hF`).
  While the save is pending, a cache subscription re-applies the patch if a background refetch lands, so the switch does not flicker back.
- `onError`: for each snapshot, restore only the fields this mutation wrote, and only if no newer write to that field exists (`Sx(writeSeq, …)`).
- **Response font** (`It` in `c0db37792`) also rolls back locally. If `customStyles:chatFont` still holds the attempted value, it restores the previous font and the `chatFontSynced` flag.

**Global error toast** (`shared-l-p-m-w-14`, **exact**):
- The react-query `MutationCache` `onError` calls `a.addApiError(e, …)`, which shows the server's error message, unless `meta.noToast` or `meta.silent` is set. Notification rows pass `{noToast:!0}` where they show their own copy.
- HTML or network failures show "We are experiencing technical difficulties. Some functionality may be temporarily unavailable.". When the failure is a 403 without a Cloudflare ray, the toast is "Something on your network may be blocking part of Claude…" instead.
- Query defaults: `staleTime: 3e5` (5 min), `refetchOnWindowFocus: false`, retry up to 3 times except on auth/permission errors.

**Piano Trainer takeaway (Settings):** local settings apply instantly with no rollback needed. For any synced setting:
- snapshot, apply optimistically, roll back on error;
- show one toast, "Couldn't save your change. Try again.";
- give permission errors (notifications, mic for pitch detection) their own specific copy.

---

## 7. Piano Trainer settings blueprint

This interface is written for Piano Trainer. It borrows the claude.ai patterns: an `LSS-` style envelope in localStorage, html data-attributes for appearance, an optimistic sync for the few fields that need a server, a sequence-guarded locale switch, and a time-limit model.

```ts
// Piano Trainer: settings store (localStorage, offline-first)
// Key: localStorage["pt:settings:v1"] = JSON {value: PianoSettings, timestamp}
// Cross-tab: listen to 'storage'; same-tab: dispatch synthetic StorageEvent after write.

export type ThemeMode = 'auto' | 'light' | 'dark';           // -> <html data-mode>
export type UiFont = 'default' | 'system' | 'dyslexic' | 'atkinson'; // -> data-*-font attrs
export type ScoreFont = 'bravura' | 'petaluma' | 'leland';   // notation font -> data-score-face
export type ContentWidth = 's' | 'm' | 'l';                  // 768 / 960 / 1280 px
export type Locale = 'en' | 'ru';

export interface PianoSettings {
  // Appearance (Settings > Appearance)
  theme: ThemeMode;                 // default 'auto' (matchMedia prefers-color-scheme)
  uiFont: UiFont;                   // default 'default'
  scoreFont: ScoreFont;             // default 'bravura'
  contentWidth: ContentWidth;       // default 'm'

  // Accessibility (Settings > Accessibility)
  motion: 'system' | 'reduce';      // default 'system' -> <html data-reduce-motion="true">
  contrast: 'system' | 'more';      // default 'system' -> <html data-contrast="more">
  toastsAutoDismiss: boolean;       // default true (on-screen vs auto-dismiss)
  colorBlindNoteColors: boolean;    // default false (Player/Practice note colouring)

  // Language (Settings > Language): own keys, see below
  // Sound & input (Player, Practice tools)
  masterVolume: number;             // 0..1, default 0.8
  metronomeVolume: number;          // 0..1, default 0.6
  metronomeAccentFirstBeat: boolean;// default true
  playbackSpeed: 0.5 | 0.75 | 1 | 1.25; // default 1 (like voice speed list)
  midiInputId: string | null;       // default null (auto)
  micPitchDetection: boolean;       // default false (needs permission -> own error toasts)
  latencyCompensationMs: number;    // default 0, range -200..200

  // Learn / Practice
  showNoteNames: 'off' | 'letters' | 'solfege'; // default 'letters' (ru: 'solfege' suggested)
  handsHighlight: boolean;          // default true
  waitForCorrectNote: boolean;      // default true

  // Time & focus (Practice tools), modelled on reflections/settings
  dailyGoalMinutes: number;         // default 20; 0 = off
  breakReminderMinutes: number;     // default 0 (off); fire when sessionMs >= minutes*60000
  quietHours: { days: boolean[]; startMin: number; endMin: number } | null; // days[0] = Sunday
  snoozedUntilMs: number | null;    // "snooze break" = now + 15 min

  // Notifications (Profile/Settings)
  practiceReminderPush: boolean;    // default false; request Notification permission on enable
}

export const DEFAULT_SETTINGS: PianoSettings = {
  theme: 'auto', uiFont: 'default', scoreFont: 'bravura', contentWidth: 'm',
  motion: 'system', contrast: 'system', toastsAutoDismiss: true, colorBlindNoteColors: false,
  masterVolume: 0.8, metronomeVolume: 0.6, metronomeAccentFirstBeat: true, playbackSpeed: 1,
  midiInputId: null, micPitchDetection: false, latencyCompensationMs: 0,
  showNoteNames: 'letters', handsHighlight: true, waitForCorrectNote: true,
  dailyGoalMinutes: 20, breakReminderMinutes: 0, quietHours: null, snoozedUntilMs: null,
  practiceReminderPush: false,
};

// Separate tiny keys (read before React mounts, like spa:locale / userThemeMode):
//   localStorage["pt:locale"] = 'en' | 'ru'
//   localStorage["pt:locale-source"] = 'user' | 'browser'
//   localStorage["pt:theme"] = ThemeMode  (inline <head> script sets data-mode pre-paint)

// Settings search index (static, like ca25db325 Ot()):
export interface SettingsIndexRow {
  section: 'appearance' | 'accessibility' | 'language' | 'sound' | 'practice' | 'time' | 'notifications' | 'profile';
  label: string;            // i18n message id
  aliases?: string[];       // e.g. ['dark mode','тёмная тема'] for theme
  rowId?: string;           // anchor to scroll to
}

// Practice-pace forecast (copy of Ji logic, weekly goal instead of limit):
// percent = practicedMs / weeklyGoalMs * 100; elapsed = now - weekStart;
// if percent<10 'fresh'; if elapsed<12h 'early';
// projected = now + (100-percent)*elapsed/percent;
// projected <= weekEnd ? 'on_track' : 'behind'.
```

**Screen mapping:**
- **Settings dialog sections:** Appearance, Accessibility, Language, Sound & MIDI, Practice, Time & focus, Notifications, Profile.
- **Routes:** use `#settings/<section>` for the modal and `/settings/<section>` for the full page.
- **Shortcuts:** ⇧⌘, / Ctrl+⇧+, plus the `<` alias.
- **Search:** NFKD-normalised, with ranking exact > prefix > word-prefix > substring.

---

## What could not be determined

- **The pre-paint inline theme script:** `index.html` was not captured.
- **The Time and focus and Reflect forms:** they are server-gated `__built("cardinal")` code. The exact `quiet_hours` element shape and the select option lists (hours, minutes) are not in the bundles. Only the runtime model above is visible.
- **The English labels for Reflect, Time limits and Insights:** they are gated messages with ids only.
- **Live locale list:** the 35 offered locales come from the server, so the code has no static list.
- **Exact account fields for "Inline visualizations", "Run code in the cloud" and "Sensitive topics in memory":** these were not resolved.
- **Voice-speed sync endpoint and the "Preferred browser" storage:** not traced.
- **The exact handler of the ⇧⌘, command:** it opens General (**inferred** from its description).
