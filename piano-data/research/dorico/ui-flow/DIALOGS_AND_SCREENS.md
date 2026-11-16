# Dorico 6.2 QML screens and dialogs: their contents and actions

Dorico's newer UI (the Hub, onboarding, sign-in and many dialogs) is written in QML and embedded as Qt resources in the app binary. **218 unique QML/JS files** were extracted; **56 contain user-visible text** and are listed below.
For each screen:
- **Title.**
- **Visible text**, in source order.
- **Buttons, check boxes and switches.**
- **Number of drop-down menus and number fields.**
- **Event handlers** (what the screen reacts to).
- **Backend calls** (what it asks the app to do).

Source code isn't reproduced.

The 85 QML file paths referenced by the binary are listed at the end, so you can see every screen's name even where its text isn't shown.

## 1. Project File Modified  _(root: `DoricoDialog`)_

**Text:** “Project File Modified” · “Do you want to save your project as a new file?” · “Do you want to rename your project to preserve your changes?” · “Do you want to reload the project?” · “Save As...” · “Rename” · “Reload” · “Cancel” · “The file for project %1 has been deleted.” · “The file for project %1 has been modified on disk.”

**Buttons:** [Cancel]

**Reacts to:** `onAccepted`, `onRejected`, `onEditingFinished`

**Backend calls:** `setProjectName()`


## 2. Update Available  _(root: `DoricoDialog`)_

**Text:** “Update Available” · “Free update to version %1 available.” · “Update to version %1 available.” · “ Run Steinberg Download Assistant or visit the web site to download.” · “ Visit the web site for more information.”

**Reacts to:** `onAccepted`, `onClicked`


## 3. Subscribe  _(root: `DoricoDialog`)_

**Text:** “Subscribe” · “Restoring...” · “Restore Purchase” · “ / Month” · “ / Year”

**Reacts to:** `onRejected`, `onClicked`

**Backend calls:** `subscribeMonthlyButtonClicked()`, `subscribeAnnuallyButtonClicked()`, `lifetimeUnlockButtonClicked()`, `restorePurchaseClicked()`, `termsOfUseClicked()`, `privacyPolicyClicked()`


## 4. Send Crash Reports to Steinberg  _(root: `DoricoDialog`)_

**Text:** “Send Crash Reports to Steinberg” · “Send to Steinberg” · “Don't Send” · “Don't Ask Again”

**Buttons:** [Send to Steinberg], [Don't Send], [Don't Ask Again]

**Reacts to:** `onAccepted`, `onRejected`, `onApplied`

**Backend calls:** `doNotShowAgain()`


## 5. Delete Project  _(root: `DoricoDialog`)_

**Text:** “Delete Project” · “Delete” · “Cancel” · “Are you sure you want to delete the project '%1'? This operation cannot be undone.”

**Buttons:** [Delete], [Cancel]

**Reacts to:** `onAccepted`, `onRejected`


## 6. Activate Project for Playback  _(root: `DoricoDialog`)_

**Text:** “Activate Project for Playback” · “Activate” · “Do Not Activate”

**Buttons:** [Activate], [Do Not Activate]

**Reacts to:** `onAccepted`, `onRejected`, `onCheckedChanged`


## 7. Launching Steinberg Activation Manager  _(root: `DoricoDialog`)_

**Text:** “Launching Steinberg Activation Manager” · “Relaunch” · “Quit”

**Buttons:** [Relaunch], [Quit]

**Reacts to:** `onAccepted`, `onRejected`


## 8. Forwards  _(root: `DoricoDialog`)_

**Text:** “Forwards” · “Backwards”

**Reacts to:** `onValueChanged`, `onCurrentIndexChanged`, `onCompleted`


## 9. Reset Sounds  _(root: `DoricoDialog`)_

**Text:** “Reset Sounds” · “We recommend you use Iconica Sketch and Etude Elements only with small projects on this device.\nDorico for iPad may be terminated by iPadOS if it uses too much device memory.”

**Buttons:** [We recommend you use Iconica Sketch and Etude Elements only with small projects on this device.\nDorico for iPad may be terminated by iPadOS if it uses too much device memory.]

**Reacts to:** `onRejected`, `onClicked`

**Backend calls:** `applyGM()`, `applyIconicaSketch()`, `downloadIconicaSketch()`, `subscribe()`


## 10. Download Progress  _(root: `DoricoDialog`)_

**Text:** “Download Progress”


## 11. Promote Overridden Chord Symbol Appearance  _(root: `DoricoDialog`)_

**Text:** “Promote Overridden Chord Symbol Appearance”

**Reacts to:** `onClicked`

**Backend calls:** `setSelectedIndex()`


## 12. Choose Fonts  _(root: `DoricoDialog`)_

**Text:** “Choose Fonts”

**Reacts to:** `onActivated`, `onPressed`

**Backend calls:** `textFontChanged()`, `textFontStyleChanged()`, `musicFontChanged()`, `musicFontStyleChanged()`


## 13. Auto Playback Template  _(root: `DoricoDialog`)_

**Text:** “Auto Playback Template”

**Reacts to:** `onClicked`, `onCheckStateChanged`

**Backend calls:** `moveUp()`, `moveDown()`, `resetOrder()`, `setUseGrooveAgent()`


## 14. Repeat Pitches  _(root: `DoricoDialog`)_

**Text:** “Repeat Pitches”

**Reacts to:** `onValueChanged`, `onCompleted`


## 15. Print Flows  _(root: `DoricoDialog`)_

**Text:** “Print Flows”

**Reacts to:** `onClicked`

**Backend calls:** `requestSelectAll()`, `requestSelectNone()`, `requestInvertSelection()`


## 16. Edit Help Connections  _(root: `DoricoDialog`)_

**Text:** “Edit Help Connections”

**Reacts to:** `onExtraActionButton1Triggered`, `onPressed`

**Backend calls:** `updateConnections()`


## 17. Manual Staff Visibility  _(root: `DoricoDialog`)_

**Text:** “Manual Staff Visibility”

**Reacts to:** `onClicked`

**Backend calls:** `requestClearAll()`, `requestResetAll()`, `requestShowAll()`, `requestHideAll()`


## 18. History  _(root: `DoricoDialog`)_

**Text:** “History”

**Reacts to:** `onCompleted`


## 19. Configuration Name  _(root: `DoricoDialog`)_

**Text:** “Configuration Name”

**Reacts to:** `onCompleted`, `onTextChanged`, `onPressed`


## 20. Rename Project  _(root: `DoricoDialog`)_

**Text:** “Rename Project”

**Reacts to:** `onEditingFinished`

**Backend calls:** `setProjectName()`


## 21. Custom Centered Beam  _(root: `DoricoDialog`)_

**Text:** “Custom Centered Beam”


## 22. Sign Out  _(root: `DoricoDialog`)_

**Text:** “Sign Out”

**Backend calls:** `getExplanatoryText()`


## 23. Comment  _(root: `DoricoDialog`)_

**Text:** “Comment”

**Reacts to:** `onCompleted`, `onTextChanged`


## 24. Register  _(root: `DoricoDialog`)_

**Text:** “Register”

**Reacts to:** `onRejected`, `onClicked`

**Backend calls:** `signInButtonClicked()`


## 25. Alert  _(root: `DoricoDialog`)_

**Text:** “Alert”

**Reacts to:** `onAccepted`


## 26. Set the priority order of available content sets, from highe  _(root: `Pane`)_

**Text:** “Set the priority order of available content sets, from highest to lowest:” · “Move Up” · “Move Down” · “Reset Order” · “Use Groove Agent SE for drum set”

**Buttons:** [Set the priority order of available content sets, from highest to lowest:], [Move Up], [Move Down], [Reset Order]

**Toggles:** ☐ Set the priority order of available content sets, from highest to lowest:, ☐ Use Groove Agent SE for drum set

**Reacts to:** `onClicked`


## 27. Engraving Options  _(root: `ListModel`)_

**Text:** “Engraving Options” · “Layout Options” · “Notation Options” · “Note Input Options” · “Playback Options”


## 28. Setup  _(root: `Rectangle`)_

**Text:** “Setup” · “Write” · “Engrave” · “Play”

**Inputs:** 1 drop-down(s), 0 number field(s)

**Reacts to:** `onClicked`


## 29.  / Month  _(root: `UpdateInstalledMainForm`)_

**Text:** “ / Month” · “ / Year” · “Restoring...” · “Restore Purchase”

**Reacts to:** `onClicked`

**Backend calls:** `subscribeMonthlyClicked()`, `subscribeAnnuallyClicked()`, `subscribeLifetimeClicked()`, `restorePurchaseClicked()`, `finished()`, `showPrivacyPolicy()`, `showTermsOfUse()`


## 30. Enter the number of steps by which to rotate.  _(root: `Item`)_

**Text:** “Enter the number of steps by which to rotate.” · “Number of steps:” · “Direction:”

**Buttons:** [Enter the number of steps by which to rotate.], [Direction:]

**Inputs:** 0 drop-down(s), 1 number field(s)


## 31. Register Dorico with a free Steinberg ID and increase the ma  _(root: `Pane`)_

**Text:** “Register Dorico with a free Steinberg ID and increase the maximum number of instruments in your projects from eight to 12” · “Tapping below will direct you to your default browser where you can either sign in with your existing Steinberg ID or create an account and sign in, after which you will be redirected here.” · “Sign In”

**Buttons:** [Register Dorico with a free Steinberg ID and increase the maximum number of instruments in your projects from eight to 12], [Sign In]


## 32. Select All  _(root: `Pane`)_

**Text:** “Select All” · “Select None” · “Invert Selection”

**Buttons:** [Select All], [Select None], [Invert Selection]


## 33. Instrument names language:  _(root: `Pane`)_

**Text:** “Instrument names language:” · “Reset instrument names” · “Date and time language:”

**Toggles:** ☐ Instrument names language:, ☐ Reset instrument names

**Inputs:** 2 drop-down(s), 0 number field(s)


## 34. Activate playback for this project?  _(root: `Item`)_

**Text:** “Activate playback for this project?” · “This will cause all required VST plug-ins to be loaded, and allow this project to be played back.” · “Remember my choice”

**Toggles:** ☐ Remember my choice


## 35. Reset  _(root: `ItemDelegate`)_

**Text:** “Reset” · “Show” · “Hide”


## 36. Advance Caret  _(root: `Item`)_

**Text:** “Advance Caret” · “Backspace”

**Buttons:** [Advance Caret], [Backspace]

**Reacts to:** `onClicked`, `onCompleted`


## 37. Filter...  _(root: `Item`)_

**Text:** “Filter...” · “View multiple instruments”

**Buttons:** [View multiple instruments]

**Toggles:** ☐ View multiple instruments


## 38. Select  _(root: `ScoreContextMenuPage`)_

**Text:** “Select” · “Deselect”

**Reacts to:** `onActivated`


## 39. Project Opened From Read-Only Location  _(root: `Pane`)_

**Text:** “Project Opened From Read-Only Location” · “Don't say this again”

**Toggles:** ☐ Project Opened From Read-Only Location, ☐ Don't say this again


## 40. Launching Steinberg Activation Manager  _(root: `Pane`)_

**Text:** “Launching Steinberg Activation Manager” · “To activate Dorico, switch to Steinberg Activation Manager and follow the prompts. If Steinberg Activation Manager is not running, click Relaunch. If you cannot activate Dorico now, click Quit.”


## 41. Up  _(root: `ItemDelegate`)_

**Text:** “Up” · “Down”


## 42. Restoring...  _(root: `LifetimeUnlockMainForm`)_

**Text:** “Restoring...” · “Restore Purchase”

**Reacts to:** `onClicked`

**Backend calls:** `lifetimeUnlockClicked()`, `restorePurchaseClicked()`, `finished()`, `showPrivacyPolicy()`, `showTermsOfUse()`


## 43. News item  _(root: `ItemDelegate`)_

**Text:** “News item” · “Opens in browser”


## 44. Tutorial name  _(root: `ItemDelegate`)_

**Text:** “Tutorial name” · “Opens in browser”


## 45. Select an instrument track to show the key editor  _(root: `Item`)_

**Text:** “Select an instrument track to show the key editor”


## 46. Loaded Audio Units and effects will be displayed here  _(root: `Item`)_

**Text:** “Loaded Audio Units and effects will be displayed here”

**Reacts to:** `onUiPathChanged`


## 47. Dorico detected one or more crash reports from recent unexpe  _(root: `Pane`)_

**Text:** “Dorico detected one or more crash reports from recent unexpected exits. Sending them to Steinberg improves software quality. Reports are anonymous, and our privacy policy outlines their use.”


## 48. Number of pitches to repeat:  _(root: `Pane`)_

**Text:** “Number of pitches to repeat:”

**Inputs:** 0 drop-down(s), 1 number field(s)


## 49. Are you sure you want to sign out?  _(root: `Pane`)_

**Text:** “Are you sure you want to sign out?”


## 50. More Information...  _(root: `Pane`)_

**Text:** “More Information...”

**Buttons:** [More Information...]


## 51. Specify the desired stem direction for each note and rest in  _(root: `Item`)_

**Text:** “Specify the desired stem direction for each note and rest in the beam.”


## 52. Mixer  _(root: `Window`)_

**Text:** “Mixer”


## 53. Remove Project Template  _(root: `HubCreateNewTemplateDelegateForm`)_

**Text:** “Remove Project Template”

**Reacts to:** `onTriggered`, `onClicked`

**Backend calls:** `removeProjectTemplate()`


## 54. Name  _(root: `ItemDelegate`)_

**Text:** “Name”


## 55. Tutorial name  _(root: `ItemDelegate`)_

**Text:** “Tutorial name”


## 56. Name  _(root: `ItemDelegate`)_

**Text:** “Name”


## All QML screen files referenced by Dorico 6.2

- `Dorico/Components/LongPressAnimation.qml`
- `Dorico/Components/ScoreViewTest.qml`
- `Dorico/Components/WriteModeEditOverlay.qml`
- `Dorico/Diagnostics/BasicOptionDialog.qml`
- `Dorico/Diagnostics/ScoreSnippetDrawerTestDialog.qml`
- `Dorico/Dialogs/AutomationConfigurationNameDialog.qml`
- `Dorico/Dialogs/AutoPlaybackTemplateDialog.qml`
- `Dorico/Dialogs/ChooseSingleChordSymbolOverridePopup.qml`
- `Dorico/Dialogs/CommentDialog.qml`
- `Dorico/Dialogs/CopyingProjectIntoAppContainerWarning.qml`
- `Dorico/Dialogs/CrashUploadConfirmationDialog.qml`
- `Dorico/Dialogs/CreateCustomChordDialog.qml`
- `Dorico/Dialogs/CustomCentredBeamDialog.qml`
- `Dorico/Dialogs/DeleteProjectWarning.qml`
- `Dorico/Dialogs/DoricoDynamicPopup.qml`
- `Dorico/Dialogs/DownloadProgressDialog.qml`
- `Dorico/Dialogs/FileModifiedDialog.qml`
- `Dorico/Dialogs/FlowHeadingTextContentDialog.qml`
- `Dorico/Dialogs/FontSetDialog.qml`
- `Dorico/Dialogs/GenerateChordSymbolsFromNotesDialog.qml`
- `Dorico/Dialogs/GenerateNotesFromChordSymbolsDialog.qml`
- `Dorico/Dialogs/GridViewOptionsDialog.qml`
- `Dorico/Dialogs/HelpConnectionsEditor.qml`
- `Dorico/Dialogs/ImportUserSettingsDialog.qml`
- `Dorico/Dialogs/InstrumentFamiliesEditor.qml`
- `Dorico/Dialogs/InstrumentScoreOrderEditor.qml`
- `Dorico/Dialogs/InvertDialog.qml`
- `Dorico/Dialogs/JumpBar.qml`
- `Dorico/Dialogs/LaunchActivationManagerDialog.qml`
- `Dorico/Dialogs/LiveStageEditor.qml`
- `Dorico/Dialogs/ManageInstrumentFiltersDialog.qml`
- `Dorico/Dialogs/ManualStaffVisibilityDialog.qml`
- `Dorico/Dialogs/MapPitchesDialog.qml`
- `Dorico/Dialogs/MessageBox.qml`
- `Dorico/Dialogs/ProjectActivationDialog.qml`
- `Dorico/Dialogs/ProjectLanguageDialog.qml`
- `Dorico/Dialogs/RenameProjectDialog.qml`
- `Dorico/Dialogs/RepeatPitchesDialog.qml`
- `Dorico/Dialogs/ResetSoundsDialog.qml`
- `Dorico/Dialogs/RespellOptionsDialog.qml`
- `Dorico/Dialogs/RotateCredentialsDialog.qml`
- `Dorico/Dialogs/ScoreContextMenuFilterPage.qml`
- `Dorico/Dialogs/ScoreContextMenuPage.qml`
- `Dorico/Dialogs/ScoreStatisticsDialog.qml`
- `Dorico/Dialogs/SetFlowHeadingOverridesDialog.qml`
- `Dorico/Dialogs/SetFlowPrintRangeDialog.qml`
- `Dorico/Dialogs/SignInPrompt.qml`
- `Dorico/Dialogs/SignOutPrompt.qml`
- `Dorico/Dialogs/SpaceEditorDialog.qml`
- `Dorico/Dialogs/SpinBoxPopover.qml`
- `Dorico/Dialogs/StageTemplateEditorDialog.qml`
- `Dorico/Dialogs/SubscriptionPrompt.qml`
- `Dorico/Dialogs/TransformScaleDialog.qml`
- `Dorico/Dialogs/UndoRedoHistoryDialog.qml`
- `Dorico/Dialogs/UpdateAvailableDialog.qml`
- `Dorico/Dialogs/ViewOptionsDialog.qml`
- `Dorico/DocumentWindow/LowerPanel/LowerPanelCommonControls.qml`
- `Dorico/DocumentWindow/LowerPanel/LowerPanelDevice.qml`
- `Dorico/DocumentWindow/LowerPanel/LowerPanelDeviceControls.qml`
- `Dorico/DocumentWindow/LowerPanel/LowerPanelDrumPads.qml`
- `Dorico/DocumentWindow/LowerPanel/LowerPanelDrumPadsControls.qml`
- `Dorico/DocumentWindow/LowerPanel/LowerPanelGuitar.qml`
- `Dorico/DocumentWindow/LowerPanel/LowerPanelGuitarControls.qml`
- `Dorico/DocumentWindow/LowerPanel/LowerPanelKeyboard.qml`
- `Dorico/DocumentWindow/LowerPanel/LowerPanelKeyboardControls.qml`
- `Dorico/DocumentWindow/LowerPanel/LowerPanelMIDIEditor.qml`
- `Dorico/DocumentWindow/LowerPanel/LowerPanelMIDIEditorControls.qml`
- `Dorico/DocumentWindow/LowerPanel/LowerPanelMixer.qml`
- `Dorico/DocumentWindow/LowerPanel/LowerPanelMixerControls.qml`
- `Dorico/DocumentWindow/LowerPanel/LowerPanelPropertiesControls.qml`
- `Dorico/DocumentWindow/Overlays/InstrumentFilterOverlay.qml`
- `Dorico/DocumentWindow/Panels/GraphicEditingPanel.qml`
- `Dorico/DocumentWindow/Panels/ProofingPanel.qml`
- `Dorico/DocumentWindow/PlayMode/PlayModeView.qml`
- `Dorico/DocumentWindow/Toolbar/ReadModeToolbar.qml`
- `Dorico/DocumentWindow/Toolbar/SecondaryToolbar.qml`
- `Dorico/DocumentWindow/Toolbar/Toolbar.qml`
- `Dorico/DocumentWindow/Toolboxes/NotationsToolbox.qml`
- `Dorico/Hub/HubMain.qml`
- `Dorico/LibraryManager/LibManBasicOptionDialog.qml`
- `Dorico/Mixer/MixerWindow.qml`
- `Dorico/Onboarding/LifetimeUnlockMain.qml`
- `Dorico/Onboarding/OnboardingMain.qml`
- `Dorico/Onboarding/UpdateInstalledMain.qml`
- `Dorico/Transport/TransportWindow.qml`
