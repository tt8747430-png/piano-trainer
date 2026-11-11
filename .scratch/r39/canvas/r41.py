# R41: every Songs and Practice page refactored to its own reference, in the calm language. Run: python3 -I r41.py
import json, re
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/r41_kit.py').read())
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/r41_lib.py').read())
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/r41_songs.py').read())
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/r44_editor.py').read())
import os
if os.path.exists('/home/user/piano-trainer/.scratch/r39/canvas/r41_practice.py'):
    exec(open('/home/user/piano-trainer/.scratch/r39/canvas/r41_practice.py').read())
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/r42_chords.py').read())
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/r45_places.py').read())
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/r46_admin.py').read())
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/r47_edit.py').read())
