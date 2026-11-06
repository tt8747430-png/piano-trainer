import os
base = os.path.dirname(os.path.abspath(__file__))
scratch = os.path.dirname(base)
out = os.path.join(scratch, 'calm', 'project')
read = lambda n: open(os.path.join(base, n), encoding='utf8').read()
old = open(os.path.join(scratch, 'ideal/project/Main.dc.html'), encoding='utf8').read()
music = old[old.index('  music() {'):old.index('  componentWillUnmount()')].replace("'Dim · Add'", "'Dim & added'")
logic = read('logic2.js').replace('/*MUSIC*/', music.strip())

ICON = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'
CHEV_L = f'<svg viewBox="0 0 24 24" width="22" height="22" {ICON}><path d="m15 18-6-6 6-6"></path></svg>'
CHEV_R = f'<svg viewBox="0 0 24 24" width="18" height="18" {ICON}><path d="m9 18 6-6-6-6"></path></svg>'
CHEV_U = f'<svg viewBox="0 0 24 24" width="18" height="18" {ICON}><path d="m18 15-6-6-6 6"></path></svg>'
UPDOWN = f'<svg viewBox="0 0 24 24" width="16" height="16" {ICON}><path d="m7 15 5 5 5-5"></path><path d="m7 9 5-5 5 5"></path></svg>'
MORE = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8"></circle><circle cx="12" cy="12" r="1.8"></circle><circle cx="19" cy="12" r="1.8"></circle></svg>'
PLAY = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M7 4.8a1.6 1.6 0 0 1 2.4-1.4l11 6.8a2.1 2.1 0 0 1 0 3.6l-11 6.8A1.6 1.6 0 0 1 7 19.2z"></path></svg>'
STOP = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2.5"></rect></svg>'
PEDAL = f'<svg viewBox="0 0 24 24" width="22" height="22" {ICON}><path d="M12 3v7"></path><path d="M8 10h8l2 7H6z"></path><path d="M5 21h14"></path></svg>'

STAGE = '''<sc-if value="{{isKeys}}" hint-placeholder-val="{{ true }}">
        <sc-if value="{{twoRows}}" hint-placeholder-val="{{ false }}">
          <div style="position: absolute; left: 0; right: 0; top: 0; bottom: 0; display: flex; flex-direction: column; gap: 4px">
            <div style="font-size: 13px; line-height: 18px; color: {{c.soft}}">Right hand</div>
            <div style="position: relative; height: {{splitH}}px; border-radius: 12px; overflow: hidden; background: {{c.line}}; box-shadow: 0 0 0 1px {{c.line}}">
              <sc-for list="{{rhWhites}}" as="k" hint-placeholder-count="12"><button type="button" aria-label="{{k.name}}" style="position: absolute; left: {{k.left}}px; top: {{k.top}}px; width: {{k.w}}px; height: {{splitH}}px; box-sizing: border-box; padding: 0 0 6px; border: 0; border-right: 1px solid rgba(51,41,33,.16); background: {{k.bg}}; color: #332921; font: inherit; font-size: 13px; font-weight: 600; display: flex; align-items: flex-end; justify-content: center">{{k.label}}</button></sc-for>
              <sc-for list="{{rhBlacks}}" as="k" hint-placeholder-count="8"><button type="button" aria-label="{{k.name}}" style="position: absolute; left: {{k.left}}px; top: 0; width: {{k.w}}px; height: {{splitBlackH}}px; box-sizing: border-box; padding: 0 0 4px; border: 0; border-radius: 0 0 5px 5px; background: {{k.bg}}; color: #332921; font: inherit; font-size: 11px; font-weight: 600; display: flex; align-items: flex-end; justify-content: center">{{k.label}}</button></sc-for>
              <div style="position: absolute; left: 0; right: 0; top: 0; height: 3px; background: {{c.felt}}"></div>
            </div>
            <div style="font-size: 13px; line-height: 18px; margin-top: 4px; color: {{c.soft}}">Left hand</div>
            <div style="position: relative; height: {{splitH}}px; border-radius: 12px; overflow: hidden; background: {{c.line}}; box-shadow: 0 0 0 1px {{c.line}}">
              <sc-for list="{{lhWhites}}" as="k" hint-placeholder-count="12"><button type="button" aria-label="{{k.name}}" style="position: absolute; left: {{k.left}}px; top: {{k.top}}px; width: {{k.w}}px; height: {{splitH}}px; box-sizing: border-box; padding: 0 0 6px; border: 0; border-right: 1px solid rgba(51,41,33,.16); background: {{k.bg}}; color: #332921; font: inherit; font-size: 13px; font-weight: 600; display: flex; align-items: flex-end; justify-content: center">{{k.label}}</button></sc-for>
              <sc-for list="{{lhBlacks}}" as="k" hint-placeholder-count="8"><button type="button" aria-label="{{k.name}}" style="position: absolute; left: {{k.left}}px; top: 0; width: {{k.w}}px; height: {{splitBlackH}}px; box-sizing: border-box; padding: 0 0 4px; border: 0; border-radius: 0 0 5px 5px; background: {{k.bg}}; color: #332921; font: inherit; font-size: 11px; font-weight: 600; display: flex; align-items: flex-end; justify-content: center">{{k.label}}</button></sc-for>
              <div style="position: absolute; left: 0; right: 0; top: 0; height: 3px; background: {{c.felt}}"></div>
            </div>
          </div>
        </sc-if>
        <sc-if value="{{singleKeys}}" hint-placeholder-val="{{ true }}">
        <div style="position: absolute; left: 0; right: 0; top: {{keysTop}}px; height: {{keysH}}px; border-radius: 14px; overflow: hidden; background: {{c.line}}; box-shadow: 0 0 0 1px {{c.line}}">
          <sc-for list="{{whites}}" as="k" hint-placeholder-count="10">
            <button type="button" aria-label="{{k.name}}" style="position: absolute; left: {{k.left}}px; top: {{k.top}}px; width: {{k.w}}px; height: {{keysH}}px; box-sizing: border-box; padding: 0 0 14px; border: 0; border-right: 1px solid rgba(51,41,33,.16); background: {{k.bg}}; color: {{k.ink}}; font: inherit; font-size: {{k.size}}px; font-weight: {{k.weight}}; display: flex; align-items: flex-end; justify-content: center">{{k.label}}</button>
          </sc-for>
          <sc-for list="{{blacks}}" as="k" hint-placeholder-count="7">
            <button type="button" aria-label="{{k.name}}" style="position: absolute; left: {{k.left}}px; top: 0; width: {{k.w}}px; height: {{blackH}}px; box-sizing: border-box; padding: 0 0 8px; border: 0; border-radius: 0 0 6px 6px; background: {{k.bg}}; color: #332921; font: inherit; font-size: 12px; font-weight: 600; display: flex; align-items: flex-end; justify-content: center">{{k.label}}</button>
          </sc-for>
          <div style="position: absolute; left: 0; right: 0; top: 0; height: 3px; background: {{c.felt}}"></div>
          <sc-if value="{{handsShown}}" hint-placeholder-val="{{ false }}">
            <div style="position: absolute; left: {{palmLeft}}px; top: {{palmTop}}px; width: {{palmW}}px; height: {{palmH}}px; box-sizing: border-box; border: 1px solid {{c.handLine}}; border-radius: 26px 26px 0 0; background: {{c.hand}}"></div>
            <sc-for list="{{handFingers}}" as="f" hint-placeholder-count="5">
              <div style="position: absolute; left: {{f.left}}px; top: {{f.top}}px; width: 18px; height: {{f.height}}px; box-sizing: border-box; border: 1px solid {{c.handLine}}; border-radius: 9px 9px 0 0; background: {{c.hand}}"></div>
            </sc-for>
            <sc-for list="{{handFingers}}" as="f" hint-placeholder-count="5">
              <sc-if value="{{f.badge}}" hint-placeholder-val="{{ true }}">
                <div style="position: absolute; left: {{f.badgeLeft}}px; top: {{f.badgeTop}}px; width: 22px; height: 22px; border-radius: 11px; background: #332921; color: #FEFDFB; font-size: 13px; font-weight: 600; line-height: 22px; text-align: center">{{f.number}}</div>
              </sc-if>
            </sc-for>
          </sc-if>
        </div>
        </sc-if>
        <sc-if value="{{showStrip}}" hint-placeholder-val="{{ false }}">
          <div aria-label="Where the keys are on the piano" style="position: absolute; left: 0; right: 0; bottom: 0; height: 12px; border-radius: 6px; background: {{c.fill}}">
            <div style="position: absolute; left: {{stripLeft}}; top: 0; width: 16%; height: 12px; border-radius: 6px; background: {{c.band}}"></div>
          </div>
        </sc-if>
      </sc-if>
      <sc-if value="{{isStaff}}" hint-placeholder-val="{{ false }}">
        <button type="button" aria-label="Staff settings" onClick="{{toStaffSettings}}" style="position: absolute; left: 0; right: 0; top: 0; bottom: 0; z-index: 2; padding: 0; border: 0; background: transparent; cursor: pointer"></button>
        <sc-if value="{{chordOverStaff}}" hint-placeholder-val="{{ false }}">
          <div style="position: absolute; left: 60px; top: {{chordLabelY}}px; font-size: 19px; font-weight: 600; white-space: nowrap">{{symbol}}</div>
        </sc-if>
        <sc-if value="{{positionUnderStaff}}" hint-placeholder-val="{{ false }}">
          <div style="position: absolute; left: 60px; top: {{positionLabelY}}px; font-size: 13px; color: {{c.soft}}; white-space: nowrap">{{inversionLabel}}</div>
        </sc-if>
        <sc-for list="{{staffLines}}" as="l" hint-placeholder-count="5">
          <div style="position: absolute; left: 0; right: 0; top: {{l.y}}px; height: 1px; background: {{c.ink}}; opacity: .55"></div>
        </sc-for>
        <div style="position: absolute; left: 10px; top: {{clefY}}px; font-family: 'Noto Music', serif; font-size: {{clefSize}}px; line-height: {{clefSize}}px; color: {{c.ink}}">𝄞</div>
        <sc-for list="{{bassLines}}" as="l" hint-placeholder-count="0">
          <div style="position: absolute; left: 0; right: 0; top: {{l.y}}px; height: 1px; background: {{c.ink}}; opacity: .55"></div>
        </sc-for>
        <sc-if value="{{splitOn}}" hint-placeholder-val="{{ false }}">
          <div style="position: absolute; left: 12px; top: {{bassClefY}}px; font-family: 'Noto Music', serif; font-size: {{bassSize}}px; line-height: {{bassLine}}px; color: {{c.ink}}">𝄢</div>
        </sc-if>
        <sc-for list="{{ledgers}}" as="l" hint-placeholder-count="1">
          <div style="position: absolute; left: {{l.x}}px; top: {{l.y}}px; width: {{ledgerW}}px; height: 1px; background: {{c.ink}}; opacity: .55"></div>
        </sc-for>
        <sc-for list="{{staffNotes}}" as="n" hint-placeholder-count="3">
          <div style="position: absolute; left: {{n.x}}px; top: {{n.y}}px; width: {{noteW}}px; height: {{noteH}}px; border-radius: 50%; transform: rotate(-18deg); background: {{c.ink}}"></div>
        </sc-for>
        <sc-for list="{{staffSigns}}" as="n" hint-placeholder-count="0">
          <div style="position: absolute; left: {{n.x}}px; top: {{n.y}}px; font-family: 'Noto Music', serif; font-size: 24px; line-height: 28px; color: {{c.ink}}">{{n.sign}}</div>
        </sc-for>
        <sc-for list="{{staffLabels}}" as="n" hint-placeholder-count="3">
          <div style="position: absolute; left: {{n.x}}px; top: {{n.y}}px; padding: 0 3px; background: {{c.page}}; font-size: {{labelSize}}px; line-height: {{labelSize}}px; font-weight: {{n.weight}}; color: {{n.ink}}; white-space: nowrap">{{n.text}}</div>
        </sc-for>
      </sc-if>
      <sc-if value="{{isBuilt}}" hint-placeholder-val="{{ false }}">
        <div style="position: absolute; left: 0; right: 0; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; gap: 10px">
          <div style="display: flex; flex-direction: column; gap: 6px">
            <div style="font-size: 13px; color: {{c.soft}}">{{toneCaption}}</div>
            <div style="display: flex; gap: 6px">
              <sc-for list="{{toneChips}}" as="t" hint-placeholder-count="3">
                <button type="button" onClick="{{t.pick}}" style="flex: 1; max-width: 72px; min-width: 0; height: 52px; padding: 0; border: 0; border-radius: 12px; background: {{t.bg}}; box-shadow: {{t.ring}}; color: #332921; font: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.15"><span style="font-size: 16px; font-weight: 600">{{t.text}}</span><span style="font-size: 12px">{{t.degree}}</span></button>
              </sc-for>
            </div>
          </div>
          <sc-if value="{{hasTensions}}" hint-placeholder-val="{{ true }}">
            <div style="display: flex; flex-direction: column; gap: 6px">
              <div style="font-size: 13px; color: {{c.soft}}">Tensions: tap to add</div>
              <div style="display: flex; gap: 6px">
                <sc-for list="{{tensions}}" as="t" hint-placeholder-count="3">
                  <button type="button" onClick="{{t.pick}}" style="flex: 1; max-width: 72px; min-width: 0; height: 52px; padding: 0; border: 0; border-radius: 12px; background: {{t.bg}}; color: {{t.ink}}; font: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.15"><span style="font-size: 16px; font-weight: 600">{{t.note}}</span><span style="font-size: 12px">{{t.text}}</span></button>
                </sc-for>
              </div>
            </div>
          </sc-if>
          <sc-if value="{{hasAvoid}}" hint-placeholder-val="{{ true }}">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: {{c.soft}}">Avoid
              <sc-for list="{{avoid}}" as="t" hint-placeholder-count="1">
                <span style="color: {{c.ink}}; font-weight: 600">{{t.note}} ({{t.text}})</span>
              </sc-for>
            </div>
          </sc-if>
        </div>
      </sc-if>'''

TABS = f'''<div style="display: flex; align-items: center; justify-content: center; height: 44px">
        <div role="tablist" aria-label="View" style="display: flex; gap: 2px">
          <sc-for list="{{{{tabs}}}}" as="t" hint-placeholder-count="4">
            <button type="button" role="tab" aria-selected="{{{{t.chosen}}}}" onClick="{{{{t.pick}}}}" style="height: 44px; padding: 0 10px; border: 0; background: transparent; color: {{{{t.ink}}}}; font: inherit; font-size: 15px; font-weight: {{{{t.weight}}}}">{{{{t.name}}}}</button>
          </sc-for>
        </div>
      </div>'''

INV = f'''<div style="display: flex; align-items: center; height: 52px; box-sizing: border-box; padding: 0 4px 0 16px; border-radius: 14px; background: {{{{c.fill}}}}">
        <div style="flex: 1; font-size: 17px">{{{{inversionLabel}}}}</div>
        <button type="button" aria-label="Previous inversion" onClick="{{{{prevInversion}}}}" style="width: 44px; height: 44px; padding: 0; border: 0; background: transparent; color: {{{{c.ink}}}}; display: grid; place-items: center">{CHEV_L}</button>
        <button type="button" aria-label="Change chord" onClick="{{{{toChange}}}}" style="min-width: 64px; height: 44px; padding: 0 4px; border: 0; background: transparent; color: {{{{c.ink}}}}; font: inherit; font-size: 17px; font-weight: 600; white-space: nowrap">{{{{slash}}}}</button>
        <button type="button" aria-label="Next inversion" onClick="{{{{nextInversion}}}}" style="width: 44px; height: 44px; padding: 0; border: 0; background: transparent; color: {{{{c.ink}}}}; display: grid; place-items: center"><svg viewBox="0 0 24 24" width="22" height="22" {ICON}><path d="m9 18 6-6-6-6"></path></svg></button>
      </div>'''

ROWS = '<div style="box-sizing: border-box; padding: 0 0 0 0; border-radius: 14px; background: {{c.fill}}">' + INV.replace('background: {{c.fill}}', 'background: transparent').replace('height: 52px', 'height: 48px').replace('padding: 0 4px 0 16px', 'padding: 0 4px 0 14px').replace('border-radius: 14px', 'border-bottom: 1px solid {{c.line}}') + '<div style="padding: 0 14px">' + '@@VOICING@@' + '@@PRACTISE@@' + '</div></div>'

SOUND = f'''<button type="button" aria-pressed="{{{{arpOn}}}}" onClick="{{{{arpeggio}}}}" style="flex: none; height: 52px; padding: 0 18px; border: 0; border-radius: 26px; background: {{{{arpBg}}}}; color: {{{{arpInk}}}}; font: inherit; font-size: 15px; font-weight: 600">{{{{arpLabel}}}}</button>
        <button type="button" aria-label="Play" aria-pressed="{{{{chordOn}}}}" onClick="{{{{play}}}}" style="flex: none; width: 52px; height: 52px; padding: 0; border: 0; border-radius: 26px; background: {{{{accent}}}}; color: {{{{c.onAccent}}}}; display: grid; place-items: center">
          <sc-if value="{{{{chordOn}}}}" hint-placeholder-val="{{{{ false }}}}">{STOP}</sc-if>
          <sc-if value="{{{{chordOff}}}}" hint-placeholder-val="{{{{ true }}}}">{PLAY}</sc-if>
        </button>'''

def wheel_col(listname, label, extra=''):
    return f'''<div role="listbox" aria-label="{label}" style="position: relative">
            <sc-for list="{{{{{listname}}}}}" as="w" hint-placeholder-count="5">
              <button type="button" onClick="{{{{w.pick}}}}" style="position: absolute; left: 0; right: 0; top: {{{{w.y}}}}px; height: 44px; padding: 0; border: 0; background: transparent; color: {{{{c.ink}}}}; opacity: {{{{w.opacity}}}}; font: inherit; font-size: {{{{w.size}}}}px; font-weight: {{{{w.weight}}}}; white-space: nowrap{extra}">{{{{w.text}}}}</button>
            </sc-for>
          </div>'''

CHORD_WHEELS = f'''<div style="position: relative; height: {{{{wheelH}}}}px; display: grid; grid-template-columns: 2fr 3fr 3fr; column-gap: 4px; overflow: hidden">
          <div style="position: absolute; left: 0; right: 0; top: {{{{bandTop}}}}px; height: 44px; border-radius: 12px; background: {{{{c.band}}}}"></div>
          {wheel_col('rootWheel', 'Root')}
          {wheel_col('familyWheel', 'Family')}
          {wheel_col('typeWheel', 'Chord')}
        </div>'''

VOICING_WHEEL = f'''<div style="display: grid; grid-template-columns: 150px minmax(0, 1fr); column-gap: 16px; align-items: center">
          <div style="position: relative; height: {{{{wheelH}}}}px; display: grid; overflow: hidden">
            <div style="position: absolute; left: 0; right: 0; top: {{{{bandTop}}}}px; height: 44px; border-radius: 12px; background: {{{{c.band}}}}"></div>
            {wheel_col('voicingWheel', 'Voicing', '; text-decoration: {{w.dim}}')}
          </div>
          <div style="font-size: 15px; line-height: 21px; color: {{c.soft}}">{{{{voicingAbout}}}}</div>
        </div>'''

def head(title, left=None, right=None):
    l = left or ''
    r = right or ''
    return f'''<div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; height: 44px">
          <div style="justify-self: start">{l}</div>
          <div style="font-size: 17px; font-weight: 600">{title}</div>
          <div style="justify-self: end">{r}</div>
        </div>'''

def textbtn(label, action, weight=400):
    return f'<button type="button" onClick="{{{{{action}}}}}" style="height: 44px; padding: 0; border: 0; background: transparent; color: {{{{c.link}}}}; font: inherit; font-size: 17px; font-weight: {weight}; white-space: nowrap">{label}</button>'

def back(action, label='Back'):
    return f'<button type="button" onClick="{{{{{action}}}}}" style="height: 44px; padding: 0; border: 0; background: transparent; color: {{{{c.link}}}}; font: inherit; font-size: 17px; display: flex; align-items: center; margin-left: -6px">{CHEV_L}{label}</button>'

DONE = textbtn('Done', 'close', 600)
LINE = 'border-bottom: 1px solid {{c.line}}'

def row_nav(title, value, action, last=False):
    v = f'<span style="color: {{{{c.soft}}}}">{value}</span>' if value else ''
    b = '' if last else f'; {LINE}'
    return f'<button type="button" onClick="{{{{{action}}}}}" style="width: 100%; min-height: 48px; padding: 0; border: 0{b}; background: transparent; color: {{{{c.ink}}}}; font: inherit; font-size: 17px; display: flex; align-items: center; justify-content: space-between; gap: 8px; text-align: left"><span style="flex: 1">{title}</span>{v}<span style="color: {{{{c.soft}}}}; display: grid">{CHEV_R}</span></button>'

def row_menu(title, value, action, last=False):
    b = '' if last else f'; {LINE}'
    return f'<button type="button" onClick="{{{{{action}}}}}" style="width: 100%; min-height: 48px; padding: 0; border: 0{b}; background: transparent; color: {{{{c.ink}}}}; font: inherit; font-size: 17px; display: flex; align-items: center; gap: 6px; text-align: left"><span style="flex: 1">{title}</span><span style="color: {{{{c.soft}}}}">{value}</span><span style="color: {{{{c.soft}}}}; display: grid">{UPDOWN}</span></button>'

def switch(look, action, label):
    return f'<button type="button" role="switch" aria-label="{label}" onClick="{{{{{action}}}}}" style="position: relative; flex: none; width: 50px; height: 32px; padding: 0; border: 0; border-radius: 16px; background: {{{{{look}.bg}}}}"><span style="position: absolute; left: {{{{{look}.knob}}}}px; top: 2px; width: 28px; height: 28px; border-radius: 14px; background: #FEFDFB; box-shadow: 0 1px 3px rgba(0,0,0,.25)"></span></button>'

def row_switch(title, look, action, last=False):
    b = '' if last else f'; {LINE}'
    return f'<div style="min-height: 48px; display: flex; align-items: center; gap: 8px; font-size: 17px{b}"><span style="flex: 1">{title}</span>{switch(look, action, title)}</div>'

def group(*rows):
    return f'<div style="box-sizing: border-box; padding: 0 14px; border-radius: 14px; background: {{{{c.fill}}}}">' + ''.join(rows) + '</div>'

def caption(text):
    return f'<div style="margin: 6px 0 -4px 14px; font-size: 13px; color: {{{{c.soft}}}}">{text}</div>'

ROWS = ROWS.replace('@@VOICING@@', row_nav('Voicing', '{{voicingName}}', 'toVoicing')).replace('@@PRACTISE@@', row_nav('Practise', '', 'toPractise', True))
PANEL_ROWS = group(row_nav('Voicing', '{{voicingName}}', 'toVoicing'), row_nav('Practise', '', 'toPractise', True))

MORE_BODY = head('{{symbol}}', right=DONE) + group(
    row_menu('Hands', '{{playHandsValue}}', 'nextPlayHands'),
    row_nav('Keyboard', '', 'toKeyboard'),
    row_nav('Staff', '', 'toStaffSettings'),
    row_nav('Tools', '', 'toTools', True),
) + '<sc-if value="{{hasAlso}}" hint-placeholder-val="{{ true }}"><div style="padding: 0 14px; font-size: 13px; color: {{c.soft}}">Also written {{alsoWritten}}</div></sc-if>'

STAFF_BODY = head('Staff', right=DONE) + caption('Show on the staff') + group(
    row_switch('Chord', 'chordShown', 'flipChordShown'),
    row_switch('Position', 'positionShown', 'flipPositionShown'),
    row_switch('Fingers', 'fingersShown', 'flipFingersShown'),
    row_switch('Note names', 'notesShown', 'flipNotesShown', True),
)

KEYBOARD_BODY = head('Keyboard', left=back('toMore'), right=DONE) + group(
    row_menu('Key size', '{{keySizeValue}}', 'nextKeySize'),
    row_switch('Hands at the keys', 'showHandsLook', 'flipShowHands', True),
) + caption('Names') + group(
    row_menu('Note names', '{{noteNamesValue}}', 'nextNoteNames'),
    row_switch('On highlighted keys', 'markNotes', 'flipMarkNotes'),
    row_switch('Chord symbol', 'chordSymbol', 'flipChordSymbol', True),
) + caption('Playing') + group(
    row_menu('Swipe gesture', '{{swipeValue}}', 'nextSwipe'),
    row_nav('Pedals', '', 'toPedals'),
    row_switch('Play on selection', 'autoplay', 'flipAutoplay', True),
) + group(
    row_nav('MIDI keyboard', 'Not connected', 'close', True),
)

PRACTISE_BODY = head('Practise', right=DONE) + group(
    row_nav('Arpeggio', '', 'close'),
    row_nav('Inversions', '', 'close'),
    row_nav('Chromatic walk', '', 'close', True),
) + '<div style="padding: 0 14px; font-size: 13px; color: {{c.soft}}">Opens this chord in the Player.</div>'

TIMER = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2h4"></path><path d="M12 14l3-3"></path><circle cx="12" cy="14" r="8"></circle></svg>'
GAUGE = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 14 4-4"></path><path d="M3.3 19a10 10 0 1 1 17.4 0"></path></svg>'
TOOL_ICON = 'flex: none; width: 40px; height: 40px; border-radius: 10px; background: {{c.toolFill}}; color: {{c.toolInk}}; display: grid; place-items: center'
TOOL_CARD = 'box-sizing: border-box; padding: 10px 14px; border-radius: 14px; background: {{c.fill}}; display: flex; flex-direction: column; gap: 6px'
def tool_head(icon, name, detail, end):
    return f'<div style="display: flex; align-items: center; gap: 12px"><span style="{TOOL_ICON}">{icon}</span><span style="flex: 1; min-width: 0; display: flex; flex-direction: column"><span style="font-size: 17px; font-weight: 600">{name}</span><span style="font-size: 14px; color: {{{{c.soft}}}}; font-variant-numeric: tabular-nums">{detail}</span></span>{end}</div>'
STEP = 'width: 44px; height: 44px; padding: 0; border: 0; background: transparent; color: {{c.ink}}; font: inherit; font-size: 22px'
METRO_CARD = f'''<div role="group" aria-label="Metronome" style="{TOOL_CARD}">''' + tool_head(TIMER, 'Metronome', '{{metroDetail}}', f'''<button type="button" aria-label="{{{{metroLabel}}}}" aria-pressed="{{{{metroOn}}}}" onClick="{{{{flipMetro}}}}" style="flex: none; width: 44px; height: 44px; padding: 0; border: 0; border-radius: 22px; background: {{{{accent}}}}; color: {{{{c.onAccent}}}}; display: grid; place-items: center"><sc-if value="{{{{metroOff}}}}" hint-placeholder-val="{{{{ true }}}}">{PLAY}</sc-if><sc-if value="{{{{metroOn}}}}" hint-placeholder-val="{{{{ false }}}}">{STOP}</sc-if></button>''') + f'''<input type="range" min="30" max="300" value="{{{{tempo}}}}" aria-label="Tempo" onInput="{{{{slideTempo}}}}" style="width: 100%; height: 32px; margin: 0; accent-color: {{{{accent}}}}">
<div style="display: flex; align-items: center; justify-content: space-between; gap: 8px">
  <div role="group" aria-label="Beats" style="display: flex; gap: 2px; flex-wrap: wrap; margin-left: -3px">
    <sc-for list="{{{{beatSquares}}}}" as="b" hint-placeholder-count="4"><button type="button" aria-label="{{{{b.name}}}}" onClick="{{{{b.pick}}}}" style="width: 22px; height: 44px; padding: 0; border: 0; background: transparent; display: flex; align-items: center; justify-content: center"><span style="position: relative; width: 16px; height: 26px; box-sizing: border-box; border-radius: 4px; box-shadow: inset 0 0 0 1px {{{{c.line}}}}; overflow: hidden"><span style="position: absolute; left: 0; right: 0; bottom: 0; height: {{{{b.fillH}}}}px; background: {{{{b.bg}}}}"></span></span></button></sc-for>
  </div>
  <button type="button" onClick="{{{{tapTempo}}}}" style="flex: none; height: 44px; padding: 0 18px; border: 0; border-radius: 22px; background: {{{{c.band}}}}; color: {{{{c.ink}}}}; font: inherit; font-size: 15px; font-weight: 600">Tap tempo</button>
</div>
<button type="button" onClick="{{{{toMetroSettings}}}}" style="align-self: flex-start; height: 36px; padding: 0; border: 0; background: transparent; color: {{{{c.link}}}}; font: inherit; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 2px">Metronome settings{CHEV_R}</button>
</div>'''
TOOLS_BODY = head('Tools', left=back('toMore'), right=DONE) + METRO_CARD + group(
    row_nav('Tuner', '', 'toTuner'),
    row_nav('Chord finder', '', 'close'),
    row_nav('Circle of fifths', '', 'close', True),
)
def row_step(title, value, down, up, last=False):
    b = '' if last else f'; {LINE}'
    return f'<div style="min-height: 48px; display: flex; align-items: center; font-size: 17px{b}"><span style="flex: 1">{title}</span><button type="button" aria-label="{title} −" onClick="{{{{{down}}}}}" style="{STEP}">−</button><span style="min-width: 76px; text-align: center; font-weight: 600; font-variant-numeric: tabular-nums">{{{{{value}}}}}</span><button type="button" aria-label="{title} +" onClick="{{{{{up}}}}}" style="{STEP}">+</button></div>'
def explain(text):
    return f'<div style="padding: 0 14px; font-size: 14px; line-height: 19px; color: {{{{c.soft}}}}">{text}</div>'
def opens(flag, note, *rows):
    return f'<sc-if value="{{{{{flag}}}}}" hint-placeholder-val="{{{{ false }}}}"><div style="padding: 0 0 8px; font-size: 14px; line-height: 19px; color: {{{{c.soft}}}}; {LINE}">{note}</div>' + ''.join(rows) + '</sc-if>'
METRO_BODY = head('Metronome', left=back('toTools'), right=DONE) + caption('Rhythm') + group(
    row_menu('Time signature', '{{meter}}', 'nextMeter'),
    row_menu('Click sound', '{{clickSound}}', 'nextClickSound'),
    row_menu('Clicks per beat', '{{subdivision}}', 'nextSubdivision', True),
) + caption('Timing practice') + group(
    row_switch('Speed up gradually', 'rampLook', 'flipRamp', True),
    opens('rampOn', 'The tempo rises step by step, then holds at the target.',
        row_step('Start tempo', 'rampFrom', 'rampFromDown', 'rampFromUp'),
        row_step('Target tempo', 'rampTo', 'rampToDown', 'rampToUp'),
        row_step('Raise by', 'rampStep', 'rampStepDown', 'rampStepUp'),
        row_step('Every', 'rampEvery', 'rampEveryDown', 'rampEveryUp', True)),
) + group(
    row_switch('Mute some bars', 'gapLook', 'flipGap', True),
    opens('gapOn', 'The click goes quiet for some bars while you keep time, then comes back.',
        row_step('Click for', 'gapPlay', 'gapPlayDown', 'gapPlayUp'),
        row_step('Mute for', 'gapMute', 'gapMuteDown', 'gapMuteUp', True)),
)
TUNER_BODY = head('Tuner', left=back('toTools'), right=DONE) + '''<sc-if value="{{tunerWorks}}" hint-placeholder-val="{{ true }}">
  <div aria-live="polite" style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 8px 14px 4px">
    <div style="font-size: 72px; line-height: 80px; font-weight: 600; letter-spacing: -0.02em">A4</div>
    <div style="font-size: 17px; font-weight: 600; font-variant-numeric: tabular-nums">{{tunerReading}}</div>
    <div style="position: relative; width: 100%; height: 36px"><div style="position: absolute; left: 0; right: 0; top: 18px; height: 1px; background: {{c.soft}}; opacity: .5"></div><div style="position: absolute; left: 50%; top: 6px; width: 1px; height: 25px; background: {{c.soft}}"></div><div style="position: absolute; left: {{needleLeft}}%; top: 0; width: 4px; height: 36px; margin-left: -2px; border-radius: 2px; background: {{needleInk}}"></div></div>
    <div style="width: 100%; display: flex; justify-content: space-between; font-size: 13px; color: {{c.soft}}; font-variant-numeric: tabular-nums"><span>−50</span><span>{{tunerHz}}</span><span>+50</span></div>
  </div>
</sc-if>
<sc-if value="{{tunerRefused}}" hint-placeholder-val="{{ false }}"><div role="status" style="padding: 40px 14px; text-align: center; font-size: 17px; line-height: 24px; color: {{c.soft}}">The microphone is not available. Allow it in the browser to use the tuner.</div></sc-if>''' + group(
    row_step('A4 tuning', 'a4Text', 'a4Down', 'a4Up', True),
) + explain('The microphone stops when you close this.')

PEDALS_BODY = head('Pedals', left=back('toKeyboard'), right=DONE) + f'''<div style="box-sizing: border-box; padding: 0 14px; border-radius: 14px; background: {{{{c.fill}}}}">
          <sc-for list="{{{{pedalRows}}}}" as="r" hint-placeholder-count="3">
            <div style="min-height: 60px; display: flex; align-items: center; gap: 8px; {LINE}">
              <div style="flex: 1; display: flex; flex-direction: column"><span style="font-size: 17px">{{{{r.name}}}}</span><span style="font-size: 13px; color: {{{{c.soft}}}}">{{{{r.detail}}}}</span></div>
              <button type="button" role="switch" aria-label="{{{{r.name}}}}" onClick="{{{{r.pick}}}}" style="position: relative; flex: none; width: 50px; height: 32px; padding: 0; border: 0; border-radius: 16px; background: {{{{r.bg}}}}"><span style="position: absolute; left: {{{{r.knob}}}}px; top: 2px; width: 28px; height: 28px; border-radius: 14px; background: #FEFDFB; box-shadow: 0 1px 3px rgba(0,0,0,.25)"></span></button>
            </div>
          </sc-for>
        </div>'''

def sheets(frame):
    bodies = [
        ('isChange', 300, f'<div style="display: flex; align-items: center; justify-content: space-between; height: 44px"><button type="button" onClick="{{{{flip}}}}" style="height: 44px; padding: 0; border: 0; background: transparent; color: {{{{c.link}}}}; font: inherit; font-size: 17px">{{{{spelling}}}}</button>{DONE}</div>{CHORD_WHEELS}'),
        ('isVoicing', 300, head('Voicing', right=DONE) + VOICING_WHEEL),
        ('isMore', 318, MORE_BODY),
        ('isKeyboard', 690, KEYBOARD_BODY),
        ('isPractise', 270, PRACTISE_BODY),
        ('isTools', 440, TOOLS_BODY),
        ('isTuner', 420, TUNER_BODY),
        ('metroPlain', 430, METRO_BODY),
        ('metroRamp', 660, METRO_BODY),
        ('metroGap', 560, METRO_BODY),
        ('metroBoth', 790, METRO_BODY),
        ('isPedals', 310, PEDALS_BODY),
        ('isStaffSettings', 320, STAFF_BODY),
    ]
    return '\n'.join(f'<sc-if value="{{{{{flag}}}}}" hint-placeholder-val="{{{{ false }}}}">{frame(h, body)}</sc-if>' for flag, h, body in bodies)

def phone_sheet(h, body, under=0):
    return f'''<div role="dialog" style="position: absolute; left: 0; right: 0; bottom: {-under}px; height: {h + under}px; box-sizing: border-box; padding: 8px 16px {24 + under}px; overflow-y: auto; border-radius: 28px 28px 0 0; background: {{{{c.sheet}}}}; box-shadow: {{{{c.shadow}}}}; display: flex; flex-direction: column; gap: 10px">{body}</div>'''

def side_panel(h, body):
    return f'''<div style="position: absolute; inset: 0; box-sizing: border-box; padding: 32px 24px; background: {{{{c.sheet}}}}; display: flex; flex-direction: column; gap: 10px">{body}</div>'''

HEAD = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>%s</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link href="https://fonts.googleapis.com/css2?family=Noto+Music&amp;display=swap" rel="stylesheet">
<style>
body{margin:0}
</style>
</helmet>
'''
FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', 'Noto Music', sans-serif"
PROPS = '{"theme":{"editor":"enum","options":["day","night"],"default":"day","section":"Look"},"accent":{"editor":"color","options":["#EDC684","#85B8DC","#9BC093"],"default":"#EDC684","section":"Look"},"page":{"editor":"enum","options":["keys","staff","fingers","built"],"default":"keys","section":"State"},"overlay":{"editor":"enum","options":["none","change","voicing","more","keyboard","practise","tools","pedals"],"default":"none","section":"State"},"view":{"editor":"enum","options":["rest","chord","arpeggio"],"default":"rest","section":"State"},"keySize":{"editor":"enum","options":["fit","large","all"],"default":"fit","section":"State"},"root":{"editor":null},"flats":{"editor":null},"chord":{"editor":null},"inversion":{"editor":null},"voicing":{"editor":null},"held":{"editor":null},"showHands":{"editor":null},"staffFingers":{"editor":null},"metroOn":{"editor":null},"tunerRefused":{"editor":null},"rampOn":{"editor":null},"gapOn":{"editor":null},"$preview":{"width":%d,"height":%d}}'
def tail(script, w, h):
    return '</x-dc>\n<script type="text/x-dc" data-dc-script data-props=\'' + PROPS % (w, h) + "'>\n" + script + '</script>\n</body>\n</html>\n'

def logic_for(w, h, reach, size):
    return logic.replace('/*STAGE_W*/', str(w)).replace('/*STAGE_H*/', str(h)).replace('/*REACH*/', str(reach)).replace('/*NAME_SIZE*/', size)

PHONE_SIZE = 'symbol.length <= 2 ? 96 : symbol.length <= 4 ? 80 : symbol.length <= 6 ? 60 : symbol.length <= 8 ? 46 : 38'
PHONE_SIZE_COMPACT = 'symbol.length <= 2 ? 72 : symbol.length <= 4 ? 64 : symbol.length <= 6 ? 50 : symbol.length <= 8 ? 40 : 34'
ICONBTN = 'width: 44px; height: 44px; padding: 0; border: 0; background: transparent; color: {{c.ink}}; display: grid; place-items: center'

def phone_page(name, title, w, vh, top, bottom, compact, over=0, under=0):
    name_h, name_line = (110, 78) if compact else (150, 108)
    size = PHONE_SIZE_COMPACT if compact else PHONE_SIZE
    stage_top = top + 50 + name_h + 14
    stage_h = vh - top - bottom - 352 - name_h
    html = HEAD % title + f'''<div style="position: relative; width: {w}px; height: {vh}px; overflow: {'visible' if under else 'hidden'}; background: {{{{c.page}}}}; color: {{{{c.ink}}}}; font-family: {FONT}">
  <div style="position: absolute; left: 8px; right: 8px; top: {top}px; display: flex; justify-content: space-between">
    <button type="button" aria-label="Back" style="{ICONBTN}">{CHEV_L}</button>
    <button type="button" aria-label="More" onClick="{{{{toMore}}}}" style="{ICONBTN}">{MORE}</button>
  </div>
  <div style="position: absolute; left: 16px; right: 16px; top: {top + 50}px; height: {name_h}px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center">
    <div style="font-size: {{{{nameSize}}}}px; line-height: {name_line}px; height: {name_line}px; font-weight: 600; letter-spacing: -0.03em; white-space: nowrap">{{{{symbol}}}}</div>
    <div style="font-size: 17px; line-height: 24px; color: {{{{c.soft}}}}">{{{{nameLine}}}}</div>
  </div>
  <div style="position: absolute; left: 16px; top: {stage_top}px; width: {w - 32}px; height: {stage_h}px">
      {STAGE}
  </div>
  <div style="position: absolute; left: 16px; right: 16px; top: {stage_top + stage_h + 6}px">
      {TABS}
  </div>
  <div style="position: absolute; left: 16px; right: 16px; top: {stage_top + stage_h + 56}px">
      {ROWS}
  </div>
  <sc-if value="{{{{noOverlay}}}}" hint-placeholder-val="{{{{ true }}}}">
    <div role="toolbar" aria-label="Chord" style="position: absolute; left: 16px; right: 16px; bottom: {bottom}px; height: 68px; box-sizing: border-box; padding: 0 8px; border-radius: 34px; background: {{{{c.glass}}}}; backdrop-filter: blur(24px) saturate(1.8); box-shadow: 0 0 0 1px {{{{c.line}}}}, {{{{c.shadow}}}}; display: flex; align-items: center; gap: 8px">
      <button type="button" onClick="{{{{toChange}}}}" style="flex: 1; min-width: 0; height: 52px; padding: 0 0 0 14px; border: 0; background: transparent; color: {{{{c.ink}}}}; font: inherit; font-size: 17px; font-weight: 600; text-align: left; display: flex; align-items: center; gap: 6px; white-space: nowrap">Change chord{CHEV_U}</button>
      {SOUND}
    </div>
  </sc-if>
  <sc-if value="{{{{scrimOn}}}}" hint-placeholder-val="{{{{ false }}}}">
    <button type="button" aria-label="Close" onClick="{{{{close}}}}" style="position: absolute; left: 0; right: 0; top: {-over}px; bottom: {-under}px; padding: 0; border: 0; background: {{{{c.scrim}}}}"></button>
  </sc-if>
  {sheets(lambda h, body: phone_sheet(min(h, vh - 24), body, under))}
</div>
''' + tail(logic_for(w - 32, stage_h, 2, size), w, vh)
    open(os.path.join(out, name + '.dc.html'), 'w', encoding='utf8').write(html)

# Viewports measured on the device: the installed app is the whole screen, Safari keeps 402x714 (393x695 on the smaller phone).
phone_page('App', 'Chords on the iPhone 17 Pro', 402, 874, 62, 34, False)
phone_page('AppSafari', 'Chords in Safari on the iPhone 17 Pro', 402, 714, 8, 12, True, 62, 98)
phone_page('AppSmall', 'Chords on the smaller iPhone', 393, 852, 54, 34, False)
phone_page('AppSmallSafari', 'Chords in Safari on the smaller iPhone', 393, 695, 8, 12, True, 54, 103)

laptop = HEAD % 'Chords on a laptop' + f'''<div style="position: relative; width: 1710px; height: 904px; overflow: hidden; background: {{{{c.page}}}}; color: {{{{c.ink}}}}; font-family: {FONT}">
  <button type="button" aria-label="Back" style="position: absolute; left: 24px; top: 24px; {ICONBTN}">{CHEV_L}</button>
  <div style="position: absolute; left: 115px; top: 32px; width: 1000px; height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center">
    <div style="font-size: {{{{nameSize}}}}px; line-height: 132px; height: 132px; font-weight: 600; letter-spacing: -0.03em; white-space: nowrap">{{{{symbol}}}}</div>
    <div style="font-size: 19px; line-height: 28px; color: {{{{c.soft}}}}">{{{{nameLine}}}}</div>
  </div>
  <div style="position: absolute; left: 115px; top: 226px; width: 1000px; height: 540px">
      {STAGE}
  </div>
  <div style="position: absolute; left: 115px; width: 1000px; top: 774px">
      {TABS}
  </div>
  <div style="position: absolute; left: 115px; width: 1000px; top: 828px; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 16px; align-items: center">
      {INV}
      <div role="toolbar" aria-label="Sound" style="display: flex; gap: 8px">{SOUND}</div>
  </div>
  <div role="region" aria-label="Change chord" style="position: absolute; right: 0; top: 0; bottom: 0; width: 480px; box-sizing: border-box; padding: 32px 24px; background: {{{{c.sheet}}}}; box-shadow: -1px 0 0 {{{{c.line}}}}; display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex; align-items: center; justify-content: space-between; height: 44px">
      <div style="font-size: 20px; font-weight: 600">Change chord</div>
      <button type="button" aria-label="More" onClick="{{{{toMore}}}}" style="{ICONBTN}">{MORE}</button>
    </div>
    {CHORD_WHEELS}
    {PANEL_ROWS}
    <button type="button" onClick="{{{{flip}}}}" style="align-self: center; height: 44px; padding: 0; border: 0; background: transparent; color: {{{{c.link}}}}; font: inherit; font-size: 15px">{{{{spelling}}}}</button>
    {''.join(f'<sc-if value="{{{{{flag}}}}}" hint-placeholder-val="{{{{ false }}}}">{side_panel(0, body)}</sc-if>' for flag, body in [('isVoicing', head('Voicing', right=DONE) + VOICING_WHEEL), ('isMore', MORE_BODY), ('isKeyboard', KEYBOARD_BODY), ('isPractise', PRACTISE_BODY), ('isTools', TOOLS_BODY), ('isMetroSettings', METRO_BODY), ('isTuner', TUNER_BODY), ('isPedals', PEDALS_BODY), ('isStaffSettings', STAFF_BODY)])}
  </div>
</div>
''' + tail(logic_for(1000, 540, 5, 'symbol.length <= 4 ? 120 : symbol.length <= 6 ? 96 : 72'), 1710, 904)
open(os.path.join(out, 'DeskApp.dc.html'), 'w', encoding='utf8').write(laptop)

land = HEAD % 'Chords on its side' + f'''<div style="position: relative; width: 874px; height: 402px; overflow: hidden; background: {{{{c.page}}}}; color: {{{{c.ink}}}}; font-family: {FONT}">
  <button type="button" aria-label="Back" style="position: absolute; left: 56px; top: 12px; {ICONBTN}">{CHEV_L}</button>
  <div style="position: absolute; left: 60px; top: 62px; width: 200px; display: flex; flex-direction: column; gap: 2px">
    <div style="font-size: {{{{nameSize}}}}px; line-height: 72px; font-weight: 600; letter-spacing: -0.03em; white-space: nowrap">{{{{symbol}}}}</div>
    <div style="font-size: 15px; line-height: 20px; color: {{{{c.soft}}}}">{{{{nameLine}}}}</div>
  </div>
  <div style="position: absolute; left: 60px; bottom: 24px; width: 200px; display: flex; flex-direction: column; gap: 10px">
    <button type="button" onClick="{{{{toChange}}}}" style="height: 44px; padding: 0; border: 0; background: transparent; color: {{{{c.ink}}}}; font: inherit; font-size: 17px; font-weight: 600; text-align: left; display: flex; align-items: center; gap: 6px">Change chord{CHEV_U}</button>
    <div style="display: flex; gap: 8px">{SOUND}</div>
  </div>
  <div style="position: absolute; left: 280px; top: 24px; width: 540px; height: 354px">
      {STAGE}
  </div>
</div>
''' + tail(logic_for(540, 354, 2, 'symbol.length <= 3 ? 64 : symbol.length <= 6 ? 48 : 34'), 874, 402)
open(os.path.join(out, 'SideApp.dc.html'), 'w', encoding='utf8').write(land)

SAFARI_BAR = """<svg xmlns="http://www.w3.org/2000/svg" width="334" height="48" style="position: absolute; left: %dpx; bottom: 34px; filter: drop-shadow(0 4px 12px rgba(0,0,0,.18))" aria-hidden="true"><g fill="rgba(250,250,250,.86)" stroke="rgba(0,0,0,.1)"><circle cx="24" cy="24" r="23.5"></circle><rect x="56.5" y=".5" width="221" height="47" rx="23.5"></rect><circle cx="310" cy="24" r="23.5"></circle></g><path d="M27 16l-8 8 8 8" fill="none" stroke="#1c1c1e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path><text x="167" y="29" font-family="-apple-system,system-ui,sans-serif" font-size="15" font-weight="500" text-anchor="middle" fill="#1c1c1e">piano-trainer</text><g fill="#1c1c1e"><circle cx="302" cy="24" r="2"></circle><circle cx="310" cy="24" r="2"></circle><circle cx="318" cy="24" r="2"></circle></g></svg>"""
PHONES = {
    'pro': dict(fw=450, fh=920, sx=24, sy=23, sw=402, sh=874, r=62, png='iphone-17-pro', comp='App', at=0, vh=874),
    'small': dict(fw=440, fh=899, sx=23.5, sy=22.5, sw=393, sh=852, r=60, png='iphone-17-pro', comp='AppSmall', at=0, vh=852),
    'pro-safari': dict(fw=450, fh=920, sx=24, sy=23, sw=402, sh=874, r=62, png='iphone-safari', comp='AppSafari', at=62, vh=714),
    'small-safari': dict(fw=440, fh=899, sx=23.5, sy=22.5, sw=393, sh=852, r=60, png='iphone-safari', comp='AppSmallSafari', at=54, vh=695),
}

def board(name, title, w, h, inner):
    body = HEAD.replace('<link href="https://fonts.googleapis.com/css2?family=Noto+Music&amp;display=swap" rel="stylesheet">\n', '') % title
    body += f'<div style="position: relative; width: {w}px; height: {h}px; overflow: hidden">\n{inner}\n</div>\n'
    body += '</x-dc>\n<script type="text/x-dc" data-dc-script data-props=\'{"$preview":{"width":%d,"height":%d}}\'>\nclass Component extends DCLogic {\n  renderVals() {\n    return {};\n  }\n}\n</script>\n</body>\n</html>\n' % (w, h)
    open(os.path.join(out, name + '.dc.html'), 'w', encoding='utf8').write(body)

def page_ink(attrs):
    return '#191512' if 'theme="night"' in attrs else '#F7F3EE'

def wrap(name, title, attrs, kind='pro'):
    d = PHONES[kind]
    bar = SAFARI_BAR % ((d['sw'] - 334) / 2) if 'safari' in kind else ''
    board(name, title, d['fw'], d['fh'], f"""<div style="position: absolute; left: {d['sx']}px; top: {d['sy']}px; width: {d['sw']}px; height: {d['sh']}px; border-radius: {d['r']}px; overflow: hidden; background: {page_ink(attrs)}">
  <div style="position: absolute; left: 0; top: {d['at']}px; width: {d['sw']}px; height: {d['vh']}px"><dc-import name="{d['comp']}" {attrs} hint-size="{d['sw']}px,{d['vh']}px"></dc-import></div>
  {bar}
</div>
<img src="frames/{d['png']}.png" alt="" style="position: absolute; left: 0; top: 0; width: {d['fw']}px; height: {d['fh']}px; pointer-events: none">""")

def side(name, title, attrs):
    board(name, title, 920, 450, f"""<div style="position: absolute; left: 23px; top: 24px; width: 874px; height: 402px; border-radius: 62px; overflow: hidden; background: {page_ink(attrs)}"><dc-import name="SideApp" {attrs} hint-size="874px,402px"></dc-import></div>
<img src="frames/iphone-17-pro.png" alt="" style="position: absolute; left: 235px; top: -235px; width: 450px; height: 920px; transform: rotate(-90deg); pointer-events: none">""")

def mac(name, title, attrs):
    night = 'theme="night"' in attrs
    ink = '#ebebf5' if night else '#1c1c1e'
    board(name, title, 2143, 1299, f"""<img src="frames/macbook-wallpaper.jpg" alt="" style="position: absolute; left: 217.7px; top: 36.6px; width: 1710px; height: 1112px">
<div style="position: absolute; left: 217.7px; top: 36.6px; width: 1710px; height: 37px; background: rgba(255,255,255,.28)"></div>
<div style="position: absolute; left: 217.7px; top: 73.6px; width: 1710px; height: 51px; border-radius: 16px 16px 0 0; overflow: hidden; background: url(frames/safari-{'dark' if night else 'light'}.png) 0 0 / 100% 100%; color: {ink}; font: 500 14px/51px -apple-system, system-ui, sans-serif; text-align: center">piano-trainer</div>
<div style="position: absolute; left: 217.7px; top: 124.6px; width: 1710px; height: 904px; border-radius: 0 0 16px 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,.35)"><dc-import name="DeskApp" {attrs} hint-size="1710px,904px"></dc-import></div>
<img src="frames/macbook-air.png" alt="" style="position: absolute; left: 0; top: 0; width: 2143px; height: 1299px; pointer-events: none">""")

WRAPS = {
  'Main': ('At rest', ''),
  'ChangeChord': ('Changing the chord', 'overlay="change" root="3" flats="true" chord="m7"'),
  'Voicing': ('Voicing', 'overlay="voicing" chord="maj7" voicing="drop2"'),
  'Staff': ('The staff', 'page="staff" root="7" chord="7" staff-fingers="true"'),
  'Fingering': ('Fingering', 'page="fingers" chord="maj7"'),
  'BigChord': ('A big chord', 'root="7" chord="13"'),
  'BigFingering': ('Fingering a big chord', 'page="fingers" root="7" chord="13"'),
  'BigStaff': ('A big chord on the staff', 'page="staff" root="7" chord="13" staff-fingers="true"'),
  'NotesPage': ('Notes and tensions', 'page="built" root="7" chord="7"'),
  'Arpeggio': ('Arpeggio sounding', 'view="arpeggio" root="9" chord="m9"'),
  'MoreOptions': ('Chord options', 'overlay="more" chord="maj7"'),
  'KeyboardSettings': ('Keyboard settings', 'overlay="keyboard"'),
  'Practise': ('Practise', 'overlay="practise" root="9" chord="m"'),
  'Tools': ('Tools', 'overlay="tools"'),
  'Pedals': ('Pedals', 'overlay="pedals"'),
  'ToolsLive': ('The metronome running', 'overlay="tools" metro-on="true"'),
  'MetronomeSettings': ('Metronome settings', 'overlay="metroSettings"'),
  'MetronomeOpen': ('Metronome settings, both on', 'overlay="metroSettings" ramp-on="true" gap-on="true"'),
  'Tuner': ('The Tuner', 'overlay="tuner"'),
  'TunerRefused': ('The Tuner with no microphone', 'overlay="tuner" tuner-refused="true"'),
  'StaffSettings': ('Staff settings', 'overlay="staffSettings" page="staff" root="7" chord="7" staff-fingers="true"'),
  'LargeKeys': ('Large keys', 'keySize="large" root="2" chord="m7"'),
  'AllKeys': ('All keys', 'keySize="all" root="5" chord="maj7"'),
  'HandsAtKeys': ('Hands at the keys', 'showHands="true" root="7" chord="maj"'),
  'Held': ('Playing your own keyboard', 'held="true" root="9" chord="m7"'),
  'Night': ('By night', 'theme="night" root="1" flats="true" chord="maj7"'),
}
for name, (title, attrs) in WRAPS.items():
    wrap(name, title, attrs)
BROWSER = {
  'SafariMain': ('In Safari', 'root="0" chord="maj7"', 'pro-safari'),
  'SafariStaff': ('The staff in Safari', 'page="staff" root="7" chord="13" staff-fingers="true"', 'pro-safari'),
  'SafariFingering': ('Fingering in Safari', 'page="fingers" root="7" chord="13"', 'pro-safari'),
  'SafariChange': ('Changing the chord in Safari', 'overlay="change" root="3" flats="true" chord="m7"', 'pro-safari'),
  'SafariStaffSettings': ('Staff settings in Safari', 'overlay="staffSettings" page="staff" root="7" chord="7" staff-fingers="true"', 'pro-safari'),
  'SafariKeyboard': ('Keyboard settings in Safari', 'overlay="keyboard"', 'pro-safari'),
  'SafariTools': ('Tools in Safari', 'overlay="tools" metro-on="true"', 'pro-safari'),
  'SafariMetronomeOpen': ('Metronome settings in Safari, both on', 'overlay="metroSettings" ramp-on="true" gap-on="true"', 'pro-safari'),
  'SafariTuner': ('The Tuner in Safari', 'overlay="tuner"', 'pro-safari'),
  'SafariMetronome': ('Metronome settings in Safari', 'overlay="metroSettings"', 'pro-safari'),
  'SmallMain': ('The smaller iPhone', 'root="9" chord="m7"', 'small'),
  'SmallSafari': ('The smaller iPhone in Safari', 'root="9" chord="m7"', 'small-safari'),
}
for name, (title, attrs, kind) in BROWSER.items():
    wrap(name, title, attrs, kind)
side('Landscape', 'On its side', 'root="2" chord="m7"')
mac('Laptop', 'MacBook Air in Safari', 'root="3" flats="true" chord="m7"')
mac('LaptopStaff', 'The staff on the MacBook Air', 'page="staff" root="7" chord="13" staff-fingers="true"')
mac('LaptopTools', 'Tools on the MacBook Air', 'overlay="tools" metro-on="true"')
mac('LaptopNight', 'MacBook Air by night', 'theme="night" root="1" flats="true" chord="maj7"')
print(sorted(os.listdir(out)))
