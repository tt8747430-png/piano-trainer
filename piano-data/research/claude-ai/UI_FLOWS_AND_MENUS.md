# claude.ai: UI flows, menus and popups

Recorded live on 2026-11-20 in the owner's signed-in Chrome (UI language German, desktop width 1710 × 841 px, light mode). Build `data-build-id=0d4c697ee9`, git hash `0d4c697ee92cd073dd85742c468e4621a7382bc3`, `data-version=1.0.0`.

**Status of claims:** everything here is **exact** (read from the live DOM, accessibility tree or screenshots) unless marked **inferred**. German labels are as shown; English glosses are in brackets.

**Privacy:** the account's personal data (email, name, session locations, card digits, invoices, memory entries, chat titles, org ID) is not reproduced. Where a screen lists such data, only its structure is described.

## 1. App shell

| Region | Contents |
|---|---|
| Sidebar (left, collapsible, `⌘B`) | Logo "Claude" link to `/new`; mode switch with radios **Claude / cowork / Code**; nav items **Neu** (New, `⇧⌘O`), **Suchen** (Search, `⌘K`), **Projekte**, **Artefakte**, **Geplant** (Scheduled), **Design**, **Anpassungen** (Customize); section **Angepinnt** (Pinned, collapsible, with "Weitere Optionen"); section **Letzte Elemente** (Recents, collapsible, with "Letzte filtern und gruppieren" filter button); each row has a "Weitere Optionen für …" (⋯) button on hover; footer: avatar + name + plan badge ("· Max") opening the account menu, plus a device/desktop button. |
| Sidebar resize | `separator "Seitenleistenbreite anpassen"` (drag to resize). CSS: `--kf-side-width: 288px`, `--kf-side-floor: 200px`. |
| Top right (new chat) | **Inkognito verwenden** (ghost icon, `⇧⌘I`). |
| Home (`/new`) | Greeting with the clay asterisk logo ("Los geht's!"), font size `clamp(1.5rem, 1.15rem + 1vw, 2rem)`, line-height 1.2. Optional usage banner above the composer ("Du hast 65 % deines wöchentlichen Limits verwendet" + button "Mehr Nutzungsvolumen erhalten", dismiss ×). Composer below. |
| Composer | Textbox "Prompt an Claude schreiben", placeholder "Wie kann ich dir heute helfen?" (in a chat: "Antworten"; when focused on home: "Tippe / für Skills"). Buttons: **+** "Dateien, Konnektoren und mehr hinzufügen"; **Diktieren** with dropdown; **Mikrofon**; **Sprachmodus verwenden** (voice mode). Under the box: **Projekt ▾** picker (left), **Modell: Opus 5.5 Mittel** picker and **Auto** (right). In a chat, a footnote "Claude ist eine KI und kann Fehler machen." Composer font size `0.9375rem`, line-height `max(1.3125rem, 22px)`. |

## 2. Composer "+" menu

| Item | Detail |
|---|---|
| Dateien hochladen oder hinzufügen (Upload or add files) | shortcut `⌘U` |
| Skills ▸ | submenu |
| Konnektoren ▸ (Connectors) | submenu |
| Designsystem ▸ | submenu |
| Plugins ▸ | submenu |
| Geräte ▸ (Devices) | submenu (home only, not shown inside a chat) |
| — separator — | |
| Recherche (Research) | toggle |
| Gedächtnis (Memory) | toggle, checked ✓ (home only) |

## 3. Model picker (`⇧⌘.`)

| Row | Subtitle |
|---|---|
| Fable 5.2 | Für deine schwierigsten Herausforderungen |
| Opus 5.5 ✓ | Für komplexe Arbeit und alltägliche Aufgaben |
| Sonnet 5.5 | Am effizientesten für einfachere Aufgaben |
| Haiku 5.5 | Am schnellsten für schnelle Antworten |
| Aufwand ▸ (Effort) | current value "Mittel" |
| Weitere Modelle ▸ (More models) | |

**Effort submenu.** Header text: "Höherer Aufwand bedeutet gründlichere Antworten, dauert aber länger und verbraucht Ihre Limits schneller." Options: Niedrig, Mittel (badge "Empfohlen", ✓), Hoch, Extra hoch, Maximal (warning badge "4× oder mehr Nutzung").

**More models submenu:** Fable 5.1, Fable 5, Opus 5, Opus 4.8, Opus 4.7, Opus 4.6, Opus 3, Sonnet 5, Sonnet 4.6.

Submenus open on hover, to the right of the parent row.

## 4. Account menu (footer button)

| Item | Detail |
|---|---|
| (email, muted header) | |
| Einstellungen (Settings) | `⇧⌘,`. Opens the settings dialog (section 6). |
| Nutzung (Usage) | Opens the settings dialog on `#settings/usage`. |
| Sprache (Language) | Opens the "Wähle deine Sprache" dialog (section 8). |
| Hilfe (Help) | |
| Mehr erfahren ▸ (Learn more) | Submenu: Über Anthropic (external ↗), Claude Academy, Tastenkombinationen (`⌘/`), Deine Datenschutzoptionen, Rechtliches ▸ |
| — | |
| Plan upgraden | |
| Apps und Erweiterungen holen | |
| Gastpässe teilen (Share guest passes) | |
| — | |
| API-Schlüssel abrufen | external ↗ |
| — | |
| Abmelden (Log out) | |

## 5. Search palette (`⌘K`)

Centred modal, about 370 × 320 px at 0.6 scale (**inferred** ≈ 615 × 535 px real). Search field "Suchen" with × close. Filter chips: **Alle, Artefakte, Sitzungen, Code, Projekte, Geplant**. Section "Letzte Elemente" (recent items; each row has an icon by kind (chat bubble, code `</>`, design palette, artifact) and optional badge such as "PR #2"; hovered row shows ⋯ and ↵). Section "Aktionen": "Neue Sitzung". Footer key hints: Schließen `Esc` · Typ wechseln `← →` · Filter `/` · Aktionen `⌥ ↵` · Verfassen `Tab` (compose).

## 6. Settings dialog

Opened as a modal over the current page; the route is held in the URL hash. Size **1024 × 800 px**, border-radius **16 px**, white, shadow `0 0 0 1px rgba(0,0,0,.08), 0 1px 2px hsl(0 0% 4.3% / .06), 0 2px 8px hsl(0 0% 4.3% / .08)`. Left nav 212 px wide with a search field "Suchen" ("Einstellungen durchsuchen" combobox). Close button "Schließen" (×) top right; `Esc` closes.

| Nav group | Item | Hash |
|---|---|---|
| Präferenzen | Allgemein | `#settings/general` |
| | Konto | `#settings/account` |
| | Datenschutz | `#settings/data-privacy-controls` |
| | Abrechnung | `#settings/billing` |
| | Nutzung | `#settings/usage` |
| | Funktionen | `#settings/capabilities` |
| | Gedächtnis | `#settings/memory` |
| | Designsysteme | `#settings/design-systems` |
| | Rückblick | `#settings/reflect` |
| | Zeit und Fokus | `#settings/time-limits` |
| | Claude Code | `#settings/claude-code` |
| | Claude in Chrome | `#settings/browser-extension` |
| Anpassungen | Skills | `#customize/skills/yours` |
| | Konnektoren | `#customize/connectors/yours` |
| | Plugins | `#customize/plugins/yours` |
| Plattform | API-Schlüssel ↗ | external link (`data-testid=settings-nav-platform-api-keys`) |

Every control on every page is listed in `SETTINGS.md`.

## 7. Keyboard shortcuts dialog (`⌘/`)

Search field "Tastenkürzel durchsuchen" with a keyboard icon. Two groups:

| Group | Action | Keys |
|---|---|---|
| Allgemein | Schneller Chat oder Suche | `⌘K` |
| | Suchen | `⇧⌘K` |
| | Inkognito | `⇧⌘I` |
| | Seitenleiste ein-/ausblenden | `⌘B` |
| | Neue Sitzung | `⇧⌘O` |
| | Tastenkombinationen | `⌘/` |
| | Einstellungen | `⇧⌘,` |
| | Nächsten Seitenbereich fokussieren | `F6` |
| | Vorherigen Seitenbereich fokussieren | `⇧F6` |
| In Sitzungen | Nachricht senden | `↵` |
| | Neue Zeile in Nachricht | `⇧↵` |
| | Für später vormerken (queue) | `⌘↵` |
| | Denken umschalten (toggle thinking) | `⇧⌘E` |
| | Modellmenü öffnen | `⇧⌘.` |
| | Dateien oder Fotos hinzufügen | `⌘U` |
| | Diktat beenden | `↵` |
| | Diktat abbrechen | `Esc` |
| | Claudes Antwort stoppen | `Esc` |
| | Suchen (in chat) | `⌘F` |
| | Weitersuchen | `⌘G` |
| | Vorheriges suchen | `⇧⌘G` |

Keys are drawn as key caps with both the glyph and a screen-reader word ("⌘ Command").

## 8. Language dialog

Title "Wähle deine Sprache", search "Sprachen durchsuchen", 3-column grid of cards (native name over English name, selected card tinted with ✓). 35 languages, in this order: Amharic, Bangla, Bhojpuri, Chinese (Simplified), Chinese (Traditional), Danish, Dutch, English (United States), Filipino, Finnish, French (France), German (Germany), Gujarati, Hausa, Hindi (India), Indonesian (Indonesia), Italian (Italy), Japanese (Japan), Kannada, Korean (South Korea), Malayalam, Marathi, Norwegian Bokmål, Portuguese (Brazil), **Russian**, Spanish (Latin America), Spanish (Spain), Swahili, Swedish, Tamil, Telugu, Thai, Turkish, Ukrainian, Vietnamese. Choosing one changes the UI immediately (**inferred**; not clicked).

## 9. Top-level pages

| Page | Route | Layout |
|---|---|---|
| Projekte | `/projects` | Title; search, sort and black "Neues Projekt" button top right; project cards (icon, name, date, pin icon). |
| Artefakte | `/artifacts` | Title; tabs Alle / Meine / Mit dir geteilt; search, filter, list/grid toggle, +. Row "Etwas Neues erstellen" with coloured tiles: Dokumente (blue), Folien (orange), Tabelle (green, Beta), Design (violet), Daten (pink), Whiteboard (pink, Beta), +. Info banner with action "Deine Projekte verschieben" and ×. 3-column card grid (thumbnail, title, kind · relative date, globe icon if public). While loading: grey skeleton cards. |
| Geplant | `/scheduled` (**inferred** route) | Title "Geplante Aufgaben"; 2-column card grid; skeletons while loading. |
| Design | `/design` (**inferred** route) | Like Artefakte; create tiles: Folien, Design, Design in der Code…, Designsystem, Whiteboard (Beta). |
| Anpassungen | `/customize/skills` | Title; segmented tabs Skills / Konnektoren / Plugins and Meine / Entdecken; search, filter, sort, black "+ Hinzufügen ▾". Hero card "From Anthropic · Data" (sage green background, illustration, "Hinzufügen"). "Für dich" grid of 2 columns: icon, name, 2-line description, author · install count, "Ausprobieren" button and +. Then "Neue Skills" with "Alle anzeigen →". |

## 10. Chat view

- **Header:** chat title with ▾ (title menu), a tasks/artifact icon, a list icon, and "Teilen" (Share).
- **Title menu:** Anpinnen `P` · Umbenennen `R` · Sitzung teilen · — · Archivieren `A` · Löschen (red).
- **Share popover ("Sitzung teilen"):** "Nur die bisherigen Nachrichten werden geteilt" (only messages so far are shared); "Personen per E-Mail hinzufügen" field + "Einladen"; "Wer hat Zugriff": "Nur eingeladene Personen ›"; owner row (avatar, name "(du)", email, "Besitzer"); warning about personal information with a link "Nutzungsrichtlinien"; footer gear icon + black "Link kopieren". It was opened only; nothing was shared.
- **Assistant message:** serif reply font (`--font-claude-response: var(--font-serif)`), user messages sans. The action row under each reply has 5 icons: copy, read aloud, thumbs up, thumbs down, retry. Reveal-in 120 ms, out 60 ms (`--cds-message-actions-reveal-*-duration`).
- **Composer in chat:** + menu without "Geräte" and "Gedächtnis"; the usage banner sits directly above the composer.

## 11. Recording

A 50-frame GIF of the walk-through (8.8 MB, 1568 × 771) was saved to `~/Downloads/claude-ai-flows.gif`. It shows the account email and chat titles, so it is **not** copied into this repo.
