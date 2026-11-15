# R69: Night for every area, not only Learn, Practice and the Player (ui-and-mockups: "Both themes, Night as its own
# boards in its own row"). Songs' home and a song's page, Profile and Settings, phone and laptop, drawn again through
# the one map in night.py. Exec'd last, after every board it reads is written.
for _f in ('Songs', 'SongsLaptop', 'Song', 'SongLaptop', 'Profile', 'ProfileLaptop', 'Settings', 'SettingsLaptop'):
    open(OUT + _f + 'Night.dc.html', 'w').write(night(open(OUT + _f + '.dc.html').read()))
print('r69 night ok')
