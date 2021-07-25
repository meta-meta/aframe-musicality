# 2021-07-24_17.28.50


## Why a DSL? 
[Domain-specific language](https://en.wikipedia.org/wiki/Domain-specific_language)

I need a way to specify _just enough_ about a musical idea, talking explicitly at a chosen level of abstraction. Symbols help to disambiguate just what it is we're talking about, and music terminology is full of ambiguity.

Often, when we talk about the structures and relationships in a piece of music it is in the territory of analysis, after the thing exists. A composition is typically thought to be an end product like sheet music. Embedded in it are artifacts of a composer's intent but they are inferred rather than explicit. The notes are set in stone in a sense, thus the name _engraving_.

There's notation like the staff, tablature, chord charts, etc. These are instructions for a trained player to execute and reproduce the piece with minimal understanding.

In order to interact with a composition, introduce variations, transpose, etc. there must be some understanding of the structure surrounding the notes. This is something that takes a very high level of musical literacy. I think there is an invisible structure that emerges in the mind of a very experienced jazz musician when consuming a chart. Less experienced musicians have no model of the mechanics of a piece. It takes patience and focus to map out the underlying relationships.

When composing, it takes a tremendous amount of focus to work in this invisible realm of rules and relationships while maintaining a tenuous grasp on the idea being developed. In my experience, it seems I have a choice of either ride the wave of inspiration in real-time with a recording device, staying close to home with very simple movements, or compose something with more intent and complexity that ends up contrived and uninspired. It's a rare occurance to find myself in a state of flow, bridging those two worlds.

I think there is room for improvement in modeling the invisible structure underlying musical composition.

In the world of software, we have programming languages that encode instructions and intent at various levels of abstraction. Each type of language has a different feel that is catered to a given environment. Think of a musician as the computer. 

Assembly language is akin to staff notation. It's low-level, rigid instructions for the computer to execute. GOTO = D.S. 

Higher-level languages are more flexible. They allow a programmer to specify rules that govern _how to generate_ instructions in varying contexts. A program in a higher-level language is a composition of relationships and transformations. Instructions are _derived_ from data and context.

As a programmer, manipulating symbols up high in the world of abstract rules and relationships, in idea-space, the explicit intent and theory can exist at surface level. New ideas and theories can be explored rapidly as if they are tangible objects. There is more flexibility to rearrange and recompose ideas. A pop song can be expressed and understood in a very condensed form, in terms of transformations on some starting note (key). When I want to play it, I simply compile it down to whatever notation best suits the activity/instrument.

When I want to analyze a piece of music, as a programmer I want to _refactor_ it into some construct of basic building blocks to construct a theory of the piece. Once distilled, the model can be parameterized and new pieces reminiscent of the original can be constructed. It's a fun exercise to explore what makes a song great. Sort of like the Goldilocks principle, it makes one think of all the other possible songs a hit _could have been_. Is the "hitness" contained in that specific arrangement of the model, or is the exposed model itself a hit-generator?

Likewise, when composing, the idea might be bound up in a gesture which can be encoded as a function that can be applied to small building blocks like pitches, pitch-classes, etc to rapidly generate phrases to try out. That gestural idea stays exposed in the code, whereas it may have been lost in the details of notation.

## Clojure

Clojure is a very high-level language that excels at manipulating data. It offers a rich set of built-in data literals which express a lot of subtle meaning in very few characters. This DSL is meant to work within Clojure to also bring that level of concise expression to musical building blocks. A Clojure program is composed while it's running so the instructions for a musician or a sequencer can be compiled on-the-fly. This DSL also serves to organize and drive my personal understanding of music. It's a way to decide on what game I'm playing when I'm doing music. What are the building blocks and in which ways can they legally come together into a composition?

## Some constraints

### valid forms that the Clojure reader can parse

[the reader](https://clojure.org/reference/reader)

* `Symbols` can be user-defined. They may be a good match for things that there are few of, small closed sets of things.

> Symbols begin with a non-numeric character and can contain alphanumeric characters and *, +, !, -, _, ', ?, <, > and = (other characters may be allowed eventually).

* `Keywords` are more open-ended than symbols. They can't be imbued with inherent meaning in the same way, but they can be arbitrarily constructed such that meaning can be parsed from them. Thus, they are a better fit for open sets of things.

### legibility, spacing within a monospaced font

* ease of writing

* when objects can be represented such that they take up a predictable amount of space, rhythm and density of content can be portrayed without any special markup or engraving

* command line terminal as a conversational notation generator 

### avoid too many ways of specifying the same thing

### compact, quick and easy to type

## The Data Literals

### low-level instructions - suitable for command-line or plaintext notation

* 12ET pitch - corresponds to the MIDI note number. Can be left-padded with `0`s for equal spacing. (this may be too ambiguous as integers can be interpreted in a variety of ways)

`0` `00` `07` `60` `67` `127` ...

* 12ET chord - serves as a chord shorthand that exposes its intervallic content and reolves the issue of naming exotic chords at the expense of indeterminate voicing and making common chords a little more computery looking. `12ET pitch root` `+` `pitch-class intervals`. 

`:0+47` `:Ɛ+37` `:5+47૪` ...
`:0+47` = `Cmaj`
`:5+46Ɛ` = `Fmaj7♭5`

* JI pitch-class (not sure if it's useful to distinguish from interval)
`2/1` `5/4` `1/8` ... (clojure has ratio literals, unfortunately clojurescript does not so this may be a no-go)
`:2|1` `:5|4` `:1|8` ... (a possible compromise for legibility)

* binary rhythm - beat or rest
`1` `0`

### slightly abstract

* 12ET pitch-class - ideally, 12 single-character symbols. Clojure symbols cannot start with a digit unfortunately so keywords are used as a compromise. Characters from [Dominique Waller](http://musicnotation.org/wp-content/uploads/2013/03/Waller_single_digit_symbols.pdf)

`:0` `:1` `:2` `:3` `:4` `:5` `:6` `:7` `:8` `:9` `:૪` `:Ɛ`

Pronounced `oh` `one` `two` `three` `four` `five` `six` `sev` `eight` `nine` `ten` `el` [Michael L. Friedmann](https://yalebooks.yale.edu/book/9780300045376/ear-training-twentieth-century-music) (though Friedmann prefers `lev` to `el`

* 12ET interval - the count and direction of semitones to move from a given 12ET pitch or 12ET pitch-class

`:+1` `:-5` `:+7` `:+24` ...

* JI interval - a whole number ratio used to calculate the frequency of a pitch relative to some fundamental

`:2:1` `:5:4` `:1:8` ...

### collections

* 12ET pitch set - a set of specific pitches, suitable for representing specific chord voicings

`#{60}` `#{80 82}`  `#{60 64 67}` ...

* 12ET pitch-class set - a set of pitch classes with indeterminate voicing, much like `C maj7`

`#{0 4 7}` `#{0 4 7 ૪}` ...

* 12ET pitch vector - one possible transposition of the pitch content of a melody

`[60 72 71 67 69 71 72]` ...

* 12ET pitch-class vector - one possible transposition of the pitch content of a melody with no specific voicing. Useful as a short-hand cue for chromatic melodies on a monophonic instrument like sax or flute.

`[0 0 Ɛ 7 9 Ɛ 0]`

* 12ET interval vector - no specific transposition of the pitch content of a melody. This seems to be getting to the essence of a melody. It exposes the movement from one note to the next.

`[:+0 :+12 :-4 :+2 :+2 :+2 :+1]`
