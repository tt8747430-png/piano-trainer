# R69: Night for every area, not only Learn, Practice and the Player (ui-and-mockups: "Both themes, Night as its own
# boards in its own row"). Songs' home, a song's page, Explore, a folder, the score editor, a lesson, a course, Profile and Settings, phone and laptop, drawn again through
# the one map in night.py. Exec'd last, after every board it reads is written.
# Round 41: every other page too (the libraries, the Chord player, a practice run, the account pages, Admin, Legal,
# the app's layers), so no board is drawn by Day alone. The Player's own boards keep theirs (PlayerAppNight).
R69 = ('Songs', 'Song', 'Explore', 'Folder', 'Editor', 'Lesson', 'Course', 'Profile', 'Settings',
       'Main', 'Accompaniment', 'FingerTechnique', 'JazzVocabulary', 'Progressions', 'ProgressionEdit', 'PatternNew', 'ChordPlayer', 'Section',
       'Check', 'PlayChord', 'PlayChromatic', 'PlayExercise', 'PlayProgression', 'PlayWalk', 'PracticeResult',
       'Archive', 'Groups', 'SongSettings', 'Take', 'Takes', 'EditorDraft', 'YourLessonSettings', 'YourCourseSettings',
       'Admin', 'SignIn', 'Legal', 'AppLayers')
for _f in [b + s for b in R69 for s in ('', 'Laptop')] + ['Laptop']:
    if _f == 'MainLaptop':
        continue
    open(OUT + _f + 'Night.dc.html', 'w').write(night(open(OUT + _f + '.dc.html').read()))
print('r69 night ok')
