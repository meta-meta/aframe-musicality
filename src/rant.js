import _ from 'lodash';
import PC from './pc';
import React from 'react';

const Rant = () => (
  <div style={{height: '100%', overflowY: 'auto', padding: '20% 10%'}}>
    <h1>What is this nonsense all about?</h1>

    <p>
      When I learned how to play an instrument, we started with "Hot Cross Buns", "Mary Had a Little Lamb", etc.
      We started with the first 3 notes in the key of "C". Eventually, we'd build up to the other 4 notes. Then a new
      key was introduced. This one has a "Bb" -- the key of "F". At some point we'd be introduced to an "accidental".
    </p>

    <p>
      This left a lasting impression that the notes C, D, E, F, G, A, and B were the main notes. And these other things
      were in another class. They were harder -- harder to think about, harder to play, harder to keep track of, harder
      to say. C, D, E, F, G, A, and B are all single syllables. The other 5 notes were thought of as modifications of
      these main notes. "B flat", "C sharp", "D flat", yada yada. Wait are there 5 or are there 10?
    </p>

    <p>
      "B sharp" is one of the first little musical jokes you get to say when you're in the know, until you learn that
      when you really get in deep, actually "B sharp" <i>is</i> a real note. There's even a "B double sharp"! How many
      notes <i>are</i> there!? Answer: infinite, as there are infinite numbers between 0 and 1, there are infinite
      pitches. Another answer, and this is the one we'll focus on in this website, is 12. There are 12 pitch-classes in
      the musical system that westerners refer to as "music theory" and more formally 12-tone equal temperament. All the
      fancy names like "B flat" and "F sharp" are just various spellings of the 12 pitch-classes in 12-TET.
    </p>

    <p>
      This is all kind of interesting for a while and makes a young musician wonder about how deep this labyrinth gets.
      But it's all a smoke screen. And it gets even worse when you start to learn about intervals. Honestly, what's the
      use of a "diminished second" if not to sound pedantic and "technically correct"?
    </p>

    <p>
      While I'll concede that it sort of makes sense when you're talking about notes <i>written on a staff</i>,
      I'll maintain that it's a bullshit system to think in and it's needlessly convoluted, scares off all but the
      masochistic academics and overachievers. It adds a layer of cognitive as well as verbal overhead to otherwise
      simple concepts, and all so that we can pretend that music all fits into this diatonic model, with a few outliers
      that we call "accidentals". It makes the white keys approachable and the black keys scary and hard to name. "Is
      it a C# or a Db"? Why do we care, when we really just want to think about the one pitch we're trying to finger?
    </p>

    <p>
      If we're going to commit to this arguably artificial model of 12 notes, which is but one of a panoply of more
      naturally harmonious tunings, if we're going to compromise with this 12-TET model so that we end up with 12
      equally spaced notes around the octave, let's go all in and treat it with the simple terms it asks for. Let's
      treat these 12 notes equally instead of imagining this additional layer of complexity on top of them.
    </p>

    <br/>
    <hr/>

    <h2>Please consider:</h2>
    <pre>{_.range(12).map(pc => <PC key={pc} n={pc}/>)}</pre>
    <p> That's "oh" "one" "two" "three" "four" "five" "six" "sev" "eight" "nine" "ten" "el".</p>



  </div>
);

export default Rant;
