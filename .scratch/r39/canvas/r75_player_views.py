# ════ The laptop Player's four views wear the Play · Edit switch's shape ════
# Two segmented controls in one bar drew two shapes (the views 34 high in a 4px tray, each 112 wide; Play · Edit the
# bar's full 44, hugging its word): similarity, one control one look. The views take the bar's segment values: segments
# 44 high, hugging their word, 15 on 600 in ink, 15 off 500 in soft ink. The Player's own generator cannot be re-run
# (later passes live on its boards), so this pass edits the built board, once.
_f = '/home/user/piano-trainer/.scratch/r39/canvas/practice/project/PlayerDesk.dc.html'
_s = open(_f).read()
_a = 'style="width: 112px; height: 34px; padding: 0; box-sizing: border-box; justify-content: center; border: 0; border-radius: 9999px; background: {{v.bg}}; color: {{v.fg}}; display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600"'
if _a in _s:
    _s = _s.replace(_a, 'style="min-width: 76px; height: 44px; padding: 0 18px; box-sizing: border-box; justify-content: center; border: 0; border-radius: 22px; background: {{v.bg}}; color: {{v.fg}}; display: flex; align-items: center; gap: 8px; font-family: inherit; font-size: 15px; font-weight: {{v.fw}}"', 1)
    _n0 = '<nav aria-label="View" style="flex: none; height: 44px; box-sizing: border-box; padding: 4px; display: flex; gap: 2px;'
    assert _n0 in _s, 'views tray'
    _s = _s.replace(_n0, '<nav aria-label="View" style="flex: none; height: 44px; box-sizing: border-box; padding: 0; display: flex; gap: 0;', 1)
    _j = "bg: on ? '#332921' : 'transparent', fg: on ? '#FEFDFB' : '#332921', ...viewPress(id)"
    assert _j in _s, 'views logic'
    _s = _s.replace(_j, "bg: on ? '#332921' : 'transparent', fg: on ? '#FEFDFB' : '#685E56', fw: on ? 600 : 500, ...viewPress(id)", 1)
    # the button's hit area was widened 5 above and below the 34; at 44 it is the bar's own
    _s = _s.replace(' [aria-label="View"] button::before { content: ""; position: absolute; inset: -5px 0 }', '', 1)
    open(_f, 'w').write(_s)
    print('player views: the Play · Edit shape')
