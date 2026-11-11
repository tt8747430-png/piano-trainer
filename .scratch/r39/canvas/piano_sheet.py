"""The one Piano sheet (R43 canvas 121; owner: "why the player doesnt have the hands on the keys setting and also the
range selections and the chord player doesnt have the view from above or seat. merge them and make proper one piano
settings"). Imported by the Chords page (r42_chords.py) and the Player (player/r43_player.py), so the two can never
drift again. Each page supplies the same bindings:

  pianoSw, kbHandsSw          switches: { on, track, knob, flip }
  kb3c, kb2c                  view cards: { on, bg, ring, dot, dotRing, mk, fw, pick }
  kb3d                        the 3D card is chosen (its Angle and Hands rows show)
  kbAngleSeg, kbRangeSeg, kbLabelSeg   segments: [{ l, on, bg, sh, fw, pick }]
  kbStrip                     the 88-key strip: { x, w, bl, cap }
  kbDimOp, kbPE               the sheet below Show the piano dims when the piano is hidden
  soundSub*, midiSub*         the two link rows (value, its colour, and a second line when there is news)

Only the choices differ by page: a chord fits the chord or shows two or four octaves (the strip is dragged to move
them); a song fits the song or matches the learner's own piano, 61, 76 or 88 keys (the strip shows where they sit).

Every measure is on the 4 scale: groups 12 round with rows of 48 and 8 by 16 padding; a view card 16 round, inset 8,
its picture 8 round (concentric); segments 44 high in an 11-round track; blocks 12 16 16 with 8 between."""

INK, SOFT, FILL, LINE, SHEET = '#332921', '#685E56', '#EEE9E2', '#DAD1C8', '#FEFDFB'
CARD = f'border-radius: 12px; background: {SHEET}; overflow: hidden; box-shadow: 0 0 0 1px rgba(51,41,33,.07)'
ROW = f'min-height: 48px; box-sizing: border-box; padding: 8px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 16px; color: {INK}'
SEP = 'box-shadow: inset 0 1px 0 #E9E2D8'
HONEY_SEP = 'box-shadow: inset 0 1px 0 rgba(176,122,42,.3)'
CHEV_R = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>'
PIC3D = '<g><path d="M9 6h30l7 18H2z"></path><path d="M14.5 6 11 24M20 6l-2 18M26 6v18M31.5 6l3 18M37 6l5 18"></path><path d="M12.6 6h3l-1.2 9h-3.4zM18.3 6h3l-.7 9h-3.3zM27.6 6h3l1 9h-3.3zM33.3 6h3l1.9 9h-3.4z" fill="currentColor"></path></g>'
PIC2D = '<g><rect x="2" y="4" width="44" height="20" rx="2"></rect><path d="M8.3 4v20M14.6 4v20M20.9 4v20M27.1 4v20M33.4 4v20M39.7 4v20"></path><path d="M6.5 4h3.6v11H6.5zM12.8 4h3.6v11h-3.6zM25.3 4h3.6v11h-3.6zM31.6 4h3.6v11h-3.6zM37.9 4h3.6v11h-3.6z" fill="currentColor"></path></g>'


def SWITCH(v):  # the Chords page's switch: 51 by 31, green when on
    return (f'<span aria-hidden="true" style="position: relative; flex: none; width: 51px; height: 31px; border-radius: 16px; background: {{{{{v}.track}}}}">'
            f'<span style="position: absolute; top: 2px; left: {{{{{v}.knob}}}}px; width: 27px; height: 27px; border-radius: 14px; background: #FFFFFF; box-shadow: 0 2px 4px rgba(0,0,0,.2)"></span></span>')


def SWROW(label, v, sep=''):
    return (f'<button type="button" role="switch" aria-checked="{{{{{v}.on}}}}" onClick="{{{{{v}.flip}}}}" style="{ROW}; {sep + "; " if sep else ""}width: 100%; border: 0; background: transparent; font: inherit; text-align: left">'
            f'<span>{label}</span>{SWITCH(v)}</button>')


def SEG(lst, n):
    return (f'<div role="radiogroup" style="display: grid; grid-auto-flow: column; grid-auto-columns: minmax(max-content, 1fr); gap: 2px; padding: 2px; border-radius: 11px; background: {FILL}">'
            f'<sc-for list="{{{{{lst}}}}}" as="o" hint-placeholder-count="{n}"><button type="button" role="radio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="min-width: 0; height: 44px; padding: 0 8px; border: 0; border-radius: 9px; background: {{{{o.bg}}}}; box-shadow: {{{{o.sh}}}}; color: {INK}; font: inherit; font-size: 14px; font-weight: {{{{o.fw}}}}; white-space: nowrap">{{{{o.l}}}}</button></sc-for></div>')


def CARDV(v, pic, name, inner=''):
    dot = (f'<span aria-hidden="true" style="flex: none; width: 24px; height: 24px; border-radius: 12px; background: {{{{{v}.dot}}}}; box-shadow: {{{{{v}.dotRing}}}}; color: {SHEET}; display: flex; align-items: center; justify-content: center">'
           f'<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="opacity: {{{{{v}.mk}}}}"><path d="m5 12 5 5 9-10"></path></svg></span>')
    return (f'<div style="border-radius: 16px; background: {{{{{v}.bg}}}}; box-shadow: {{{{{v}.ring}}}}; overflow: hidden">'
            f'<button type="button" role="radio" aria-checked="{{{{{v}.on}}}}" onClick="{{{{{v}.pick}}}}" style="width: 100%; min-height: 64px; box-sizing: border-box; border: 0; background: transparent; padding: 8px 16px 8px 8px; display: flex; align-items: center; gap: 12px; color: {INK}; font: inherit; text-align: left">'
            f'<span aria-hidden="true" style="flex: none; width: 64px; height: 48px; border-radius: 8px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; display: flex; align-items: center; justify-content: center">'
            f'<svg width="48" height="28" viewBox="0 0 48 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">{pic}</svg></span>'
            f'<span style="flex: 1; min-width: 0; font-size: 16px; font-weight: {{{{{v}.fw}}}}">{name}</span>{dot}</button>{inner}</div>')


def LINK(label, sub, sep=''):
    return (f'<a href="#" style="{ROW}; {sep + "; " if sep else ""}text-decoration: none"><span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px"><span>{label}</span>'
            f'<sc-if value="{{{{{sub}On}}}}" hint-placeholder-val="{{{{false}}}}"><span style="font-size: 13px; color: {SOFT}">{{{{{sub}}}}}</span></sc-if></span>'
            f'<span style="flex: none; display: flex; align-items: center; gap: 4px; color: {{{{{sub}ValC}}}}">{{{{{sub}Val}}}}<span style="display: flex; color: {SOFT}">{CHEV_R}</span></span></a>')


def STRIP(slider):
    act = (' role="slider" tabindex="0" aria-label="Move the keys shown along the 88" aria-valuetext="{{kbStrip.cap}}" onPointerDown="{{rangeAt}}" onPointerMove="{{rangeAt}}" onKeyDown="{{rangeKey}}"'
           if slider else ' role="img" aria-label="The keys shown, of 88: {{kbStrip.cap}}"')
    cur = 'touch-action: none; cursor: grab; ' if slider else ''
    return (f'<svg viewBox="0 0 340 26"{act} preserveAspectRatio="none" style="display: block; width: 100%; height: 40px; border-radius: 4px; overflow: hidden; {cur}">'
            f'<rect width="340" height="26" fill="{SHEET}" stroke="{LINE}"></rect><rect x="{{{{kbStrip.x}}}}" y="0" width="{{{{kbStrip.w}}}}" height="26" fill="#F6E3BC"></rect>'
            '<path d="{{kbStrip.bl}}" fill="#332C28"></path><rect x="{{kbStrip.x}}" y="0.75" width="{{kbStrip.w}}" height="24.5" fill="none" stroke="#B07A2A" stroke-width="1.5"></rect></svg>')


def BLOCK(head, body):
    return f'<div style="{CARD}; opacity: {{{{kbDimOp}}}}; pointer-events: {{{{kbPE}}}}"><div style="padding: 12px 16px 16px; display: flex; flex-direction: column; gap: 8px">{head}{body}</div></div>'


def PIANO_SHEET(slider, ranges=4, labels=4):
    """The sheet's body, under its title. `slider`: the strip can be dragged (the Chords page)."""
    inner = (f'<sc-if value="{{{{kb3d}}}}" hint-placeholder-val="{{{{true}}}}"><div style="{ROW}; {HONEY_SEP}"><span>Angle</span><div style="flex: none; width: 168px">{SEG("kbAngleSeg", 2)}</div></div>'
             + SWROW('Hands on the keys', 'kbHandsSw', HONEY_SEP) + '</sc-if>')
    return (f'<div style="{CARD}">' + SWROW('Show the piano', 'pianoSw') + '</div>'
            f'<div role="radiogroup" aria-label="Piano view" style="display: flex; flex-direction: column; gap: 8px; opacity: {{{{kbDimOp}}}}; pointer-events: {{{{kbPE}}}}">'
            + CARDV('kb3c', PIC3D, '3D piano', inner) + CARDV('kb2c', PIC2D, '2D keys') + '</div>'
            + BLOCK(f'<div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 16px; color: {INK}"><span>Range</span><span style="font-size: 14px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{kbStrip.cap}}}}</span></div>',
                    STRIP(slider) + SEG('kbRangeSeg', ranges))
            + BLOCK(f'<span style="font-size: 16px; color: {INK}">Labels</span>', SEG('kbLabelSeg', labels))
            + f'<div style="{CARD}">' + LINK('Sound', 'soundSub') + LINK('MIDI keyboard', 'midiSub', SEP) + '</div>')


# the values both pages compute the same way (JS, inside the logic's value object)
def CARD_JS(on, pick):
    return (f"((on) => ({{ on, bg: on ? '#FBF1DD' : '#FEFDFB', ring: on ? '0 0 0 2px #B07A2A' : '0 0 0 1px rgba(51,41,33,.07)', dot: on ? '#B07A2A' : 'transparent', "
            f"dotRing: on ? 'none' : 'inset 0 0 0 2px #DAD1C8', mk: on ? 1 : 0, fw: on ? 600 : 500, pick: {pick} }}))({on})")
def SW_JS(on, flip):
    return f"((on) => ({{ on, track: on ? '#7FB685' : '#DAD1C8', knob: on ? 22 : 2, flip: {flip} }}))({on})"
SEG_JS = ("(list, cur, pick) => list.map(([id, l]) => ({ l, on: id === cur, bg: id === cur ? '#FEFDFB' : 'transparent', "
          "sh: id === cur ? '0 1px 2px rgba(51,41,33,.18), 0 0 0 0.5px rgba(51,41,33,.08)' : 'none', fw: id === cur ? 600 : 500, pick: () => pick(id) }))")
