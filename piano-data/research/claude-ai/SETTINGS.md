# claude.ai: every settings page and control

Read live from the settings dialog on 2026-11-20 (German UI). For each control: label, kind, value seen on this account. The account's personal data is left out and replaced by `<…>`. All values are **exact** (DOM `role`, `aria-checked` and visible text).

Kinds: **switch** (on/off), **select** (combobox dropdown), **button**, **link**, **text** (input/textarea), **segmented** (icon toggle group).

## Allgemein (`#settings/general`)

**Darstellung (Appearance)**
| Control | Kind | Value | Description shown |
|---|---|---|---|
| Design | segmented (3 icons: system / light / dark) | — | |
| Schriftart der Oberfläche (UI font) | select | Standard · Anthropic Sans | "Schriftart für die gesamte Oberfläche — Menüs, Seitenleisten und Panels." CSS also defines OpenDyslexic and Atkinson Hyperlegible Next options (`data-dyslexic-font`, `data-atkinson-font`). |
| Schriftart für Antworten (reply font) | select | Anthropic Serif | |
| Transkriptbreite (transcript width) | select | Schmal (narrow) | "Maximale Breite der Spalten für Transkript und Eingabefeld." |

**Bedienungshilfen (Accessibility)**
| Control | Kind | Value | Description |
|---|---|---|---|
| Bewegung (Motion) | select | System | Reduce motion or follow the system setting. |
| Kontrast | select | System | Increase text/UI contrast or follow the system. Sets `data-cds-contrast="more"`. |
| Pop-ups | select | Automatisch ausblenden (auto-hide) | Toasts stay until closed, or auto-hide after a few seconds. |
| Dynamische Chats (Virtualisierung) | switch | on | Loads and unloads messages in long chats; screen readers can't reach unloaded messages. |

**Aufgaben (Tasks)**
| Bevorzugter Browser | select | Integrierter Browser | Browser Claude uses by default. |

**Stimme (Voice)**
| Sprache | select | Deutsch | |
| Stil | select | Auswählen (none) | |
| Geschwindigkeit | select | Normal | |

**Benachrichtigungen (Notifications)**
| Control | Kind | Value |
|---|---|---|
| Abgeschlossene Antworten (finished replies) | switch | on |
| Geplante Aufgaben | switch | off |
| E-Mails zu geplanten Aufgaben | switch | off |
| Code-Benachrichtigungen | switch | off |
| Code-Berechtigungsanfragen (push when Code needs approval) | switch | off |
| Projekte (per-project choice in project settings) | switch | off |
| Erwähnungen und Antworten (email on @mention/reply in artifacts) | switch | on |
| Kommentare zu deinen Artefakten (inherits previous until changed) | switch | on |
| Mit dir geteilte Artefakte | switch | on |

## Konto (`#settings/account`)

| Section | Controls |
|---|---|
| Profil | Profilbild button (PNG, JPEG or WebP, up to 10 MB; shows initial letter); Vollständiger Name (text); "Wie soll Claude dich nennen?" (text); "Was beschreibt deine Arbeit am besten?" select (value: Ingenieurwesen); "Anweisungen für Claude" textarea (placeholder "z. B. Erklärungen kurz und präzise halten") with links "Richtlinien von Anthropic" and "Mehr erfahren". |
| Konto | "Von allen Geräten abmelden" → button Abmelden; delete text "Um dein Konto zu löschen, kündige zuerst dein Abonnement für Claude Max." with link Abrechnung; button "Konto löschen"; Organisations-ID `<id>` with copy button. |
| Vertrauenswürdige Geräte voraussetzen | switch (off): every new device must be verified before remote control or cloud sessions; may re-prompt about once a day. |
| Lokale Geräte | Table: Name, Plattform, Hinzugefügt am, Zuletzt gesehen; row actions button. |
| Vertrauenswürdige Geräte | Empty state "Keine vertrauenswürdigen Geräte."; "Passkey hinzufügen" button. |
| Aktive Sitzungen | Table: Gerät, Standort, Erstellt, Aktualisiert; the current one tagged "Aktuell"; per-row actions; paginated ("1–10 von 11 angezeigt", "Seite 1 von 2", prev/next). |
| Anmeldungen in Claude in Chrome | Count text and button "Alle beenden". |

## Datenschutz (`#settings/data-privacy-controls`)

| Control | Kind | Value |
|---|---|---|
| Links Datenschutzzentrum, Datenschutzrichtlinie | link | |
| Wie wir deine Daten schützen / Wie wir deine Daten nutzen | expandable buttons | |
| Standortmetadaten (city/region metadata) | switch | off |
| Zur Verbesserung unserer KI-Modelle beitragen (use chats for training) | switch | off |
| Daten exportieren | button | |
| Geteilte Chats / Geteilte Artefakte / Hochgeladene Dateien / Dein Feedback / Gedächtniseinstellungen | each "Verwalten" button | |

## Abrechnung (`#settings/billing`)

Structure only: plan card (plan name, "5× Pro-Nutzung alle 5 Stunden und jede Woche", renewal date, "Plan ändern"); API credit card (linked org, monthly credit, next credit date); Zahlung (text on default and fallback card charging, "Zahlungsmethode hinzufügen", saved cards each with "Aktualisieren"/actions); Nutzungsguthaben (balance, "Nutzungsguthaben kaufen · Bis zu 30% Rabatt"); Automatisches Aufladen ("Aktivieren"); Rechnungen table (Datum, Gesamt, Status, Aktionen = "PDF herunterladen"; "Mehr laden"); Kündigung ("Abo kündigen" → "Kündigen").

## Nutzung (`#settings/usage`)

- **Dein Verbrauch:** plan badge, then a forecast line "Hinweis: Bei diesem Tempo erreichst du dein Limit morgen Abend, bevor es am Mittwoch zurückgesetzt wird." Buttons "Plan upgraden" (black) and "Nutzungsguthaben kaufen".
- **Progress rows:** blue bar plus "NN % verwendet".
  - "Aktuelle Sitzung", which resets at a clock time.
  - "Diese Woche ▾", a dropdown that resets on a weekday and time.
- **Limit wird zurückgesetzt:** a "Fable-Zurücksetzung" card with an expiry date, explanation text and the button "Kostenlos zurücksetzen".
- **Nutzungsguthaben:**
  - Balance, plus a switch (on).
  - "Monatliches Ausgabenlimit" with "Verwalten" (manage).
- **Nutzung in dieser Woche nach Produkt:** a percentage per product (Claude Code, Chats, Cowork, Sonstiges).
- **Footer:**
  - "Zuletzt aktualisiert: gerade eben" with a refresh button.
  - Links "Mehr über Nutzungslimits erfahren" and "Transaktionsverlauf …".

## Funktionen (`#settings/capabilities`)

| Group | Control | Kind | Value |
|---|---|---|---|
| Allgemein | Tool-Zugriffsmodus | select | Tools bereits geladen |
| | Konnektor-Suche | switch | on |
| | Modell wechseln, wenn eine Nachricht markiert wird | switch | on |
| Visuelle Inhalte | Artefakte ("Erforderlich für Codeausführung und Dateierstellung") | switch | on |
| | Visualisierungen im Chat | switch | on |
| Codeausführung und Dateierstellung | Code in der Cloud ausführen | switch | on |
| | Ausgehenden Netzwerkverkehr erlauben (link "Sicherheitsrisiken") | switch | on |
| | Domain-Zulassungsliste | select | Alle Domains |
| Skills | "Skills wurden zu Anpassen verschoben." with link Anpassen | link | |

## Gedächtnis (`#settings/memory`)

| Control | Kind | Value |
|---|---|---|
| Chats durchsuchen und heranziehen | switch | on |
| Gedächtnisgenerierung aus Chats | switch | on |
| Sensible Themen im Gedächtnis | switch | off |
| Gedächtnis von anderen KI-Anbietern importieren | button "Import starten" | |
| Gedächtnis exportieren (.zip of Markdown files) | button "Exportieren" | |

Below: tables "Du" and "Lebensbereiche" with columns Name, Zusammenfassung, Zuletzt aktualisiert, Aktionen (edit, delete). There is also a message box "Nachricht" with a send button for editing memory by chat. The entries themselves are not reproduced.

## Designsysteme (`#settings/design-systems`)

Intro text; "Neues Designsystem" button; search "Designsysteme durchsuchen"; table: Name, Nutzbar von (with info button), Veröffentlicht; each row has an actions button; paginated ("1–2 von 2 angezeigt").

## Rückblick (`#settings/reflect`)

"Zeitraum" select (Letzter Monat); a loading state with the text "Sieht sich deinen letzten Monat an . . . Das sollte nur eine Minute dauern." (three dots appear one after another; keyframes `cardinal-dot-2`/`-3`); button "Rückblick neu generieren".

## Zeit und Fokus (`#settings/time-limits`)

- **Pausenerinnerungen** (break reminders): two selects, "– Stunden: Keine" and "– Minuten: Keine".
- **Ruhezeiten** (quiet hours): 7 day toggle buttons labelled S M D M D F S. Their accessible names are Sonntag through Samstag, so the week starts on Sunday.

## Claude Code (`#settings/claude-code`)

| Group | Control | Kind | Value |
|---|---|---|---|
| Allgemein | Sitzungsstatus klassifizieren | switch | on |
| | Modell wechseln, wenn eine Nachricht markiert wird | switch | on |
| Code-Darstellung | Helles Code-Thema | select | Claude Light |
| | Dunkles Code-Theme | select | Claude Dark |
| | Code-Schriftart | text (Schriftfamilie für Code) | empty |
| | Schriftgröße für Code | select | Standard · 13 px |
| Darstellung | Standard-Transkriptansicht | radio-like (Normal / Denkprozess / Ausführlich) | |
| Pull-Requests | Branch-Präfix | text | claude |
| | Pull-Requests automatisch erstellen | switch | off |
| | Pull-Requests automatisch korrigieren | switch | off |
| Autorisierungstoken | Table: Anwendung, Geltungsbereiche (scopes such as `user:file_upload`, `user:inference`, `user:mcp_servers`, `user:plugins`, `user:profile`, `user:sessions:claude_code`); revoke button per row; 5 per page | | |
| Claude Code (CLI, Desktop, IDE) | "Von Anthropic gespeicherte Sitzungen löschen" → "Löschen…" | button | |
| Cloud-Umgebungen | "Neu"; rows Default (Eingeschränkter Zugriff), Full (Vollzugriff · Setup-Skript), each with actions | | |
| Freigabe-Einstellungen | "Verwalten" | button | |

## Claude in Chrome (`#settings/browser-extension`)

| Control | Kind | Value |
|---|---|---|
| Claude in Chrome aktivieren | switch | on |
| Standard für alle Websites | select | Alle Websites erlauben ("Claude funktioniert überall, außer auf Websites, die du unten sperrst") |
| Blockierte Seiten | list + "Websites hinzufügen" | empty: "Noch keine Websites hinzugefügt." |

## Anpassungen: Skills / Konnektoren / Plugins (`#customize/*/yours`)

The same layout is used inside the dialog and on `/customize`:
- **Header:** segmented tabs Meine / Entdecken, a search field, a filter and a sort button, and a black "+ Hinzufügen ▾" button.
- **Groups:** "Von dir erstellt N" (made by you) and "Von Anthropic & Partnern N".
- **Each row:**
  - Icon, name and a category chip (for example "Dateien & Dokumente", "Design", "Ingenieurwesen", "Lernen").
  - "+N" extra categories.
  - Byline and a one-line description, truncated with an ellipsis.
  - Relative date ("vor 14 Std.", "vorgestern", "24. Sept.").
  - A "Deaktivieren" button (for your own items) and a ⋯ menu.
