# Localisation

Source: `Contents/Resources/<locale>.lproj/Localizable.strings` (UI strings) and `Contents/Resources/theory-names/theory-names.<locale>.tsv` (chord and scale names). All values below are **exact** unless marked.

## 1. How the app localises

| Item | Detail | Status |
|---|---|---|
| UI strings | One file per locale: `Localizable.strings`. No `.stringsdict`, no localised nibs. Code calls `GetString(key)` / `BaseNSViewController.GetLocalizedString(key)`. | **exact** (bundle listing; e.g. `SettingsWindowController` `GetString("dont_play_chords")`) |
| Development region | `CFBundleDevelopmentRegion = en` | **exact** (Info.plist) |
| Theory names | `TheoryNamesLocalization` (PianoCompanion.Engine.OSX) reads `theory-names/theory-names.<locale>.tsv`. Columns: `type` (`chord` or `scale`), `id` (int), `name`. Header row `type\tid\tname` is skipped because `id` is not an int. | **exact** (`TheoryNamesLocalization.Parse`) |
| Locale resolution | `NSUserDefaults["AppleLanguages"][0]`, else `NSLocale.PreferredLanguages[0]`, else `"en"`. Candidates tried: the full tag, then the part before the first `-`. Example: `ru-RU` → `ru-RU`, `ru`. | **exact** (`ResolveLocale`, `LocaleCandidates`) |
| Consequence | `zh-Hant-TW` resolves to `zh.tsv` (simplified), not `zh-Hant.tsv`; `zh-Hant.tsv` is only hit when the language tag is exactly `zh-Hant`. `pt-BR` is hit only for an exact `pt-BR` tag. There is no `en` TSV, so English uses the names compiled into code. | **inferred** from the resolution code |
| Toggle | Theory names are translated only when `Settings.TranslateTheoryNames == true`; otherwise English names from code are shown. | **exact** (`ChordService.GetLocalizedName`) |
| Variant chords | For chord ids ≥ 1200 with no TSV entry (the generated alterations such as 1900 `7sus2`), the name is `localized(id / 100)` + the English suffix after the base English name (e.g. ru `Септаккорд sus2`). | **exact** (`ChordService.GetLocalizedName`) |
| Duplicates | `he.tsv` = `iw.tsv` and `id.tsv` = `in.tsv` (byte-identical; legacy ISO codes). `zh` ≠ `zh-Hant`, `pt` ≠ `pt-BR`. | **exact** (`cmp`) |

## 2. Locales and key counts

| Locale (.lproj) | Keys in Localizable.strings | theory-names TSV |
|---|---|---|
| ar | 1443 | theory-names.ar.tsv |
| bg | 1415 | theory-names.bg.tsv |
| ca | 1420 | theory-names.ca.tsv |
| cs | 1428 | theory-names.cs.tsv |
| da | 1415 | theory-names.da.tsv |
| de | 1430 | theory-names.de.tsv |
| el | 1415 | theory-names.el.tsv |
| en | 1423 | none (English from code) |
| en-AU | 397 | none (English from code) |
| en-GB | 397 | none (English from code) |
| es | 1435 | theory-names.es.tsv |
| et | 1415 | theory-names.et.tsv |
| fi | 1415 | theory-names.fi.tsv |
| fr | 1436 | theory-names.fr.tsv |
| he | 1422 | theory-names.he.tsv |
| hi | 1426 | theory-names.hi.tsv |
| hr | 1422 | theory-names.hr.tsv |
| hu | 1415 | theory-names.hu.tsv |
| id | 1409 | theory-names.id.tsv |
| it | 1420 | theory-names.it.tsv |
| ja | 1425 | theory-names.ja.tsv |
| ko | 1424 | theory-names.ko.tsv |
| lt | 1427 | theory-names.lt.tsv |
| lv | 1422 | theory-names.lv.tsv |
| ms | 1409 | theory-names.ms.tsv |
| nl | 1415 | theory-names.nl.tsv |
| no | 1415 | theory-names.no.tsv |
| pl | 1429 | theory-names.pl.tsv |
| pt-BR | 1420 | theory-names.pt-BR.tsv |
| pt-PT | 1420 | via `pt` fallback |
| ro | 1422 | theory-names.ro.tsv |
| ru | 1444 | theory-names.ru.tsv |
| sk | 1428 | theory-names.sk.tsv |
| sl | 1429 | theory-names.sl.tsv |
| sr | 1422 | theory-names.sr.tsv |
| sv | 1415 | theory-names.sv.tsv |
| th | 1409 | theory-names.th.tsv |
| tr | 1415 | theory-names.tr.tsv |
| uk | 1429 | theory-names.uk.tsv |
| vi | 1409 | theory-names.vi.tsv |
| zh-Hans | 1409 | via `zh` fallback |
| zh-Hant | 1409 | theory-names.zh-Hant.tsv |

TSV locales (41): ar, bg, ca, cs, da, de, el, es, et, fi, fr, he, hi, hr, hu, id, in, it, iw, ja, ko, lt, lv, ms, nl, no, pl, pt-BR, pt, ro, ru, sk, sl, sr, sv, th, tr, uk, vi, zh-Hant, zh. Each TSV has 51 chord rows and 1027 scale rows (ru counted: 51 + 1027). **exact**

`en-GB` and `en-AU` contain only 397 keys; all others fall back to `en`. 39 of them differ from `en` (British spelling and note-value names such as Crotchet/Quaver). Full list: `data/en_regional_overrides.json`. **exact**

## 3. Russian chord names

All 51 base chords. `shortName` is the symbol stored in `ChordService.GenerateChords`; display symbols depend on `ChordSymbols` and the selected style (see THEORY_ENGINE.md). Uk (Ukrainian) given for comparison.

| id | shortName | English (code) | Russian (ru.tsv) | Ukrainian (uk.tsv) |
|---|---|---|---|---|
| 1 | I | Tonic | Тоника | Тоніка |
| 2 | IV | Sub-Dominant | Субдоминанта | Субдомінанта |
| 3 | V | Dominant | Доминанта | Домінанта |
| 4 | V7 | Dominant 7th | Доминантсептаккорд | Домінантсептакорд |
| 5 | VIm | Tonic | Тоника | Тоніка |
| 6 | IIm | Sub-Dominant | Субдоминанта | Субдомінанта |
| 7 | III | Mediant | Медианта | Медіанта |
| 8 | III7 | Mediant 7th | Медиантсептаккорд | Медіантсептакорд |
| 9 | VII°7 | Leading tone 7th | Септаккорд вводного тона | Септакорд ввідного тону |
| 10 | M | Major | Мажорный | Мажорний |
| 11 | m | Minor | Минорный | Мінорний |
| 12 | ° | Diminished | Уменьшённый | Зменшений |
| 13 | ⁺ | Augmented | Увеличенный | Збільшений |
| 14 | sus2 | Suspended 2nd | Задержание 2 | Затримання 2 |
| 15 | sus4 | Suspended 4th | Задержание 4 | Затримання 4 |
| 16 | ⁻5 | Flat Fifth | Уменьшённая квинта | Зменшена квінта |
| 17 | 6 | Sixth | Секстаккорд | Секстакорд |
| 18 | m6 | Minor 6th | Минорный секстаккорд | Мінорний секстакорд |
| 19 | 7 | Seventh | Септаккорд | Септакорд |
| 20 | m7 | Minor 7th | Минорный септаккорд | Мінорний септакорд |
| 21 | °7 | Diminished 7th | Уменьшённый септаккорд | Зменшений септакорд |
| 22 | M7 | Major 7th | Большой септаккорд | Великий септакорд |
| 23 | m,M7 | Minor, Major 7th | Минорный, большая септима | Мінорний, велика септима |
| 24 | 7/6 | Seven-Six | Септима-секста | Септима-секста |
| 25 | 9 | Ninth | Нонаккорд | Нонакорд |
| 26 | m9 | Minor Ninth | Минорный нонаккорд | Мінорний нонакорд |
| 27 | ⁻9 | Flat Ninth | Пониженная нона | Понижена нона |
| 28 | m⁻9 | Minor, Flat 9th | Минорный, пониженная нона | Мінорний, понижена нона |
| 29 | 9⁺ | Augmented Ninth | Увеличенная нона | Збільшена нона |
| 30 | 9/6 | Nine-Six | Нона-секста | Нона-секста |
| 31 | m9/6 | Minor Nine-Six | Минорная нона-секста | Мінорна нона-секста |
| 32 | 11 | Eleventh | Ундецимаккорд | Ундецимакорд |
| 33 | m11 | Minor Eleventh | Минорный ундецимаккорд | Мінорний ундецимакорд |
| 34 | 11⁺ | Augmented 11th | Увеличенная ундецима | Збільшена ундецима |
| 35 | m11⁺ | Minor Augm. 11th | Минорный, увеличенная ундецима | Мінорний, збільшена ундецима |
| 36 | 13 | Thirteenth | Терцдецимаккорд | Терцдецимакорд |
| 37 | m13 | Minor Thirteenth | Минорный терцдецимаккорд | Мінорний терцдецимакорд |
| 38 | 13#11 | 13th Augm. 11th | Терцдецима, увеличенная ундецима | Терцдецима, збільшена ундецима |
| 39 | m13#11 | Min. 13th Augm. 11th | Минорная терцдецима, увеличенная ундецима | Мінорна терцдецима, збільшена ундецима |
| 100 | 5 | Fifth | Квинтаккорд | Квінтакорд |
| 101 | M9 | Major Ninth | Большой нонаккорд | Великий нонакорд |
| 102 | M11 | Major 11th | Большой ундецимаккорд | Великий ундецимакорд |
| 103 | M13 | Major 13th | Большой терцдецимаккорд | Великий терцдецимакорд |
| 104 | add9 | Added 9th | Добавленная нона | Додана нона |
| 105 | madd9 | Minor Added 9th | Минорный, добавленная нона | Мінорний, додана нона |
| 106 | add11 | Added 11th | Добавленная ундецима | Додана ундецима |
| 107 | madd11 | Minor Added 11th | Минорный, добавленная ундецима | Мінорний, додана ундецима |
| 108 | add13 | Added 13th | Добавленная терцдецима | Додана терцдецима |
| 109 | madd13 | Minor Added 13th | Минорный, добавленная терцдецима | Мінорний, додана терцдецима |
| 110 | 11sus | 11th Suspended, 9sus4 | Задержанная ундецима, 9sus4 | Затримана ундецима, 9sus4 |
| 111 | 11sus#13 | 11th Suspended, Sharp 13th | Задержанная ундецима, повышенная терцдецима | Затримана ундецима, підвищена терцдецима |

### Russian names of generated variant chords (derived, not in TSV)

| id | base | shortName | English | Russian as displayed |
|---|---|---|---|---|
| 1900 | 19 | 7sus2 | Seventh sus2 | Септаккорд sus2 |
| 1901 | 19 | 7sus4 | Seventh sus4 | Септаккорд sus4 |
| 1902 | 19 | 7⁻5 | Seventh ⁻5 | Септаккорд ⁻5 |
| 1903 | 19 | 7⁺5 | Seventh ⁺5 | Септаккорд ⁺5 |
| 2000 | 20 | m7⁻5 | Minor 7th ⁻5, ø | Минорный септаккорд ⁻5, ø |
| 2001 | 20 | m7⁺5 | Minor 7th ⁺5 | Минорный септаккорд ⁺5 |
| 2200 | 22 | M7sus2 | Major 7th sus2 | Большой септаккорд sus2 |
| 2201 | 22 | M7sus4 | Major 7th sus4 | Большой септаккорд sus4 |
| 2202 | 22 | M7⁻5 | Major 7th ⁻5 | Большой септаккорд ⁻5 |
| 2203 | 22 | M7⁺5 | Major 7th ⁺5 | Большой септаккорд ⁺5 |
| 2300 | 23 | m,M7⁻5 | Minor, Major 7th ⁻5 | Минорный, большая септима ⁻5 |
| 2301 | 23 | m,M7⁺5 | Minor, Major 7th ⁺5 | Минорный, большая септима ⁺5 |
| 2500 | 25 | 9sus4 | Ninth sus4 | Нонаккорд sus4 |
| 2501 | 25 | 9⁻5 | Ninth ⁻5 | Нонаккорд ⁻5 |
| 2502 | 25 | 9⁺5 | Ninth ⁺5 | Нонаккорд ⁺5 |
| 2503 | 25 | 97 | Ninth 7 | Нонаккорд 7 |
| 2600 | 26 | m9⁻5 | Minor Ninth ⁻5 | Минорный нонаккорд ⁻5 |
| 2601 | 26 | m9⁺5 | Minor Ninth ⁺5 | Минорный нонаккорд ⁺5 |
| 2602 | 26 | m97 | Minor Ninth 7 | Минорный нонаккорд 7 |
| 2700 | 27 | ⁻9sus4 | Flat Ninth sus4 | Пониженная нона sus4 |
| 2701 | 27 | ⁻9⁻5 | Flat Ninth ⁻5 | Пониженная нона ⁻5 |
| 2702 | 27 | ⁻9⁺5 | Flat Ninth ⁺5 | Пониженная нона ⁺5 |
| 2703 | 27 | ⁻97 | Flat Ninth 7 | Пониженная нона 7 |
| 2800 | 28 | m⁻9⁻5 | Minor, Flat 9th ⁻5 | Минорный, пониженная нона ⁻5 |
| 2801 | 28 | m⁻9⁺5 | Minor, Flat 9th ⁺5 | Минорный, пониженная нона ⁺5 |
| 2802 | 28 | m⁻97 | Minor, Flat 9th 7 | Минорный, пониженная нона 7 |
| 2900 | 29 | 9⁺sus4 | Augmented Ninth sus4 | Увеличенная нона sus4 |
| 2901 | 29 | 9⁺⁻5 | Augmented Ninth ⁻5 | Увеличенная нона ⁻5 |
| 2902 | 29 | 9⁺⁺5 | Augmented Ninth ⁺5 | Увеличенная нона ⁺5 |
| 2903 | 29 | 9⁺7 | Augmented Ninth 7 | Увеличенная нона 7 |
| 3200 | 32 | 11⁻5 | Eleventh ⁻5 | Ундецимаккорд ⁻5 |
| 3201 | 32 | 11⁺5 | Eleventh ⁺5 | Ундецимаккорд ⁺5 |
| 3202 | 32 | 117 | Eleventh 7 | Ундецимаккорд 7 |
| 3203 | 32 | 11⁻9 | Eleventh ⁻9 | Ундецимаккорд ⁻9 |
| 3204 | 32 | 11⁺9 | Eleventh ⁺9 | Ундецимаккорд ⁺9 |
| 3300 | 33 | m11⁻5 | Minor Eleventh ⁻5 | Минорный ундецимаккорд ⁻5 |
| 3301 | 33 | m11⁺5 | Minor Eleventh ⁺5 | Минорный ундецимаккорд ⁺5 |
| 3302 | 33 | m117 | Minor Eleventh 7 | Минорный ундецимаккорд 7 |
| 3303 | 33 | m11⁻9 | Minor Eleventh ⁻9 | Минорный ундецимаккорд ⁻9 |
| 3400 | 34 | 11⁺⁺5 | Augmented 11th ⁺5 | Увеличенная ундецима ⁺5 |
| 3401 | 34 | 11⁺7 | Augmented 11th 7 | Увеличенная ундецима 7 |
| 3402 | 34 | 11⁺⁻9 | Augmented 11th ⁻9 | Увеличенная ундецима ⁻9 |
| 3403 | 34 | 11⁺⁺9 | Augmented 11th ⁺9 | Увеличенная ундецима ⁺9 |
| 3500 | 35 | m11⁺⁺5 | Minor Augm. 11th ⁺5 | Минорный, увеличенная ундецима ⁺5 |
| 3501 | 35 | m11⁺7 | Minor Augm. 11th 7 | Минорный, увеличенная ундецима 7 |
| 3502 | 35 | m11⁺⁻9 | Minor Augm. 11th ⁻9 | Минорный, увеличенная ундецима ⁻9 |
| 3600 | 36 | 13⁻5 | Thirteenth ⁻5 | Терцдецимаккорд ⁻5 |
| 3601 | 36 | 13⁺5 | Thirteenth ⁺5 | Терцдецимаккорд ⁺5 |
| 3602 | 36 | 137 | Thirteenth 7 | Терцдецимаккорд 7 |
| 3603 | 36 | 13⁻9 | Thirteenth ⁻9 | Терцдецимаккорд ⁻9 |
| 3604 | 36 | 13⁺9 | Thirteenth ⁺9 | Терцдецимаккорд ⁺9 |
| 3700 | 37 | m13⁻5 | Minor Thirteenth ⁻5 | Минорный терцдецимаккорд ⁻5 |
| 3701 | 37 | m13⁺5 | Minor Thirteenth ⁺5 | Минорный терцдецимаккорд ⁺5 |
| 3702 | 37 | m137 | Minor Thirteenth 7 | Минорный терцдецимаккорд 7 |
| 3703 | 37 | m13⁻9 | Minor Thirteenth ⁻9 | Минорный терцдецимаккорд ⁻9 |
| 3800 | 38 | 13#11⁺5 | 13th Augm. 11th ⁺5 | Терцдецима, увеличенная ундецима ⁺5 |
| 3801 | 38 | 13#117 | 13th Augm. 11th 7 | Терцдецима, увеличенная ундецима 7 |
| 3802 | 38 | 13#11⁻9 | 13th Augm. 11th ⁻9 | Терцдецима, увеличенная ундецима ⁻9 |
| 3803 | 38 | 13#11⁺9 | 13th Augm. 11th ⁺9 | Терцдецима, увеличенная ундецима ⁺9 |
| 3900 | 39 | m13#11⁻5 | Min. 13th Augm. 11th ⁻5 | Минорная терцдецима, увеличенная ундецима ⁻5 |
| 3901 | 39 | m13#117 | Min. 13th Augm. 11th 7 | Минорная терцдецима, увеличенная ундецима 7 |
| 3902 | 39 | m13#11⁻9 | Min. 13th Augm. 11th ⁻9 | Минорная терцдецима, увеличенная ундецима ⁻9 |

## 4. Russian scale names

All 1027 scales. English names from `ScaleService` (`list.Add(new Scale(id, "Name", ...))`). **exact**

| id | English | Russian |
|---|---|---|
| 1 | Acoustic | Акустическая |
| 2 | Adonai Malakh | Адонай малах |
| 3 | Aeolian | Эолийская |
| 4 | Aeolian Harmonic | Эолийская гармоническая |
| 5 | Aeolian Major | Эолийская мажорная |
| 6 | Aeolian Pentatonic | Эолийская пентатоника |
| 7 | Aeolian b1 | Эолийская b1 |
| 8 | Ahava Rabba | Ахава раба |
| 9 | Akebono I | Акэбоно I |
| 10 | Akebono II | Акэбоно II |
| 11 | Algerian | Алжирская |
| 12 | Alhijaz | Аль-хиджаз |
| 13 | Altered Diminished | Альтерированная уменьшённая |
| 14 | Altered Dominant | Альтерированная доминантовая |
| 15 | Altered Lydian | Альтерированная лидийская |
| 16 | Altered Mixolydian I | Альтерированная миксолидийская I |
| 17 | Altered Mixolydian II | Альтерированная миксолидийская II |
| 18 | Altered Pentatonic | Альтерированная пентатоника |
| 19 | Ambassel | Амбассель |
| 20 | Ancient Chinese | Древнекитайская |
| 21 | Anhemitonic Hexatonic | Ангемитонная гексатоника |
| 22 | Arabic | Арабская |
| 23 | Ararai | Арарай |
| 24 | Arezzo Major Diatonic Hexachord | Ареццкий мажорный диатонический гексахорд |
| 25 | Asawari Thaat | Асавари тхат |
| 26 | Augmented Hexatonic | Увеличенная гексатоника |
| 27 | Auxiliary Diminished | Вспомогательная уменьшённая |
| 28 | Bacovia | Баковия |
| 29 | Balinese Pelog | Балийский пелог |
| 30 | Banshikicho | Бансикитё |
| 31 | Bartok | Барток |
| 32 | Bati | Бати |
| 33 | Bebop Dominant | Бибоп доминантовая |
| 34 | Bebop Half-Diminished | Бибоп полууменьшённая |
| 35 | Bebop Major I | Бибоп мажорная I |
| 36 | Bebop Major II | Бибоп мажорная II |
| 37 | Bebop Minor | Бибоп минорная |
| 38 | Bhairavi Thaat | Бхайрави тхат |
| 39 | Bhairav Thaat | Бхайрав тхат |
| 40 | Bhairubahar Thaat | Бхайрубахар тхат |
| 41 | Bilawal Thaat | Билавал тхат |
| 42 | Bi Yu | Би юй |
| 43 | Black Key Pentatonic | Пентатоника чёрных клавиш |
| 44 | Blues Nine-Note | Блюзовая девятиступенная |
| 45 | Blues Enneatonic | Блюзовая эннеатоника |
| 46 | Blues Heptatonic | Блюзовая гептатоника |
| 47 | Blues Hexatonic | Блюзовая гексатоника |
| 48 | Blues Pentatonic | Блюзовая пентатоника |
| 49 | Blues I | Блюзовая I |
| 50 | Blues Major ▲ | Блюзовая мажорная ▲ |
| 51 | Blues Major ▼ | Блюзовая мажорная ▼ |
| 52 | Blues Minor ▲ | Блюзовая минорная ▲ |
| 53 | Blues Minor ▼ | Блюзовая минорная ▼ |
| 54 | Blues Nonatonic | Блюзовая нонатоника |
| 55 | Blues III | Блюзовая III |
| 56 | Blues IV | Блюзовая IV |
| 57 | Blues V | Блюзовая V |
| 58 | Blues VI | Блюзовая VI |
| 59 | Bluesy R and R | Блюзовая R and R |
| 60 | Byzantine Liturgical Chromatic | Византийская литургическая хроматическая |
| 61 | Byzantine | Византийская |
| 62 | Chad Gadyo | Хад гадья |
| 63 | Chiao | Цзяо |
| 64 | Chaio Two | Цзяо два |
| 65 | Chin | Цинь |
| 66 | Chinese | Китайская |
| 67 | Ching | Цин |
| 68 | Chromatic (harmonic) ▲ | Хроматическая (гармоническая) ▲ |
| 69 | Chromatic (harmonic) ▼ | Хроматическая (гармоническая) ▼ |
| 70 | Chromatic (melodic) ▲ | Хроматическая (мелодическая) ▲ |
| 71 | Chromatic (melodic) ▼ | Хроматическая (мелодическая) ▼ |
| 72 | Chromatic and Diatonic Dorian mixed | Хроматическая и диатоническая дорийская смешанная |
| 73 | Chromatic and Permuted Diatonic Dorian mixed | Хроматическая и переставленная диатоническая дорийская смешанная |
| 74 | Chromatic Dorian | Хроматическая дорийская |
| 75 | Chromatic Hypodorian | Хроматическая гиподорийская |
| 76 | Chromatic Hypodorian Inverse | Хроматическая гиподорийская обращённая |
| 77 | Chromatic Hypolydian | Хроматическая гиполидийская |
| 78 | Chromatic Hypolydian Inverse | Хроматическая гиполидийская обращённая |
| 79 | Chromatic Hypophrygian | Хроматическая гипофригийская |
| 80 | Chromatic Hypophrygian Inverse | Хроматическая гипофригийская обращённая |
| 81 | Chromatic Lydian | Хроматическая лидийская |
| 82 | Chromatic Lydian Inverse | Хроматическая лидийская обращённая |
| 83 | Chromatic Mixolydian | Хроматическая миксолидийская |
| 84 | Chromatic Mixolydian Inverse | Хроматическая миксолидийская обращённая |
| 85 | Chromatic Phrygian | Хроматическая фригийская |
| 86 | Chromatic Phrygian Inverse | Хроматическая фригийская обращённая |
| 87 | Cushak | Кушак |
| 88 | Dastgah Mahur | Дастгах махур |
| 89 | Dastgah Rast Panjgah | Дастгах раст панджгях |
| 90 | Deuterus authenticus | Deuterus authenticus |
| 91 | Deuterus plagis | Deuterus plagis |
| 92 | Diatonic major | Диатоническая мажорная |
| 93 | Diatonic minor | Диатоническая минорная |
| 94 | Diminished | Уменьшённая |
| 95 | Diminished Blues | Уменьшённая блюзовая |
| 96 | Diminished b9 | Уменьшённая b9 |
| 97 | Diminished Locrian | Уменьшённая локрийская |
| 98 | Diminished Whole-tone I | Уменьшённая целотоновая I |
| 99 | Diminished Whole-tone II | Уменьшённая целотоновая II |
| 100 | Dominant 7th | Доминантсептима |
| 101 | Dominant Bebop | Доминантовая бибоп |
| 102 | Dominant Diminished | Доминантовая уменьшённая |
| 103 | Dorian/Aeolian mixed | Дорийская/эолийская смешанная |
| 104 | Dorian Bebop | Дорийская бибоп |
| 105 | Dorian b2 | Дорийская b2 |
| 106 | Dorian b2 b5 | Дорийская b2 b5 |
| 107 | Dorian b5 | Дорийская b5 |
| 108 | Dorian b9 | Дорийская b9 |
| 109 | Dorian Greek | Дорийская греческая |
| 110 | Dorian | Дорийская |
| 111 | Dorian Minor | Дорийская минорная |
| 112 | Dorian Pentatonic | Дорийская пентатоника |
| 113 | Dorian #4 | Дорийская #4 |
| 114 | Dorian #11 | Дорийская #11 |
| 115 | Dorico Flamenco | Dorico Flamenco |
| 116 | Double Harmonic Major | Дважды гармоническая мажорная |
| 117 | Double Harmonic Minor | Дважды гармоническая минорная |
| 118 | Double-Phrygian Hexatonic | Дважды фригийская гексатоника |
| 119 | Egyptian | Египетская |
| 120 | Eight-Note Chinese | Восьмиступенная китайская |
| 121 | Eight-Note Diminished | Восьмиступенная уменьшённая |
| 122 | Eight-Note Spanish | Восьмиступенная испанская |
| 123 | Enigmatic | Загадочная |
| 124 | Ethiopian | Эфиопская |
| 125 | Eskimo Heptatonic | Эскимосская гептатоника |
| 126 | Eskimo Hexatonic 1 | Эскимосская гексатоника 1 |
| 127 | Eskimo Hexatonic 2 (Alaska : Point Hope) | Эскимосская гексатоника 2 (Аляска : Пойнт-Хоуп) |
| 128 | Eskimo tetratonic (Alaska : Bethel) | Эскимосская тетратоника (Аляска : Бетел) |
| 129 | Esplá's | Эспла |
| 130 | Ezel | Эзель |
| 131 | Fifth Mode | Пятый лад |
| 132 | Five-Note Prometheus | Пятиступенный Прометей |
| 133 | Four Semitone I | Четыре полутона I |
| 134 | Four Semitone II | Четыре полутона II |
| 135 | Freygish | Фрейгиш |
| 136 | Full Minor | Полная минорная |
| 137 | Geez | Гыыз |
| 138 | Genus chromaticum | Genus chromaticum |
| 139 | Genus diatonicum | Genus diatonicum |
| 140 | Genus diatonicum veterum correctum | Genus diatonicum veterum correctum |
| 141 | Genus primum | Genus primum |
| 142 | Genus secundum | Genus secundum |
| 143 | Genus tertium | Genus tertium |
| 144 | Ghana Heptatonic | Ганская гептатоника |
| 145 | Ghana Pentatonic I | Ганская пентатоника I |
| 146 | Ghana Pentatonic II | Ганская пентатоника II |
| 147 | Gnossiennes (Satie) | Gnossiennes (Satie) |
| 148 | Gong | Гун |
| 149 | Gregorian no.1 | Григорианская no.1 |
| 150 | Gregorian no.2 | Григорианская no.2 |
| 151 | Gregorian no.3 | Григорианская no.3 |
| 152 | Gregorian no.4 | Григорианская no.4 |
| 153 | Gregorian no.5 | Григорианская no.5 |
| 154 | Gregorian no.6 | Григорианская no.6 |
| 155 | Gregorian no.7 | Григорианская no.7 |
| 156 | Gregorian no.8 | Григорианская no.8 |
| 157 | Gypsy Hexatonic | Цыганская гексатоника |
| 158 | Gypsy I | Цыганская I |
| 159 | Gypsy II | Цыганская II |
| 160 | Gu | Гу |
| 161 | Gu Xian | Гу сянь |
| 162 | Half-Diminished | Полууменьшённая |
| 163 | Half-Diminished Bebop | Полууменьшённая бибоп |
| 164 | Half-Whole step | Полутон-целый тон (шаг) |
| 165 | Half-Whole tone | Полутон-целый тон |
| 166 | Han-Iwato | Хан-ивато |
| 167 | Han-kumoi | Хан-кумои |
| 168 | Hard Pentatonic | Жёсткая пентатоника |
| 169 | Harmonic and Neapolitan Minor mixed | Гармоническая и неаполитанская минорная смешанная |
| 170 | Harmonic Major | Гармоническая мажорная |
| 171 | Harmonic Major | Гармоническая мажорная |
| 172 | Harmonic Minor | Гармоническая минорная |
| 173 | Hawaiian | Гавайская |
| 174 | Hawaiian 2 | Гавайская 2 |
| 175 | Heptonia seconda | Heptonia seconda |
| 176 | Hindu | Индуистская |
| 177 | Hira-joshi | Хира-дзёси |
| 178 | Hijaz | Хиджаз |
| 179 | Hijaz Major | Хиджаз мажорная |
| 180 | Hijazskiar major | Хиджазкяр мажорная |
| 181 | Honchoshi | Хонтёси |
| 182 | Honchoshi plagal form | Хонтёси, плагальная форма |
| 183 | Honchoshi 2 | Хонтёси 2 |
| 184 | Hon-kumoi-joshi | Хон-кумои-дзёси |
| 185 | Houseini | Хусейни |
| 186 | Houzam I Major | Хузам I мажорная |
| 187 | Houzam II | Хузам II |
| 188 | Hungarian Major | Венгерская мажорная |
| 189 | Hungarian Minor | Венгерская минорная |
| 190 | Hyojo | Хёдзё |
| 191 | Hyperaeolian | Гиперэолийская |
| 192 | Hyperdorian | Гипердорийская |
| 193 | Hyperphrygian | Гиперфригийская |
| 194 | Hypoaeolian | Гипоэолийская |
| 195 | Hypodorian | Гиподорийская |
| 196 | Hypoionian | Гипоионийская |
| 197 | Hypolocrian | Гиполокрийская |
| 198 | Hypolydian | Гиполидийская |
| 199 | Hypolydian | Гиполидийская |
| 200 | Hypomixolydian | Гипомиксолидийская |
| 201 | Hypophrygian | Гипофригийская |
| 202 | Hypophrygian | Гипофригийская |
| 203 | In | Ин |
| 204 | Insen | Инсэн |
| 205 | Insen 2 | Инсэн 2 |
| 206 | Inverted Augmented | Обращённая увеличенная |
| 207 | Ionian Augmented | Ионийская увеличенная |
| 208 | Ionian Iastian | Ионийская иастийская |
| 209 | Ionian | Ионийская |
| 210 | Ionian Pentatonic | Ионийская пентатоника |
| 211 | Ionian #5 | Ионийская #5 |
| 212 | Ichikotsucho | Итикоцутё |
| 213 | Iwato | Ивато |
| 214 | John Foulds' 'Mantra of Will' | John Foulds' 'Mantra of Will' |
| 215 | Japanese mode | Японский лад |
| 216 | Jazz Minor | Джазовая минорная |
| 217 | Jazz Minor inverse | Джазовая минорная обращённая |
| 218 | Jeths' mode | Лад Йетса |
| 219 | Jewish I | Еврейская I |
| 220 | Jewish II | Еврейская II |
| 221 | Jiao | Цзяо |
| 222 | Jia Zhong | Цзя чжун |
| 223 | Jin Yu | Цзинь юй |
| 224 | Kaffa | Каффа |
| 225 | Kafi Thaat | Кафи тхат |
| 226 | Kalyan Thaat (Yaman) | Кальян тхат (Яман) |
| 227 | Kartzihiar | Карцихиар |
| 228 | Kata-kumoi | Ката-кумои |
| 229 | Khammaj Thaat | Кхаммадж тхат |
| 230 | Kiourdi Minor | Кюрди минорная |
| 231 | Kiourdi ▲ | Кюрди ▲ |
| 232 | Kiourdi ▼ | Кюрди ▼ |
| 233 | Kokin-joshi | Кокин-дзёси |
| 234 | Kubilai's Mongol | Монгольская Хубилая |
| 235 | Kung | Кун |
| 236 | Kung 2 | Кун 2 |
| 237 | Kyemyonjo | Кемёнджо |
| 238 | Leading Whole-tone | Вводная целотоновая |
| 239 | Locrian Diminished | Локрийская уменьшённая |
| 240 | Locrian b4 | Локрийская b4 |
| 241 | Locrian b7 | Локрийская b7 |
| 242 | Locrian bb7 | Локрийская bb7 |
| 243 | Locrian | Локрийская |
| 244 | Locrian Nat. 2 | Локрийская nat. 2 |
| 245 | Locrian Nat. 2/6 | Локрийская nat. 2/6 |
| 246 | Locrian Nat. 2 b7 | Локрийская nat. 2 b7 |
| 247 | Locrian Nat. 6 | Локрийская nat. 6 |
| 248 | Locrian #2 bb7 | Локрийская #2 bb7 |
| 249 | Locrian #2 | Локрийская #2 |
| 250 | Locrian #6 | Локрийская #6 |
| 251 | Locrian #2 #6 | Локрийская #2 #6 |
| 252 | Lydian Augmented | Лидийская увеличенная |
| 253 | Lydian Augmented #2 | Лидийская увеличенная #2 |
| 254 | Lydian Diminished | Лидийская уменьшённая |
| 255 | Lydian Dominant | Лидийская доминантовая |
| 256 | Lydian b3 | Лидийская b3 |
| 257 | Lydian b7 | Лидийская b7 |
| 258 | Lydian (Greek) | Лидийская (греческая) |
| 259 | Lydian Hexatonic | Лидийская гексатоника |
| 260 | Lydian | Лидийская |
| 261 | Lydian Minor b7 | Лидийская минорная b7 |
| 262 | Lydian-Mixolydian | Лидийско-миксолидийская |
| 263 | Lydian/Mixolydian mixed | Лидийская/миксолидийская смешанная |
| 264 | Lydian #2 | Лидийская #2 |
| 265 | Lydian #5 | Лидийская #5 |
| 266 | Lydian #9 | Лидийская #9 |
| 267 | Magen Abot | Маген авот |
| 268 | Major | Мажорная |
| 269 | Major Augmented | Мажорная увеличенная |
| 270 | Major Bebop I | Мажорная бибоп I |
| 271 | Major Bebop II | Мажорная бибоп II |
| 272 | Major Blues ▲ | Мажорная блюзовая ▲ |
| 273 | Major Blues ▼ | Мажорная блюзовая ▼ |
| 274 | Major/Dorian mixed | Мажорная/дорийская смешанная |
| 275 | Major Gipsy | Мажорная цыганская |
| 276 | Major inverse | Мажорная обращённая |
| 277 | Major Locrian mode | Мажорный локрийский лад |
| 278 | Major/Lydian mixed | Мажорная/лидийская смешанная |
| 279 | Major-Minor | Мажоро-минорная |
| 280 | Major/Minor mixed | Мажорная/минорная смешанная |
| 281 | Major/Mixolydian mixed | Мажорная/миксолидийская смешанная |
| 282 | Major Pentatonic | Мажорная пентатоника |
| 283 | Man Gong | Мань гун |
| 284 | Man Jue | Мань цзюэ |
| 285 | Makam Çârgâh | Макам чаргях |
| 286 | Makam Bûselik I | Макам бусалик I |
| 287 | Makam Bûselik II | Макам бусалик II |
| 288 | Makam Hijaz | Макам Хиджаз |
| 289 | Makam Rast | Макам Раст |
| 290 | Maqam Ajam Ashiran | Макам аджам ашуран |
| 291 | Maqam Bayat-e-Esfahan | Макам баят-э-эсфахан |
| 292 | Maqam Hedjaz | Макам хеджаз |
| 293 | Maqam Hicaz | Макам хиджаз |
| 294 | Maqam Hijaz Kar | Макам Хиджаз Кар |
| 295 | Maqam Hisar | Макам Хисар |
| 296 | Maqam Humayun | Макам Хумаюн |
| 297 | Maqam Huzzam | Макам Хуззам |
| 298 | Maqam Karcigar | Макам карджигяр |
| 299 | Maqam Kurd | Макам курд |
| 300 | Maqam Lami | Макам Лами |
| 301 | Maqam Nahawand | Макам Нахаванд |
| 302 | Maqam Nahawand Murassah | Макам Нахаванд Мурассах |
| 303 | Maqam Nakriz | Макам Накриз |
| 304 | Maqam Nawa Athar | Макам нава асар |
| 305 | Maqam Nihavend | Макам нихавенд |
| 306 | Maqam Saba Zamzam | Макам саба замзам |
| 307 | Maqam Shadd'araban | Макам шаддараван |
| 308 | Maqam Shahnaz Kurdi | Макам шахназ курди |
| 309 | Maqam Shawq Awir | Макам Шавк Авир |
| 310 | Maqam Sultani Yakah | Макам султани ягах |
| 311 | Maqam Suzidil | Макам сузидиль |
| 312 | Maqam Tarznauyn | Макам Тарзнауйн |
| 313 | Maqam Uşşâk | Макам ушшак |
| 314 | Maqam Zanjaran | Макам Занджаран |
| 315 | Maqam Zengule | Макам зенгюле |
| 316 | Marwa Thaat | Марва тхат |
| 317 | Mela Bhavapriya | Мела Бхаваприя |
| 318 | Mela Cakravaka | Мела Чакравака |
| 319 | Mela Calanata | Мела Чаланата |
| 320 | Mela Carukesi | Мела Чарукеси |
| 321 | Mela Citrambari | Мела Читрамбари |
| 322 | Mela Dharmavati | Мела Дхармавати |
| 323 | Mela Dhatuvardhani | Мела Дхатувардхани |
| 324 | Mela Dhavalambari | Мела Дхаваламбари |
| 325 | Mela Dhenuka | Мела Дхенука |
| 326 | Mela Divyamani | Мела Дивьямани |
| 327 | Mela Gamanasrama | Мела Гаманасрама |
| 328 | Mela Ganamurti | Мела Ганамурти |
| 329 | Mela Gangeyabhusani | Мела Гангеябхусани |
| 330 | Mela Gaurimanohari | Мела Гауриманохари |
| 331 | Mela Gavambodhi | Мела Гавамбодхи |
| 332 | Mela Gayakapriya | Мела Гаякаприя |
| 333 | Mela Harikambhoji | Мела Харикамбходжи |
| 334 | Mela Hatakambari | Мела Хатакамбари |
| 335 | Mela Hemavati | Мела Хемавати |
| 336 | Mela Jalarnava | Мела Джаларнава |
| 337 | Mela Jhalavarali | Мела Джхалаварали |
| 338 | Mela Jhankaradhvani | Мела Джханкарадхвани |
| 339 | Mela Jyotisvarupini | Мела Джьотисварупини |
| 340 | Mela Kamavardhani | Мела Камавардхани |
| 341 | Mela Kanakangi | Мела Канаканги |
| 342 | Mela Kantamani | Мела Кантамани |
| 343 | Mela Kharaharapriya | Мела Кхарахараприя |
| 344 | Mela Kiravani | Мела Киравани |
| 345 | Mela Kokilapriya | Мела Кокилаприя |
| 346 | Mela Kosalam | Мела Косалам |
| 347 | Mela Latangi | Мела Латанги |
| 348 | Mela Manavati | Мела Манавати |
| 349 | Mela Mararanjani | Мела Мараранджани |
| 350 | Mela Mayamalavagaula | Мела Маямалавагаула |
| 351 | Mela Mecakalyani | Мела Мечакальяни |
| 352 | Mela Naganandini | Мела Наганандини |
| 353 | Mela Namanarayani | Мела Наманараяни |
| 354 | Mela Nasikabhusani | Мела Насикабхусани |
| 355 | Mela Natabhairavi | Мела Натабхайрави |
| 356 | Mela Natakapriya | Мела Натакаприя |
| 357 | Mela Navanitam | Мела Наванитам |
| 358 | Mela Nitimati | Мела Нитимати |
| 359 | Mela Pavani | Мела Павани |
| 360 | Mela Ragavardhani | Мела Рагавардхани |
| 361 | Mela Raghupriya | Мела Рагхуприя |
| 362 | Mela Ramapriya | Мела Рамаприя |
| 363 | Mela Rasikapriya | Мела Расикаприя |
| 364 | Mela Ratnangi | Мела Ратнанги |
| 365 | Mela Risabhapriya | Мела Рисабхаприя |
| 366 | Mela Rupavati | Мела Рупавати |
| 367 | Mela Sadvidhamargini | Мела Садвидхамаргини |
| 368 | Mela Salaga | Мела Салага |
| 369 | Mela Sanmukhapriya | Мела Санмукхаприя |
| 370 | Mela Sarasangi | Мела Сарасанги |
| 371 | Mela Senavati | Мела Сенавати |
| 372 | Mela Shankarabharanam | Мела Шанкарабхаранам |
| 373 | Mela Shubhapantuvarali | Мела Шубхапантуварали |
| 374 | Mela Simhendramadhyama | Мела Симхендрамадхяма |
| 375 | Mela Sucaritra | Мела Сучаритра |
| 376 | Mela Sulini | Мела Сулини |
| 377 | Mela Suryakanta | Мела Сурьяканта |
| 378 | Mela Suvarnangi | Мела Суварнанги |
| 379 | Mela Tanarupi | Мела Танарупи |
| 380 | Mela Vacaspati | Мела Вачаспати |
| 381 | Mela Vagadhisvari | Мела Вагадхисвари |
| 382 | Mela Vakulabharanam | Мела Вакулабхаранам |
| 383 | Mela Vanaspati | Мела Ванаспати |
| 384 | Mela Varunapriya | Мела Варунаприя |
| 385 | Mela Visvambhari | Мела Висвамбхари |
| 386 | Mela Yagapriya | Мела Ягаприя |
| 387 | Melodic Major | Мелодическая мажорная |
| 388 | Melodic Minor ▲ | Мелодическая минорная ▲ |
| 389 | Melodic Minor ▼ | Мелодическая минорная ▼ |
| 390 | Melodic Minor #11 | Мелодическая минорная #11 |
| 391 | Messiaen mode 1 | Лад Мессиана 1 |
| 392 | Messiaen mode 2 | Лад Мессиана 2 |
| 393 | Messiaen mode 2 inverse | Лад Мессиана 2 обращённый |
| 394 | Messiaen mode 3 | Лад Мессиана 3 |
| 395 | Messiaen mode 4 | Лад Мессиана 4 |
| 396 | Messiaen mode 4 inverse | Лад Мессиана 4 обращённый |
| 397 | Messiaen mode 5 | Лад Мессиана 5 |
| 398 | Messiaen mode 6 | Лад Мессиана 6 |
| 399 | Messiaen mode 6 inverse | Лад Мессиана 6 обращённый |
| 400 | Messiaen mode 7 | Лад Мессиана 7 |
| 401 | Messiaen mode 7 inverse | Лад Мессиана 7 обращённый |
| 402 | Messiaen truncated mode 5 | Усечённый лад Мессиана 5 |
| 403 | Messiaen truncated mode 5 inverse | Усечённый лад Мессиана 5 обращённый |
| 404 | Messiaen truncated mode 6 | Усечённый лад Мессиана 6 |
| 405 | Messiaen truncated mode 6 inverse | Усечённый лад Мессиана 6 обращённый |
| 406 | Minor Bebop | Минорная бибоп |
| 407 | Minor Blues ▲ | Минорная блюзовая ▲ |
| 408 | Minor Blues ▼ | Минорная блюзовая ▼ |
| 409 | Minor b5 | Минорная b5 |
| 410 | Minor Gipsy | Минорная цыганская |
| 411 | Minor Gipsy inverse | Минорная цыганская обращённая |
| 412 | Minor Hexatonic | Минорная гексатоника |
| 413 | Minor Locrian | Минорная локрийская |
| 414 | Minor-Major | Миноро-мажорная |
| 415 | Minor Pentatonic | Минорная пентатоника |
| 416 | Minor Pentatonic with leading notes | Минорная пентатоника с вводными тонами |
| 417 | Minyo | Минъё |
| 418 | Mischung 1 | Смесь 1 |
| 419 | Mischung 2 | Смесь 2 |
| 420 | Mischung 3 Mixolydian | Смесь 3 миксолидийская |
| 421 | Mischung 4 | Смесь 4 |
| 422 | Mischung 5 Dorian | Смесь 5 дорийская |
| 423 | Mischung 6 | Смесь 6 |
| 424 | Misheberekh | Мишеберах |
| 425 | Mixolydian Bebop | Миксолидийская бибоп |
| 426 | Mixolydian/Dorian mixed | Миксолидийская/дорийская смешанная |
| 427 | Mixolydian b2 | Миксолидийская b2 |
| 428 | Mixolydian b6 | Миксолидийская b6 |
| 429 | Mixolydian b6 b9 | Миксолидийская b6 b9 |
| 430 | Mixolydian b9 | Миксолидийская b9 |
| 431 | Mixolydian b9 b13 | Миксолидийская b9 b13 |
| 432 | Mixolydian Greek | Миксолидийская греческая |
| 433 | Mixolydian Hexatonic | Миксолидийская гексатоника |
| 434 | Mixolydian | Миксолидийская |
| 435 | Mixolydian Pentatonic | Миксолидийская пентатоника |
| 436 | Mixolydian #1 | Миксолидийская #1 |
| 437 | Mixolydian #4 | Миксолидийская #4 |
| 438 | Miyako-bushi I | Мияко-буси I |
| 439 | Miyako-bushi II | Мияко-буси II |
| 440 | Modes of Major Pentatonic mixed | Лады мажорной пентатоники смешанные |
| 441 | Modified Blues | Изменённая блюзовая |
| 442 | Modus conjunctus | Modus conjunctus |
| 443 | Moorish Phrygian | Мавританская фригийская |
| 444 | Nando-kyemyonjo | Нандо-кемёнджо |
| 445 | Natural Minor | Натуральная минорная |
| 446 | Neapolitan Major | Неаполитанская мажорная |
| 447 | Neapolitan Minor | Неаполитанская минорная |
| 448 | Neveseri | Невесери |
| 449 | Niagari | Ниагари |
| 450 | Niagari 2 | Ниагари 2 |
| 451 | Niaventi Minor | Ниавенти минорная |
| 452 | Nihavend | Нихавенд |
| 453 | Nigriz | Нигриз |
| 454 | Nine-Note Blues | Девятиступенная блюзовая |
| 455 | Nine-Note | Девятиступенная |
| 456 | Nohkan Flute | Флейта нокан |
| 457 | Octatonic (Half-tone, Whole-tone) | Октатоника (полутон, целый тон) |
| 458 | Octatonic (Whole-tone, Half-tone) | Октатоника (целый тон, полутон) |
| 459 | Olympos Enharmonic | Олимпос энармоническая |
| 460 | Oriental | Восточная |
| 461 | Oshikicho : Japan | Осикитё : Япония |
| 462 | Ousak minor | Усак минорная |
| 463 | Overtone | Обертоновая |
| 464 | Peiraiotikos | Пирейотикос |
| 465 | Peiraiotikos Minor | Пирейотикос минорная |
| 466 | Pelog | Пелог |
| 467 | Pentatonic Blues | Пентатоника блюзовая |
| 468 | Pentatonic Major | Пентатоника мажорная |
| 469 | Pentatonic Major b2 | Пентатоника мажорная b2 |
| 470 | Pentatonic Major b2 b5 | Пентатоника мажорная b2 b5 |
| 471 | Pentatonic Major b2 b6 | Пентатоника мажорная b2 b6 |
| 472 | Pentatonic Major b3 | Пентатоника мажорная b3 |
| 473 | Pentatonic Major b3 b6 | Пентатоника мажорная b3 b6 |
| 474 | Pentatonic Major b5 | Пентатоника мажорная b5 |
| 475 | Pentatonic Major b6 | Пентатоника мажорная b6 |
| 476 | Pentatonic Major b9 | Пентатоника мажорная b9 |
| 477 | Pentatonic Major #9 b7 | Пентатоника мажорная #9 b7 |
| 478 | Pentatonic Minor | Пентатоника минорная |
| 479 | Pentatonic Minor added 6 | Пентатоника минорная с добавленной 6 |
| 480 | Pentatonic Minor Major 6 | Пентатоника минорная с большой 6 |
| 481 | Pentatonic Minor 7 b5 | Пентатоника минорная 7 b5 |
| 482 | Pentatonic Whole Tone | Пентатоника целотоновая |
| 483 | Persian | Персидская |
| 484 | Peruvian major | Перуанская мажорная |
| 485 | Peruvian minor | Перуанская минорная |
| 486 | Peruvian Pentatonic 1 | Перуанская пентатоника 1 |
| 487 | Peruvian Pentatonic 2 | Перуанская пентатоника 2 |
| 488 | Peruvian tritonic 1 | Перуанская тритоника 1 |
| 489 | Peruvian tritonic 2 | Перуанская тритоника 2 |
| 490 | Petrushka chord | Аккорд «Петрушка» |
| 491 | Phrygian/Aeolian mixed | Фригийская/эолийская смешанная |
| 492 | Phrygian Dominant | Фригийская доминантовая |
| 493 | Phrygian b4 | Фригийская b4 |
| 494 | Phrygian Greek | Фригийская греческая |
| 495 | Phrygian Hexatonic | Фригийская гексатоника |
| 496 | Phrygian/Locrian mixed | Фригийская/локрийская смешанная |
| 497 | Phrygian Major | Фригийская мажорная |
| 498 | Phrygian | Фригийская |
| 499 | Phrygian-Mixolydian | Фригийско-миксолидийская |
| 500 | Phrygian Pentatonic | Фригийская пентатоника |
| 501 | Phrygian Nat. 6 | Фригийская nat. 6 |
| 502 | Phrygian #6 | Фригийская #6 |
| 503 | Pien chih | Бянь чжи |
| 504 | Pilu Thaat | Пилу тхат |
| 505 | Ping | Пин |
| 506 | Pireotikos | Пиреотикос |
| 507 | Pomeroy | Померой |
| 508 | Primary Pentatonic | Первичная пентатоника |
| 509 | Prokofiev | Прокофьев |
| 510 | Prometheus | Прометей |
| 511 | Prometheus Liszt | Прометей Листа |
| 512 | Prometheus Neapolitan | Прометей неаполитанский |
| 513 | Protus authentus | Protus authentus |
| 514 | Protus plagis | Protus plagis |
| 515 | Pure Minor | Чистая минорная |
| 516 | Purvi Thaat | Пурви тхат |
| 517 | P'yongjo | Пхёнджо |
| 518 | P'yongjo 2 | Пхёнджо 2 |
| 519 | P'yongjo-kyemyonjo | Пхёнджо-кемёнджо |
| 520 | Pyramid Hexatonic | Пирамидальная гексатоника |
| 521 | Qing Shang | Цин шан |
| 522 | Qing Yu | Цин юй |
| 523 | Quan Ming | Цюань мин |
| 524 | Raga Abheri | Рага Абхери |
| 525 | Raga Abhogi | Рага Абхоги |
| 526 | Raga Adana | Рага Адана |
| 527 | Raga Ahira-Lalita | Рага Ахира-Лалита |
| 528 | Raga Ahir Bhairav | Рага Ахир Бхайрав |
| 529 | Raga Ahiri Todi | Рага Ахири Тоди |
| 530 | Raga Airavati | Рага Айравати |
| 531 | Raga Alhaiya Bilaval | Рага Алхайя Билавал |
| 532 | Raga Amarasenapriya | Рага Амарасенаприя |
| 533 | Raga Ambika | Рага Амбика |
| 534 | Raga Amritavarshini | Рага Амритаваршини |
| 535 | Raga Anandabhairavi | Рага Анандабхайрави |
| 536 | Raga Andolika | Рага Андолика |
| 537 | Raga Antara Kaishiaki | Рага Антара Кайшиаки |
| 538 | Raga Arabhi | Рага Арабхи |
| 539 | Raga Arunajualita | Рага Арунаджуалита |
| 540 | Raga Asavari (Asaveri) | Рага Асавари (Асавери) |
| 541 | Raga Audav Tukhari | Рага Аудав Тукхари |
| 542 | Raga Baduhari | Рага Бадухари |
| 543 | Raga Bageshri | Рага Багешри |
| 544 | Raga Bageshri 2 | Рага Багешри 2 |
| 545 | Raga Bahar | Рага Бахар |
| 546 | Raga Bairagi (Baira) | Рага Байраги (Байра) |
| 547 | Raga Barbara | Рага Барбара |
| 548 | Raga Basant | Рага Басант |
| 549 | Raga Bauli | Рага Баули |
| 550 | Raga Bhankar | Рага Бханкар |
| 551 | Raga Bhanumanjari | Рага Бхануманджари |
| 552 | Raga Bhanumati | Рага Бханумати |
| 553 | Raga Bhatiyar | Рага Бхатияр |
| 554 | Raga Bhavani | Рага Бхавани |
| 555 | Raga Bhavani 2 | Рага Бхавани 2 |
| 556 | Raga Bhavani 2 | Рага Бхавани 2 |
| 557 | Raga Bhimpalasi | Рага Бхимпаласи |
| 558 | Raga Bhinna Pancama | Рага Бхинна Панчама |
| 559 | Raga Bhinna Shadja | Рага Бхинна Шадджа |
| 560 | Raga Bhogachayanata | Рага Бхогачаяната |
| 561 | Raga Bhup (Bhopali) | Рага Бхуп (Бхопали) |
| 562 | Raga Bhupalam | Рага Бхупалам |
| 563 | Raga Bhupala Todi | Рага Бхупала Тоди |
| 564 | Raga Bhupeshwari | Рага Бхупешвари |
| 565 | Raga Bhusavati | Рага Бхусавати |
| 566 | Raga Bibhas (bhairava) | Рага Бибхас (бхайрава) |
| 567 | Raga Bibhas (marva) | Рага Бибхас (марва) |
| 568 | Raga Bihag | Рага Бихаг |
| 569 | Raga Bilahari | Рага Билахари |
| 570 | Raga Bilashkhani | Рага Билашкхани |
| 571 | Raga Bilwadala | Рага Билвадала |
| 572 | Raga Bindumalini | Рага Биндумалини |
| 573 | Raga Brindabani Sarang | Рага Бриндабани Саранг |
| 574 | Raga Brindabani Tilang | Рага Бриндабани Тиланг |
| 575 | Raga Budhamanohari | Рага Будхаманохари |
| 576 | Raga Camara | Рага Чамара |
| 577 | Raga Chandrajyoti | Рага Чандраджьоти |
| 578 | Raga Chandrakauns (kafi) | Рага Чандракаунс (кафи) |
| 579 | Raga Chandrakauns (kiravani) | Рага Чандракаунс (киравани) |
| 580 | Raga Chandrakauns (modern) | Рага Чандракаунс (модерн) |
| 581 | Raga Charukeshi | Рага Чарукеши |
| 582 | Raga Chaturangini | Рага Чатурангини |
| 583 | Raga Chaturangini 2 | Рага Чатурангини 2 |
| 584 | Raga Chaya Nat | Рага Чая Нат |
| 585 | Raga Chaya Vati | Рага Чая Вати |
| 586 | Raga Chaya Todi | Рага Чая Тоди |
| 587 | Raga Chinthamani | Рага Чинтхамани |
| 588 | Raga Chinthamani 2 | Рага Чинтхамани 2 |
| 589 | Raga Chitthakarshini | Рага Читтхакаршини |
| 590 | Raga Cudamani | Рага Чудамани |
| 591 | Raga Darbar | Рага Дарбар |
| 592 | Raga Desh | Рага Деш |
| 593 | Raga Deshgaur | Рага Дешгаур |
| 594 | Raga Deshi | Рага Деши |
| 595 | Raga Deshi 2 | Рага Деши 2 |
| 596 | Raga Deshi 3 | Рага Деши 3 |
| 597 | Raga Desh Malhar | Рага Деш Малхар |
| 598 | Raga Desisimharavam | Рага Десисимхаравам |
| 599 | Raga Deskar | Рага Дескар |
| 600 | Raga Desya Todi | Рага Десья Тоди |
| 601 | Raga Devakriya | Рага Девакрия |
| 602 | Raga Devamani | Рага Девамани |
| 603 | Raga Devarangini | Рага Деварангини |
| 604 | Raga Devaranjani 2 (Devaranji) | Рага Деваранджани 2 (Деваранджи) |
| 605 | Raga Devarashtra | Рага Девараштра |
| 606 | Raga Dhani (Suddha Dhanyasi) | Рага Дхани (Суддха Дханьяси) |
| 607 | Raga Dhauta Pancama | Рага Дхаута Панчама |
| 608 | Raga Dhavalangam | Рага Дхавалангам |
| 609 | Raga Dhavalashri | Рага Дхавалашри |
| 610 | Raga Dhipaka | Рага Дхипака |
| 611 | Raga Dhunibinnashadjam | Рага Дхунибиннашадджам |
| 612 | Raga Dipak | Рага Дипак |
| 613 | Raga Dumyaraga | Рага Думьярага |
| 614 | Raga Durga | Рага Дурга |
| 615 | Raga Dvigandharabushini | Рага Двигандхарабушини |
| 616 | Raga Gamakakriya | Рага Гамакакрия |
| 617 | Raga Gamakasamantam | Рага Гамакасамантам |
| 618 | Raga Gambhiranata | Рага Гамбхираната |
| 619 | Raga Ganasamavarali | Рага Ганасамаварали |
| 620 | Raga Ganavaridhi | Рага Ганаваридхи |
| 621 | Raga Gandharavam | Рага Гандхаравам |
| 622 | Raga Gangatarangini | Рага Гангатарангини |
| 623 | Raga Gaud Sarang | Рага Гауд Саранг |
| 624 | Raga Gaula | Рага Гаула |
| 625 | Raga Gauri | Рага Гаури |
| 626 | Raga Gaurikriya | Рага Гаурикрия |
| 627 | Raga Gauri Velavali | Рага Гаури Велавали |
| 628 | Raga Geyahejjajji | Рага Геяхеджджаджджи |
| 629 | Raga Ghandarva | Рага Гхандарва |
| 630 | Raga Ghantana | Рага Гхантана |
| 631 | Raga Girija | Рага Гириджа |
| 632 | Raga Girvani | Рага Гирвани |
| 633 | Raga Gitapriya | Рага Гитаприя |
| 634 | Raga Gopikatilaka | Рага Гопикатилака |
| 635 | Raga Gopikavasantam | Рага Гопикавасантам |
| 636 | Raga Gopriya | Рага Гоприя |
| 637 | Raga Gorakh Kalyan | Рага Горакх Кальян |
| 638 | Raga Gowleeswari | Рага Говлисвари |
| 639 | Raga Guhamanohari | Рага Гухаманохари |
| 640 | Raga Gunakri (Gunakali) | Рага Гунакри (Гунакали) |
| 641 | Raga Gurjari Todi | Рага Гурджари Тоди |
| 642 | Raga Hamir Kalyani | Рага Хамир Кальяни |
| 643 | Raga Hamsadhvani (Hansadhvani) | Рага Хамсадхвани (Хансадхвани) |
| 644 | Raga Hamsagiri | Рага Хамсагири |
| 645 | Raga Hamsalata | Рага Хамсалата |
| 646 | Raga Hamsanada | Рага Хамсанада |
| 647 | Raga Hamsanandi | Рага Хамсананди |
| 648 | Raga Hamsanandi 2 | Рага Хамсананди 2 |
| 649 | Raga Hamsanarayani | Рага Хамсанараяни |
| 650 | Raga Hamsa Vinodini | Рага Хамса Винодини |
| 651 | Raga Hansadhvani (Hamsadhvani) | Рага Хансадхвани (Хамсадхвани) |
| 652 | Raga Harikauns | Рага Харикаунс |
| 653 | Raga Hari Nata | Рага Хари Ната |
| 654 | Raga Harini | Рага Харини |
| 655 | Raga Haripriya | Рага Хариприя |
| 656 | Raga Haripriya 2 | Рага Хариприя 2 |
| 657 | Raga Hejjajji | Рага Хеджджаджджи |
| 658 | Raga Hindol (Sunada Vinodini) | Рага Хиндол (Сунада Винодини) |
| 659 | Raga Hindola | Рага Хиндола |
| 660 | Raga Hindolita | Рага Хиндолита |
| 661 | Raga Indupriya | Рага Индуприя |
| 662 | Raga Jaganmohanam | Рага Джаганмоханам |
| 663 | Raga Jait Kalyan | Рага Джаит Кальян |
| 664 | Raga Janasammodini | Рага Джанасаммодини |
| 665 | Raga Janjhuti | Рага Джанджхути |
| 666 | Raga Jaunpuri | Рага Джаунпури |
| 667 | Raga Jayakauns | Рага Джаякаунс |
| 668 | Raga Jeyasuddhamalavi | Рага Джеясуддхамалави |
| 669 | Raga Jhankara Bhramavi | Рага Джханкара Бхрамави |
| 670 | Raga Jinavali | Рага Джинавали |
| 671 | Raga Jivantika | Рага Дживантика |
| 672 | Raga Jivantini | Рага Дживантини |
| 673 | Raga Jog | Рага Джог |
| 674 | Raga Jogiya | Рага Джогия |
| 675 | Raga Jotismatti | Рага Джотисматти |
| 676 | Raga Jyoti | Рага Джьоти |
| 677 | Raga Kaikavasi | Рага Кайкаваси |
| 678 | Raga Kaishikiranjani (Kaushiranjani) | Рага Кайшикиранджани (Кауширанджани) |
| 679 | Raga Kalagada | Рага Калагада |
| 680 | Raga Kalahamsa | Рага Калахамса |
| 681 | Raga Kalakanthi | Рага Калакантхи |
| 682 | Raga Kalakanthi 2 | Рага Калакантхи 2 |
| 683 | Raga Kalamurti | Рага Каламурти |
| 684 | Raga Kalavati | Рага Калавати |
| 685 | Raga Kalingada | Рага Калингада |
| 686 | Raga Kalyana | Рага Кальяна |
| 687 | Raga Kalyani Keseri | Рага Кальяни Кесери |
| 688 | Raga Kamalamanohari | Рага Камаламанохари |
| 689 | Raga Kamalamanohari 2 | Рага Камаламанохари 2 |
| 690 | Raga Kambhoji | Рага Камбходжи |
| 691 | Raga Kanakambari | Рага Канакамбари |
| 692 | Raga Kannadabangala | Рага Каннадабангала |
| 693 | Raga Kapijingla | Рага Капиджингла |
| 694 | Raga Kashyapi | Рага Кашяпи |
| 695 | Raga Kasiramakriya | Рага Касирамакрия |
| 696 | Raga Kaushikdhvani | Рага Каушикдхвани |
| 697 | Raga Kaushiranjani / Kaishikiranjani | Рага Кауширанджани / Кайшикиранджани |
| 698 | Raga Kedar | Рага Кедар |
| 699 | Raga Kedaram | Рага Кедарам |
| 700 | Raga Keseri | Рага Кесери |
| 701 | Raga Khamaj | Рага Кхамадж |
| 702 | Raga Khamaji Durga | Рага Кхамаджи Дурга |
| 703 | Raga Khamas | Рага Кхамас |
| 704 | Raga Khambhavati | Рага Кхамбхавати |
| 705 | Raga Kiranavali | Рага Киранавали |
| 706 | Raga Kirvani | Рага Кирвани |
| 707 | Raga Kokila | Рага Кокила |
| 708 | Raga Kokilaravam | Рага Кокиларавам |
| 709 | Raga Kokil Pancham | Рага Кокил Панчам |
| 710 | Raga Kshanika | Рага Кшаника |
| 711 | Raga Kumarapriya | Рага Кумараприя |
| 712 | Raga Kumbhini | Рага Кумбхини |
| 713 | Raga Kumud | Рага Кумуд |
| 714 | Raga Kumudki (Kumurdaki) | Рага Кумудки (Кумурдаки) |
| 715 | Raga Kuntala | Рага Кунтала |
| 716 | Raga Kuntalavarali (Kuntvarali) | Рага Кунталаварали (Кунтварали) |
| 717 | Raga Kusumakaram | Рага Кусумакарам |
| 718 | Raga Lalit | Рага Лалит |
| 719 | Raga Lalita | Рага Лалита |
| 720 | Raga Lalita 2 | Рага Лалита 2 |
| 721 | Raga Lalit Bhairav | Рага Лалит Бхайрав |
| 722 | Raga Lasaki | Рага Ласаки |
| 723 | Raga Latantapriya | Рага Латантаприя |
| 724 | Raga Latika | Рага Латика |
| 725 | Raga Lavangi | Рага Лаванги |
| 726 | Raga Madhava Manohari | Рага Мадхава Манохари |
| 727 | Raga Madhmat Sarang | Рага Мадхмат Саранг |
| 728 | Raga Madhukauns (hexatonic) | Рага Мадхукаунс (хексатонич) |
| 729 | Raga Madhukauns (pentatonic) | Рага Мадхукаунс (пентатонич) |
| 730 | Raga Madhuranjani | Рага Мадхуранджани |
| 731 | Raga Madhuri | Рага Мадхури |
| 732 | Raga Madhuvanti | Рага Мадхуванти |
| 733 | Raga Madhyamavati | Рага Мадхямавати |
| 734 | Raga Mahathi | Рага Махатхи |
| 735 | Raga Malahari | Рага Малахари |
| 736 | Raga Malarani (Hamsanada) | Рага Маларани (Хамсанада) |
| 737 | Raga Malashri | Рага Малашри |
| 738 | Raga Malashri 2 | Рага Малашри 2 |
| 739 | Raga Malayamarutam | Рага Малаямарутам |
| 740 | Raga Malgunji | Рага Малгунджи |
| 741 | Raga Malkauns (Malakosh) | Рага Малкаунс (Малакош) |
| 742 | Raga Malini | Рага Малини |
| 743 | Raga Mamata | Рага Мамата |
| 744 | Raga Manaranjani I | Рага Манаранджани I |
| 745 | Raga Manaranjani II | Рага Манаранджани II |
| 746 | Raga Manavi | Рага Манави |
| 747 | Raga Mand | Рага Манд |
| 748 | Raga Mandari | Рага Мандари |
| 749 | Raga Manirangu | Рага Манирангу |
| 750 | Raga Manohari | Рага Манохари |
| 751 | Raga Manoranjani | Рага Маноранджани |
| 752 | Raga Marga Hindola | Рага Марга Хиндола |
| 753 | Raga Matha Kokila (Matkokil) | Рага Матха Кокила (Маткокил) |
| 754 | Raga Megh | Рага Мегх |
| 755 | Raga Megh (Megh Malhar) | Рага Мегх (Мегх Малхар) |
| 756 | Raga Megharanjani | Рага Мегхаранджани |
| 757 | Raga Megharanji | Рага Мегхаранджи |
| 758 | Raga Mian Ki Malhar | Рага Миан Ки Малхар |
| 759 | Raga Mohanam | Рага Моханам |
| 760 | Raga Mohanangi | Рага Мохананги |
| 761 | Raga Mruganandana | Рага Мруганандана |
| 762 | Raga Mukhari | Рага Мукхари |
| 763 | Raga Multani | Рага Мултани |
| 764 | Raga Multani 2 | Рага Мултани 2 |
| 765 | Raga Nabhomani | Рага Набхомани |
| 766 | Raga Nabhomani 2 | Рага Набхомани 2 |
| 767 | Raga Nagabharanam | Рага Нагабхаранам |
| 768 | Raga Nagagandhari | Рага Нагагандхари |
| 769 | Raga Nagasvaravali | Рага Нагасваравали |
| 770 | Raga Nalinakanti | Рага Налинаканти |
| 771 | Raga Nandkauns | Рага Нандкаунс |
| 772 | Raga Narayani | Рага Нараяни |
| 773 | Raga Narmada | Рага Нармада |
| 774 | Raga Nasamani | Рага Насамани |
| 775 | Raga Nata | Рага Ната |
| 776 | Raga Natabharanam | Рага Натабхаранам |
| 777 | Raga Nattaikurinji | Рага Наттайкуринджи |
| 778 | Raga Navamanohari | Рага Наваманохари |
| 779 | Raga Nayaki | Рага Наяки |
| 780 | Raga Nayaki Kanada | Рага Наяки Канада |
| 781 | Raga Neelangi | Рага Ниланги |
| 782 | Raga Neroshta | Рага Нерошта |
| 783 | Raga Nigamagamini | Рага Нигамагамини |
| 784 | Raga Nileshwari | Рага Нилешвари |
| 785 | Raga Nisada | Рага Нисада |
| 786 | Raga Nishadi | Рага Нишади |
| 787 | Raga None | Рага Ноне |
| 788 | Raga Ongkari | Рага Онгкари |
| 789 | Raga Padi | Рага Пади |
| 790 | Raga Pahadi | Рага Пахади |
| 791 | Raga Palasi | Рага Паласи |
| 792 | Raga Pancama | Рага Панчама |
| 793 | Raga Pantuvarali | Рага Пантуварали |
| 794 | Raga Paraj | Рага Парадж |
| 795 | Raga Paraju | Рага Параджу |
| 796 | Raga Partiravam | Рага Партиравам |
| 797 | Raga Patdip | Рага Патдип |
| 798 | Raga Phenadyuti | Рага Пхенадьюти |
| 799 | Raga Phenadyuti 2 | Рага Пхенадьюти 2 |
| 800 | Raga Pilu | Рага Пилу |
| 801 | Raga Pratapa | Рага Пратапа |
| 802 | Raga Priyadharshini | Рага Приядхаршини |
| 803 | Raga Puriya | Рага Пурия |
| 804 | Raga Puriya 2 | Рага Пурия 2 |
| 805 | Raga Puriya Dhanashri | Рага Пурия Дханашри |
| 806 | Raga Puriya Kalyan | Рага Пурия Кальян |
| 807 | Raga Purnalalita | Рага Пурналалита |
| 808 | Raga Purna Pancama | Рага Пурна Панчама |
| 809 | Raga Puruhutika | Рага Пурухутика |
| 810 | Raga Purvaholika | Рага Пурвахолика |
| 811 | Raga Pushpalithika | Рага Пушпалитхика |
| 812 | Raga Putrika | Рага Путрика |
| 813 | Raga Ragamalini | Рага Рагамалини |
| 814 | Raga Rageshri | Рага Рагешри |
| 815 | Raga Rageshri 2 (Rageshwari) | Рага Рагешри 2 (Рагешвари) |
| 816 | Raga Rajeshwari | Рага Раджешвари |
| 817 | Raga Ramamanohari | Рага Рамаманохари |
| 818 | Raga Ramamanohari 2 | Рага Рамаманохари 2 |
| 819 | Raga Ramdasi Malhar | Рага Рамдаси Малхар |
| 820 | Raga Ramkali (Ramakri) | Рага Рамкали (Рамакри) |
| 821 | Raga Ramkali 2 | Рага Рамкали 2 |
| 822 | Raga Rangini | Рага Рангини |
| 823 | Raga Ranjani | Рага Ранджани |
| 824 | Raga Rasamanjari | Рага Расаманджари |
| 825 | Raga Rasamanjari 2 | Рага Расаманджари 2 |
| 826 | Raga Rasavali | Рага Расавали |
| 827 | Raga Rasika Ranjani | Рага Расика Ранджани |
| 828 | Raga Rasranjani | Рага Расранджани |
| 829 | Raga Ratipriya | Рага Ратиприя |
| 830 | Raga Ratnakanthi | Рага Ратнакантхи |
| 831 | Raga Ravikriya | Рага Равикрия |
| 832 | Raga Reva | Рага Рева |
| 833 | Raga Revagupti | Рага Ревагупти |
| 834 | Raga Rudra Pancama | Рага Рудра Панчама |
| 835 | Raga Rukmangi | Рага Рукманги |
| 836 | Raga Sahera | Рага Сахера |
| 837 | Raga Sailadesakshi | Рага Сайладесакши |
| 838 | Raga Salagavarali | Рага Салагаварали |
| 839 | Raga Salanganata | Рага Саланганата |
| 840 | Raga Samanta | Рага Саманта |
| 841 | Raga Samudhra Priya | Рага Самудхра Прия |
| 842 | Raga Sanjh ka Hindol | Рага Санджх ка Хиндол |
| 843 | Raga Sankara (Shankara) | Рага Санкара (Шанкара) |
| 844 | Raga Santanamanjari | Рага Сантанаманджари |
| 845 | Raga Sarasanana | Рага Сарасанана |
| 846 | Raga Sarasvati | Рага Сарасвати |
| 847 | Raga Saravati (Sharavati) | Рага Саравати (Шаравати) |
| 848 | Raga Sarvasri | Рага Сарвасри |
| 849 | Raga Saugandhini | Рага Саугандхини |
| 850 | Raga Saurashtra | Рага Саураштра |
| 851 | Raga Sauviram | Рага Саувирам |
| 852 | Raga Saveri | Рага Савери |
| 853 | Raga Savitri | Рага Савитри |
| 854 | Raga Senagrani | Рага Сенаграни |
| 855 | Raga Shailaja | Рага Шайладжа |
| 856 | Raga Shankarabharanam | Рага Шанкарабхаранам |
| 857 | Raga Shilangi | Рага Шиланги |
| 858 | Raga Shobhavari | Рага Шобхавари |
| 859 | Raga Shri | Рага Шри |
| 860 | Raga Shri Kalyan | Рага Шри Кальян |
| 861 | Raga Shubravarni | Рага Шубраварни |
| 862 | Raga Shuddh Kalyan | Рага Шуддх Кальян |
| 863 | Raga Simharava (Sinharavam) | Рага Симхарава (Синхаравам) |
| 864 | Raga Simhavahini | Рага Симхавахини |
| 865 | Raga Sindhi-Bhairavi | Рага Синдхи-Бхайрави |
| 866 | Raga Sindhura | Рага Синдхура |
| 867 | Raga Sindhu Ramakriya | Рага Синдху Рамакрия |
| 868 | Raga Sindhura Kafi | Рага Синдхура Кафи |
| 869 | Raga Siva Kambhoji | Рага Сива Камбходжи |
| 870 | Raga Sivaranjini (Shivranjani) | Рага Сиваранджини (Шивранджани) |
| 871 | Raga Sohani | Рага Сохани |
| 872 | Raga Sohini | Рага Сохини |
| 873 | Raga Sorati | Рага Сорати |
| 874 | Raga Sowrashtram | Рага Совраштрам |
| 875 | Raga Sriraga | Рага Срирага |
| 876 | Raga Sriranjani | Рага Сриранджани |
| 877 | Raga Srutiranjani | Рага Срутиранджани |
| 878 | Raga Sthavarajam | Рага Стхавараджам |
| 879 | Raga Suddha Bangala | Рага Суддха Бангала |
| 880 | Raga Suddha Dhanyasi (Dhani) | Рага Суддха Дханьяси (Дхани) |
| 881 | Raga Suddha Mukhari | Рага Суддха Мукхари |
| 882 | Raga Suddha Pancama | Рага Суддха Панчама |
| 883 | Raga Suddha Ramakriya | Рага Суддха Рамакрия |
| 884 | Raga Suddha Saveri | Рага Суддха Савери |
| 885 | Raga Suddha Simantini | Рага Суддха Симантини |
| 886 | Raga Suddha Todi | Рага Суддха Тоди |
| 887 | Raga Suha Kanada | Рага Суха Канада |
| 888 | Raga Suha Sughrai | Рага Суха Сугхрай |
| 889 | Raga Sumukam | Рага Сумукам |
| 890 | Raga Suposhini | Рага Супошини |
| 891 | Raga Supradhipam | Рага Супрадхипам |
| 892 | Raga Surati | Рага Сурати |
| 893 | Raga Sur Malhar | Рага Сур Малхар |
| 894 | Raga Surya | Рага Сурья |
| 895 | Raga Sutradhari | Рага Сутрадхари |
| 896 | Raga Syamalam | Рага Сьямалам |
| 897 | Raga Takka | Рага Такка |
| 898 | Raga Tanukirti | Рага Танукирти |
| 899 | Raga Tarangini | Рага Тарангини |
| 900 | Raga Tilang | Рага Тиланг |
| 901 | Raga Tivravahini | Рага Тивравахини |
| 902 | Raga Trimurti | Рага Тримурти |
| 903 | Raga Trishuli | Рага Тришули |
| 904 | Raga Udayaravicandrika | Рага Удаяравичандрика |
| 905 | Raga Udhayaravi Chandrika | Рага Удхаярави Чандрика |
| 906 | Raga Vaijayanti | Рага Вайджаянти |
| 907 | Raga Valaji | Рага Валаджи |
| 908 | Raga Vamsavathi | Рага Вамсаватхи |
| 909 | Raga Varali | Рага Варали |
| 910 | Raga Varamu | Рага Вараму |
| 911 | Raga Varini | Рага Варини |
| 912 | Raga Vasantha | Рага Васантха |
| 913 | Raga Vasantha 2 | Рага Васантха 2 |
| 914 | Raga Vasantha (bhairavi) | Рага Васантха (бхайрави) |
| 915 | Raga Vativasanta (bhairavi) | Рага Вативасанта (бхайрави) |
| 916 | Raga Vegavahini | Рага Вегавахини |
| 917 | Raga Velavali | Рага Велавали |
| 918 | Raga Vibhas (bhairava) | Рага Вибхас (бхайрава) |
| 919 | Raga Vibhas (marva) | Рага Вибхас (марва) |
| 920 | Raga Vibhavari (Revati) | Рага Вибхавари (Ревати) |
| 921 | Raga Vijayanagari | Рага Виджаянагари |
| 922 | Raga Vijayasri | Рага Виджаясри |
| 923 | Raga Vijayavasanta | Рага Виджаявасанта |
| 924 | Raga Vilasini | Рага Виласини |
| 925 | Raga Viravasantham | Рага Виравасантхам |
| 926 | Raga Vivardhini | Рага Вивардхини |
| 927 | Raga Viyogavarali | Рага Виёгаварали |
| 928 | Raga Vutari | Рага Вутари |
| 929 | Raga Yaman Kalyan | Рага Яман Кальян |
| 930 | Raga Yamuna Kalyani | Рага Ямуна Кальяни |
| 931 | Raga Yashranjani | Рага Яшранджани |
| 932 | Raga Zilaf | Рага Зилаф |
| 933 | Raga Zilla | Рага Зилла |
| 934 | Rast | Раст |
| 935 | Rast ▲ | Раст ▲ |
| 936 | Rast ▼ | Раст ▼ |
| 937 | Ravel | Равель |
| 938 | Relative Minor Pentatonic | Параллельная минорная пентатоника |
| 939 | Ritsu | Рицу |
| 940 | Ritsu Gagaku | Рицу гагаку |
| 941 | Ritsusen | Рицусэн |
| 942 | Romanian Major | Румынская мажорная |
| 943 | Romanian Minor | Румынская минорная |
| 944 | Rui Bin | Жуй бинь |
| 945 | Ryo | Рё |
| 946 | Ryosen | Рёсэн |
| 947 | Ryukyu | Рюкю |
| 948 | Sabach minor | Сабах минорная |
| 949 | Sakura | Сакура |
| 950 | Sansagari | Сансагари |
| 951 | Scottish Hexatonic | Шотландская гексатоника |
| 952 | Scottish Pentatonic | Шотландская пентатоника |
| 953 | Scriabin | Скрябин |
| 954 | Se | Сэ |
| 955 | Sengah | Сенгях |
| 956 | Shang | Шан |
| 957 | Shang 2 | Шан 2 |
| 958 | Shostakovich | Шостакович |
| 959 | Souzinak minor | Сузинак минорная |
| 960 | Spanish Gypsy | Испанская цыганская |
| 961 | Spanish Major | Испанская мажорная |
| 962 | Spanish Mode | Испанский лад |
| 963 | Spanish Phrygian I | Испанская фригийская I |
| 964 | Spanish Phrygian II | Испанская фригийская II |
| 965 | Spanish Phrygian III | Испанская фригийская III |
| 966 | Super Locrian | Супралокрийская |
| 967 | Super Locrian diminished | Супралокрийская уменьшённая |
| 968 | Suspended Pentatonic | Задержанная пентатоника |
| 969 | Symmetrical Diminished | Симметричная уменьшённая |
| 970 | Symmetrical Decatonic | Симметричная декатоника |
| 971 | Synthetic Mixture #5 | Синтетическая смесь #5 |
| 972 | Syrian pentatonic | Сирийская пентатоника |
| 973 | Tabahaniotiko | Табаханиотико |
| 974 | Taishikicho | Тайсикитё |
| 975 | Takemitsu Tree Line mode 1 | Лад Такэмицу Tree Line 1 |
| 976 | Takemitsu Tree Line mode 2 | Лад Такэмицу Tree Line 2 |
| 977 | Tcherepnin Nine-Note Mode I | Девятиступенный лад Черепнина I |
| 978 | Tcherepnin Major Pentatonic Mode I | Мажорная пентатоника Черепнина, лад I |
| 979 | Tcherepnin Major Pentatonic Mode II | Мажорная пентатоника Черепнина, лад II |
| 980 | Tcherepnin Major Pentatonic Mode III | Мажорная пентатоника Черепнина, лад III |
| 981 | Tcherepnin Major Pentatonic Mode IV | Мажорная пентатоника Черепнина, лад IV |
| 982 | Tcherepnin Major Pentatonic Mode V | Мажорная пентатоника Черепнина, лад V |
| 983 | Tcherepnin Minor Pentatonic Mode I | Минорная пентатоника Черепнина, лад I |
| 984 | Tcherepnin Minor Pentatonic Mode II | Минорная пентатоника Черепнина, лад II |
| 985 | Tcherepnin Minor Pentatonic Mode III | Минорная пентатоника Черепнина, лад III |
| 986 | Tcherepnin Minor Pentatonic Mode IV | Минорная пентатоника Черепнина, лад IV |
| 987 | Tcherepnin Minor Pentatonic Mode V | Минорная пентатоника Черепнина, лад V |
| 988 | Tetrardus authenticus | Tetrardus authenticus |
| 989 | Tetrardus plagis | Tetrardus plagis |
| 990 | Three Semitone | Три полутона |
| 991 | Tizita Major | Тизита мажорная |
| 992 | Tizita Minor | Тизита минорная |
| 993 | Todi Thaat | Тоди тхат |
| 994 | Todi Thaat 2 | Тоди тхат 2 |
| 995 | Tritus authenticus | Tritus authenticus |
| 996 | Tritus plagis | Tritus plagis |
| 997 | Tsinganikos | Цинганикос |
| 998 | Tunisian | Тунисская |
| 999 | Ultra Locrian | Ультралокрийская |
| 1000 | Ujo | Уджо |
| 1001 | Ute tritonic | Тритоника юта |
| 1002 | Utility Minor | Прикладная минорная |
| 1003 | Van der Horst Octatonic | Октатоника Ван дер Хорста |
| 1004 | Verdi's Enigmatic ▲ | Загадочная Верди ▲ |
| 1005 | Verdi's Enigmatic ▼ | Загадочная Верди ▼ |
| 1006 | Verdi's Scala Enigmatica | Scala Enigmatica Верди |
| 1007 | Warao ditonic | Дитоника варао |
| 1008 | Warao tetratonic | Тетратоника варао |
| 1009 | Warao tritonic | Тритоника варао |
| 1010 | Whole-Half step | Целый тон-полутон (шаг) |
| 1011 | Whole-Half tone | Целый тон-полутон |
| 1012 | Whole-tone I | Целотоновая I |
| 1013 | Xin | Синь |
| 1014 | Yishtabach | Йиштабах |
| 1015 | Yi Ze | И цзэ |
| 1016 | Yo (shomyo, Gagaku) | Ё (сёмё, гагаку) |
| 1017 | Yona Nuki Major | Ёна-нуки мажорная |
| 1018 | Yona Nuki Minor | Ёна-нуки минорная |
| 1019 | Yosen | Ёсэн |
| 1020 | Youlan | Ю лань |
| 1021 | Yu | Юй |
| 1022 | Yu 2 | Юй 2 |
| 1023 | Zhalibny Minor | Жалибны минорная |
| 1024 | Zheng | Чжэн |
| 1025 | Zhi | Чжи |
| 1026 | Zirafkend : Arabic | Зирафкенд : арабская |
| 1027 | Zokuso | Дзокусо |

## 5. English UI strings (complete)

All 1423 keys of `en.lproj/Localizable.strings`, sorted by key. Machine-readable copy: `data/en_strings.json`. Placeholders use .NET `{0}` style. **exact**

| Key | English value |
|---|---|
| `a_minute_ago` | a minute ago |
| `a_month_ago` | a month ago |
| `a_second_ago` | a second ago |
| `a_year_ago` | a year ago |
| `about` | About |
| `about_app` | About Piano Companion |
| `about_dialog` | Send feedback to: {0} |
| `about_dialog_build` | Build id: {0} |
| `academic_notation` | Academic Notation |
| `adagietto_1` | Adagietto 1 |
| `adagietto_2` | Adagietto 2 |
| `adagio` | Adagio |
| `adagissimo` | Adagissimo |
| `add_as_new_chord` | Add as a new chord |
| `add_as_new_scale` | Add as a new scale |
| `add_chord` | Add chord |
| `add_new_row` | Add new row |
| `add_note_to_start_filtering` | Add note to start filtering |
| `add_to_library` | Add to library |
| `added_to_library` | Added to library. |
| `additional` | Additional |
| `after` | After |
| `agree_with_terms_of_service` | By signing up, I agree to Songtive's terms of service. |
| `album` | Album |
| `all` | All |
| `allegretto` | Allegretto |
| `allegrissimo` | Allegrissimo |
| `allegro` | Allegro |
| `allegro_moderato` | Allegro moderato |
| `allegro_vivace` | Allegro vivace |
| `alphabetical_sort` | Sort alphabetically |
| `always_select_first_item` | Always select the first item |
| `an_hour_ago` | an hour ago |
| `and_under` | and under |
| `andante` | Andante |
| `andante_moderato` | Andante moderato |
| `andantino` | Andantino |
| `ann_chordiq_cta` | Try ChordIQ |
| `ann_chordiq_desc` | I built ChordIQ to help you put your music knowledge to the test — sight reading, chord recognition, ear training, and more. Think of it as a workout companion for everything you learn in Piano Companion. |
| `ann_chordiq_title` | I made something for your ear training |
| `ann_kidteller_cta` | Create a Story |
| `ann_kidteller_desc` | I created KidTeller so any child can star in their own storybook. You add their name, photo, and favorite things — and they become the hero of a one-of-a-kind adventure. If you have little ones, I think you'll love it. |
| `ann_kidteller_title` | A personal project close to my heart |
| `ann_mathit_cta` | Play MathIt |
| `ann_mathit_desc` | MathIt is a real-time math game I built for families. Grab 2–5 players, share a room code, and race through 30-second rounds. My kids couldn't stop playing — yours might feel the same. |
| `ann_mathit_title` | Made math fun (finally) |
| `app_of_the_day` | App of<br>the Day |
| `app_outdated` | Your app is outdated, please update it. |
| `apprater_do_you_like_app` | We need your help! Is Piano Companion useful for you? |
| `apprater_dontshow` | No, thanks |
| `apprater_provide_feedback` | Would you mind giving us feedback? |
| `apprater_question` | If you like {0}, please take a moment to rate it. Thanks for your support! |
| `apprater_rate_app` | Please rate us! Each vote increases popularity and motivates us to continue development. |
| `apprater_remind_me_later` | Remind me later |
| `apprater_title` | Rate {0} |
| `arabic` | Arabic |
| `are_you_sure` | Are you sure? |
| `arpeggio` | Arpeggio |
| `art_accent` | Accent |
| `art_accent_desc` | Play this note louder |
| `art_fermata` | Fermata |
| `art_fermata_desc` | Hold longer than written |
| `art_marcato` | Marcato |
| `art_marcato_desc` | Strongly accented |
| `art_slur` | Slur |
| `art_slur_desc` | Play the notes smoothly (legato) |
| `art_staccato` | Staccato |
| `art_staccato_desc` | Short and detached |
| `art_tenuto` | Tenuto |
| `art_tenuto_desc` | Hold the note for its full value |
| `art_tie` | Tie |
| `art_tie_desc` | Joins two notes of the same pitch into one sound |
| `artist` | Artist |
| `at_a_moderate_speed` | At a moderate speed |
| `at_a_walking_pace` | At a walking pace |
| `aug` | Aug |
| `auto_renew_terms` | Subscription auto-renews • cancel anytime |
| `available_for_android21plus` | Sorry, this feature is available only for Android 2.1 and newer devices for better performance. |
| `bad_password` | Please enter a password. |
| `bad_username` | Please enter a username. |
| `bass` | Bass |
| `beats` | (beats) |
| `beats_per_bar` | Beats per bar |
| `between_and` | Between {0} and {1} |
| `billing_details` | Billing Details |
| `black` | Black |
| `blues` | Blues |
| `bpm` | bpm |
| `broadly` | Broadly |
| `buy` | Buy |
| `by_keys` | By Keys |
| `by_name` | By Name |
| `cancel` | Cancel |
| `cancel_anytime` | cancel anytime |
| `cant_retrieve_products` | Can't retrieve products. Check your network or try again. |
| `choose_bass` | Choose bass |
| `choose_inversion` | Choose inversion |
| `choose_root` | Choose root |
| `chord` | Chord |
| `chord_added` | Chord was added. |
| `chord_applied` | Chord was applied. |
| `chord_details` | Chord Details |
| `chord_lookup` | Chords Dictionary |
| `chord_lookup_description` | Custom chords, edit existing chords, chord scales, unlimited reverse search, chord inversions, MIDI keyboard support. |
| `chord_lookup_pro_feature` | Unlimited reverse search, chord inversions. |
| `chord_notes` | Chord notes |
| `chord_preview` | Chord preview |
| `chord_progression` | Chord Progression |
| `chord_progression_description` | Unlimited number of chords in songs, transposing, save/load songs, export it as MIDI. |
| `chord_scales` | Chord Scales |
| `chord_symbols` | Chord symbols |
| `chord_symbols_asian` | Asian (Japan, Korea, China) |
| `chord_symbols_automatic` | Automatic |
| `chord_symbols_brazilian` | Brazilian |
| `chord_symbols_french` | French |
| `chord_symbols_international` | International |
| `chord_symbols_jazz` | Jazz |
| `chords` | Chords |
| `chords_and_scales` | Chords & Scales |
| `chords_for_every_key` | Chords for every key |
| `chords_scales` | Chords / Scales |
| `circle_of_fifths` | Circle of Fifths |
| `clear` | Clear |
| `clef_alto` | Alto |
| `clef_tenor` | Tenor |
| `clef_treble` | Treble |
| `close` | Close |
| `close_to_but_not_quite` | Close to, but not quite {0} |
| `comments` | Comments |
| `common` | Common |
| `common_chords` | Common Chords |
| `community` | Community |
| `compact_mode` | Compact Mode |
| `compact_mode_description` | Simplifies main menu, hides irrelevant options. |
| `compatible_chords` | Compatible Chords |
| `connection_error_message` | Please check your network connection or try again later. |
| `connection_error_title` | Connection error! |
| `copy` | Copy |
| `copy_items` | Copy items |
| `copyright` | Copyright |
| `count_in` | Count-in |
| `courses` | Courses |
| `credits` | Credits |
| `custom_chord` | Custom chord |
| `customize` | Customize |
| `days_ago` | days ago |
| `default_email` | Default email |
| `degree` | Degree |
| `delete` | Delete |
| `delete_item` | Delete current item |
| `delete_library` | Delete current library |
| `description` | Description |
| `details` | Details |
| `detected_scales` | Detected Scales |
| `dim` | Dim |
| `display` | Display |
| `do_you_want_to_install_songtive` | Do you want to install Songtive? |
| `dont_play_chords` | Don't play chords |
| `dont_play_scales` | Don't play scales |
| `down` | Down |
| `download_pattern` | Download pattern |
| `drumset` | Drumset |
| `dual_keyboards_enabled` | Dual keyboard enabled |
| `dual_keyboards_settings` | Dual keyboard settings |
| `duplicate` | Duplicate |
| `duration` | Duration |
| `dyn_cresc` | Crescendo |
| `dyn_cresc_desc` | Gradually louder |
| `dyn_dim` | Diminuendo |
| `dyn_dim_desc` | Gradually softer |
| `dyn_f` | Forte |
| `dyn_f_desc` | Loud |
| `dyn_ff` | Fortissimo |
| `dyn_ff_desc` | Very loud |
| `dyn_fp` | Fortepiano |
| `dyn_fp_desc` | Loud, then at once soft |
| `dyn_mf` | Mezzo-forte |
| `dyn_mf_desc` | Moderately loud |
| `dyn_mp` | Mezzo-piano |
| `dyn_mp_desc` | Moderately soft |
| `dyn_p` | Piano |
| `dyn_p_desc` | Soft |
| `dyn_pp` | Pianissimo |
| `dyn_pp_desc` | Very soft |
| `dyn_sfz` | Sforzando |
| `dyn_sfz_desc` | A sudden, strong accent |
| `edit` | Edit |
| `edit_chord` | Edit Chord |
| `edit_library` | Edit Library |
| `elevenths` | Elevenths |
| `email` | Email |
| `enter` | Enter |
| `even_faster_than` | Even faster than {0} |
| `excludes_inversions_for_reverse_mode` | Excludes inversions from Reverse Lookup |
| `export` | Export |
| `export_custom_chords` | Export custom chords |
| `export_to_midi` | Export to MIDI |
| `facebook` | Facebook |
| `fast_quickly_and_bright` | Fast, quickly, and bright |
| `favourite_scales` | Favourite scales |
| `favourites` | Favourites |
| `feature_chord_pads_sub` | Play chords with pads |
| `feature_chords` | Chords |
| `feature_chords_home_sub` | Find, identify & listen |
| `feature_chords_sub` | Find and identify chords |
| `feature_circle_sub` | Explore keys and harmony |
| `feature_collections` | My collections |
| `feature_collections_sub` | Your saved chords and scales |
| `feature_courses_sub` | Follow music lessons |
| `feature_flashcards_sub` | Practice chords and scales |
| `feature_is_not_for_demo_version` | This feature is not available for LITE version. |
| `feature_knowledge_base` | Knowledge Base |
| `feature_knowledge_base_sub` | Guides and video tutorials |
| `feature_metronome_sub` | Keep time while you practice |
| `feature_new_chord` | New chord |
| `feature_new_chord_sub` | Build your own chord |
| `feature_new_scale` | New scale |
| `feature_new_scale_sub` | Build your own scale |
| `feature_new_song` | New song |
| `feature_new_song_sub` | Write chords and lyrics |
| `feature_piano_sub` | Play the keyboard |
| `feature_practice_songs` | Practice songs |
| `feature_practice_songs_sub` | Play along with falling notes |
| `feature_progression_builder` | Progression Builder |
| `feature_progression_builder_sub` | Build a chord progression |
| `feature_progression_library_sub` | Browse chord progressions |
| `feature_recent_sub` | Chords and scales you opened |
| `feature_scales` | Scales |
| `feature_scales_home_sub` | Explore notes & patterns |
| `feature_scales_sub` | Explore scales and their notes |
| `feature_songs_sub` | Your songs with chords and lyrics |
| `feature_symbols` | Musical Symbols |
| `feature_symbols_sub` | Look up music notation |
| `feature_transcribe` | Transcribe a song |
| `feature_transcribe_sub` | From a TikTok, a Reel or a photo of sheet music |
| `feature_transcriptions` | Transcriptions |
| `feature_transcriptions_sub` | Songs you turned into notes |
| `fifth_inversion` | 5th inversion |
| `fingering_l` | Left Hand |
| `fingering_r` | Right Hand |
| `fingerings` | Fingerings |
| `fingerings_added_less_than_required` | You've specified only {0} of {1} fingers. |
| `first_inversion` | 1st inversion |
| `first_octave` | First octave |
| `flashcards` | Flashcards |
| `flashcards_card_count` | {0} cards |
| `flashcards_daily_goal` | Daily goal: {0} / {1} |
| `flashcards_daily_goal_reached` | Daily goal reached ✓ |
| `flashcards_deck_add9` | Add9 Chords |
| `flashcards_deck_add9_desc` | add9 and m(add9) in every key |
| `flashcards_deck_diatonic_c` | Key of C — Diatonic |
| `flashcards_deck_diatonic_c_desc` | I, ii, iii, IV, V, vi, vii° |
| `flashcards_deck_diatonic_d` | Key of D — Diatonic |
| `flashcards_deck_diatonic_d_desc` | I, ii, iii, IV, V, vi, vii° |
| `flashcards_deck_diatonic_f` | Key of F — Diatonic |
| `flashcards_deck_diatonic_f_desc` | I, ii, iii, IV, V, vi, vii° |
| `flashcards_deck_diatonic_g` | Key of G — Diatonic |
| `flashcards_deck_diatonic_g_desc` | I, ii, iii, IV, V, vi, vii° |
| `flashcards_deck_dim_7` | Diminished 7 — Passing Chords |
| `flashcards_deck_dim_7_desc` | Fully-diminished 7ths |
| `flashcards_deck_dim_aug` | Diminished & Augmented |
| `flashcards_deck_dim_aug_desc` | Diminished and augmented triads |
| `flashcards_deck_dom_7` | Dominant 7th Chords |
| `flashcards_deck_dom_7_desc` | All 12 dominant 7th chords |
| `flashcards_deck_inversion_drill` | Inversion Drill — C, F, G |
| `flashcards_deck_inversion_drill_desc` | Root, 1st and 2nd inversions |
| `flashcards_deck_jazz_vocab` | Jazz Vocab — ii–V–I |
| `flashcards_deck_jazz_vocab_desc` | ii–V–I voicings in six keys |
| `flashcards_deck_maj_min_7` | Major 7 / Minor 7 |
| `flashcards_deck_maj_min_7_desc` | Maj7 and m7 in every key |
| `flashcards_deck_min_maj_7` | Minor-Major 7 |
| `flashcards_deck_min_maj_7_desc` | m(Maj7) in every key |
| `flashcards_deck_secondary_dominants_c` | Secondary Dominants in C |
| `flashcards_deck_secondary_dominants_c_desc` | A7, B7, C7, D7, E7 |
| `flashcards_deck_sixths` | 6th & Minor 6th Chords |
| `flashcards_deck_sixths_desc` | 6 and m6 in every key |
| `flashcards_deck_sus_chords` | Sus Chords |
| `flashcards_deck_sus_chords_desc` | sus2 and sus4 in every key |
| `flashcards_deck_triads_all_12` | Major & Minor Triads — All 12 Keys |
| `flashcards_deck_triads_all_12_desc` | Every major and minor triad |
| `flashcards_deck_triads_basic_major` | Major Triads |
| `flashcards_deck_triads_basic_major_desc` | C, G, F major triads |
| `flashcards_deck_triads_basic_minor` | Minor Triads |
| `flashcards_deck_triads_basic_minor_desc` | Am, Em, Dm minor triads |
| `flashcards_due_badge` | {0} due |
| `flashcards_empty_deck` | Add chords to this deck first. |
| `flashcards_include_inversions` | Include inversions |
| `flashcards_next` | Next |
| `flashcards_progress` | {0} / {1} |
| `flashcards_retry_missed` | Retry missed |
| `flashcards_section_catalog` | Curated decks |
| `flashcards_section_mine` | My Decks |
| `flashcards_session_done` | Session complete |
| `flashcards_session_finish` | Done |
| `flashcards_session_score` | {0} / {1} |
| `flashcards_size_all` | All |
| `flashcards_size_due` | Due ({0}) |
| `flashcards_size_due_short` | Due |
| `flashcards_start` | Start |
| `flashcards_streak_days` | 🔥 {0}-day streak |
| `forgot_password` | Forgot Password? |
| `formula` | Formula |
| `fourth_inversion` | 4th inversion |
| `free_trial_days` | 3 days free trial |
| `free_trial_days_one` | {0} day free trial |
| `free_trial_days_other` | {0} days free trial |
| `from` | From |
| `full_name` | Full name |
| `full_version` | Full Version |
| `get_started` | Get Started |
| `grave` | Grave |
| `group` | Group |
| `help` | Help |
| `hidden_keyboard` | Hidden Keyboard |
| `hidden_keyboard_description` | Keyboard is hidden for chord/scale lookup screen to preserve space. |
| `home_recent_chord` | Chord · {0} |
| `home_recent_chord_short` | Chord |
| `home_recent_scale_short` | Scale |
| `home_recent_unavailable` | This item is no longer available. Remove it from Recent? |
| `home_remove` | Remove |
| `home_section_explore` | Explore |
| `home_section_quick_tools` | Quick tools |
| `home_section_recent` | Recent |
| `home_see_all` | See all |
| `hot` | Hot |
| `hours_ago` | hours ago |
| `import_custom_chords` | Import custom chords |
| `impossible_to_detect_chord` | Impossible to detect a played chord. Please try again. |
| `incorrect_format` | Incorrect format: file extension must be .pc |
| `indian` | Indian |
| `inspect_details` | Inspect details |
| `instrument` | Instrument |
| `instrument_brightpiano` | Bright Piano |
| `instrument_cello` | Cello |
| `instrument_marimba` | Marimba |
| `instrument_piano` | Grand Piano |
| `instrument_steelguitar` | Steel Guitar |
| `instrument_synthstrings` | Synth Strings |
| `instrument_synthvoice` | Synth Voice |
| `instrument_vibraphone` | Vibraphone |
| `instrument_xylophone` | Xylophone |
| `interval_augmented_11` | Augmented eleventh |
| `interval_augmented_2` | Augmented second |
| `interval_augmented_4` | Augmented fourth |
| `interval_augmented_5` | Augmented fifth |
| `interval_augmented_9` | Augmented ninth |
| `interval_diminished_5` | Diminished fifth |
| `interval_diminished_7` | Diminished seventh |
| `interval_major_13` | Major thirteenth |
| `interval_major_2` | Major second |
| `interval_major_3` | Major third |
| `interval_major_6` | Major sixth |
| `interval_major_7` | Major seventh |
| `interval_major_9` | Major ninth |
| `interval_minor_13` | Minor thirteenth |
| `interval_minor_2` | Minor second |
| `interval_minor_3` | Minor third |
| `interval_minor_6` | Minor sixth |
| `interval_minor_7` | Minor seventh |
| `interval_minor_9` | Minor ninth |
| `interval_octave` | Octave |
| `interval_perfect_11` | Perfect eleventh |
| `interval_perfect_4` | Perfect fourth |
| `interval_perfect_5` | Perfect fifth |
| `interval_root` | Root |
| `intervals` | Intervals |
| `invalid_formula` | Invalid formula: Please use numbers 1-20, b, #. |
| `inversion` | Inversion |
| `inversion_0` | Root |
| `inversion_1` | 1st |
| `inversion_2` | 2nd |
| `inversion_3` | 3rd |
| `inversion_4` | 4th |
| `inversion_5` | 5th |
| `inversion_6` | 6th |
| `inversion_is_not_supported` | This type of inversion is not supported by this chord. |
| `inversion_short_0` | Root pos. |
| `inversion_short_1` | 1st inv. |
| `inversion_short_2` | 2nd inv. |
| `inversion_short_3` | 3rd inv. |
| `inversion_short_4` | 4th inv. |
| `inversion_short_5` | 5th inv. |
| `inversion_short_6` | 6th inv. |
| `inversions` | Inversions |
| `jazz` | Jazz |
| `join_with_facebook` | Join with Facebook |
| `join_with_google` | Join with Google |
| `join_with_twitter` | Join with Twitter |
| `kb_channel` | More videos on our YouTube channel |
| `kb_clear_filters` | Clear filters |
| `kb_empty` | Guides and video tutorials will appear here |
| `kb_filter_all` | All |
| `kb_filter_guides` | Guides |
| `kb_filter_videos` | Videos |
| `kb_language_english` | English |
| `kb_latest` | Latest guides & videos |
| `kb_no_matches` | No matching guides or videos |
| `kb_search_hint` | Search guides and videos |
| `kb_start_here` | Start here |
| `kb_topic_general` | Getting started |
| `kb_topic_progressions` | Progressions |
| `kb_topic_purchases` | PRO & purchases |
| `kb_topic_troubleshooting` | Troubleshooting |
| `kb_type_guide` | Guide |
| `kb_type_video` | Video |
| `kb_watch_on_youtube` | Watch on YouTube |
| `key` | Key |
| `key_notation` | Music Notation |
| `key_notation_summary` | Allows to switch key notation to Italian, German, Japanese, etc. |
| `key_parallel_notation` | Parallel Notation |
| `key_signature` | Key Signature |
| `keyboard` | Keyboard |
| `keys` | Keys |
| `lang_arabic` | العربية |
| `lang_brazilian_portuguese` | Português (Brasil) |
| `lang_bulgarian` | Български |
| `lang_catalan` | Català |
| `lang_chinese` | 简体中文 |
| `lang_chinese_traditional` | 繁體中文 |
| `lang_croatian` | Hrvatski |
| `lang_czech` | Čeština |
| `lang_danish` | Dansk |
| `lang_dutch` | Nederlands |
| `lang_english` | English (American) |
| `lang_english_au` | English (Australian) |
| `lang_english_br` | English (British) |
| `lang_estonian` | Eesti |
| `lang_finnish` | Suomi |
| `lang_french` | Français |
| `lang_german` | Deutsch |
| `lang_greek` | Ελληνικά |
| `lang_hebrew` | עברית |
| `lang_hindi` | हिंदी |
| `lang_hungarian` | Magyar |
| `lang_indonesian` | Bahasa Indonesia |
| `lang_italian` | Italiano |
| `lang_japanese` | 日本語 |
| `lang_korean` | 한국어 |
| `lang_latvian` | Latviešu |
| `lang_lithuanian` | Lietuvių |
| `lang_malay` | Bahasa Melayu |
| `lang_norwegian` | Norsk |
| `lang_polish` | Polski |
| `lang_portuguese` | Português (Portugal) |
| `lang_romanian` | Română |
| `lang_russian` | Русский |
| `lang_serbian` | Srpski |
| `lang_slovak` | Slovenčina |
| `lang_slovenian` | Slovenščina |
| `lang_spanish` | Español |
| `lang_swedish` | Svenska |
| `lang_thai` | ไทย |
| `lang_turkish` | Türkçe |
| `lang_ukrainian` | Українська |
| `lang_vietnamese` | Tiếng Việt |
| `language` | Language |
| `larghetto` | Larghetto |
| `larghissimo` | Larghissimo |
| `largo` | Largo |
| `learn_more` | Learn More |
| `length` | Length |
| `lento` | Lento |
| `library` | Library |
| `library_name` | Library Name |
| `lifetime` | Lifetime |
| `lively_and_fast` | Lively and fast |
| `load` | Load |
| `loading` | Loading… |
| `loop` | Loop |
| `macos_ann_description` | <br>🎉 I'm happy to announce that Piano Companion 🎹 is available for macOS 🖥.<br><br>I would really love 😍 your feedback and suggestions! 🤩 |
| `macos_ann_title` | Piano Companion for macOS |
| `maj` | Maj |
| `manage_subscription` | Manage subscription |
| `manage_subscription_active` | Change or cancel your subscription in {0}. |
| `manage_subscription_trial` | Free trial ends {0}. We remind you one day before. |
| `marcia_moderato` | Marcia moderato |
| `measure` | Measure |
| `menu_app_help` | {0} Help |
| `menu_bring_all_to_front` | Bring All to Front |
| `menu_close` | Close |
| `menu_customize_toolbar` | Customize Toolbar… |
| `menu_cut` | Cut |
| `menu_file` | File |
| `menu_hide_app` | Hide {0} |
| `menu_hide_others` | Hide Others |
| `menu_minimize` | Minimize |
| `menu_paste` | Paste |
| `menu_quit_app` | Quit {0} |
| `menu_redo` | Redo |
| `menu_select_all` | Select All |
| `menu_services` | Services |
| `menu_show_all` | Show All |
| `menu_show_toolbar` | Show Toolbar |
| `menu_undo` | Undo |
| `menu_view` | View |
| `menu_window` | Window |
| `menu_zoom` | Zoom |
| `metronome` | Metronome |
| `metronome_beats_per_bar` | Beats per bar |
| `metronome_cross_off` | Off |
| `metronome_cross_rhythm` | Cross-rhythm |
| `metronome_preset_name` | Preset name |
| `metronome_preset_save` | Save current |
| `metronome_presets` | Presets |
| `metronome_presets_empty` | No presets yet. Dial in a tempo and save it. |
| `metronome_presets_full` | You can keep up to {0} presets. |
| `metronome_start` | Start |
| `metronome_stop` | Stop |
| `metronome_sub_eighth` | Eighth |
| `metronome_sub_quarter` | Quarter |
| `metronome_sub_sixteenth` | Sixteenth |
| `metronome_sub_triplet` | Triplets |
| `metronome_subdivision` | Subdivision |
| `midi` | MIDI |
| `midi_bluetooth_connect` | Connect a Bluetooth MIDI keyboard |
| `midi_in` | MIDI IN |
| `midi_input` | MIDI Input |
| `midi_input_all` | All devices |
| `midi_input_help_apple` | No MIDI keyboard connected. Connect one with a USB cable (use a USB-C or Lightning adapter if needed). |
| `midi_output` | MIDI Output |
| `min` | Min |
| `minutes_ago` | minutes ago |
| `mode` | Mode |
| `moderately_fast` | Moderately fast |
| `moderately_march` | Moderately, in the manner of a march |
| `moderato` | Moderato |
| `monthly` | Monthly |
| `months_12` | 12 Months |
| `months_ago` | months ago |
| `move_down` | Move Down |
| `move_up` | Move Up |
| `my_apps` | My apps |
| `my_songs` | My songs |
| `my_songs_empty` | Songs you practise appear here. |
| `my_songs_file_missing` | This file is no longer on the device. |
| `my_songs_midi_file` | MIDI file |
| `my_songs_no_results` | No song matches “{0}”. |
| `my_songs_remove` | Remove |
| `my_songs_remove_question` | Remove “{0}” from My songs? |
| `my_songs_search` | Search your songs |
| `my_songs_title` | My songs |
| `name` | Name |
| `name_is_too_short` | Name is too short. |
| `nav_create` | Create |
| `nav_explore` | Explore |
| `nav_home` | Home |
| `nav_library` | Library |
| `nav_practice` | Practice |
| `nav_practice_tools` | Tools |
| `new_chord` | New Chord |
| `new_library` | New Library |
| `new_name` | New name |
| `next` | Next |
| `ninths` | Ninths |
| `no` | No |
| `no_payment_today_disclaimer` | No Payment Today • Subscription Auto-Renews |
| `not_a_member` | Not a member yet? |
| `not_enough_information` | Not enough information |
| `not_yet` | not yet |
| `notation_chinesenumbers` | Chinese |
| `notation_english` | English |
| `notation_french` | French |
| `notation_german` | German |
| `notation_italian` | Italian |
| `notation_japanese` | Japanese |
| `notation_korean` | Korean |
| `notation_numbers` | Numbers |
| `notation_russian` | Russian |
| `note_1` | Whole Note |
| `note_128` | One Hundred and Twenty-eighth Note |
| `note_16` | Sixteenth Note |
| `note_1dbl` | Double-whole Note |
| `note_2` | Half Note |
| `note_2_dotted` | Dotted Half Note |
| `note_32` | Thirty-second Note |
| `note_4` | Quarter Note |
| `note_4_dotted` | Dotted Quarter Note |
| `note_64` | Sixty-fourth Note |
| `note_8` | Eighth Note |
| `note_8_dotted` | Dotted Eighth Note |
| `note_values` | Note Values |
| `notes` | Notes |
| `oa_follow_x` | Follow @desunit on X |
| `oa_get` | Get |
| `oa_intro` | Hi! I'm Sergey, the author of Piano Companion. I love building apps, and I hope you'll love my other apps too — millions of people around the world use them. Thank you! |
| `oa_tagline_chordiq` | Ear training and music theory games: notes, chords, scales and rhythm. |
| `oa_tagline_ear_hop` | Arcade ear training: hear the sound, sing the note, flap on the beat. |
| `oa_tagline_kidteller` | Personalized storybooks starring your child. |
| `oa_tagline_mathit` | Math practice and games for kids. |
| `octave` | Octave |
| `off` | Off |
| `ok` | OK |
| `on` | On |
| `onboarding_attr_ad_other` | 📢  An ad somewhere else |
| `onboarding_attr_app_store` | App Store search |
| `onboarding_attr_friend_teacher` | 👥  A friend or teacher |
| `onboarding_attr_google_play` | Google Play search |
| `onboarding_attr_h1` | How did you hear about Piano Companion? |
| `onboarding_attr_meta` | Instagram or Facebook |
| `onboarding_attr_other` | 💬  Somewhere else |
| `onboarding_attr_reddit` | Reddit |
| `onboarding_attr_sub` | Helps us know which musicians to reach next. |
| `onboarding_attr_tiktok` | TikTok |
| `onboarding_attr_youtube` | YouTube |
| `onboarding_back` | Back |
| `onboarding_continue` | Continue |
| `onboarding_continue_free` | Continue free → |
| `onboarding_demo_h1` | Try it: tap any 3 keys. |
| `onboarding_demo_hear_again` | ♫ Hear it again |
| `onboarding_demo_next` | Next → |
| `onboarding_demo_prog_play` | ▶  Play the progression |
| `onboarding_demo_prog_stop` | ■  Stop |
| `onboarding_demo_prog_subtitle` | {0} — the four chords behind “Viva La Vida” and “Let It Be”. |
| `onboarding_demo_prog_title` | Hear it: {0} in C |
| `onboarding_demo_progress_1` | 1 more |
| `onboarding_demo_progress_2` | 2 more |
| `onboarding_demo_progress_3` | Tap 3 keys to play a chord |
| `onboarding_demo_result_known` | That's {0} |
| `onboarding_demo_result_unknown` | Hmm, that's not a standard chord — try C–E–G for C major. |
| `onboarding_demo_sub` | We'll tell you what chord you just played. |
| `onboarding_demo_try_another` | Try another |
| `onboarding_fd_dict_h1` | Any chord, in two taps |
| `onboarding_fd_dict_sub` | Pick a root and a chord type. See the notes and hear it. |
| `onboarding_fd_dict_where` | In the app: Explore → Chords |
| `onboarding_fd_jazz_251` | ▶ Play ii–V–I |
| `onboarding_fd_jazz_h1` | Jazz chords, voiced for you |
| `onboarding_fd_jazz_sub` | Tap a chord to see and hear it. Then play a ii–V–I. |
| `onboarding_fd_jazz_where` | In the app: Explore → Chords · search “Cmaj9” |
| `onboarding_fd_listen` | ▶ Listen first |
| `onboarding_fd_pads_h1` | One finger, full chords |
| `onboarding_fd_pads_sub` | Tap the pads to play a song's chords. Every pad is in the same key. |
| `onboarding_fd_pads_where` | In the app: Create → Chord Pads |
| `onboarding_fd_practice_done` | You played the first line! |
| `onboarding_fd_practice_done_sub` | Find more songs in Practice songs. |
| `onboarding_fd_practice_h1` | Play your first song |
| `onboarding_fd_practice_progress` | {0} of {1} notes |
| `onboarding_fd_practice_song` | Ode to Joy |
| `onboarding_fd_practice_sub` | Tap the lit key. The song waits for you. |
| `onboarding_fd_practice_where` | In the app: Practice → Practice songs |
| `onboarding_fd_reverse_where` | In the app: Chords → By keys |
| `onboarding_fd_scales_h1` | See and hear any scale |
| `onboarding_fd_scales_sub` | Tap a scale. Its notes light up and it plays. |
| `onboarding_fd_scales_where` | In the app: Explore → Scales |
| `onboarding_fd_song_emotional` | Emotional |
| `onboarding_fd_song_fifties` | 50s |
| `onboarding_fd_song_h1` | Start a song from a progression |
| `onboarding_fd_song_hint` | Change the key, edit the chords, save it to a song. |
| `onboarding_fd_song_jazz` | Jazz |
| `onboarding_fd_song_pop` | Pop |
| `onboarding_fd_song_sub` | Tap a progression to hear it. Hits are built on these. |
| `onboarding_fd_song_where` | In the app: Explore → Progression Library |
| `onboarding_fd_transcribe_example` | ▶ Hear an example |
| `onboarding_fd_transcribe_h1` | From any song to notes |
| `onboarding_fd_transcribe_result` | Example: Ode to Joy |
| `onboarding_fd_transcribe_result_sub` | Notes · Sheet music · MIDI |
| `onboarding_fd_transcribe_step1` | Find a piano video on TikTok, Instagram or Facebook, or use an audio file |
| `onboarding_fd_transcribe_step2` | Tap Share → Piano Companion |
| `onboarding_fd_transcribe_step3` | Get the notes, sheet music and a MIDI file, and play it here |
| `onboarding_fd_transcribe_sub` | Piano Companion listens to a piano video and writes the notes for you. |
| `onboarding_fd_transcribe_where` | In the app: Practice → Transcribe a song |
| `onboarding_fd_type_major` | Major |
| `onboarding_fd_type_minor` | Minor |
| `onboarding_genre_classical` | Classical |
| `onboarding_genre_electronic` | Electronic |
| `onboarding_genre_film` | Film & games |
| `onboarding_genre_folk` | Folk / Country |
| `onboarding_genre_h1` | What music do you play? |
| `onboarding_genre_hiphop` | Hip-hop |
| `onboarding_genre_jazz` | Jazz |
| `onboarding_genre_latin` | Latin |
| `onboarding_genre_pop` | Pop |
| `onboarding_genre_rnb` | R&B / Soul |
| `onboarding_genre_rock` | Rock |
| `onboarding_genre_worship` | Gospel / Worship |
| `onboarding_get_started` | Get Started |
| `onboarding_goal_exam` | 🎓  Pass an exam or audition |
| `onboarding_goal_h1` | What do you want to do with piano? |
| `onboarding_goal_play_songs` | 🎬  Play songs I love |
| `onboarding_goal_produce` | 🎚️  Produce & record music |
| `onboarding_goal_sub` | Pick the one that's most you. |
| `onboarding_goal_theory` | 📖  Understand music theory |
| `onboarding_goal_write_songs` | 🎵  Write my own songs |
| `onboarding_instr_bass` | Bass |
| `onboarding_instr_daw` | Music software |
| `onboarding_instr_digital` | Digital piano |
| `onboarding_instr_guitar` | Guitar |
| `onboarding_instr_h1` | What do you play? |
| `onboarding_instr_midi` | MIDI keyboard |
| `onboarding_instr_none` | Nothing yet |
| `onboarding_instr_piano` | Piano |
| `onboarding_instr_ukulele` | Ukulele |
| `onboarding_instr_voice` | Voice |
| `onboarding_int_dictionary` | Look up any chord |
| `onboarding_int_dictionary_sub` | 1,500+ chords: notes, fingering and sound |
| `onboarding_int_jazz` | Jazz & advanced chords |
| `onboarding_int_jazz_sub` | 9ths, 11ths, 13ths, altered chords, ii–V–I |
| `onboarding_int_pads` | Make music with Chord Pads |
| `onboarding_int_pads_sub` | Play full chords with one finger |
| `onboarding_int_practice` | Learn songs on piano |
| `onboarding_int_practice_sub` | Follow the lit keys at your own pace |
| `onboarding_int_reverse` | Name the chord I play |
| `onboarding_int_reverse_sub` | Tap keys and get the chord name |
| `onboarding_int_scales` | Scales & modes |
| `onboarding_int_scales_sub` | See and hear any scale in any key |
| `onboarding_int_songwriting` | Write songs |
| `onboarding_int_songwriting_sub` | Chord progressions, keys and song sheets |
| `onboarding_int_transcribe` | Turn a song into notes |
| `onboarding_int_transcribe_sub` | From a video or audio file to notes and sheet music |
| `onboarding_interests_h1` | What do you want to do with Piano Companion? |
| `onboarding_interests_sub` | Pick all that fit. We'll show you how each one works. |
| `onboarding_label_goal_exam` | Pass an exam or audition |
| `onboarding_label_goal_play_songs` | Play songs I love |
| `onboarding_label_goal_produce` | Produce & record music |
| `onboarding_label_goal_theory` | Understand music theory |
| `onboarding_label_goal_write_songs` | Write my own songs |
| `onboarding_label_skill_advanced` | Advanced |
| `onboarding_label_skill_comfortable` | Comfortable reading |
| `onboarding_label_skill_just_starting` | Just starting |
| `onboarding_label_skill_know_a_few` | Know a few chords |
| `onboarding_multi_sub` | Pick all that fit. |
| `onboarding_not_now` | Not now |
| `onboarding_notation_h1` | How do you read notes? |
| `onboarding_notation_sub` | We'll show every chord and scale in your notation. |
| `onboarding_notif_bullet_1` | A chord matched to your level, delivered each morning |
| `onboarding_notif_enable` | Enable daily reminders |
| `onboarding_notif_h1` | Never miss your daily chord. |
| `onboarding_notif_sub` | One chord a day. 30 seconds. Nothing else. |
| `onboarding_opt_other` | Other |
| `onboarding_pains_cant_name` | 🤷  I can't name chords I hear |
| `onboarding_pains_fingering` | ✋  I don't know where to put my fingers |
| `onboarding_pains_forget` | 😩  I forget what I learned last week |
| `onboarding_pains_h1` | What's been getting in your way? |
| `onboarding_pains_no_time` | ⏰  I don't have time for long lessons |
| `onboarding_pains_sub` | Pick all that hit home. |
| `onboarding_pains_theory` | 🎼  Theory feels confusing |
| `onboarding_pains_tutorials` | 🎧  Every tutorial teaches differently |
| `onboarding_plan_first` | Opens first · {0} |
| `onboarding_plan_h1` | Your Piano Companion is ready |
| `onboarding_plan_sub` | Here is where to find what you picked. |
| `onboarding_processing_h1` | Building your personalized starter pack… |
| `onboarding_processing_sub_1` | Matching chords to your level… |
| `onboarding_processing_sub_2` | Finding progressions you'll love… |
| `onboarding_processing_sub_3` | Tuning to your notation… |
| `onboarding_role_h1` | What describes you best? |
| `onboarding_role_parent` | Parent |
| `onboarding_role_parent_sub` | I help my child learn |
| `onboarding_role_performer` | Performer |
| `onboarding_role_performer_sub` | I play in a band, a church or at gigs |
| `onboarding_role_producer` | Producer / beatmaker |
| `onboarding_role_producer_sub` | I make music on a computer or phone |
| `onboarding_role_self_taught` | Self-taught |
| `onboarding_role_self_taught_sub` | I learn on my own |
| `onboarding_role_songwriter` | Songwriter |
| `onboarding_role_songwriter_sub` | I write my own songs |
| `onboarding_role_student` | Student |
| `onboarding_role_student_sub` | I take lessons or study music |
| `onboarding_role_sub` | This helps us make Piano Companion better for people like you. |
| `onboarding_role_teacher` | Teacher |
| `onboarding_role_teacher_sub` | I teach music |
| `onboarding_skill_advanced` | 🎷  Advanced |
| `onboarding_skill_advanced_sub` | Jazz, modes, the works |
| `onboarding_skill_comfortable` | 🎼  Comfortable reading |
| `onboarding_skill_comfortable_sub` | Sheet music doesn't scare me |
| `onboarding_skill_h1` | How would you describe your piano level? |
| `onboarding_skill_just_starting` | 🎹  Just starting |
| `onboarding_skill_just_starting_sub` | I don't know any chords yet |
| `onboarding_skill_know_a_few` | 🌱  Know a few chords |
| `onboarding_skill_know_a_few_sub` | I can play simple songs |
| `onboarding_skill_sub` | We'll use this to personalize what you see first. |
| `onboarding_skip` | Skip |
| `onboarding_social_a1` | Maya R. · Hobbyist songwriter |
| `onboarding_social_a2` | Daniel K. · Piano teacher |
| `onboarding_social_a3` | Joel T. · Bedroom producer |
| `onboarding_social_chip` | ★ 4.7 · 30,000 ratings · 1,000,000+ downloads |
| `onboarding_social_h1` | A million musicians have learned this way. |
| `onboarding_social_q1` | "I'm self-taught and this is the only app where music theory finally clicked. The reverse lookup is genuinely magical." |
| `onboarding_social_q2` | "I use it every lesson with my students. The grand staff + piano view together is what every other app gets wrong." |
| `onboarding_social_q3` | "Found a chord I'd been hunting for 20 minutes in 2 taps. That paid for the subscription right there." |
| `onboarding_solution_fix_cant_name` | Reverse lookup names any chord in 2 taps. Press the keys → instant identification with audio + notation. |
| `onboarding_solution_fix_exam` | 1,500+ chords up to 6th inversion, every scale you need, with fingerings and grand staff. |
| `onboarding_solution_fix_fingering` | Fingering shown for every chord and scale. Left and right hand, every inversion. |
| `onboarding_solution_fix_forget` | Save every chord you learn to your own library — find it again in 2 taps, with notes, fingering and sound. |
| `onboarding_solution_fix_goal_theory` | Built-in courses, analytical labels (secondary dominants), and the interactive Circle of Fifths. |
| `onboarding_solution_fix_no_time` | 30-second lookups. Find the chord, hear it, play it — practice fits into a coffee break. |
| `onboarding_solution_fix_play_songs` | Reverse-lookup any chord from sheet music — see the keys, hear it, play it. |
| `onboarding_solution_fix_produce` | External MIDI keyboard support, MP3 export, custom chord libraries you can save and reuse. |
| `onboarding_solution_fix_theory` | One unified view — piano, staff, degrees, fingering. See and hear every concept on the same screen. |
| `onboarding_solution_fix_tutorials` | One consistent system, every chord and scale. No more contradicting YouTube videos. |
| `onboarding_solution_fix_write_songs` | 35+ famous progressions ready to play and customize — I–V–vi–IV, ii–V–I, 12-bar blues, and more. |
| `onboarding_solution_h1` | Welcome to a smarter way to learn piano. |
| `onboarding_solution_sub` | Here's how Piano Companion fixes what's been getting in your way: |
| `onboarding_tinder_agree` | ✓ Yes, me |
| `onboarding_tinder_card_1` | "I've Googled the same chord more than once." |
| `onboarding_tinder_card_2` | "I avoid songs because the chord symbols scare me." |
| `onboarding_tinder_card_3` | "I can hum a song but can't find the chords on the piano." |
| `onboarding_tinder_card_4` | "I forget what I practiced last week." |
| `onboarding_tinder_disagree` | ✗ Not me |
| `onboarding_tinder_h1` | Sound familiar? |
| `onboarding_tinder_sub` | Tap ✓ if you've felt this. Tap ✗ if you haven't. |
| `onboarding_tinder_tally` | You're not alone — most musicians say yes to {0} of 4 before they download this app. |
| `onboarding_value_card_dictionary_action` | Look them up |
| `onboarding_value_card_dictionary_label` | 🔍  Your first chords to look up |
| `onboarding_value_card_dictionary_meta` | Keys, notes, fingering and sound — in one tap. |
| `onboarding_value_card_library_label` | ☁️  Your library, everywhere |
| `onboarding_value_card_library_meta` | Keep your chords, scales and progressions on every device. |
| `onboarding_value_card_library_title` | Save & sync across devices |
| `onboarding_value_card_progression_action` | Open |
| `onboarding_value_card_progression_label` | 🎵  Your first famous progression |
| `onboarding_value_card_quickstart_action` | Show me |
| `onboarding_value_card_quickstart_label` | 🎹  Quick-start guide |
| `onboarding_value_card_quickstart_meta` | Reverse lookup, hearing scales, building your own chords. |
| `onboarding_value_card_quickstart_title` | 3 things to do right now |
| `onboarding_value_h1` | Your starter pack is ready! |
| `onboarding_value_share` | Share my starter pack |
| `onboarding_value_share_body` | Just set up my account — they recommended I start with {0} and {1}. The reverse-lookup feature is unreal. Check it out: https://apps.apple.com/app/id586097063 |
| `onboarding_value_share_subject` | I'm learning piano with Piano Companion 🎹 |
| `onboarding_value_sub` | Based on your goal — {0} — and your level — {1}. |
| `onboarding_welcome_h1` | Your shortcut to every chord, scale, and song you've ever wanted to play. |
| `onboarding_welcome_pill` | ★ 4.7 · 1M+ downloads |
| `onboarding_welcome_sub` | Built for self-taught pianists. No music degree required. |
| `one_time_payment` | One-time payment |
| `open_separate_window` | Open in new window |
| `or` | Or |
| `other` | Other |
| `other_names` | Other names |
| `overwrite_current_progression` | Overwrite Current Progression |
| `overwrite_record` | Overwrite record {0}? |
| `parallel_mode` | Parallel Mode Chords |
| `parallel_notation_indianhindustani` | Indian - Hindustani |
| `parallel_notation_none` | None |
| `password` | Password |
| `pattern` | Pattern |
| `patterns` | Patterns |
| `paywall_review_1` | Every chord I need for lessons, right at my fingertips. |
| `paywall_review_2` | Finally understood scales thanks to this app. Worth it. |
| `paywall_review_3` | Progression builder saved me hours of noodling. |
| `paywall_review_4` | Scale library is unreal. Modes, jazz, ethnic — all there. |
| `paywall_review_5` | Hit any chord, see every extension. 7ths, 9ths, 13ths — brilliant. |
| `paywall_review_6` | Connect MIDI keyboard, reverse-lookup chords live. Game changer. |
| `paywall_review_7` | The inversions feature helped me play smoother. |
| `piano` | Piano |
| `piano_keys_larger` | Larger keys |
| `piano_keys_smaller` | Smaller keys |
| `piano_teaser_banner` | See the name of every chord you play |
| `piano_teaser_last` | Last free chord today |
| `piano_teaser_locked` | Chord names · PRO |
| `piano_teaser_new` | New |
| `piano_teaser_unlock` | Unlock |
| `play` | Play |
| `play_arpeggio` | Play Arpeggio |
| `play_as_arpeggio` | Play as Arpeggio |
| `play_in_songtive` | Play in Songtive |
| `play_panel` | Play Panel |
| `play_your_pattern` | Play your pattern how a single chord should be played. |
| `plays_in_background` | Plays in the Background |
| `please_input_chord` | Please input a chord with at least 3 intervals, e.g. CMinor: 1 b3 5 |
| `pno_8va` | 8va |
| `pno_8va_desc` | Play one octave higher than written |
| `pno_8vb` | 8vb |
| `pno_8vb_desc` | Play one octave lower than written |
| `pno_brace` | Grand staff |
| `pno_brace_desc` | Treble and bass staff joined by a brace |
| `pno_fingering` | Fingering |
| `pno_fingering_desc` | 1 = thumb, 5 = little finger |
| `pno_gliss` | Glissando |
| `pno_gliss_desc` | Slide quickly across the keys |
| `pno_grace` | Grace note |
| `pno_grace_desc` | A very quick note just before the main note |
| `pno_mordent` | Mordent |
| `pno_mordent_desc` | The note, the note below, the note again |
| `pno_pedal` | Sustain pedal |
| `pno_pedal_desc` | Press the right pedal |
| `pno_pedal_up` | Pedal release |
| `pno_pedal_up_desc` | Lift the pedal |
| `pno_trill` | Trill |
| `pno_trill_desc` | Alternate fast with the note above |
| `pno_turn` | Turn |
| `pno_turn_desc` | Note above, the note, note below, the note |
| `popular_badge` | POPULAR |
| `practice` | Practice |
| `practice_again` | Practice again |
| `practice_attribution` | Arrangement: {0} |
| `practice_difficulty_1` | Easy |
| `practice_difficulty_2` | Intermediate |
| `practice_difficulty_3` | Advanced |
| `practice_download_failed` | The song did not download. Try again. |
| `practice_file_failed` | This file cannot be opened. Choose a standard MIDI file (.mid). |
| `practice_hands` | Hands |
| `practice_hands_both` | Both hands |
| `practice_hands_left` | Left hand |
| `practice_hands_right` | Right hand |
| `practice_hide_keyboard` | Hide keyboard |
| `practice_load_failed` | The songs did not load. Check the connection and try again. |
| `practice_midi_hint` | The keyboard is hidden. Play on a MIDI keyboard. |
| `practice_no_results` | No song for “{0}” yet. We keep a note of every search to choose the next songs. |
| `practice_open_file` | Open MIDI file |
| `practice_other_song` | Choose another song |
| `practice_popular` | Popular |
| `practice_restart` | Start again |
| `practice_result_notes` | {0} of {1} notes correct on the first try |
| `practice_result_time` | Time {0} |
| `practice_results` | Results |
| `practice_search_hint` | Search a song or a composer |
| `practice_show_keyboard` | Show keyboard |
| `practice_songs` | Practice |
| `practice_speed` | Speed |
| `practice_try_again` | Try again |
| `practice_wait_hint` | Play the marked keys. The song waits for you. |
| `pressed` | Pressed |
| `prestissimo` | Prestissimo |
| `presto` | Presto |
| `preview` | Preview |
| `previous_records` | Previous records |
| `price_per_month_format` | {0} / month |
| `price_per_week_format` | {0} / week |
| `price_per_year_format` | {0} / year |
| `principal` | Principal |
| `privacy_policy` | Privacy Policy |
| `private_item` | Private record |
| `pro_feat_circle_desc` | Every related key, chord, and scale — one tap on the wheel. |
| `pro_feat_circle_title` | Interactive Circle of Fifths |
| `pro_feat_custom_desc` | Invent voicings, tweak any chord or scale, save them to your library. |
| `pro_feat_custom_title` | Your Chords, Your Scales |
| `pro_feat_progressions_desc` | Drop chords in-key, loop them, export MIDI to your DAW. |
| `pro_feat_progressions_title` | Progressions That Fit the Key |
| `pro_feat_reverse_desc` | Play the keys or hook up MIDI — we name the chord instantly. |
| `pro_feat_reverse_title` | What Chord Is That? |
| `pro_feat_scales_desc` | Jazz, modal, ethnic — with fingering for both hands, right on the staff. |
| `pro_feat_scales_title` | 10,000+ Scales & Modes |
| `pro_feat_voicings_desc` | Triads to 13ths, 1st–6th inversions — the voicing you need, instantly. |
| `pro_feat_voicings_title` | Every Inversion, Every Extension |
| `progression_library` | Progression Library |
| `progression_library_category_all` | All |
| `progression_library_category_blues` | Blues |
| `progression_library_category_classical` | Classical |
| `progression_library_category_film` | Film |
| `progression_library_category_folk` | Folk |
| `progression_library_category_jazz` | Jazz |
| `progression_library_category_latin` | Latin |
| `progression_library_category_pop` | Pop |
| `progression_library_category_rock` | Rock |
| `progression_library_category_worship` | Worship |
| `progression_library_empty` | No matching progressions. |
| `progression_library_key_label` | Key: {0} |
| `progression_library_play_preview` | Play preview |
| `progression_library_pro_only` | PRO only |
| `progression_library_search_hint` | Search progressions, keys, songs |
| `progression_library_used_in` | Used in: {0} |
| `progression_overwritten_warning` | The progression will be overwritten. Do you want to continue? |
| `progression_too_short` | The progression is too short. |
| `promo_badge` | −{0}% |
| `promo_countdown_days` | {0}d {1} |
| `promo_cta` | Get {0}% off — {1} |
| `promo_ends_in_caption` | Ends in |
| `promo_ends_on` | Ends {0} |
| `promo_note_months_one` | first month, then {1}/month |
| `promo_note_months_other` | first {0} months, then {1}/month |
| `promo_note_weeks_one` | first week, then {1}/week |
| `promo_note_weeks_other` | first {0} weeks, then {1}/week |
| `promo_note_years_one` | first year, then {1}/year |
| `promo_note_years_other` | first {0} years, then {1}/year |
| `promo_summary` | {0} now, {1} |
| `promo_title_back_to_school` | Back-to-school sale |
| `promo_title_birthday` | Piano Companion birthday sale |
| `promo_title_black_friday` | Black Friday |
| `promo_title_cyber_monday` | Cyber Monday |
| `promo_title_flash` | Flash sale |
| `promo_title_holiday` | Holiday sale |
| `promo_title_limited` | Limited-time offer |
| `promo_title_new_year` | New Year sale |
| `promo_title_special` | Special offer |
| `promo_title_spring` | Spring sale |
| `promo_title_summer` | Summer sale |
| `promo_title_weekend` | Weekend deal |
| `publish_worldwide` | Publish |
| `purchases_restored` | Purchases have been restored. |
| `quick_tools_add` | Add a tool |
| `quick_tools_edit_title` | Edit quick tools |
| `quick_tools_hint_many` | Choose up to six tools for your home screen |
| `quick_tools_remove` | Remove {0} |
| `quick_tools_restore` | Restore default shortcuts |
| `quick_tools_slot` | Slot {0} |
| `quiz` | Quiz |
| `rate` | Rate |
| `rather_broadly` | Rather broadly |
| `rating_badge` | Rating<br>★ 4.7 |
| `recent` | Recent |
| `recent_chords` | Recent chords |
| `record` | Record |
| `record_custom_pattern` | Record custom pattern |
| `reduced_music_rate` | Reduced music rate from 44k to 11k due-to old Android version. |
| `register_now` | Register Now |
| `relative_minor` | Relative Minor |
| `relative_scales` | Relative |
| `reminder_day1_body` | 30 seconds. Tap to hear it and see what sounds great with it. |
| `reminder_day1_title` | Today's chord: {0} |
| `remixes` | Remixes |
| `remove_last_row` | Remove last row |
| `rep_coda` | Coda |
| `rep_coda_desc` | Jump to the final section |
| `rep_dc` | D.C. (Da capo) |
| `rep_dc_desc` | Go back to the beginning |
| `rep_ds` | D.S. (Dal segno) |
| `rep_ds_desc` | Go back to the segno sign |
| `rep_end` | End repeat |
| `rep_end_desc` | Go back to the start repeat sign |
| `rep_endings` | 1st and 2nd endings |
| `rep_endings_desc` | Play ending 1 the first time, ending 2 the second time |
| `rep_fine` | Fine |
| `rep_fine_desc` | The end, after D.C. or D.S. |
| `rep_segno` | Segno |
| `rep_segno_desc` | The sign D.S. sends you back to |
| `rep_start` | Start repeat |
| `rep_start_desc` | Repeat from here |
| `repeats` | Repeats |
| `report` | Report |
| `reset` | Reset |
| `resolve_ambiguity_with` | Resolve ambiguity with |
| `rest_1` | Whole Rest |
| `rest_128` | One Hundred and Twenty-eighth Rest |
| `rest_16` | Sixteenth Rest |
| `rest_1dbl` | Double-whole Rest |
| `rest_2` | Half Rest |
| `rest_32` | Thirty-second Rest |
| `rest_4` | Quarter Rest |
| `rest_64` | Sixty-fourth Rest |
| `rest_8` | Eighth Rest |
| `restart_to_apply_language` | NOTE: you have to restart the app to apply language changes. |
| `restore_purchases` | Restore Purchases |
| `restore_purchases_failed` | Failed to restore purchases. See FAQ or contact us: support@songtive.com |
| `rests` | Rests |
| `retry` | Retry |
| `reverse_chord_lookup` | Reverse Chord Lookup |
| `reverse_chord_lookup_staff` | Staff Lookup |
| `reverse_scale_lookup` | Reverse Scale Lookup |
| `rhythm_ledger` | Ledger lines |
| `rhythm_ledger_desc` | Short lines for notes above or below the staff |
| `rhythm_triplet` | Triplet |
| `rhythm_triplet_desc` | Three notes in the time of two |
| `root` | Root |
| `root_position` | Root position |
| `s` | S |
| `same_length_finger` | Left and right fingering must be the same length |
| `sar_position` | Sar Position |
| `save` | Save |
| `save_percent_format` | SAVE {0}% |
| `scale` | Scale |
| `scale_chords` | Scale Chords |
| `scale_lookup` | Scales Dictionary |
| `scale_lookup_description` | Favourite scales, common scale chords, custom scales, edit existing scales, mark favourite, scale chords. |
| `scale_lookup_pro_feature` | Common scale chords. |
| `search` | Search |
| `second_inversion` | 2nd inversion |
| `second_octave` | Second octave |
| `secondary_dominant` | Secondary Dominant |
| `secondary_leading_tone` | Secondary Leading-Tone |
| `seconds_ago` | seconds ago |
| `section_learn_help` | Learn & help |
| `select_chord` | Select chord |
| `select_current_chord_using_menu` | Select current chord using menu (or toolbar). |
| `select_current_scale_using_menu` | Select current scale using menu (or toolbar). |
| `select_library` | Select Library |
| `select_scale` | Select scale |
| `selected_on_circle_of_fifths` | selected on circle of fifths |
| `selected_scale` | Selected Scale |
| `send_feedback` | Send feedback |
| `send_fingering` | Contribute fingering |
| `send_midi` | Send MIDI file |
| `settings` | Settings |
| `settings_about_app` | About Piano Companion |
| `settings_advanced` | Advanced |
| `settings_appearance` | Appearance |
| `settings_contact_support` | Contact support |
| `settings_help_info` | Help & information |
| `settings_help_sub` | Questions and answers |
| `settings_home` | Home screen |
| `settings_purchases` | Purchases |
| `settings_purchases_sub` | Plans, PRO features and your purchase |
| `settings_reset_purchases` | Reset test purchases |
| `settings_share_app` | Share Piano Companion |
| `settings_theme` | Theme |
| `seventh` | Seventh |
| `sevenths` | Sevenths |
| `share` | Share |
| `share_record_prompt` | Saved. Share this recording with a link? |
| `shop` | Shop |
| `show_11th_chords` | Show 11th Chords |
| `show_13th_chords` | Show 13th Chords |
| `show_9th_chords` | Show 9th Chords |
| `show_chord_names` | Show chord names |
| `show_notes` | Show notes |
| `show_only_popular_scales` | Show only popular scales |
| `sign_in` | Sign in |
| `sign_in_google` | Continue with Google |
| `sign_in_to_share` | Sign in to share your recording as a link. |
| `sign_out` | Sign out |
| `silence` | Rest |
| `sixth_inversion` | 6th inversion |
| `skip` | Skip |
| `slightly_faster_than` | Slightly faster than {0} |
| `slow_device_support` | Slow device support |
| `slower_than` | Slower than {0} |
| `slowly` | Slowly |
| `slowly_with_great_expression` | Slowly with great expression |
| `song` | Song |
| `songbook` | Songs |
| `songbook_add_chord` | Add chord |
| `songbook_add_line` | Add line |
| `songbook_add_section` | Add section |
| `songbook_author_hint` | Author |
| `songbook_autoscroll` | Auto-scroll |
| `songbook_autoscroll_speed` | Speed |
| `songbook_autoscroll_start` | Start |
| `songbook_autoscroll_stop` | Stop auto-scroll |
| `songbook_beats_default` | Default ({0}) |
| `songbook_by_author` | Words & Music by {0} |
| `songbook_change_chord` | Change chord |
| `songbook_copy_line` | Copy line |
| `songbook_copy_section` | Copy section |
| `songbook_copy_title` | {0} (copy) |
| `songbook_date` | Date |
| `songbook_delete_confirm` | Delete "{0}"? |
| `songbook_delete_section` | Delete section |
| `songbook_delete_section_confirm` | Delete this section and its lines? |
| `songbook_duplicate_line` | Duplicate line |
| `songbook_duplicate_section` | Duplicate section |
| `songbook_empty` | No songs yet — tap "New song" to write one |
| `songbook_export_midi` | Export MIDI |
| `songbook_insert_line_above` | Insert line above |
| `songbook_insert_line_below` | Insert line below |
| `songbook_insert_progression` | Insert progression… |
| `songbook_key_none` | — |
| `songbook_lyrics_hint` | Type lyrics… |
| `songbook_my_progressions` | My progressions |
| `songbook_new_song` | New song |
| `songbook_paste_line` | Paste line below |
| `songbook_paste_section` | Paste section |
| `songbook_print` | Print |
| `songbook_search_hint` | Search songs |
| `songbook_section_bridge` | Bridge |
| `songbook_section_chorus` | Chorus |
| `songbook_section_custom` | Custom… |
| `songbook_section_hint` | Section (e.g. Verse 1) |
| `songbook_section_intro` | Intro |
| `songbook_section_outro` | Outro |
| `songbook_section_prechorus` | Pre-Chorus |
| `songbook_section_solo` | Solo |
| `songbook_section_verse` | Verse |
| `songbook_share_pdf` | Share as PDF |
| `songbook_title_hint` | Title |
| `songbook_untitled` | Untitled song |
| `songbook_view_diagrams` | Show diagrams |
| `songbook_view_names` | Show chord names |
| `songtive_account_username` | Username |
| `songtive_is_not_installed` | Songtive is not installed; you won't be able to hear how chords sound with different instruments and arrangements. |
| `sound` | Sound |
| `sounds_great_with` | Sounds great with |
| `special_thanks` | Special thanks go to |
| `staff` | Staff |
| `start_free_trial` | Start Free Trial |
| `stay_awake` | Stay awake |
| `stay_awake_summary` | Screen will never sleep while lookup screen is open |
| `stop` | Stop |
| `strict_filter` | Strict filter |
| `strict_search` | Strict Search |
| `style` | Style |
| `subscribe` | Subscribe |
| `subscription_disclaimer` | Payment will be charged to iTunes Account at confirmation of purchase. Subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period. Account will be charged for renewal within 24 hours prior to the end of the current period, and identify the cost of the renewal. Subscriptions may be managed by the user and auto-renewal may be turned off by going to the user's Account Settings after purchase. |
| `subscription_section` | Subscription |
| `suggestion` | Suggestion |
| `suppress_sound` | Suppress Sound |
| `symbol_alto_clef` | Alto Clef |
| `symbol_alto_clef_desc` | C clef. The middle line is middle C |
| `symbol_bar_line` | Bar Line |
| `symbol_bar_line_desc` | Divides the staff into measures |
| `symbol_bass_clef` | Bass Clef |
| `symbol_bass_clef_desc` | F clef. Lower notes, usually the left hand |
| `symbol_dot` | Augmentation Dot |
| `symbol_dot_desc` | Adds half of the note's value |
| `symbol_double_bar_line` | Double Bar Line |
| `symbol_double_bar_line_desc` | Marks the end of a section |
| `symbol_double_flat` | Double Flat |
| `symbol_double_flat_desc` | Lowers a note by a whole step |
| `symbol_double_sharp` | Double Sharp |
| `symbol_double_sharp_desc` | Raises a note by a whole step |
| `symbol_final_bar_line` | Final Bar Line |
| `symbol_final_bar_line_desc` | Marks the end of the piece |
| `symbol_flat` | Flat |
| `symbol_flat_desc` | Lowers a note by a half step |
| `symbol_natural` | Natural |
| `symbol_natural_desc` | Cancels a sharp or a flat |
| `symbol_repeat_sign` | Repeat Sign |
| `symbol_repeat_sign_desc` | Play the section again |
| `symbol_sharp` | Sharp |
| `symbol_sharp_desc` | Raises a note by a half step |
| `symbol_staff` | Staff |
| `symbol_staff_desc` | 5 lines and 4 spaces |
| `symbol_treble_clef` | Treble Clef |
| `symbol_treble_clef_desc` | G clef. Higher notes, usually the right hand |
| `symbols` | Symbols |
| `symbols_articulations` | Articulations |
| `symbols_dynamics` | Dynamics |
| `symbols_piano` | Piano |
| `symbols_repeats` | Repeats |
| `symbols_signs` | Clefs & Signs |
| `symbols_time` | Time & Rhythm |
| `tags` | Tags |
| `tap_to_select_chord` | Tap to select chord |
| `tap_to_set_tempo` | Tap to set tempo |
| `tempo` | Tempo |
| `terms_and_conditions` | Terms and Conditions |
| `terms_of_use` | Terms of Use |
| `thank_you` | Thank you! |
| `theme_dark` | Dark |
| `theme_light` | Light |
| `theme_system` | Same as device |
| `third_inversion` | 3rd inversion |
| `thirteenths` | Thirteenths |
| `time_2_4` | 2/4 time |
| `time_2_4_desc` | 2 quarter-note beats in each measure (march) |
| `time_3_4` | 3/4 time |
| `time_3_4_desc` | 3 quarter-note beats in each measure (waltz) |
| `time_4_4` | 4/4 time |
| `time_4_4_desc` | 4 quarter-note beats in each measure |
| `time_6_8` | 6/8 time |
| `time_6_8_desc` | 6 eighth notes, felt as 2 beats |
| `time_common` | Common time |
| `time_common_desc` | The same as 4/4 |
| `time_cut` | Cut time |
| `time_cut_desc` | The same as 2/2: two half-note beats |
| `to` | To |
| `touch_piano_key_to_start_filtering` | Touch piano key to start filtering. |
| `transcribe_bought` | {0} added |
| `transcribe_buy` | Buy {0} |
| `transcribe_choose_file` | Choose a video or audio file |
| `transcribe_confirm_account` | Your songs and credits are kept in your account. |
| `transcribe_confirm_balance` | You have {0} left |
| `transcribe_confirm_cost` | Uses 1 song credit |
| `transcribe_confirm_cost_n_one` | Uses {0} song credit |
| `transcribe_confirm_cost_n_other` | Uses {0} song credits |
| `transcribe_confirm_length` | Up to 6 minutes per credit. A longer song (up to 12 minutes) uses 2. |
| `transcribe_confirm_pages` | 1 credit reads up to 3 pages of printed music. |
| `transcribe_confirm_rights` | I use this music for my own practice and study |
| `transcribe_confirm_title` | Get the notes? |
| `transcribe_credits_cd` | Song credits: {0}. Open to get more |
| `transcribe_credits_chip` | {0} song credits |
| `transcribe_credits_chip_one` | 1 song credit |
| `transcribe_credits_chip_zero` | No credits |
| `transcribe_credits_footer` | Bought songs never expire. 1 song = up to 6 minutes of audio. |
| `transcribe_credits_hero_new` | Turn any song into notes |
| `transcribe_credits_left` | {0} songs left |
| `transcribe_credits_left_one` | 1 song left |
| `transcribe_credits_left_zero` | No songs left |
| `transcribe_credits_lifetime_line` | Buy songs when you need them |
| `transcribe_credits_next` | Your next free song: {0} |
| `transcribe_credits_pro_line` | A PRO subscription adds free songs |
| `transcribe_credits_title` | Song credits |
| `transcribe_demo` | Try the demo song |
| `transcribe_demo_sub` | See a finished transcription. It uses no credit |
| `transcribe_error_daily_limit` | You reached today's limit of songs. Try again tomorrow. |
| `transcribe_error_job_running` | Another song is still being transcribed. Wait until it is ready. |
| `transcribe_error_too_large` | This file is larger than {0} MB. Choose a shorter recording. |
| `transcribe_full_song` | Get the full song |
| `transcribe_get_notes` | Get the notes |
| `transcribe_get_pro_sub` | Free songs with a PRO subscription, plus every PRO tool |
| `transcribe_get_pro_title` | Get PRO |
| `transcribe_how_1` | Share a video to Piano Companion, or paste its link |
| `transcribe_how_2` | We write the notes for you. It takes 1–3 minutes |
| `transcribe_how_3` | Play along with falling notes, or save the sheet music as PDF or MIDI |
| `transcribe_how_title` | How it works |
| `transcribe_link_hint` | TikTok, Instagram or Facebook link |
| `transcribe_link_title` | Paste a link |
| `transcribe_link_unsupported` | Use a TikTok, Instagram or Facebook link, or choose a file. |
| `transcribe_no_credits` | You have no song credits left. |
| `transcribe_or_buy` | Or buy songs |
| `transcribe_pack_1` | 1 song |
| `transcribe_pack_best` | Best value |
| `transcribe_pack_each` | {0} per song |
| `transcribe_pack_n` | {0} songs |
| `transcribe_pages_one` | {0} page |
| `transcribe_pages_other` | {0} pages |
| `transcribe_paste` | Paste |
| `transcribe_payment_pending_apple` | Payment pending. Your songs are added when the App Store confirms it. |
| `transcribe_preview_fact` | Hear the first 20 seconds free |
| `transcribe_preview_fact_scan` | Read the first page free |
| `transcribe_preview_fact_sub` | The full song uses 1 song credit. A PRO subscription adds free songs. |
| `transcribe_preview_free` | Preview 20 seconds free |
| `transcribe_preview_free_scan` | Read page 1 free |
| `transcribe_preview_used` | You used your free preview. |
| `transcribe_recent_home_sub` | Song · {0} |
| `transcribe_recent_practise` | Practise {0} |
| `transcribe_recent_sheet` | Open the notes and sheet |
| `transcribe_recent_title` | Continue practising |
| `transcribe_scan` | Scan sheet music |
| `transcribe_scan_camera` | Scan with the camera |
| `transcribe_scan_files` | Choose a PDF or image file |
| `transcribe_scan_photos` | Choose photos |
| `transcribe_sign_in` | Sign in to continue |
| `transcribe_source_demo` | Demo |
| `transcribe_source_facebook` | Facebook |
| `transcribe_source_file` | File |
| `transcribe_source_instagram` | Instagram |
| `transcribe_source_scan` | Sheet music |
| `transcribe_source_tiktok` | TikTok |
| `transcribe_source_youtube` | YouTube |
| `transcribe_status_downloading` | Getting the video… |
| `transcribe_status_extracting` | Taking out the audio… |
| `transcribe_status_failed` | Not transcribed · credit returned |
| `transcribe_status_left` | About {0} min left |
| `transcribe_status_preview` | Preview · first 20 seconds |
| `transcribe_status_preview_scan` | Preview · first page |
| `transcribe_status_queued` | Waiting to start… |
| `transcribe_status_transcribing` | Writing the notes… |
| `transcribe_tip` | Videos: one instrument works best, up to 12 minutes. Sheet music: printed, not handwritten. |
| `transcribe_title` | Transcribe |
| `transcribe_too_many_pages` | Choose up to {0} pages at a time. |
| `transcribe_untitled` | {0} video · {1} |
| `transcribe_untitled_scan` | Sheet music · {0} |
| `transcribe_yours` | Your transcriptions |
| `transcription_bpm` | {0} BPM |
| `transcription_chords` | Chords |
| `transcription_delete` | Delete |
| `transcription_delete_confirm` | Delete this transcription? |
| `transcription_export_midi` | Export MIDI |
| `transcription_export_musicxml` | Export MusicXML |
| `transcription_failed_blocked` | This link cannot be opened. Save the video to your phone and choose the file instead. |
| `transcription_failed_choose_file` | Choose a file |
| `transcription_failed_credit` | Your credit is back in your account. |
| `transcription_failed_long` | This recording is longer than 12 minutes. |
| `transcription_failed_no_music` | We could not hear music in this recording. |
| `transcription_failed_other` | Something went wrong. Try again in a few minutes. |
| `transcription_failed_private` | This video is private. Only public videos can be transcribed. |
| `transcription_failed_title` | We could not transcribe this song |
| `transcription_more` | More options |
| `transcription_notes` | Notes |
| `transcription_open_failed` | This file cannot be opened. |
| `transcription_pause` | Pause |
| `transcription_play` | Play |
| `transcription_practise` | Practise with falling notes |
| `transcription_preview_banner` | You are listening to the first 20 seconds. |
| `transcription_share_pdf` | Share PDF |
| `transcription_sheet` | Sheet |
| `transcription_sheet_locked` | The sheet music comes with the full song. |
| `transcription_speed` | Speed |
| `transcription_step_audio` | Take out the audio |
| `transcription_step_build` | Build the song |
| `transcription_step_get` | Get the video |
| `transcription_step_music` | Find the notes |
| `transcription_step_notes` | Write the notes |
| `transcription_step_pages` | Read the pages |
| `transcription_trim` | Trim |
| `transcription_trim_body` | Keep only the part you want to practise. Drag the two handles to cut a lesson or talk at the start or at the end. |
| `transcription_trim_chip` | Part {0}–{1} |
| `transcription_trim_end` | End {0} |
| `transcription_trim_end_earlier` | End earlier |
| `transcription_trim_end_later` | End later |
| `transcription_trim_failed` | The song could not be trimmed. |
| `transcription_trim_found` | The playing seems to go from {0} to {1}. |
| `transcription_trim_hint` | This video seems to start with a lesson. Keep only the playing? |
| `transcription_trim_hint_close` | Close |
| `transcription_trim_keeps` | Keeps {0} |
| `transcription_trim_play` | Play the kept part |
| `transcription_trim_reset` | Keep the whole song |
| `transcription_trim_save` | Save |
| `transcription_trim_saved` | Only the part you kept plays now. |
| `transcription_trim_sheet_note` | The sheet music and MusicXML stay the whole recording. |
| `transcription_trim_sheet_whole` | The sheet shows the whole recording. Notes, practice and MIDI use the part you kept. |
| `transcription_trim_start` | Start {0} |
| `transcription_trim_start_earlier` | Start earlier |
| `transcription_trim_start_later` | Start later |
| `transcription_trim_timeline` | Song timeline. Drag the handles to choose the part to keep. |
| `transcription_trim_title` | Trim the song |
| `transcription_trim_use_found` | Keep this part |
| `transcription_try_another` | Try another song |
| `transcription_working_sub` | You can leave this screen. We keep working and the song appears in Transcribe when it is ready. |
| `transcription_working_title` | Writing the notes |
| `transcription_your_photos` | Your photos |
| `translate_theory_names` | Translate chord & scale names |
| `transpose` | Transpose |
| `triads` | Triads |
| `trial_reminder_body` | PRO renews on {0}. To stop it, cancel in {1} before then. |
| `trial_reminder_title` | Your free trial ends tomorrow |
| `trial_then_price_one` | {0} day free, then {1}. Cancel anytime. |
| `trial_then_price_other` | {0} days free, then {1}. Cancel anytime. |
| `trial_timeline_charge_body` | You pay {0}. Cancel any time before. |
| `trial_timeline_remind_body` | We send you a reminder |
| `trial_timeline_title` | How your free trial works |
| `trial_timeline_today` | Today |
| `trial_timeline_today_body` | Full access to all PRO features |
| `try_for_free` | Try 3 days free \|\|then {0}/year. Cancel anytime. |
| `twitter` | Twitter |
| `type` | Type |
| `unexpected_error_message` | Unexpected service error, please try again later. |
| `unexpected_error_title` | Oops! |
| `unlock_forever` | Unlock Forever |
| `unlock_pro_features` | Unlock Pro Features |
| `up` | Up |
| `user_library` | User Library |
| `username_or_email` | Username or email |
| `users_badge` | 5M+<br>Users |
| `version` | Version |
| `very_fast` | Very fast |
| `very_fast_and_lively` | Very fast and lively |
| `very_slow` | Very slow |
| `very_slowly` | Very slowly |
| `very_very_fast` | Very, very fast |
| `very_very_slow` | Very, very slow |
| `view_mode` | View mode |
| `views` | Views |
| `visibility` | Visibility |
| `vivace` | Vivace |
| `vivacissimo` | Vivacissimo |
| `votes` | Votes |
| `weekly` | Weekly |
| `whats_new_ann_title` | What's New |
| `white` | White |
| `why_pro` | Why upgrade to Pro |
| `without_inversions` | Excludes inversions from Reverse Lookup |
| `year` | Year |
| `yearly` | Yearly |
| `years_ago` | years ago |
| `yes` | Yes |
| `yesterday` | yesterday |

## 6. Note-name notation per language

Note names are not in the TSVs; they come from `Songtive.Services.NoteService` (Songtive.Engine.OSX). **exact**

| Notation (`Notation` enum) | Natural notes C D E F G A B |
|---|---|
| English | C, D, E, F, G, A, B |
| Italian | Do, Re, Mi, Fa, Sol, La, Si |
| French | Do, Ré, Mi, Fa, Sol, La, Si |
| Russian | До, Ре, Ми, Фа, Соль, Ля, Си |
| German | C, D, E, F, G, A, **H** (flats `Ces Des Es Fes Ges As B`; sharps `Cis Dis Eis Fis Gis Ais His`) |
| Japanese | ハ, ニ, ホ, ヘ, ト, イ, ロ |
| Korean | 도, 레, 미, 파, 솔, 라, 시 |
| ChineseNumbers | 一, 二, 三, 四, 五, 六, 七 |
| Numbers | 1–7 |
| Parallel: IndianHindustani | Sa, Re, Ga, ma, Pa, Dha, Ni (altered: r, g, G, M, d, dha, n) |

Default notation on first run (`NoteService.GetDefaultNotation(LanguageSubtag(locale))`): **German** for de, no, nb, nn, da, is, cs, bs, fi, et, lt, lv, sk, mk, hu, sl, hr, sr, sq; **French** for fr; **Italian** for he, ro, ca, fa, es, it, eu, gl, el, iw; **English** for everything else — including **ru** and uk, so Russian users see C D E… by default and must pick "Russian" notation manually. Parallel notation defaults to IndianHindustani only for hi. **exact**
