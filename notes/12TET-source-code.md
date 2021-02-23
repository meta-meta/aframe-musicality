# 2021-02-09_21.45.51

## Finding the source code of 12TET
#musicality #sight-reading #improvisation

What is a melody? Is it the notes written on the staff? I don't think so. The notes on the staff are an _implementation_ of a melody. They offer instructions on how to play an instance of a melody. The melody is the thing that survives being transposed.

A melody is better specified as the sequence of movements from some starting pitch.

### pitch information


(PM)
```
melody as recipe for symmetry
notes on staff are symmetrical relationship
melodies are percieved as a collection of pitches that form a symmetry
```



The first two measures of Syrinx without rhythmic information
```
0 -1 +2 -3 -1 +2 -3 -1 -1 -3 +9 +2 -1 -1
```

When applied to a pitch, `Bb5` or `82`
```
82 81 83 80 79 81 78 77 76 73 82 84 83 82
```

If we only want to think about pitch-class (spelled according to sheet music)
```
Bb A B Ab G A Gb F E Db Bb C Cb Bb 
```

Or pitch-class in a less ambiguous mod12 notation
```
10 9 11 8 7 9 6 5 4 1 10 0 11 10
```

And finally, if we want pitch-class but with each represented by a single character
```
૪ 9 Ɛ 8 7 9 6 5 4 1 ૪ 0 Ɛ ૪
```

Thinking only about pitch-class disposes of octave information which may be crucial to a melody's identity. Of course there are a bunch of other things ignored here as well that may arguably be crucial to a melody. Ties, slurs, firmata, accents, dynamic... This is all important stuff, but maybe easier to remember or more open to interpretation depending on the role of the musician. Nashville notation is enough of a cue oftentimes.

I suppose my goals are around identifying certain levels of detail in specifying musical contexts. While I'll admit it's aesthetically appealing and richly communicative, I certainly don't want to _think_ in staff notation. The term "engraving" is informative here. It's too fixed in place. It obfuscates the structure used to generate it. If I want to transpose the melody, it will be full of accidentals. It is not immediately apparent which accidentals will arrise. There are too many layers to work back and forth. Transposition must either be done systematically on paper as a process or it happens in the abstract mental landscape _after_ interpreting the staff notation. I find myself wanting a more even written landscape on which I can imagine the notes all shifting by some degree.

When dealing with 12TET, the promise is fluid modulations and transposition but the staff does not expose the landcape on which 12TET is operating. The staff is a lens with its focus on some diatonic context. Anything that strays from the diatonic requires a modifier. An accidental.

Chromaticism is not an accident. It is an approach that musicians naturally take when they are handed an instrument that affords them 12 equally spaced pitch-classes. Chromaticism is walking around an even landscape. The landscape may have landmarks but they only have meaning in relation to _other landmarks_.

The staff establishes landmarks by way of key signature. This assumes that the piece is structured around a tonality. Accidentals mark where a piece has strayed from these landmarks. When a piece does not strongly suggest a tonality, the staff ends up with a lot of accidentals. Fledgeling musicians interpret these pieces as "difficult". In the case of Syrinx, the piece itself is not difficult to play. It is difficult to read. It is the privelege of the diatonic, especially the C, that gives the impression that a chromatic piece is more challenging. OK, that might not be true. Bobby McFerrin points out that humans naturally think pentatonically. Diatonic is probably easier to remember and tease apart than chromatic. But if a fledgeling musician is handed an instrument with 12 notes, the work of _distinguishing_ between notes is somewhat offloaded onto the instrument. Pentatonic is easier to hold in one's head. Diatonic, perhaps a bit harder but still _human_. Chromatic is considered more of a machine's territory.

It's less intrusive to overlay a mask of pentatonic or diatonic landmarks onto a chromatic landscape than to address the other 5 notes by way of _modifications to_ diatonic landmarks.


### rhythmic information

The rhythmic information in multiples of some `tatum`
```
3 1 1 3 1 1 2 2 2 2 3 1 1 8
```

These combined, may not be the easiest to sight-read, but I find them easier to explain than staff notation. Staff notation is a language; it is not the ideas being rendered by the language.

TODO: combine the two into some concise event syntax.



The rhythmic information as fraction of a whole, or `note-value`
```
3/16 1/16 1/16 3/16 1/16 1/16 1/8 1/8 1/8 1/8 3/16 1/16 1/16 1/2
```

Of course, there are all kinds of details captured in notation that are ignored here. Which details are enough to define a melody? We'll at the very least need to specify a `rest`.

There seems to be a class of musician that does not like numbers and also a class of musician that relates to numbers better than words. We can inform each other. There is not one _correct_ way of looking at and understanding music.

TODO: insert reddit thread of people rejecting "oh" "one" "two" "three"; insisting on "do" "re" "mi"

Whereas sheet music deals in divisions of some whole to define a rhythm, the above rhythm is notated in multiples of a musical planck length. A `tatum`, like a `note value`, is not fixed. It is a unitless measurement. Either must be combined with some unit like `BPM` to derive a duration in time.

An advantage of `note value` is the freedom to subdivide time infinitely.

An advantage of establishing a `tatum` is that a musician knows the temporal resolution going in. They can set their mental clock accordingly.

A point of confusion in the staff notation of rhythm is that the `whole` that's being divided is elusive. When the time signature is `4/4`, a quarter note gets 1 beat. A whole note = 4 beats which happens to be the length of a measure. In `3/4`, a whole note doesn't exist. Or at least it is not well defined.

TODO: define relationships/dependencies between `beat`, `crotchet`, `measure`, `time signature`, `note-value`, `whole note`
