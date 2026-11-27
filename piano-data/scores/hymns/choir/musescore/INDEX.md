# The choir's songs: what each one has

Every song in this folder, with the files it has and the state of its full MuseScore score. The goal for each 
song is one MuseScore file with a separate part for each voice (Soprano, Alto, Tenor, Bass; for the men's choir 
Tenor 1, Tenor 2, Baritone, Bass), the words under every part, and piano as its sound. Written by 
`python3 scripts/choir index` from the files; run it again after a change.

That file is `<song> (SATB).mscz` in a mixed choir song's folder and `<song> (TTBB).mscz` in a men's, made by 
`python3 scripts/choir build` (see `scripts/choir/README.md`). It is set in the house style 
(`template/house.mss`) and corrected inside: each staff named for the voices it holds, every instrument 
playing piano, each voice in the octave it sings (many files write the men an octave high; a plain treble 
staff of men takes the tenor clef, so the page looks the same), and a part for every voice saved in the file, 
tied to its voice of the score, with the words under it. A song with no full score but a one-voice file for 
every voice gets a two-staff score put together from those files. A song matched to its printed sheet 
(its `match.txt`, see `MATCHING.md`) has its words, notes, marks and line breaks as printed. A song with only 
a PDF, a full score left unfinished, or no file for some voice has its voices written in from the sheet.

Columns: **Score** the full MuseScore score (how many); **Shape** its staves, voices per staff and bars, and 
"chords" where two voices are written as one chord; **Words** lyrics in the score; **Parts** separate voice parts 
saved in it; **Voice files** separate MuseScore files per voice; **PDF**, **XML** (MusicXML), **Img** counts; 
**Sound** piano when every instrument plays piano.


## Summary

| Choir | Songs | Done | To do | To check | Single voices only, no full score | No MuseScore | No folder (in the book only) | Unreadable |
| --- | --: | --: | --: | --: | --: | --: | --: | --: |
| Mixed choir | 107 | 57 | 5 | 1 | 22 | 21 | 1 | 0 |
| Men's choir | 41 | 21 | 0 | 0 | 3 | 17 | 0 | 0 |

## Mixed choir (`Cântări corul mixt/`)

| Nr | Song | State | Score | Shape | Words | Parts | Voice files | PDF | XML | Img | Sound |
| --: | --- | --- | :-: | --- | :-: | --- | --- | --: | --: | --: | --- |
| 1 | Binecuvântat să fie Domnul | Done: as printed (matched to its PDF) | – | – | – | – | – | 1 | 1 |  | – |
| 2 | Glas de trâmbiți a sunat | Done: as printed (matched to its PDF) | – | – | – | – | – | 1 | 1 |  | – |
| 3 | La Calvar | Done: as printed (matched to its PDF) | – | – | – | – | – | 1 | 1 |  | – |
| 4 | Ce poate fi mai minunat | Done: as printed (matched to its PDF) | – | – | – | – | – | 1 | 1 |  | – |
| 5 | Mărire Ție, Isuse | Done: as printed (matched to its PDF) | – | – | – | – | – | 1 | 1 |  | – |
| 6 | Du-mă la izvorul | Done: as printed (matched to its PDF) | – | – | – | – | – | 1 | 1 |  | – |
| 7 | Nu nouă Doamne | Done: as printed (matched to its PDF) | – | – | – | – | – | 1 | 1 |  | – |
| 8 | De-atâția ani | Done: as printed (matched to its PDF) | – | – | – | – | – | 1 | 1 |  | – |
| 9 | Eram jos în păcat | Done: as printed (matched to its PDF) | 1 | 2 staves, voices 2/2, 17 bars, `009. Eram jos în păcat.mscz` | no | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | piano |
| 10 | Rătăceam în păcat și pierzare | Done: as printed (matched to its PDF) | 1 | 2 staves, voices 1/2, 53 bars, `010. Rătăceam în păcat și pierzare.mscz` | no | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | piano |
| 11 | Ce nume minunat | Done: as printed (matched to its PDF) | 4 | 2 staves, voices 2/2, 26 bars, `011. Ce Nume minunat.mscz` | no | – | Soprano, Alto, Tenor, Bass | 2 | 1 |  | piano |
| 12 | Crucea-i ascultarea | Done: as printed (matched to its PDF) | 1 | 2 staves, voices 2/2, 32 bars, `012. Crucea-i ascultarea.mscz` | no | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | piano |
| 13 | Trece Isus pe-aici | Done: as printed (matched to its PDF) | 1 | 2 staves, voices 2/2, 16 bars, `013. Trece Isus pe-aici.mscz` | no | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | piano |
| 14 | Când Duhul Sfânt S-a coborât (1 subfolders) | Single voices only, no full score | – | – | – | – | Alto, Tenor | 1 |  |  | – |
| 15 | Cântați pe Isus cu iubire | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 16 | Te iubesc Isuse | Done: as printed (matched to its PDF) | 1 | 2 staves, voices 1/2, 17 bars, `016. Te iubesc Isuse.mscz` | no | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | piano |
| 17 | Îmi ridic ochii spre munți | To do: its file leaves whole voices out; write them in from the PDF | 2 | 2 staves, voices 1/1, 87 bars, `017. Îmi ridic ochii spre munți.mscz` | no | – | Tenor | 1 | 1 |  | piano |
| 18 | Cineva se-ngrijește de mine | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 19 | Luceafărul Maranata (1 subfolders) | To do: its file leaves whole voices out; write them in from the PDF | 3 | 2 staves, voices 1/1, 136 bars, `19.Lucefarul-Sopran.mscz`, 102 chords | no | – | Soprano, Alto, Tenor | 1 | 1 |  | piano |
| 20 | Dumnezeu e steagul meu | Single voices only, no full score | – | – | – | – | Tenor | 1 |  |  | – |
| 21 | Fă viața mea | Done: as printed (matched to its PDF) | 1 | 2 staves, voices 2/2, 16 bars, `021. Fă viața mea.mscz` | no | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | piano |
| 22 | Să-ngenunchezi | Single voices only, no full score | – | – | – | – | – | 1 |  |  | – |
| 23 | O chemare vine din întunecimi | Single voices only, no full score | – | – | – | – | Alto | 1 |  |  | – |
| 24 | Grație a lui Isus (1 subfolders) | Done: as printed (matched to its PDF) | 2 | 2 staves, voices 2/2, 32 bars, `Gratie a lui Isus.mscz` | yes | Alto, Bass, Soprano, Soprano, Alto, Tenor, Tenor, Bass | Soprano, Alto, Tenor, Bass | 1 | 1 |  | other |
| 25 | Isuse pentru mine | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 26 | Sub crucea Ta | Single voices only, no full score | – | – | – | – | Alto | 2 |  |  | – |
| 27 | Tatăl nostru | Done: as printed (matched to its PDF) | 3 | 2 staves, voices 2/2, 40 bars, `027. Tatăl nostru.mscz` | no | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | piano |
| 28 | Deșteptare, strigă glasul Domnului | Done: a part per voice (no words in any of its files) | – | – | – | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | – |
| 29 | Vine-o zi | Done: a part per voice (no words in any of its files) | – | – | – | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | – |
| 30 | Laudă astăzi pe Domnul | Single voices only, no full score | – | – | – | – | Alto, Tenor | 1 |  |  | – |
| 31 | Stai pe loc și te gândește | Single voices only, no full score | – | – | – | – | – | 1 |  |  | – |
| 32 | Purtam in suflet dor de vesnicii | Done: a part per voice | 3 | 2 staves, voices 2/2, 17 bars, `Purtăm_în_suflet_dor_de_veșnicii.mscz` | yes | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | piano |
| 33 | Când vrei să vii | Single voices only, no full score | – | – | – | – | Soprano, Tenor, Bass | 1 |  |  | – |
| 34 | Ascultați imnul slăvirii | Single voices only, no full score | – | – | – | – | Soprano, Tenor | 1 |  |  | – |
| 35 | Doamne binecuvântă | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 36 | O, izvor al fericirii | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 37 | Nu te teme | Done: a part per voice (no words in any of its files) | 1 | 2 staves, voices 2/1, 16 bars, `037. Nu te teme.mscz` | no | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | piano |
| 38 | Mărețul har (1 subfolders) | Single voices only, no full score | – | – | – | – | Soprano, Tenor | 1 |  |  | – |
| 39 | Cânta-voi Domnului | Done: a part per voice (no words in any of its files) | 3 | 2 staves, voices 2/2, 17 bars, `039. Cânta-voi Domnului - toate vocile.mscz` | no | – | Soprano, Alto, Tenor, Bass, All voices | 1 | 1 |  | piano |
| 40 | Cat mai aproape de Tine | Done: a part per voice (no words in any of its files) | 1 | 2 staves, voices 2/2, 24 bars, `Cât mai aproape de Tine - toate vocile.mscz` | no | – | Soprano, Alto, Tenor, Bass, All voices | 1 | 1 |  | piano |
| 41 | Psalmul 139 | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 42 | Zace-n rece mormânt | Done: a part per voice (no words in any of its files) | 1 | 2 staves, voices 2/2, 20 bars, `042. Zace-n rece mormânt.mscz` | no | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | piano |
| 43 | A înviat Hristos (1 subfolders) | To do: unfinished, a staff has no notes | 7 | 4 staves, voices 2/0/2/2, 27 bars, `043. A înviat Hristos.mscz` | no | – | Soprano, Tenor, Bass | 1 |  |  | piano |
| 44 | Psalmul 86 | Done: a part per voice | – | – | – | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | – |
| 45 | Un rob | Single voices only, no full score | – | – | – | – | Tenor | 1 |  |  | – |
| 46 | Să n-ai teamă | Single voices only, no full score | – | – | – | – | Soprano, Alto | 1 |  |  | – |
| 47 | M-a aflat al meu Păstor (1 subfolders) | Done: a part per voice (no words in any of its files) | 1 | 2 staves, voices 2/2, 17 bars, `047. M-a aflat al meu Păstor.mscz` | no | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | piano |
| 48 | O, Doamne sfânt Isus | Done: a part per voice | 1 | 2 staves, voices 2/2, 16 bars, `048. O, Doamne Sfânt Isus.mscz` | yes | – | Soprano, Alto, Tenor, Bass | 2 | 1 |  | piano |
| 49 | Cum sa-Ti multumesc | Done: a part per voice | – | – | – | – | Soprano, Alto, Tenor, Bass | 2 | 1 |  | – |
| 50 | Bine e in Isus (1 subfolders) | Done: a part per voice | 2 | 2 staves, voices 2/2, 78 bars, `50. Bine e in Isus.mscz`, 8 chords | yes | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | piano |
| 51 | Cant Aleluia | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 52 | Cânt Aleluia Domnului | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 53 | El e Iehova | Done: a part per voice | – | – | – | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | – |
| 54 | Domn al Domnilor | Done: a part per voice | – | – | – | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | – |
| 55 | Oare-atunci când vine Isus | Single voices only, no full score | – | – | – | – | Tenor | 1 |  |  | – |
| 56 | Dor de cer (1 subfolders) | Done: a part per voice | 4 | 2 staves, voices 2/2, 48 bars, `056. Dor de cer.mscz` | yes | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | piano |
| 57 | Doi ochi senini | Done: a part per voice | – | – | – | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | – |
| 58 | Doamne am adus copilul (1 subfolders) | Done: a part per voice | – | – | – | – | Soprano, Tenor | 1 | 1 |  | – |
| 59 | Domn peste pamant | Done: a part per voice | – | – | – | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | – |
| 60 | De-ai luat pe umeri crucea | Single voices only, no full score | – | – | – | – | Soprano, Alto, Tenor, Bass | 1 |  |  | – |
| 61 | Voi cânta iubirea Sa | Done: a part per voice (no words in any of its files) | 1 | 2 staves, voices 2/2, 17 bars, `061. Voi cânta iubirea Sa.mscz` | no | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | piano |
| 62 | Ca cerbul după ape | Done: a part per voice | – | – | – | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | – |
| 63 | Un cor îngeresc | Done: a part per voice (no words in any of its files) | 1 | 2 staves, voices 1/2, 15 bars, `Un cor ingeresc - tenor, bas, sopran.mscz` | no | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | piano |
| 64 | Mila ai de mine Doamne (1 subfolders) | Done: a part per voice | 1 | 2 staves, voices 1/1, 16 bars, `64. Mila ai de mine Doamne.mscz`, 2 chords | yes | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | piano |
| 65 | Cantati marire lui Isus | Single voices only, no full score | – | – | – | – | Alto | 1 |  |  | – |
| 66 | O, frunte-nsangerata | Single voices only, no full score | – | – | – | – | – | 2 |  |  | – |
| 67 | Fiti tari | Done: a part per voice | 4 | 2 staves, voices 2/2, 114 bars, `Audio.mscz`, 14 chords | yes | – | Soprano, Alto, Tenor, Bass | 3 | 1 |  | piano |
| 68 | Poate fi in orice clipa | To do: its file leaves whole voices out; write them in from the PDF | – | – | – | – | Alto, Tenor | 1 | 2 |  | – |
| 69 | N-am sa uit Isuse Doamne (1 subfolders) | To do: unfinished, a staff has no notes | 1 | 4 staves, voices 0/0/1/1, 39 bars, `N-am sa uit Isuse Doamne niciodata.mscz`, 5 chords | no | – | Soprano, Tenor, Bass | 2 |  |  | other |
| 70 | Doamne Isuse ai indurare | Done: a part per voice | – | – | – | – | Soprano, Alto, Tenor, Bass | 2 | 1 | 2 | – |
| 71 | Noi suntem frati | Single voices only, no full score | – | – | – | – | Soprano, Tenor | 1 |  |  | – |
| 72 | Toata viata Doamne | Done: a part per voice (no words in any of its files) | – | – | – | – | Soprano, Alto, Tenor, Bass | 2 | 1 |  | – |
| 73 | Sfant esti, sfant esti | Done: a part per voice (no words in any of its files) | – | – | – | – | Soprano, Alto, Tenor, Bass | 1 | 1 | 1 | – |
| 74 | O Tatal nostru Te rugam | Done: a part per voice | 1 | 2 staves, voices 2/2, 9 bars, `O Tatal nostru Te rugam.mscz`, 6 chords | yes | – | Soprano, Alto, Tenor, Bass | 2 | 1 |  | piano |
| 75 | Vorbind cu El | Done: a part per voice | 2 | 2 staves, voices 2/2, 36 bars, `75._Vorbind_cu_El_3.0.mscz` | yes | – | Soprano, Alto, Tenor, Bass | 1 | 1 |  | piano |
| 76 | Singur in noaptea rece | Done: a part per voice | 3 | 2 staves, voices 2/2, 12 bars, `Singur in noaptea rece.mscz` | yes | – | Soprano, Alto, Tenor, Bass | 4 | 1 | 2 | piano |
| 77 | Cand spun Isus | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 78 | Nu te-ngrijora | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 79 | Slava Ta o cânt Isuse (1 subfolders) | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 80 | La masa iubirii | Done: a part per voice | 1 | 2 staves, voices 2/2, 27 bars, `La_masa_iubirii.mscz`, 1 chords | yes | – | Soprano, Alto, Tenor, Bass | 1 | 1 | 2 | piano |
| 81 | Din Tine am venit iubire | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 82 | Mai este har - Ce har, ce har | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 83 | Tată din ceruri (1 subfolders) | Done: a part per voice | 6 | 2 staves, voices 2/2, 133 bars, `Tata din ceruri.mscz` | yes | – | Soprano, Alto, Tenor, Bass | 1 | 1 | 1 | piano |
| 84 | Doamne bun ascultă | To check: 6 voices (a voice divides), not four | 6 | 4 staves, voices 1/2/2/1, 40 bars, `084. Doamne bun ascultă.mscz` | no | – | Soprano, Alto, Tenor, Bass | 4 |  | 3 | piano |
| 85 | Doamne ce furtună | Done: a part per voice | 1 | 2 staves, voices 2/2, 37 bars, `085. Doamne, ce furtună.mscz` | yes | – | Soprano, Alto, Tenor, Bass | 1 | 1 | 2 | piano |
| 86 | Celui Inviat Marire! | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 87 | Tu Cel înviat | Single voices only, no full score | – | – | – | – | Alto | 1 |  |  | – |
| 88 | Isus e viu! | No folder (in the book only) | – | – | – | – | – |  |  |  | – |
| 89 | Aleluia (Craciun, Paste) | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 90 | Ma iubesti tu | Done: a part per voice | 3 | 2 staves, voices 1/1, 31 bars, `90. Mă_iubești_tu - toate vocile.mscz`, 302 chords | yes | – | Soprano, Alto, Tenor, Bass, All voices | 1 | 1 |  | piano |
| 91 | Isus, minunat si indurat | Done: a part per voice | 4 | 2 staves, voices 2/1, 88 bars, `Minunat și îndurat - Bas.mscz` | yes | – | Soprano, Alto, Tenor, Bass | 2 | 1 |  | piano |
| 92 | Hristos a inviat | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 93 | La crucea Ta | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 94 | Curand vei reveni | Single voices only, no full score | – | – | – | – | Alto | 2 |  |  | – |
| 95 | Biruitori, biruitori | Done: a part per voice | 1 | 2 staves, voices 2/2, 32 bars, `Biruitori, biruitori.mscz` | no | – | Alto | 2 | 1 |  | other |
| 96 | Eu nu ma tem | Done: a part per voice | 1 | 2 staves, voices 2/2, 20 bars, `98 Ce bucurie am in Isus.mscz` | yes | – | – | 2 | 1 |  | piano |
| 97 | ÎN FAȚA TRONULUI DE SUS (1 subfolders) | No MuseScore | – | – | – | – | – | 3 |  |  | – |
| 98 | Ce bucurie am in Isus | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 99 | Așteptăm ceruri noi (1 subfolders) | Done: a part per voice (no words in any of its files) | 1 | 4 staves, voices 1/1/1/1, 64 bars, `Asteptam ceruri noi - Toate vocile.mscz` | no | – | Soprano, Alto, Tenor, Bass, All voices | 2 | 1 |  | piano |
| 100 | Privim spre mielul (1 subfolders) | No MuseScore | – | – | – | – | – | 1 | 1 |  | – |
| 102 | Stau și mă-ntreb dacă eu sunt lumină (1 subfolders) | No MuseScore | – | – | – | – | – | 1 | 1 |  | – |
| 103 | Am fost acolo (1 subfolders) | Single voices only, no full score | – | – | – | – | Soprano, Alto, Tenor, Bass | 1 |  |  | – |
|  | Casatorie (6 subfolders) | Done: a part per voice (no words in any of its files) | 1 | 2 staves, voices 2/2, 18 bars, `Har ceresc.mscz` | no | – | Soprano, Alto, Tenor, Bass | 6 | 4 |  | piano |
|  | Colinde (6 subfolders) | Single voices only, no full score | – | – | – | – | Soprano, Alto, Tenor, Bass | 8 |  |  | – |
|  | Colinde vocea alt | Single voices only, no full score | – | – | – | – | Alto | 4 |  |  | – |
|  | Pasti (3 subfolders) | Done: a part per voice | 5 | 2 staves, voices 2/2, 46 bars, `Isus e viu.mscz` | yes | – | Soprano, Alto, Tenor, Bass, All voices | 5 | 1 | 2 | piano |
|  | Sprijin mi.e Hristos | Done: a part per voice (no words in any of its files) | 3 | 2 staves, voices 2/1, 28 bars, `Kopie Toate vocile(1).mscz`, 113 chords | no | – | Soprano, Alto, Tenor, Bass, All voices | 1 | 1 |  | piano |

## Men's choir (`Cântări corul bărbătesc/`)

| Nr | Song | State | Score | Shape | Words | Parts | Voice files | PDF | XML | Img | Sound |
| --: | --- | --- | :-: | --- | :-: | --- | --- | --: | --: | --: | --- |
| 1 | Dacă ne-adunăm în Domnul | Done: a part per voice | 1 | 2 staves, voices 2/2, 16 bars, `1. Dacă ne-adunăm în Domnul.mscz` | yes | – | Tenor 1, Tenor 2, Baritone, Bass | 1 | 1 | 1 | piano |
| 2 | E plin de miraje pământul | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 3 | Vino la cruce | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 4 | Suntem mântuiți | Done: a part per voice (no words in any of its files) | 1 | 2 staves, voices 2/2, 25 bars, `4. Suntem mântuiți.mscz` | no | – | Tenor 1, Tenor 2, Baritone, Bass | 1 | 1 |  | piano |
| 5 | Sprijin în clipa grea | Single voices only, no full score | – | – | – | – | Baritone, Bass | 1 |  |  | – |
| 6 | Când pace noi spunem | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 7 | Domnului voi cânta - Psalmul 9 (1 subfolders) | Done: a part per voice | 1 | 2 staves, voices 2/2, 16 bars, `7. Psalmul 9 - Domnului voi cânta.mscz` | yes | – | Tenor 1, Tenor 2, Baritone, Bass | 2 | 1 |  | piano |
| 8 | Văd doar cenușă | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 9 | Din lanțul morții (1 subfolders) | Done: a part per voice | 1 | 2 staves, voices 2/2, 17 bars, `9. Din lanțul morții.mscz` | yes | – | Tenor 1, Tenor 2, Baritone, Bass | 2 | 1 |  | piano |
| 10 | Sunt un pribeag | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 11 | Lasă-L pe Isus azi în barca ta | Done: a part per voice | 2 | 2 staves, voices 2/2, 39 bars, `11. Lasă-L pe Isus azi în barca ta.mscz` | yes | – | Tenor 1, Tenor 2, Baritone, Bass, All voices | 2 | 1 |  | piano |
| 12 | Mă gândesc ades la Tine | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 13 | Ești pacea mea | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 14 | Departe ești încă (1 subfolders) | Done: a part per voice (no words in any of its files) | 1 | 2 staves, voices 2/2, 27 bars, `14. Departe ești încă.mscz` | no | – | Tenor 1, Tenor 2, Baritone, Bass | 1 | 1 |  | piano |
| 15 | Nimic nu sunt (1 subfolders) | Done: a part per voice | 2 | 2 staves, voices 2/2, 17 bars, `15. Nimic nu sunt.mscz` | yes | – | Tenor 1, Tenor 2, Baritone, Bass | 2 | 1 |  | piano |
| 16 | Doamne eu la cruce vin | Done: a part per voice | – | – | – | – | Tenor 2, Baritone, Bass | 1 | 1 | 1 | – |
| 17 | Răscumpărat din grea robie | Single voices only, no full score | – | – | – | – | Baritone | 1 |  |  | – |
| 18 | Unde vei fi | Single voices only, no full score | – | – | – | – | Tenor 2 | 1 |  |  | – |
| 19 | Viata aceasta pe pamant (1 subfolders) | Done: a part per voice | – | – | – | – | Tenor 2, Baritone, Bass | 1 | 1 |  | – |
| 20 | Exista Dumnezeu | Done: a part per voice | – | – | – | – | Tenor 1, Tenor 2, Baritone, Bass | 2 | 1 |  | – |
| 21 | Cu Domnul să mergem | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 22 | Prin har mântuit | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 23 | Cand eram ratacit | Done: a part per voice | – | – | – | – | Tenor 1, Tenor 2, Baritone, Bass | 1 | 1 |  | – |
| 24 | Dar a-nviat | Done: a part per voice | 4 | 2 staves, voices 2/2, 32 bars, `Dar a-nviat.mscz`, 2 chords | yes | – | Tenor 1, Tenor 2, Baritone, Bass | 1 | 1 | 1 | piano |
| 25 | Când privesc marea lucrare | Done: a part per voice (no words in any of its files) | 1 | 2 staves, voices 2/2, 17 bars, `25. Când privesc marea lucrare.mscz` | no | Piano, Piano, Piano 1, Piano 1 | Tenor 1, Tenor 2, Baritone, Bass | 2 | 1 |  | piano |
| 26 | Ma va ridica (4 subfolders) | Done: a part per voice | 14 | 2 staves, voices 2/2, 57 bars, `Ma va ridica.mscz`, 5 chords | yes | – | Tenor 1, Tenor 2, Baritone, Bass | 6 | 1 | 3 | piano |
| 28 | Vino acasa degrab | Done: a part per voice | 2 | 2 staves, voices 2/2, 64 bars, `Vino acasa degrab.mscz` | yes | – | Tenor 1, Tenor 2, Baritone, Bass | 1 | 1 | 2 | piano |
| 29 | Înălțați cântări de bucurie | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 30 | Eu stau pe stâncă | Done: a part per voice (no words in any of its files) | 1 | 2 staves, voices 2/2, 19 bars, `30. Eu stau pe stâncă.mscz` | no | – | Tenor 1, Tenor 2, Baritone, Bass | 2 | 1 |  | piano |
| 32 | Pe baricadele credinței | Done: a part per voice (no words in any of its files) | 1 | 2 staves, voices 2/2, 32 bars, `032. Pe baricadele credintei - toate vocile.mscz` | no | – | Tenor 1, Tenor 2, Baritone, Bass, All voices | 1 | 1 |  | piano |
| 33 | Prin furtuni | Done: a part per voice | 1 | 2 staves, voices 2/2, 32 bars, `Prin furtuni.mscz` | yes | – | Tenor 1, Tenor 2, Baritone, Bass | 2 | 1 |  | piano |
| 34 | De ce mai plangi cand sunt aici cu tine? | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 35 | Biruitor, spre biruinta! | No MuseScore | – | – | – | – | – | 1 |  |  | – |
| 36 | Mare bucurie, mormântu-i gol! | Done: a part per voice | 1 | 2 staves, voices 2/2, 23 bars, `36.Mare bucurie, mormântu-i gol!.mscz` | yes | – | – | 1 | 1 |  | other |
| 37 | Minunat e Isus! (1 subfolders) | No MuseScore | – | – | – | – | – | 2 | 2 |  | – |
| 38 | Pentru ce să mă frământ (1 subfolders) | Done: a part per voice | 1 | 2 staves, voices 2/2, 17 bars, `pentru-ce-sa-ma-framint.mscz`, 84 chords | yes | – | – |  | 2 | 1 | other |
|  | E sarbatoare | No MuseScore | – | – | – | – | – |  |  |  | – |
|  | O, Te privim, Isuse | No MuseScore | – | – | – | – | – | 1 |  | 2 | – |
|  | Sus pe boltă | No MuseScore | – | – | – | – | – | 1 |  |  | – |
|  | În această zi de sărbătoare (1 subfolders) | Done: a part per voice | 2 | 2 staves, voices 2/2, 38 bars, `În această zi de sărbătoare.mscz` | yes | – | Tenor 1, Tenor 2, Baritone, Bass | 1 | 1 |  | piano |
|  | Îngeri mii în ceruri cântă | No MuseScore | – | – | – | – | – | 1 |  |  | – |
