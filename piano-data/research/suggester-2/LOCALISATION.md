# Localisation

Languages: English (development region) and French. Two layers hold text:

1. Apple string tables in `Resources/{en,fr}.lproj` (Swift UI text). All entries below are **exact**; machine-readable copy in `data/strings_app_en_fr.json`. The AudioUnit extension ships identical `Localizable.strings` (checked: en table byte-for-byte equal in content).
2. Kotlin `LocalizedString(base, additionalLocalizations)` objects inside `MRMusicSuite.framework` for all music terms, settings and engine messages (English base + `fr`). These are not in .strings files. All literals, in binary order, are in `data/strings_engine_literals_in_binary_order.json` (2,701 strings; English and French appear as adjacent pairs). The music-term translations are also folded into the other data files (scales, chords, roles, progressions, settings).

Keys in brackets (`[Onboarding 1 Title]`) are symbolic keys; other keys are the English text itself.

## Localizable.strings (256 keys)

| Key | en | fr |
|---|---|---|
| Edit | Edit | Modif. |
| For example:  | For example:  | Par exemple:  |
| Medium | Medium | Moyen |
| [Standard Chords] | Standard Chords | Accords standards |
| [GUITAR MODE] | GUITAR | GUITARE |
| [Check Discount Eligibility] | Verify Eligibility | Vérifier l'éligibilité |
| Octave Shift Down | Octave Shift Down | Descendre d'un octave |
| Cut Section | Cut Section | Couper la section |
| [Tool SiriTip Format] | With Siri, say "%@" | À l'aide de Siri, dites "%@" |
| [Drag And Drop Instructions] | You can use<br>drag-and-drop. | Vous pouvez utiliser<br>le glisser-déposer. |
| Insert | Insert | Insérer |
| [DragTipTitle] | Drag and drop to a DAW | Glissez un accord vers votre DAW |
| Song List | Song List | Liste de la chanson |
| Add All | Add All | Ajouter tout |
| AppExtensionTransportInfoTitle | AudioUnit mode | Mode AudioUnit |
| [ChordBuilder Footer Markup] | For additional possibilities, use the [Modifiers](http://modifiers). | Pour plus de possibilités, utilisez les [Modificateurs](http://modifiers). |
| [Onboarding 3 Text] | Take inspiration from well-known progressions of various musical genres. | Inspirez-vous des progressions bien connues de divers genres musicaux. |
| Beat | Beat | Rhythme |
| Above | Above | au dessus |
| Duplicate Item | Duplicate Item | Dupliquer l'item |
| [iOS Key] | iOS Key | Clé iOS |
| Configure Bluetooth Devices | Configure Bluetooth Devices | Configurer les appareils Bluetooth |
| Section | Section | Section |
| [Chord Reader Prompt] | Type the name of the chords you want to add (A, Bm, G7, etc).<br><br>Roman numerals will work too (I, ii, iii7, etc). | Tapez le nom des accords que vous voulez ajouter (A, Bm, G7, etc).<br><br>Les chiffres romains fonctionnent aussi (I, ii, iii7, etc). |
| Loop | Loop | En boucle |
| [Tools Description] | These tools allow you to query the application without having to create a document. | Ces outils vous permettent d'interroger l'application sans avoir besoin de créer un document. |
| [Onboarding 6 Text] | Let the app tell you the name of the chord you are playing on the keyboard or the guitar. | Laissez l'application vous indiquer le nom de l'accord que vous jouez sur le clavier ou la guitare. |
| Pick the Destination Scale | Pick the Destination Scale | Choisissez la gamme destination |
| [Tool Chord Suggestions] | Chord Suggestions | Suggestions d'accords |
| iOS and macOS | iOS and macOS | iOS et macOS |
| No notes | No notes | Aucune note |
| [App Review Question Good] | Good 😄 | Bonne 😄 |
| Pick a chord | Pick a chord | Choisir un accord |
| [Onboarding 8 Title] | Connect with AudioUnit and MIDI | Connectez-vous avec AudioUnit et MIDI |
| Alterations Empty | To alter a chord, select it by tapping the 'Alter' button. | Pour altérer un accord, choisissez-le en appuyant sur le bouton 'Alt.' |
| Locked | Locked | Verrouillé |
| Guitar Chord Diagrams | Guitar Chord Diagrams | Diagrammes d'accords de guitare |
| Pick New Scale | Pick New Scale | Choisir une nouvelle gamme |
| Default | Default | Par défaut |
| month | month | mois |
| No selection | No selection | Aucune sélection |
| [Chord Reader] | Text Input | Entrée texte |
| Plays in the Background | Plays in the Background | Joue en arrière-plan |
| [Unvalidated Discount Eligibility] | Existing customers of the first version of Suggester are eligible to a discount on upgrades. | Les clients de la première version de Suggester sont éligibles à un rabais sur les mises à niveau. |
| [Played Scale] | Played Scale | Gamme jouée |
| Privacy policy | Privacy policy | Politique de confidentialité |
| Review on AppStore | Review on AppStore | Noter sur AppStore |
| [None, masculine] | None | Aucun |
| Extra Extra Large | Extra Extra Large | Extra extra grand |
| Invert Upward | Invert Upward | Monter d'une inversion |
| Extra Large | Extra Large | Extra grand |
| [Locked Mode] | Running in locked mode | Exécution en mode verrouillé |
| Detect Scale | Detect Scale | Détecter la gamme |
| [Onboarding 4 Title] | Chord alterations | Altérations d'accords |
| Metronome Sound | Metronome Sound | Son du métronome |
| Small | Small | Petit |
| [Custom] | Custom | Personnalisé |
| Transpose | Transpose | Transposer |
| [Validated Discount Explanation] | As an existing customer of the first version of Suggester, you are eligible to a discount on upgrades.  The discount is included in the prices below. | En tant que client de la première version de Suggester, vous êtes éligible à un rabais sur les mises à niveau.  Ce rabais est inclus dans les prix ci-dessous. |
| [Universal Key] | Universal Key | Clé universelle |
| [None, feminine] | None | Aucune |
| Tempo | Tempo | Tempo |
| Chord Detector Instructions For Guitar | Draw a chord on screen to have it identified. | Dessinez un accord à l'écran pour le faire identifier. |
| Demo Song Title | An Interesting Idea | Une idée intéressante |
| Standard | Standard | Standard |
| General | General | Général |
| Chord Collection | Chord Collection | Collection d'accords |
| Copy | Copy | Copier |
| Other Scale | Other Scale | Autre gamme |
| [Tools] | Tools | Outils |
| Contact Us | Contact Us | Nous contacter |
| System Size | System Size | Taille système |
| [macOS Key] | macOS Key | Clé macOS |
| [ChordShapes subtitle] | The intelligent guitar chord engine | Le moteur intelligent d'accords de guitare |
| [ChordPadX2 subtitle] | Chords at your fingertips | Des accords au bout des doigts |
| Panel Size | Panel Size | Taille des panneaux |
| [Launcher New Song] | Create Song | Créer une chanson |
| Not applicable for this scale | Not applicable for this scale | Ne s'applique pas à cette gamme |
| [Full Unlock] | Full Unlock | Déblocage complet |
| Import Suggester Document | Import Suggester Document | Importer un document Suggester |
| Add Text | Add Text | Ajouter du texte |
| Open | Open | Ouvrir |
| Pick the Source Scale | Pick the Source Scale | Choisissez la gamme source |
| Show Standard Chords | Show Standard Chords Instead | Montrer plutôt des accords standard |
| [Empty detected scales] | No scales have been detected. | Aucune gamme n'a pu être détectée. |
| [Pick Instrument] | Pick an instrument | Choisir l'instrument |
| Export Document | Export Document | Exporter un document |
| Chord Detector Error | This chord could not be identified. | Cet accord n'a pas pu être identifié. |
| Below | Below | en dessous |
| [No Chord Suggestions] | Suggestions are shown here when a scale is selected in the song. | Des suggestions d'accords sont affichées ici lorsqu'une gamme est sélectionnée dans la chanson. |
| [Upgrade] | Upgrade | Mise à niveau |
| AppExtensionTransportInfoMessage | In AudioUnit mode, the playback state, the song position, the time signature and the tempo are controlled by the host. | En mode AudioUnit, la lecture, la position, la signature de temps et le tempo sont contrôlés par l'hôte. |
| [Melody Scale Detector Instructions] | Select notes on the keyboard<br>or play them on the MIDI input. | Sélectionnez des notes sur le clavier<br>ou jouez-les sur l'entrée MIDI. |
| Exporting | Exporting | Export |
| [The song is empty] | The song is empty. | La chanson est vide. |
| [Chord Builder] | Chord Builder | Constructeur d'accord |
| About the app | About the app | À propos de l'app |
| Copy Section | Copy Section | Copier la section |
| Audio Output | Audio Output | Sortie audio |
| Connecting with AppStore | Connecting with AppStore | Connexion à AppStore |
| Delete Section | Delete Section | Supprimer la section |
| [Melody Scale Detector] | Melody Scale Detector | Détecteur de gamme pour mélodie |
| Preview | Preview | Aperçu |
| Cut | Cut | Couper |
| Import / Export | Import / Export | Importer / Exporter |
| [InvalidDataError] | This data cannot be read. | Ces données ne peuvent pas être lues. |
| Reset | Reset | Réinitialiser |
| [No Classic Progressions] | Classic chord progressions are shown here when a scale is selected in the song. | Des progressions d'accords classiques sont affichées ici lorsqu'une gamme est sélectionnée dans la chanson. |
| Chord Detector Instructions For Keyboard | Select notes on the keyboard<br>or play them on the MIDI input. | Sélectionnez des notes sur le clavier<br>ou jouez-les sur l'entrée MIDI. |
| [Borrowed Chord] | Borrowed Chord | Accord d'emprunt |
| Instrument Sound | Instrument Sound | Son de l'instrument |
| Large | Large | Grand |
| Semitones | Semitones | Demi-tons |
| [Storm Title] | MIDI Feedback was detected | Une boucle de retour MIDI a été détectée |
| [No Scale Suggestions] | Scale suggestions are shown here when a scale is selected in the song. | Des suggestions de gamme sont affichées ici lorsqu'une gamme est sélectionnée dans la chanson. |
| [Onboarding 4 Text] | Create new chords by changing the chord quality, voicing, bass or by adding or omitting intervals. | Créez de nouveaux accords en modifiant la qualité de l'accord, la voix, la basse ou en ajoutant ou en omettant des intervalles. |
| Copy All | Copy All | Copier tout |
| [Melody Scale Detector Failed] | No scales were found. | Aucune gamme n'a été trouvée. |
| Text | Text | Texte |
| Details | Details | Détails |
| Intervals | Intervals | Intervalles |
| Continue | Continue | Continuer |
| [Onboarding 7 Title] | Guitar chord diagrams | Diagrammes d'accords de guitare |
| Add Rest | Add Rest | Ajouter un silence |
| save %d%% | save %d%% | économisez %d%% |
| [Modulation] | Modulation | Modulation |
| [Onboarding 7 Text] | In guitar mode, chord diagrams are displayed – The app completely changes shape. | En mode guitare, les diagrammes d'accords s'affichent – ​​L'application change complètement de forme. |
| [Storm Message] | The MIDI input was shut down to avoid freezing and other issues.<br><br>Double-check your MIDI settings and make sure your connections are not creating a feedback loop. | L'entrée MIDI a été désactivée pour éviter de geler l'application.<br><br>Vérifiez vos réglages MIDI et assurez-vous de ne pas créer de boucle de retour. |
| Section Marker | Section Marker | Marqueur de section |
| New | New | Nouveau |
| Rest | Rest | Silence |
| Instrument | Instrument | Instrument |
| Export Text File | Export Text File | Exporter en fichier texte |
| [Locked Mode Message] | In locked mode, MIDI features are disabled: the plugin outputs no MIDI data.<br><br>To unlock MIDI features, a key is required. | En mode verrouillé, les fonctionnalités MIDI sont désactivées: le plugin ne génère pas de données MIDI.<br><br>Pour déverrouiller les fonctionnalités MIDI, une clé est requise. |
| Manage Subscriptions | Manage Subscriptions | Gérer les abonnements |
| System | System | Système |
| [Onboarding 1 Text] | This app is a powerful tool for writing songs and chord progressions. | Cette appli est un outil puissant pour écrire des chansons et des progressions d'accords. |
| Copy Item | Copy Item | Copier l'item |
| Semitone Shift Up | Semitone Shift Up | Monter d'un demi-ton |
| [Onboarding 3 Title] | Classic chord progressions | Progressions d'accords classiques |
| Export as Text... | Export as Text... | Exporter au format texte... |
| [Demo Document Navigation Title] | An interesting idea | Une idée intéressante |
| Export as MIDI... | Export as MIDI... | Exporter au format MIDI... |
| [Playback Settings Warning] | Some settings cannot be modified during playback. | Certains réglages ne peuvent pas être modifiés pendant la lecture. |
| Timing | Timing | Temps |
| Delete Item | Delete Item | Supprimer l'item |
| Error | Error | Erreur |
| Title | Title | Titre |
| Settings | Settings | Réglages |
| Extra Small | Extra Small | Extra petit |
| [Chord Detector] | Chord Detector | Détecteur d'accord |
| MIDI Input | MIDI Input | Entrée MIDI |
| Playback Settings | Playback Settings | Réglages de lecture |
| Done | Done | OK |
| Scale Detector | Scale Detector | Détecteur de gamme |
| [Classic Progressions] | Classic Progressions | Progressions classiques |
| Copied | Copied | Copié |
| Added | Added | Ajouté |
| [Compatible Scales] | Compatible Scales | Gammes compatibles |
| [Abort Tutorial Confirmation] | The tutorial gives important information to understand the potential of the app.<br><br>Are you sure you want to abort? | Le tutoriel donne d'importantes informations pour comprendre le potentiel de l'application.<br><br>Voulez-vous quand même abandonner le tutoriel? |
| Row Size | Row Size | Taille des rangées |
| [Onboarding Title] | Welcome to Suggester 2 | Bienvenue sur Suggester 2 |
| [App Review Question] | We hope you like Suggester 2!<br><br>How is your experience so far? | Nous espérons que vous aimez Suggester 2!<br><br>Comment est votre expérience jusqu'à maintenant? |
| [UKULELE MODE] | UKULELE | UKULÉLÉ |
| Semitone Shift Down | Semitone Shift Down | Descendre d'un demi-ton |
| Chords | Chords | Accords |
| [macOS Key Description] | A one-time purchase to unlock all features permanently (macOS only). | Un achat unique pour un déblocage permanent de toutes les fonctionnalités (macOS seulement). |
| Guitar | Guitar | Guitare |
| Paste | Paste | Coller |
| [No Scale Degrees] | Scale degrees are shown here when a scale is selected in the song. | Les degrés de gamme sont affichés ici lorsqu'une gamme est sélectionnée dans la chanson. |
| Cancel | Cancel | Annuler |
| Transpose... | Transpose... | Transposer... |
| Transpose Song | Transpose Song | Transposer la chanson |
| [Validated Discount Headline] | Good news! | Bonne nouvelle! |
| Our Facebook page | Our Facebook page | Notre page Facebook |
| Try Again | Try Again | Réessayer |
| macOS minimum requirements | Minimum requirements: macOS 14 or more recent. | Minimum requis: macOS 14 ou plus récent. |
| Paste Below | Paste Below | Coller en dessous |
| [App Review Question Bad] | Bad 😩 | Mauvaise 😩 |
| [Onboarding 2 Title] | Find chords that work together | Trouvez des accords qui s'hamonisent |
| Delete | Delete | Supprimer |
| Welcome Page | Welcome Page | Page d'accueil |
| Available Products | Available Products | Produits disponibles |
| Purchases | Purchases | Achats |
| [Discount Eligibility Failed] | No eligible purchase was found. | Aucun achat éligible n'a pu être trouvé. |
| [The song doesn't have a scale] | The song doesn't have a scale yet. | La chanson n'a pas encore de gamme. |
| [Onboarding 6 Title] | Detect chords and scales | Détectez les accords et les gammes |
| Save | Save | Sauvegarder |
| Owned Products | Owned Products | Produits possédés |
| iOS only | iOS only | iOS seulement |
| [Launcher Open] | Open… | Ouvrir… |
| Add | Add | Ajouter |
| [Chord Builder Invitation] | Not seeing the chord you want?  Use the [Chord Builder](http://builder). | Vous ne trouvez pas l'accord que vous cherchez?  Utilisez le [Constructeur d'accord](http://builder). |
| [Onboarding 5 Text] | Make your songs take a new turn. Modulations have never been easier. | Donnez une nouvelle tournure à vos chansons. Les modulations n'ont jamais été aussi simples. |
| [Launcher More] | More… | Plus… |
| macOS only | macOS only | macOS seulement |
| MIDI Output | MIDI Output | Sortie MIDI |
| [or start adding chords] | Or just start with chords.<br>You can pick a scale later. | Ou commencez par les accords.<br>Vous pourrez choisir la gamme plus tard. |
| [Onboarding 8 Text] | Use Suggester 2 in your favorite DAW by loading it as a plugin or connect it to your piano with MIDI. | Utilisez Suggester 2 dans votre DAW préféré en le chargeant en tant que plugin ou connectez-le à votre piano avec MIDI. |
| AppStore Synchronization | AppStore Synchronization | Synchronisation avec AppStore |
| Restore Purchases | Restore Purchases | Restaurer les achats |
| Duplicate | Duplicate | Dupliquer |
| Play | Play | Jouer |
| Properties | Properties | Propriétés |
| Pick a scale | Pick a scale | Choisir une gamme |
| [Universal Key Description] | A one-time purchase to unlock all features permanently on iOS and macOS. | Un achat unique pour un déblocage permanent de toutes les fonctionnalités sur iOS et macOS. |
| iOS minimum requirements | Minimum requirements: iOS 17 or more recent. | Minimum requis: iOS 17 ou plus récent. |
| Import Document | Import Document | Importer un document |
| Terms of use | Terms of use | Conditions d'utilisation |
| [Onboarding 2 Text] | Based on the scale you pick, the app will suggest chords. It goes well beyond the diatonic chords! | En fonction de la gamme choisie, l'application vous proposera des accords. Cela va bien au-delà des accords diatoniques ! |
| Duplicate Section | Duplicate Section | Dupliquer la section |
| [Chord Suggestions] | Chord Suggestions | Suggestions d'accords |
| Export as Audio... | Export as Audio... | Exporter au format audio... |
| Play from Here | Play from Here | Jouer à partir d'ici |
| Our Website | Our Website | Notre site web |
| Best Value | Best Value | Meilleur rapport qualité/prix |
| Learn More | Learn More | En savoir plus |
| Alter | Alter | Alt. |
| Detected Chords | Detected Chords | Accords détectés |
| [App Review Negative] | 💔<br><br>We're really sorry to hear that...<br><br>If you have a question or even a complaint, please contact us and we will be happy to help out. | 💔<br><br>Nous en sommes navrés...<br><br>Pour poser une question ou même faire une plainte, veuillez nous contacter et nous pourrons vous aider. |
| [Monthly Subscription] | Monthly Subscription | Abonnement mensuel |
| [No Scale] | No scale | Aucune gamme |
| Paste Above | Paste Above | Coller au dessus |
| Invert Downward | Invert Downward | Descendre d'une inversion |
| [Tool Chord Suggestions SiriShortcut Format] | Chord suggestions for %@ | Suggestions d'accords pour %@ |
| Pick | Pick | Choisir |
| Add Section Marker | Add Section Marker | Ajouter un marqueur de section |
| Back | Back | Retour |
| [iOS Key Description] | A one-time purchase to unlock all features permanently (iOS only). | Un achat unique pour un déblocage permanent de toutes les fonctionnalités (iOS seulement). |
| [Onboarding] | Onboarding | Intégration |
| [Onboarding 1 Title] | Brilliant chord progressions | De brillantes progressions d'accords |
| [Monthly Subscription Description] | Unlock all features for a month. | Déblocage complet pour un mois. |
| Text Input | Text Input | Entrée texte |
| Export Audio File | Export Audio File | Exporter en fichier audio |
| [DragTipText] | Did you know? You can drag chords directly from Suggester to another app that supports MIDI files, such as Logic Pro. | Le saviez-vous?  Il est possible de glisser des accords directement de Suggester vers une autre application qui supporte les fichiers MIDI, tel comme Logic Pro. |
| [UnsupportedLegacyDocumentError] | This document is in a old format that is no longer supported.  You can however upgrade the document to a more recent format by opening it with Suggester 1.  It will be possible to import it after that. | Ce document utilise un ancien format qui n'est plus supporté.  Vous pouvez toutefois le convertir à un format plus récent en l'ouvrant avec Suggester 1.  Vous pourrez ensuite l'importer. |
| Export Song | Export Song | Exporter la chanson |
| [Onboarding 5 Title] | Change key like a pro | Changez de tonalité comme un pro |
| [Degrees] | Scale Degrees | Degrés de la gamme |
| [No tool selected] | Pick a tool from the sidebar. | Choisissez un outil dans la barre latérale. |
| User Interface | User Interface | Interface usager |
| [Purchase Invitation] | Unlock this feature and many others by getting a key. | Accédez à cette fonctionnalité et à plusieurs autres en vous procurant une clé. |
| Octave Shift Up | Octave Shift Up | Monter d'un octave |
| Export MIDI File | Export MIDI File | Exporter en fichier MIDI |
| Cut Item | Cut Item | Couper l'item |
| Add To Song | Add To Song | Ajouter à la chanson |
| Abort Tutorial | Abort Tutorial | Abandonner le tutoriel |
| Audio | Audio | Audio |
| Transpose Section... | Transpose Section... | Transposer la section... |
| Extra Extra Extra Large | Extra Extra Extra Large | Extra extra extra grand |
| [App Review Positive] | ❤️<br><br>Awesome, we're glad you like the app!<br><br>Please share what you think by giving a rating on AppStore. | ❤️<br><br>Génial, nous en sommes ravis!<br><br>Vous pouvez partager ce que vous en pensez en laissant une note sur AppStore. |
| [Alteration] | Alteration | Altération |
| Reset Notes | Reset Notes | Réinitialiser les notes |
| [Discount] | Discount | Rabais |
| Change | Change | Changer |
| Sync | Sync | Syncro |

## InfoPlist.strings

| Key | en | fr |
|---|---|---|
| [Chord Suggestions] | Chord suggestions | Suggestions d'accords |
| NSBluetoothAlwaysUsageDescription | Enables the app to connect with MIDI Bluetooth devices. | Permet à l'app de se connecter à des appareils MIDI Bluetooth. |
| NSHumanReadableCopyright | © Mathieu Routhier. All rights reserved. | © Mathieu Routhier. Tous droits réservés. |
| My App Name For Siri | Chord suggestions | Suggestions d'accords |

## AppShortcuts.strings

| Key | en | fr |
|---|---|---|
| ${applicationName} | ${applicationName} | ${applicationName} |
| Show me ${applicationName} for ${scaleEntity} | Show me ${applicationName} for ${scaleEntity} | Montre-moi des ${applicationName} pour ${scaleEntity} |
| ${applicationName} for ${scaleEntity} | ${applicationName} for ${scaleEntity} | ${applicationName} pour ${scaleEntity} |
| Make ${applicationName} | Make ${applicationName} | Fais des ${applicationName} |
| Make ${applicationName} for ${scaleEntity} | Make ${applicationName} for ${scaleEntity} | Fais des ${applicationName} pour ${scaleEntity} |
| Give me ${applicationName} for ${scaleEntity} | Give me ${applicationName} for ${scaleEntity} | Donne-moi des ${applicationName} pour ${scaleEntity} |
| Find ${applicationName} for ${scaleEntity} | Find ${applicationName} for ${scaleEntity} | Trouve des ${applicationName} pour ${scaleEntity} |
| Show me ${applicationName} | Show me ${applicationName} | Montre-moi des ${applicationName} |
| Give me ${applicationName} | Give me ${applicationName} | Donne-moi des ${applicationName} |
| Find ${applicationName} | Find ${applicationName} | Trouve des ${applicationName} |

## Intents

- `Intents.stringsdict` (en and fr): `%lld scales` → one: `%lld scale`, other: `%lld scales`.
- `fr.lproj/Intents.strings`: `Show chord suggestions for ${scaleEntity}` → `Montre des suggestions d’accords pour  ${scaleEntity}.`; `Chord suggestions` → `Suggestion d’accords`; `Scale` → `Gamme`; `Show chord suggestions for a given scale.` → `Montre des suggestions d’accords pour une gamme donnée.`.

## Package bundles

- MRMusicUI: `[AppStore Product Error]` = "Could not acquire product information from AppStore."
- MRSwiftUI: `EditButton-Done` = Done, `EditButton-Edit` = Edit.

## Engine terms (Kotlin) — selected exact pairs

See THEORY_ENGINE.md, PLAYER_AND_MIDI.md and SETTINGS.md for all music terms with both languages. Other pairs: Undo/Redo ("Undo ", "Redo " prefixes), "The file format is invalid."/"Le format du fichier est invalide.", ordinal suffixes en `st nd rd th` and fr `1er`, `1ère`, `e`, `ème`; colour names; Left/Right-handed ("Gauche"/"Droite", "Main dominante"); Visual Theme Light/Dark/Automatic ("Clair"/"Sombre"/"Automatique"); Verse/Couplet, Chorus/Refrain, Outro/Finale (default section names); New Section/Nouvelle section; Untitled/Sans titre.

Known text bugs (exact): French inversion letters lag by one from the 7th inversion; `myxolydien`; `Naepolitan`; `Décallage` (double l); `♯12̂̂` with a doubled caret.
