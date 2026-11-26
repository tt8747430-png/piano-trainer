<?xml version="1.0" encoding="UTF-8"?>
<!--
  The choir's house style: every made score and each of its parts loads it (scripts/choir, house.py), and it can be
  loaded in MuseScore Studio by hand (Format, Style, Load style). A song's match.txt may change only what its sheet
  needs (spatium, lyrics-size, bar-numbers, footer, hide-empty-staves). From engraving practice:
  - staff 6 mm high (a 1.5 mm space), Gould's rastral 5, between her sizes for songs and for choral music (Elaine
    Gould, Behind Bars, p. 483, as tabled by Donemus: rastral 4 = 6.5 mm songs, 6 = 5.5 mm choral);
  - words in Arial, the sans the choir's sheets use, at 11 pt: the choir's own sheets and published choral octavos
    print 10-11 pt, above Gould's floor of an x-height one staff space (8.2 pt here), for a choir reading at arm's
    length; not scaled with the staff, so a song set smaller keeps readable words;
  - A4 with 15 mm margins on every side, the least engravers give a printed page, one-sided;
  - title 20 pt, composer and lyricist 10 pt, all in Arial;
  - a bar number at the start of each line;
  - the two staves of a system 5 spaces apart, systems at least 6, spread evenly down a full page;
  - a part's words a whole space apart, their hyphens always drawn (many of the choir's files space them tightly);
  - one rest where both voices of a staff rest together, as the choir's sheets print it;
  - no hyphen before a word's syllable that starts a line (the hyphen ends the line before it), as printed;
  - a part's name printed once, at its top left, not again before its staff.
  Sizes are in inches, as MuseScore keeps them: 210 mm = 8.2677, 297 mm = 11.6929, 180 mm = 7.0866, 15 mm = 0.5906.
-->
<museScore version="4.70">
  <Style>
    <spatium>1.5</spatium>
    <pageWidth>8.2677</pageWidth>
    <pageHeight>11.6929</pageHeight>
    <pagePrintableWidth>7.0866</pagePrintableWidth>
    <pageEvenLeftMargin>0.5906</pageEvenLeftMargin>
    <pageEvenTopMargin>0.5906</pageEvenTopMargin>
    <pageEvenBottomMargin>0.5906</pageEvenBottomMargin>
    <pageOddLeftMargin>0.5906</pageOddLeftMargin>
    <pageOddTopMargin>0.5906</pageOddTopMargin>
    <pageOddBottomMargin>0.5906</pageOddBottomMargin>
    <pageTwosided>0</pageTwosided>
    <lyricsOddFontFace>Arial</lyricsOddFontFace>
    <lyricsOddFontSize>11</lyricsOddFontSize>
    <lyricsOddFontSpatiumDependent>0</lyricsOddFontSpatiumDependent>
    <lyricsEvenFontFace>Arial</lyricsEvenFontFace>
    <lyricsEvenFontSize>11</lyricsEvenFontSize>
    <lyricsEvenFontSpatiumDependent>0</lyricsEvenFontSpatiumDependent>
    <lyricsMinDistance>1</lyricsMinDistance>
    <lyricsDashForce>1</lyricsDashForce>
    <lyricsDashMinLength>0.4</lyricsDashMinLength>
    <lyricsShowDashIfSyllableOnFirstNote>0</lyricsShowDashIfSyllableOnFirstNote>
    <lyricsMinTopDistance>1</lyricsMinTopDistance>
    <lyricsMinBottomDistance>1.5</lyricsMinBottomDistance>
    <lyricsLineHeight>1</lyricsLineHeight>
    <titleFontFace>Arial</titleFontFace>
    <titleFontSize>20</titleFontSize>
    <titleFontSpatiumDependent>0</titleFontSpatiumDependent>
    <subTitleFontFace>Arial</subTitleFontFace>
    <subTitleFontSpatiumDependent>0</subTitleFontSpatiumDependent>
    <composerFontFace>Arial</composerFontFace>
    <composerFontSize>10</composerFontSize>
    <composerFontSpatiumDependent>0</composerFontSpatiumDependent>
    <lyricistFontFace>Arial</lyricistFontFace>
    <lyricistFontSize>10</lyricistFontSize>
    <lyricistFontSpatiumDependent>0</lyricistFontSpatiumDependent>
    <showMeasureNumber>1</showMeasureNumber>
    <measureNumberSystem>1</measureNumberSystem>
    <measureNumberInterval>1000</measureNumberInterval>
    <staffDistance>5</staffDistance>
    <akkoladeDistance>5</akkoladeDistance>
    <minSystemDistance>6</minSystemDistance>
    <maxSystemDistance>12</maxSystemDistance>
    <enableVerticalSpread>1</enableVerticalSpread>
    <minSystemSpread>6</minSystemSpread>
    <maxSystemSpread>24</maxSystemSpread>
    <minStaffSpread>5</minStaffSpread>
    <maxStaffSpread>8</maxStaffSpread>
    <spreadSystem>2.5</spreadSystem>
    <staffUpperBorder>5</staffUpperBorder>
    <staffLowerBorder>5</staffLowerBorder>
    <showFooter>0</showFooter>
    <mergeMatchingRests>1</mergeMatchingRests>
    <hideInstrumentNameIfOneInstrument>1</hideInstrumentNameIfOneInstrument>
  </Style>
</museScore>
