class Component extends DCLogic {
  /*MUSIC*/
  rampTempo(st, bar) {
    const from = st.rampFrom ?? 80;
    const to = st.rampTo ?? 120;
    const rise = (st.rampStep ?? 5) * Math.floor(bar / (st.rampEvery ?? 4));
    return from <= to ? Math.min(to, from + rise) : Math.max(to, from - rise);
  }
  runMetronome(bpm, beats) {
    clearInterval(this.metroTimer);
    this.metroTimer = setInterval(() => {
      const st = this.state ?? {};
      const next = ((st.beat ?? -1) + 1) % beats;
      const bar = (st.bar ?? 0) + (next === 0 && st.beat !== -1 ? 1 : 0);
      this.setState({ beat: next, bar });
      const ramped = st.rampOn ? this.rampTempo(st, bar) : bpm;
      if (next === 0 && ramped !== bpm) this.runMetronome(ramped, beats);
    }, 60000 / bpm);
  }
  componentWillUnmount() {
    this.stopTimers();
  }
  stopTimers() {
    clearTimeout(this.timer);
    clearInterval(this.ticker);
    clearInterval(this.metroTimer);
    clearInterval(this.tunerTimer);
  }
  renderVals() {
    const { FAMILIES, LETTERS, NATURAL, SHARP_NAMES, FLAT_NAMES, SIGN, spell, buildChord } = this.music();
    const STAGE_W = /*STAGE_W*/;
    const STAGE_H = /*STAGE_H*/;
    const REACH = /*REACH*/;
    const s = this.state || {};
    const p = this.props;
    const yes = (value) => value === true || value === 'true';
    const night = (p.theme ?? 'day') === 'night';
    const accent = p.accent ?? (night ? '#D4B176' : '#EDC684');
    const c = night
      ? { toolFill: '#2F3B2C', toolInk: '#A9CDA0', page: '#191512', sheet: '#24201C', ink: '#EDE9E1', soft: '#BBB3A8', fill: '#2E2924', line: '#453E38', glass: 'rgba(55,50,45,.8)', white: '#D4D0CB', black: '#171310', band: '#453E38', link: '#89B7DE', onAccent: '#191512', felt: '#5A2422', scrim: 'rgba(0,0,0,.5)', on: '#8FC090', hand: '#CDB39B', handLine: 'rgba(25,21,18,.35)', shadow: '0 1px 3px rgba(10,7,5,.45), 0 6px 14px -4px rgba(10,7,5,.5), 0 14px 28px -8px rgba(10,7,5,.5)' }
      : { toolFill: '#DCE9D6', toolInk: '#3F6B45', page: '#F7F3EE', sheet: '#FEFDFB', ink: '#332921', soft: '#685E56', fill: '#EEE9E2', line: '#DAD1C8', glass: 'rgba(254,253,251,.82)', white: '#FEFDFB', black: '#332C28', band: '#DAD1C8', link: '#356890', onAccent: '#332921', felt: '#7C302C', scrim: 'rgba(51,41,33,.28)', on: '#44684A', hand: '#E3CBB4', handLine: 'rgba(51,41,33,.28)', shadow: '0 1px 3px rgba(51,41,33,.12), 0 6px 14px -4px rgba(51,41,33,.14), 0 14px 28px -8px rgba(51,41,33,.14)' };
    const ROLE = { 1: '#E19E8C', 3: '#85B8DC', 5: '#9BC093', 7: '#E8C67D', 2: '#B8A8D8', 9: '#B8A8D8', 4: '#D3AC8A', 11: '#D3AC8A', 6: '#82C2C1', 13: '#82C2C1' };

    const rootPc = s.root ?? Number(p.root ?? 0);
    const flats = s.flats ?? yes(p.flats);
    const chordKey = s.chord ?? p.chord ?? 'maj';
    const familyAt = FAMILIES.findIndex(([, list]) => list.some((each) => each[0] === chordKey));
    const type = FAMILIES[familyAt][1].find((each) => each[0] === chordKey);
    const names = flats ? FLAT_NAMES : SHARP_NAMES;
    const rootName = spell(...names[rootPc]);
    const baseFormula = type[2];
    const degreesOf = baseFormula.split(' ');
    const minorish = degreesOf.includes('b3');
    const dominant = degreesOf.includes('b7') && degreesOf.includes('3');
    const tensionList = dominant ? ['b9', '9', '#9', '#11', '13'] : minorish ? ['9', '11', '13'] : ['9', '#11', '13'];
    const added = (s.added ?? []).filter((each) => tensionList.includes(each) && !degreesOf.includes(each));
    const formula = [baseFormula, ...added].join(' ');
    const count = formula.split(' ').length;
    const pretty = (token) => token.replace(/b/g, '♭').replace(/#/g, '♯');
    const ordered = buildChord(rootPc, flats, formula, 0);
    const addedText = added.length ? `(add ${added.map(pretty).join(', ')})` : '';
    const symbol = rootName + type[1];

    const hasThird = degreesOf.some((d) => d.endsWith('3') && d.length <= 2);
    const hasSeventh = degreesOf.some((d) => d.endsWith('7') || d === '6');
    const FOUR = `Made from a close chord of four notes. This one has ${count}.`;
    const NO3 = 'Needs the chord’s 3rd, and this chord has none.';
    const NO7 = 'Needs a 7th, and this chord has none.';
    const VOICINGS = [
      ['close', 'Close', 'Every note packed as close together as it goes.', ''],
      ['drop2', 'Drop 2', 'The second note from the top moves down an octave.', count === 4 ? '' : FOUR],
      ['drop3', 'Drop 3', 'The third note from the top moves down an octave.', count === 4 ? '' : FOUR],
      ['shell', 'Shell', 'Only the root, 3rd and 7th: the notes that say what the chord is.', !hasThird ? NO3 : !hasSeventh ? NO7 : ''],
      ['rootlessA', 'Rootless A', 'The 3rd, 5th, 7th and 9th, leaving the root to the bass.', !hasThird ? NO3 : !hasSeventh ? NO7 : ''],
      ['rootlessB', 'Rootless B', 'The 7th, 9th, 3rd and 5th: type A from the other end.', !hasThird ? NO3 : !hasSeventh ? NO7 : ''],
      ['locked', 'Locked hands', 'Four notes in the right hand, the top note doubled below.', count === 4 ? '' : FOUR],
    ];
    const voicingWanted = s.voicing ?? p.voicing ?? 'close';
    const voicingRow = VOICINGS.find((each) => each[0] === voicingWanted);
    const voicingAt = VOICINGS.indexOf(voicingRow);
    const voicing = voicingRow[3] ? 'close' : voicingWanted;

    // A chord of five notes or more is shared between the hands: the left takes the root and the
    // 7th (or 5th) an octave down, the right the rest, and its top note replaces the inversion.
    const splitOn = count >= 5 && voicing === 'close';
    const lhList = [ordered[0], ordered.find((t) => t.number === 7 || t.number === 6) ?? ordered.find((t) => t.number === 5)].filter(Boolean);
    const rhBase = ordered.filter((t) => !lhList.includes(t));
    const inversionCount = splitOn ? rhBase.length : Math.min(count, 4);
    const inversion = Math.min(s.inversion ?? Number(p.inversion ?? 0), inversionCount - 1);
    const rhTones = rhBase.map((t, i) => ({ ...t, pitch: t.pitch + (i < inversion ? 12 : 0) })).sort((a, b) => a.pitch - b.pitch);
    const lhTones = lhList.map((t) => ({ ...t, pitch: t.pitch - 12 }));
    const slash = splitOn ? rhTones[rhTones.length - 1].name : inversion === 0 ? symbol : `${symbol}/${ordered[inversion].name}`;

    const voiced = (list) => {
      const notes = list.map((tone) => ({ ...tone }));
      const pick = (test) => notes.filter((tone) => test(tone.number));
      if (voicing === 'drop2') notes[notes.length - 2].pitch -= 12;
      if (voicing === 'drop3') notes[notes.length - 3].pitch -= 12;
      if (voicing === 'shell') return pick((n) => n === 1 || n === 3 || n === 7 || n === 6).sort((a, b) => a.pitch - b.pitch);
      if (voicing === 'rootlessA' || voicing === 'rootlessB') {
        const ninth = buildChord(rootPc, flats, '9', 0)[0];
        const set = [...pick((n) => n === 3 || n === 5 || n === 7 || n === 6), ninth];
        if (voicing === 'rootlessB') set.forEach((tone) => { if (tone.number === 3 || tone.number === 5) tone.pitch += 12; });
        return set.sort((a, b) => a.pitch - b.pitch);
      }
      if (voicing === 'locked') {
        const top = notes[notes.length - 1];
        return [{ ...top, pitch: top.pitch - 12 }, ...notes].sort((a, b) => a.pitch - b.pitch);
      }
      return notes.sort((a, b) => a.pitch - b.pitch);
    };
    const tones = splitOn ? [...lhTones, ...rhTones].sort((a, b) => a.pitch - b.pitch) : voiced(buildChord(rootPc, flats, formula, inversion));

    const page = s.page ?? p.page ?? 'keys';
    const overlay = s.overlay ?? p.overlay ?? 'none';
    const view = p.view ?? 'rest';
    const mode = s.mode ?? view;
    const step = s.step ?? 1;
    const chordOn = mode === 'chord';
    const arpOn = mode === 'arpeggio';
    const hand = s.hand ?? 'right';
    const set = {
      keySize: s.keySize ?? p.keySize ?? 'fit',
      noteNames: s.noteNames ?? 'c',
      markNotes: s.markNotes ?? true,
      chordSymbol: s.chordSymbol ?? true,
      swipe: s.swipe ?? 'scroll',
      pedalSet: s.pedalSet ?? 'sustain',
      autoplay: s.autoplay ?? true,
      showHands: s.showHands ?? yes(p.showHands),
      playHands: s.playHands ?? 'both',
    };
    const change = (next) => {
      this.stopTimers();
      this.setState({ mode: 'rest', step: 0, ...next });
    };

    const lowest = tones[0].pitch;
    const highest = tones[tones.length - 1].pitch;
    const allKeys = set.keySize === 'all';
    const large = set.keySize === 'large';
    let startPitch = allKeys ? 21 : Math.min(lowest, 60 + rootPc) - 1;
    while (!NATURAL.includes(startPitch % 12)) startPitch -= 1;
    const range = highest - startPitch;
    const keyCount = allKeys ? 52 : large ? 8 : range <= 15 ? 10 : range <= 19 ? 12 : 15;
    const whitePitches = [];
    for (let at = startPitch; whitePitches.length < keyCount; at += 1) {
      if (NATURAL.includes(at % 12)) whitePitches.push(at);
    }
    const fingersShown = page === 'fingers';
    const handsShown = set.showHands && !fingersShown && !splitOn;
    const numbersShown = fingersShown || (splitOn && set.showHands);
    const keysTop = 0;
    const keysH = STAGE_H - keysTop - (large ? 22 : 0);
    const keyW = STAGE_W / keyCount;
    const blackW = keyW * 0.58;
    const byPitch = new Map(tones.map((tone, at) => [tone.pitch, { tone, at }]));
    const look = (hit) => {
      if (!hit) return null;
      const lit = !arpOn || hit.at <= step;
      const role = ROLE[hit.tone.number] ?? ROLE[7];
      return {
        bg: lit ? role : `${role}59`,
        label: numbersShown ? hit.finger ?? '' : handsShown || allKeys || !set.markNotes ? '' : hit.tone.name,
        top: chordOn || (arpOn && hit.at <= step) ? 2 : 0,
      };
    };
    const letterOf = (pitch) => LETTERS[NATURAL.indexOf(pitch % 12)];
    const plainName = (pitch) => {
      if (allKeys || set.noteNames === 'none') return '';
      if (set.noteNames === 'all') return letterOf(pitch);
      return pitch % 12 === 0 ? `C${Math.floor(pitch / 12) - 1}` : '';
    };
    const centres = new Map();
    const whites = whitePitches.map((pitch, i) => {
      const hit = look(byPitch.get(pitch));
      centres.set(pitch, i * keyW + keyW / 2);
      return {
        name: `${letterOf(pitch)}${Math.floor(pitch / 12) - 1}`,
        left: i * keyW,
        w: keyW,
        top: hit ? hit.top : 0,
        bg: hit ? hit.bg : c.white,
        ink: hit ? '#332921' : '#685E56',
        weight: hit ? 600 : 500,
        size: hit ? 15 : 11,
        label: hit ? hit.label : plainName(pitch),
      };
    });
    const blacks = [];
    whitePitches.forEach((pitch, i) => {
      const next = pitch + 1;
      if (i < keyCount - 1 && !NATURAL.includes(next % 12)) {
        const hit = look(byPitch.get(next));
        centres.set(next, (i + 1) * keyW);
        blacks.push({
          name: `Black key ${i + 1}`,
          left: (i + 1) * keyW - blackW / 2,
          w: blackW,
          bg: hit ? hit.bg : c.black,
          label: hit ? hit.label : '',
        });
      }
    });

    const SPLIT_KEYS = 12;
    const splitW = STAGE_W / SPLIT_KEYS;
    const rowH = Math.floor((STAGE_H - 2 * 22 - 8) );
    const splitH = Math.floor(rowH / 2);
    const rowKeys = (list, fingers) => {
      const hits = new Map(list.map((tone, i) => [tone.pitch, {
        tone,
        finger: String(fingers[i] ?? ''),
        at: Math.max(tones.findIndex((each) => each.pitch === tone.pitch || each.pitch === tone.pitch + 12), 0),
      }]));
      const own = (pitch) => hits.get(pitch);
      let start = list[0].pitch - 1;
      while (!NATURAL.includes(start % 12)) start -= 1;
      const pitches = [];
      for (let at = start; pitches.length < SPLIT_KEYS; at += 1) if (NATURAL.includes(at % 12)) pitches.push(at);
      const rowWhites = pitches.map((pitch, i) => {
        const hit = look(own(pitch));
        return { name: `${letterOf(pitch)}${Math.floor(pitch / 12) - 1}`, left: i * splitW, w: splitW, top: hit ? hit.top : 0, bg: hit ? hit.bg : c.white, label: hit ? hit.label : '' };
      });
      const rowBlacks = [];
      pitches.forEach((pitch, i) => {
        const next = pitch + 1;
        if (i < SPLIT_KEYS - 1 && !NATURAL.includes(next % 12)) {
          const hit = look(own(next));
          rowBlacks.push({ name: `Black key ${i + 1}`, left: (i + 1) * splitW - splitW * 0.29, w: splitW * 0.58, bg: hit ? hit.bg : c.black, label: hit ? hit.label : '' });
        }
      });
      return [rowWhites, rowBlacks];
    };
    // Fingering always shows both hands, as the left and right play it. A chord one hand can hold
    // is played by each hand an octave apart; a bigger one is shared between them.
    const twoRows = splitOn || fingersShown;
    const handSets = { 1: [1], 2: [1, 5], 3: [1, 3, 5], 4: [1, 2, 3, 5], 5: [1, 2, 3, 4, 5] };
    const rightList = splitOn ? rhTones : tones;
    const leftList = splitOn ? lhTones : tones.map((tone) => ({ ...tone, pitch: tone.pitch - 12 }));
    const rightFingers = handSets[Math.min(rightList.length, 5)];
    const leftFingers = splitOn ? [5, 1] : handSets[Math.min(leftList.length, 5)].slice().reverse();
    const [rhWhites, rhBlacks] = rowKeys(rightList, rightFingers);
    const [lhWhites, lhBlacks] = rowKeys(leftList, leftFingers);

    const played = tones.slice(-5);
    const fingerSets = { 1: [1], 2: [1, 5], 3: [1, 3, 5], 4: [1, 2, 3, 5], 5: [1, 2, 3, 4, 5] };
    const fingerNumbers = fingerSets[played.length].slice();
    const orderInHand = hand === 'right' ? fingerNumbers : fingerNumbers.slice().reverse();
    const slotX = {};
    played.forEach((tone, i) => { slotX[orderInHand[i]] = centres.get(tone.pitch) ?? 0; });
    const known = Object.keys(slotX).map(Number).sort((a, b) => a - b);
    const fingerX = (n) => {
      if (slotX[n] !== undefined) return slotX[n];
      const below = known.filter((k) => k < n).pop();
      const above = known.find((k) => k > n);
      if (below === undefined) return slotX[above] + (above - n) * (hand === 'right' ? -keyW : keyW);
      if (above === undefined) return slotX[below] + (n - below) * (hand === 'right' ? keyW : -keyW);
      return slotX[below] + ((slotX[above] - slotX[below]) * (n - below)) / (above - below);
    };
    const handFingers = [1, 2, 3, 4, 5].map((n) => {
      const down = slotX[n] !== undefined;
      const x = fingerX(n);
      const thumb = n === 1;
      return {
        left: x - 9,
        top: keysH * (down ? (thumb ? 0.62 : 0.5) : thumb ? 0.76 : 0.68),
        height: keysH,
        badge: down,
        badgeLeft: x - 11,
        badgeTop: keysH * (thumb ? 0.62 : 0.5) + 2,
        number: String(n),
      };
    });
    const xs = handFingers.map((f) => f.left);
    const palmLeft = Math.min(...xs) - 8;
    const palmW = Math.max(...xs) + 26 - palmLeft;

    const WIDE = STAGE_H >= 400;
    const U = (splitOn ? 6 : 8) * (WIDE ? 1.9 : 1);
    const LABEL_SIZE = WIDE ? 18 : 12;
    const STAFF_BOTTOM = splitOn ? STAGE_H * 0.47 : STAGE_H * 0.68;
    const BASS_BOTTOM = STAGE_H * 0.95;
    const leftPitches = splitOn ? lhTones.map((tone) => tone.pitch) : [];
    const noteX = STAGE_W / 2 + 10;
    const staffLines = [0, 1, 2, 3, 4].map((i) => ({ y: STAFF_BOTTOM - i * U * 2 }));
    const staffNotes = [];
    const staffSigns = [];
    const staffLabels = [];
    const show = {
      chord: s.showChord ?? false,
      position: s.showPosition ?? false,
      fingers: s.showFingers ?? yes(p.staffFingers),
      notes: s.showNotes ?? true,
    };
    const fingerOf = new Map([...rightList.map((tone, i) => [tone.pitch, rightFingers[i]]), ...(splitOn ? leftList.map((tone, i) => [tone.pitch, leftFingers[i]]) : [])]);
    const labelRows = [];
    const ledgerSteps = new Set();
    let lastStep = null;
    let shifted = false;
    tones.forEach((tone, i) => {
      const octave = Math.floor((tone.pitch - tone.sign) / 12) - 1;
      const inBass = leftPitches.includes(tone.pitch);
      const stepUp = tone.letter + octave * 7 - (2 + 4 * 7) + (inBass ? 12 : 0);
      const bottom = inBass ? BASS_BOTTOM : STAFF_BOTTOM;
      shifted = lastStep !== null && stepUp - lastStep === 1 && !shifted;
      lastStep = stepUp;
      const x = noteX + (shifted ? U * 2.75 : 0);
      const y = bottom - stepUp * U;
      staffNotes.push({ x, y: y - U * 0.95 });
      labelRows.push({ y: y - LABEL_SIZE / 2, inBass, name: tone.name, finger: String(fingerOf.get(tone.pitch) ?? '') });
      if (tone.sign !== 0) staffSigns.push({ x: noteX - 22 - (i % 2) * 18, y: y - 15, sign: SIGN[tone.sign] });
      if (stepUp <= -2) for (let at = -2; at >= stepUp; at -= 2) ledgerSteps.add(`${bottom - at * U}:${x}`);
      if (stepUp >= 10) for (let at = 10; at <= stepUp; at += 2) ledgerSteps.add(`${bottom - at * U}:${x}`);
    });
    const LABEL_GAP = LABEL_SIZE + 3;
    const labelX = noteX + Math.max(54, U * 6.5);
    [false, true].forEach((bass) => {
      const rows = labelRows.filter((row) => row.inBass === bass).sort((a, b) => a.y - b.y);
      const spread = rows.reduce((placed, row) => [...placed, Math.max(row.y, (placed.at(-1) ?? -Infinity) + LABEL_GAP)], []);
      const lift = rows.length ? (spread.at(-1) - rows.at(-1).y) / 2 : 0;
      rows.forEach((row, i) => {
        const y = spread[i] - lift;
        if (show.notes) staffLabels.push({ x: labelX, y, text: row.name, weight: 600, ink: c.ink });
        if (show.fingers) staffLabels.push({ x: labelX + (show.notes ? LABEL_SIZE * 2 : 0), y, text: row.finger, weight: 500, ink: c.soft });
      });
    });
    const ledgers = [...ledgerSteps].map((key) => {
      const [y, x] = key.split(':').map(Number);
      return { x: x - U, y };
    });

    const INTERVALS = {
      1: 'Root', 2: 'Major second', '♭3': 'Minor third', 3: 'Major third', 4: 'Perfect fourth', '♭5': 'Diminished fifth',
      5: 'Perfect fifth', '♯5': 'Augmented fifth', 6: 'Major sixth', '♭♭7': 'Diminished seventh', '♭7': 'Minor seventh',
      7: 'Major seventh', '♭9': 'Minor ninth', 9: 'Major ninth', '♯9': 'Augmented ninth', 11: 'Perfect eleventh',
      '♯11': 'Augmented eleventh', 13: 'Major thirteenth',
    };
    const toneAt = Math.min(s.toneAt ?? 0, ordered.length - 1);
    const toneChips = ordered.map((tone, i) => ({
      text: tone.name,
      degree: tone.degree,
      bg: ROLE[tone.number] ?? ROLE[7],
      ring: i === toneAt ? `0 0 0 2px ${c.ink}` : 'none',
      pick: () => this.setState({ toneAt: i }),
    }));
    const toneCaption = `${ordered[toneAt].name}: ${INTERVALS[ordered[toneAt].degree] ?? ordered[toneAt].degree}`;
    const tensions = tensionList.filter((each) => !degreesOf.includes(each)).map((token) => {
      const on = added.includes(token);
      return {
        text: pretty(token),
        note: buildChord(rootPc, flats, `1 ${token}`, 0).find((tone) => tone.number !== 1).name,
        bg: on ? ROLE[Number(token.replace(/[b#]/g, ''))] : c.fill,
        ink: on ? '#332921' : c.ink,
        pick: () => change({ added: on ? added.filter((each) => each !== token) : [...added, token] }),
      };
    });
    const avoidToken = minorish ? 'b13' : dominant ? '' : '11';
    const avoid = avoidToken && !degreesOf.includes(avoidToken) ? [{
      text: pretty(avoidToken),
      note: buildChord(rootPc, flats, `1 ${avoidToken}`, 0).find((tone) => tone.number !== 1).name,
    }] : [];

    const tabs = [['keys', 'Keys'], ['staff', 'Staff'], ['fingers', 'Fingering'], ['built', 'Notes']].map(([id, name]) => ({
      name,
      chosen: id === page,
      ink: id === page ? c.ink : c.soft,
      weight: id === page ? 600 : 400,
      pick: () => this.setState({ page: id }),
    }));
    const wheel = (items, at) => items.map((item, i) => {
      const distance = Math.abs(i - at);
      return {
        ...item,
        y: (REACH + i - at) * 44,
        show: distance <= REACH,
        opacity: distance === 0 ? 1 : Math.max(0.72 - (distance - 1) * 0.22, 0.28),
        weight: distance === 0 ? 600 : 400,
        size: distance === 0 ? 19 : 17,
      };
    }).filter((item) => item.show);
    const rootWheel = wheel(names.map(([letter, sign], pc) => ({ text: spell(letter, sign), pick: () => change({ root: pc }) })), rootPc);
    const familyWheel = wheel(FAMILIES.map(([name, list]) => ({ text: name, pick: () => change({ chord: list[0][0], added: [] }) })), familyAt);
    const typeList = FAMILIES[familyAt][1];
    const typeWheel = wheel(typeList.map(([key, suffix]) => ({ text: rootName + suffix, pick: () => change({ chord: key, added: [] }) })), typeList.findIndex((each) => each[0] === chordKey));
    const voicingWheel = wheel(VOICINGS.map(([id, name, , bar]) => ({ text: name, dim: bar ? 'line-through' : 'none', pick: () => change({ voicing: id }) })), voicingAt);

    const cycle = (key, list) => () => {
      const now = set[key];
      this.setState({ [key]: list[(list.indexOf(now) + 1) % list.length] });
    };
    const KEY_SIZE = { fit: 'Fit to music', large: 'Large', all: 'All keys' };
    const NOTE_NAMES = { c: 'On every C', all: 'On every key', none: 'Hidden' };
    const SWIPE = { scroll: 'Scroll', glissando: 'Glissando' };
    const PEDALS = { sustain: 'Sustain only', all: 'All three' };
    const PLAY_HANDS = { both: 'Both', right: 'Right' };
    const toggle = (key) => () => this.setState({ [key]: !set[key] });
    const nextOf = (list, now) => list[(list.indexOf(now) + 1) % list.length];
    const METERS = ['2/4','3/4','4/4','5/4','6/4','2/2','3/8','5/8','6/8','7/8','9/8','12/8'];
    const tempo = s.tempo ?? 92;
    const meter = s.meter ?? '4/4';
    const beatCount = parseInt(meter, 10);
    const metroOn = s.metronome ?? yes(p.metroOn);
    const rampOn = s.rampOn ?? yes(p.rampOn);
    const gapOn = s.gapOn ?? yes(p.gapOn);
    const barNow = s.bar ?? 0;
    const gapPlay = s.gapPlay ?? 2;
    const gapMute = s.gapMute ?? 2;
    const gapSilent = gapOn && metroOn && barNow % (gapPlay + gapMute) >= gapPlay;
    const barsText = (count) => `${count} ${count === 1 ? 'bar' : 'bars'}`;
    const tempoNow = rampOn && metroOn ? this.rampTempo({ ...s, rampOn }, barNow) : tempo;
    const a4 = s.a4 ?? 440;
    const cents = s.cents ?? 6;
    const inTune = Math.abs(cents) <= 5;
    const beatNow = s.beat ?? (metroOn ? 1 : -1);
    const levels = s.levels ?? {};
    const LEVEL_NAMES = ['Accent', 'Beat', 'Silent'];
    const beatSquares = Array.from({ length: beatCount }, (_, i) => {
      const level = levels[i] ?? (i === 0 ? 0 : 1);
      return {
        name: `Beat ${i + 1}: ${LEVEL_NAMES[level]}`,
        fillH: [26, 15, 0][level],
        bg: gapSilent ? c.line : beatNow === i && level < 2 ? accent : c.soft,
        pick: () => this.setState({ levels: { ...levels, [i]: (level + 1) % 3 } }),
      };
    });
    const setTempo = (bpm) => {
      const next = Math.min(300, Math.max(30, bpm));
      this.setState({ tempo: next });
      if (metroOn && !rampOn) this.runMetronome(next, beatCount);
    };
    const nudge = (key, now, by, min, max) => () => this.setState({ [key]: Math.min(max, Math.max(min, now + by)) });
    const switchLook = (on) => ({ bg: on ? c.on : c.band, knob: on ? 20 : 2 });

    const go = (name) => () => {
      clearInterval(this.tunerTimer);
      this.setState({ overlay: name });
    };
    const pedal = s.pedal ?? {};
    const pedalRows = [['sustain', 'Sustain', 'Hold, or tap to latch'], ['sostenuto', 'Sostenuto', 'Sustains only the notes held'], ['soft', 'Soft', 'Softens the tone while held']].map(([id, name, detail]) => ({
      name,
      detail,
      ...switchLook(Boolean(pedal[id])),
      pick: () => this.setState({ pedal: { ...pedal, [id]: !pedal[id] } }),
    }));
    const latched = Boolean(pedal.sustain);

    const play = () => {
      this.stopTimers();
      if (mode === 'chord') {
        this.setState({ mode: 'rest', step: 0 });
        return;
      }
      this.setState({ mode: 'chord', step: 0 });
      this.timer = setTimeout(() => this.setState({ mode: 'rest', step: 0 }), 1800);
    };
    const arpeggio = () => {
      this.stopTimers();
      if (mode === 'arpeggio') {
        this.setState({ mode: 'rest', step: 0 });
        return;
      }
      let at = 0;
      this.setState({ mode: 'arpeggio', step: at });
      this.ticker = setInterval(() => {
        at += 1;
        if (at >= tones.length) {
          clearInterval(this.ticker);
          this.timer = setTimeout(() => this.setState({ mode: 'rest', step: 0 }), 900);
          return;
        }
        this.setState({ mode: 'arpeggio', step: at });
      }, 340);
    };
    const heldLine = yes(p.held) ? 'You’re holding this on your MIDI keyboard' : '';

    return {
      c,
      accent,
      symbol,
      nameLine: heldLine || (voicing === 'close' ? [type[3], addedText].filter(Boolean).join(' ') : `${type[3]}, ${voicingRow[1]}`),
      nameSize: /*NAME_SIZE*/,
      slash,
      staffLabels,
      chordOverStaff: show.chord,
      positionUnderStaff: show.position,
      chordLabelY: STAFF_BOTTOM - U * 8 - 30,
      positionLabelY: STAFF_BOTTOM + 12,
      chordShown: switchLook(show.chord),
      flipChordShown: () => this.setState({ showChord: !show.chord }),
      positionShown: switchLook(show.position),
      flipPositionShown: () => this.setState({ showPosition: !show.position }),
      fingersShown: switchLook(show.fingers),
      flipFingersShown: () => this.setState({ showFingers: !show.fingers }),
      notesShown: switchLook(show.notes),
      flipNotesShown: () => this.setState({ showNotes: !show.notes }),
      inversionLabel: splitOn ? 'Top note' : ['Root position', '1st inversion', '2nd inversion', '3rd inversion'][inversion],
      prevInversion: () => change({ inversion: (inversion + inversionCount - 1) % inversionCount }),
      nextInversion: () => change({ inversion: (inversion + 1) % inversionCount }),
      isKeys: page === 'keys' || page === 'fingers',
      splitOn,
      twoRows,
      singleKeys: !twoRows,
      splitH,
      splitBlackH: splitH * 0.6,
      rhWhites,
      rhBlacks,
      lhWhites,
      lhBlacks,
      bassLines: splitOn ? [0, 1, 2, 3, 4].map((i) => ({ y: BASS_BOTTOM - i * U * 2 })) : [],
      bassClefY: BASS_BOTTOM - U * 10.3,
      bassSize: U * 7.7,
      bassLine: U * 10.3,
      ledgerW: U * 4.75,
      labelSize: LABEL_SIZE,
      handsShown,
      isStaff: page === 'staff',
      isBuilt: page === 'built',
      showPedal: page === 'keys' || page === 'fingers',
      keysH,
      keysTop,
      whites,
      blacks,
      blackH: keysH * 0.6,
      handFingers,
      palmLeft,
      palmW,
      palmTop: keysH * 0.86,
      palmH: keysH * 0.3,
      showStrip: large,
      stripLeft: `${Math.max(((startPitch - 21) / 87) * 100, 0)}%`,
      staffLines,
      staffNotes,
      staffSigns,
      ledgers,
      clefY: STAFF_BOTTOM - U * 7.75,
      clefSize: U * 10.25,
      noteW: U * 2.75,
      noteH: U * 1.9,
      toneChips,
      toneCaption,
      tensions,
      hasTensions: tensions.length > 0,
      avoid,
      hasAvoid: avoid.length > 0,
      tabs,
      rootWheel,
      familyWheel,
      typeWheel,
      voicingWheel,
      voicingName: voicingRow[1],
      voicingAbout: voicingRow[3] || voicingRow[2],
      wheelH: (REACH * 2 + 1) * 44,
      bandTop: REACH * 44,
      noOverlay: overlay === 'none',
      isChange: overlay === 'change',
      isVoicing: overlay === 'voicing',
      isMore: overlay === 'more',
      isKeyboard: overlay === 'keyboard',
      isPractise: overlay === 'practise',
      isTools: overlay === 'tools',
      isPedals: overlay === 'pedals',
      isStaffSettings: overlay === 'staffSettings',
      scrimOn: ['more', 'keyboard', 'practise', 'tools', 'pedals', 'staffSettings', 'metroSettings', 'tuner'].includes(overlay),
      close: go('none'),
      toChange: go('change'),
      toVoicing: go('voicing'),
      toMore: go('more'),
      toKeyboard: go('keyboard'),
      toPractise: go('practise'),
      toTools: go('tools'),
      toPedals: go('pedals'),
      toStaffSettings: go('staffSettings'),
      pressPedal: set.pedalSet === 'all' ? go('pedals') : () => this.setState({ pedal: { ...pedal, sustain: !pedal.sustain } }),
      pedalBg: latched ? accent : c.fill,
      pedalInk: latched ? c.onAccent : c.ink,
      pedalRows,
      keySizeValue: KEY_SIZE[set.keySize],
      nextKeySize: cycle('keySize', ['fit', 'large', 'all']),
      noteNamesValue: NOTE_NAMES[set.noteNames],
      nextNoteNames: cycle('noteNames', ['c', 'all', 'none']),
      swipeValue: SWIPE[set.swipe],
      nextSwipe: cycle('swipe', ['scroll', 'glissando']),
      pedalSetValue: PEDALS[set.pedalSet],
      nextPedalSet: cycle('pedalSet', ['sustain', 'all']),
      playHandsValue: PLAY_HANDS[set.playHands],
      nextPlayHands: cycle('playHands', ['both', 'right']),
      markNotes: switchLook(set.markNotes),
      flipMarkNotes: toggle('markNotes'),
      chordSymbol: switchLook(set.chordSymbol),
      flipChordSymbol: toggle('chordSymbol'),
      autoplay: switchLook(set.autoplay),
      flipAutoplay: toggle('autoplay'),
      showHandsLook: switchLook(set.showHands),
      flipShowHands: toggle('showHands'),
      alsoWritten: ({ '': ['M', 'maj'], m: ['−', 'min'], maj7: ['M7', 'Δ7'], m7: ['−7', 'min7'], dim: ['°'], aug: ['+'], dim7: ['°7'], 'm7♭5': ['ø7'] }[type[1]] ?? []).map((each) => rootName + each).join(' · '),
      hasAlso: ['', 'm', 'maj7', 'm7', 'dim', 'aug', 'dim7', 'm7♭5'].includes(type[1]),
      spelling: flats ? 'Show sharps' : 'Show flats',
      flip: () => this.setState({ flats: !flats }),
      tempo: tempoNow,
      slideTempo: (event) => setTempo(Number(event.target.value)),
      tapTempo: () => {
        const now = Date.now();
        const taps = [...(this.taps ?? []).filter((at) => now - at < 2500), now].slice(-5);
        this.taps = taps;
        if (taps.length > 1) setTempo(Math.round(60000 / ((taps.at(-1) - taps[0]) / (taps.length - 1))));
      },
      metroOn,
      metroOff: !metroOn,
      metroDetail: gapSilent ? 'Keep counting' : rampOn && metroOn ? `Now ${tempoNow} BPM, bar ${barNow + 1}` : `${tempoNow} BPM · ${meter}`,
      metroLabel: metroOn ? 'Stop metronome' : 'Start metronome',
      flipMetro: () => {
        if (metroOn) {
          clearInterval(this.metroTimer);
          this.setState({ metronome: false, beat: -1 });
        } else {
          const start = rampOn ? this.rampTempo({ ...s, rampOn }, 0) : tempo;
          this.setState({ metronome: true, beat: 0, bar: 0, rampOn });
          this.runMetronome(start, beatCount);
        }
      },
      beatSquares,
      meter,
      nextMeter: () => {
        const next = nextOf(METERS, meter);
        this.setState({ meter: next, levels: {}, beat: metroOn ? 0 : -1 });
        if (metroOn) this.runMetronome(tempoNow, parseInt(next, 10));
      },
      clickSound: s.clickSound ?? 'Click',
      nextClickSound: () => this.setState({ clickSound: nextOf(['Click', 'Beep', 'Drum kit'], s.clickSound ?? 'Click') }),
      subdivision: s.subdivision ?? '1',
      nextSubdivision: () => this.setState({ subdivision: nextOf(['1', '2', '3 (triplets)', '4', 'Swing'], s.subdivision ?? '1') }),
      rampLook: switchLook(rampOn),
      flipRamp: () => this.setState({ rampOn: !rampOn }),
      rampStatus: rampOn && metroOn ? `Now ${tempoNow} BPM, bar ${barNow + 1}` : '',
      rampLive: rampOn && metroOn,
      rampOn,
      rampFrom: `${s.rampFrom ?? 80} BPM`,
      rampFromDown: nudge('rampFrom', s.rampFrom ?? 80, -1, 30, 300),
      rampFromUp: nudge('rampFrom', s.rampFrom ?? 80, 1, 30, 300),
      rampTo: `${s.rampTo ?? 120} BPM`,
      rampToDown: nudge('rampTo', s.rampTo ?? 120, -1, 30, 300),
      rampToUp: nudge('rampTo', s.rampTo ?? 120, 1, 30, 300),
      rampStep: `${s.rampStep ?? 5} BPM`,
      rampStepDown: nudge('rampStep', s.rampStep ?? 5, -1, 1, 20),
      rampStepUp: nudge('rampStep', s.rampStep ?? 5, 1, 1, 20),
      rampEvery: barsText(s.rampEvery ?? 4),
      rampEveryDown: nudge('rampEvery', s.rampEvery ?? 4, -1, 1, 16),
      rampEveryUp: nudge('rampEvery', s.rampEvery ?? 4, 1, 1, 16),
      gapLook: switchLook(gapOn),
      flipGap: () => this.setState({ gapOn: !gapOn }),
      gapOn,
      gapPlay: barsText(gapPlay),
      gapPlayDown: nudge('gapPlay', gapPlay, -1, 1, 8),
      gapPlayUp: nudge('gapPlay', gapPlay, 1, 1, 8),
      gapMute: barsText(gapMute),
      gapMuteDown: nudge('gapMute', gapMute, -1, 1, 8),
      gapMuteUp: nudge('gapMute', gapMute, 1, 1, 8),
      tunerReading: inTune ? 'In tune' : `${Math.abs(cents)} cents ${cents > 0 ? 'sharp' : 'flat'}`,
      tunerHz: `${(a4 * 2 ** (cents / 1200)).toFixed(1)} Hz`,
      needleLeft: 50 + cents,
      needleInk: inTune ? c.toolInk : c.ink,
      tunerWorks: !yes(p.tunerRefused),
      tunerRefused: yes(p.tunerRefused),
      a4Text: `${a4} Hz`,
      a4Down: nudge('a4', a4, -1, 415, 466),
      a4Up: nudge('a4', a4, 1, 415, 466),
      isTuner: overlay === 'tuner',
      toTuner: () => {
        this.setState({ overlay: 'tuner', cents: 6 });
        clearInterval(this.tunerTimer);
        this.tunerTimer = setInterval(() => {
          const now = this.state?.cents ?? 6;
          this.setState({ cents: Math.max(-30, Math.min(30, Math.round(now * 0.8 + Math.random() * 12 - 6))) });
        }, 400);
      },
      metroPlain: overlay === 'metroSettings' && !rampOn && !gapOn,
      metroRamp: overlay === 'metroSettings' && rampOn && !gapOn,
      metroGap: overlay === 'metroSettings' && !rampOn && gapOn,
      metroBoth: overlay === 'metroSettings' && rampOn && gapOn,
      isMetroSettings: overlay === 'metroSettings',
      toMetroSettings: go('metroSettings'),
      chordOn,
      chordOff: !chordOn,
      arpOn,
      arpBg: arpOn ? accent : c.fill,
      arpInk: arpOn ? c.onAccent : c.ink,
      arpLabel: arpOn ? 'Stop' : 'Arpeggio',
      play,
      arpeggio,
    };
  }
}
