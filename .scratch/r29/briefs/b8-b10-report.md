# B8 and B10 — the agent's report (merged d64f5262)

## B8, the Player
- Modes: Listen · Sight-read (wait) · Practice (Left · Both · Right, Hear the other hand) · Interpret (follow:
  moves on each matched onset, tempo from the last two beats, 40–200 %). `?mode=`, replacing. Transport
  Restart ‹ ▶ › click; Loop, Tempo, Modes on a labelled foot bar. HandsButton/HandsIcon deleted.
- Version: `?version=original|simple|easy` (was `?simple=`), `?app=true` the app's song over the learner's;
  `easyChart` keeps the tune, plays each chord's root. Tools row's Version opens "Choose your version".
- Tools sheet before ⚙; Display holds the count-in and the cursor.
- Feedback (`feedbackOf`: right, wrong, missed, early, late; heads coloured by engraving ids, summary card);
  Recorder (takes in the Player, My recordings); Tuner (YIN on a microphone port, A4 415–466); Annotations
  (pt-pieces v10, MEI marks, Show annotations in Display, pt-settings v22); Rhythm game switch.
- Coach line, progress line, Voice commands (Web Speech, en + ru).

## B10
- `entities/settings/model/bars.ts`: catalog and limits (Select 1–4, a swipe side 0–2, the Player's bar
  4–5) in `pt-settings.bars` (v23). One tile editor (`widgets/bar-editor`) on General › Select toolbar,
  General › Swipe actions, the Player's Settings › Tool bar; the rest under More.

## Rulings (cost if wrong)
- Hands apply only in Practice; Listen plays both (bring back one-hand Listen).
- No "Change version" pill on the score: the tools row's Version is the one way (add a pill).
- Print and Metronome moved from Settings to Tools (one row back).
- Display has no Piano keys or Show fingerings switch: the bar and view chips set them.
- Tuner A4 for the visit only; its saved home with B11.
- A typed fingering shows only while Show fingerings is on.
- At the merge: an act a built-in folder never allows (B4) is in neither the Select bar nor More.

## Left
- The Rhythm game does not hide the heads' pitch yet.
- Lesson swipes (widgets/curriculum was off-limits).
- No Takes tab (takes have no Select mode).
- The editor toolbar has two tools: nothing to arrange yet.
- Phone on its side: Transpose and Version sit tight.
