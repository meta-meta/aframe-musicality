import _ from 'lodash';



export const initialState = {

};


// https://editor.p5js.org/jayadiandri/sketches/LSNfUToa-
// Real-time Monstercat visualizer using IIR filter banks


const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
window.addEventListener('click', () => {
  if (audioCtx.state === 'suspended')
    audioCtx.resume();
});

const bands = [];
const filterBank = [];
const filterBank2 = [];
const filterBank3 = [];
const filterBank4 = [];
const filterBank5 = [];
const analysers = [];

var n = 48 * 2;

analyser.fftSize = 64; // [32, 64, 128, 256, 512, 1024, 2048]

const dataArrays = new Float32Array(analyser.fftSize);

const dataArray = new Uint8Array(analyser.frequencyBinCount);




var freq = 0;

var root24 = 2 ** ( 1 / n );

var c0 = 22.5 * root24 ** -n;

console.log('c0', c0)

let i = 0;

while ((freq = c0 * root24 ** i) <= 20000) {
  if (freq >= 20 && i % 4 === 0) bands.push(freq);
  console.log(`f${i}: ${freq}`)
  i++;
}



for ( i = 0; i < bands.length; i++ ) {
  const gamma = 1 / 0.00437;
  const q = bands[i] / (bands[i] + gamma) * 6;

  filterBank.push(audioCtx.createBiquadFilter());
  filterBank[i].frequency.value = bands[i];
  filterBank[i].type = 'bandpass';
  filterBank[i].Q.value = q;


  filterBank2.push(audioCtx.createBiquadFilter());
  filterBank2[i].frequency.value = bands[i];
  filterBank2[i].type = 'bandpass';
  filterBank2[i].Q.value = q;


  filterBank3.push(audioCtx.createBiquadFilter());
  filterBank3[i].frequency.value = bands[i];
  filterBank3[i].type = 'bandpass';
  filterBank3[i].Q.value = q;


  filterBank4.push(audioCtx.createBiquadFilter());
  filterBank4[i].frequency.value = bands[i];
  filterBank4[i].type = 'bandpass';
  filterBank4[i].Q.value = q;


  filterBank5.push(audioCtx.createBiquadFilter());
  filterBank5[i].frequency.value = bands[i];
  filterBank5[i].type = 'bandpass';
  filterBank5[i].Q.value = 0;


  analysers.push(audioCtx.createAnalyser());
  analysers[i].fftSize = analyser.fftSize;
  analysers[i].smoothingTimeConstant = 0;
}

const normalize = (val, min, max) => (val - min) / ( max - min );



let isReady = false;


/*https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia*/

navigator.mediaDevices.getUserMedia({
  audio: {
    noiseCancellation: false,
    echoCancellation: false,
    autoGainControl: false
  },
  video: false
})
  .then((stream) => {
    const audioSource = audioCtx.createMediaStreamSource(stream);
    audioSource.connect(analyser);

    bands.forEach((f, i) => {
      audioSource.connect(filterBank[i]);
      filterBank[i].connect(filterBank2[i]);
      filterBank2[i].connect(filterBank3[i]);
      filterBank3[i].connect(filterBank4[i]);
      filterBank4[i].connect(filterBank5[i]);
      filterBank5[i].connect(analysers[i]);
    });

    // ready
    isReady = true;

  })
  .catch(function (err) {
    console.error(err);
  });





export const sketch = (p5) => {
  p5.state = initialState;

  let font;
  p5.preload = () => {
    font = p5.loadFont('JetBrainsMono-Regular.ttf');
  }

  const TWO_PI = Math.PI * 2;

  let h, w;



  p5.setup = () => {
    p5.createCanvas(p5._width, p5._height);
    p5.blendMode(p5.ADD);
    p5.colorMode(p5.HSB);
    p5.textFont(font);


    p5.background(0, 0, 0);





  }

  p5.keyTyped = () => {
    console.log(p5.key)
    if (p5.key === 'Enter') {
    } else {
    }

    return false;
  }


  // const drawWave = ({ freq, phase = 0, hue }) => {
  //   const dt = TWO_PI / rayCount;
  //   p5.push();
  //   p5.translate(w/2, h/2);
  //   for(let t = 0; t < TWO_PI - dt; t += dt) {
  //     p5.stroke(
  //       hue,
  //       255,
  //       freq && (50 + 50 * Math.sin(t * freq)),
  //       100,
  //     );
  //
  //     r = w + h;
  //     x1 = r * Math.sin(t + phase);
  //     y1 = r * Math.cos(t + phase);
  //
  //     p5.line(0, 0, x1, y1);
  //   }
  //   p5.pop();
  // };


  // const isDarkMode = false;
  const isDarkMode = true;

  const starSpawn  = () => ({
    x: Math.random() - .5,
    y: Math.random() - .5,
    brightness: Math.random(),
  });

  const stars = analysers.map(starSpawn);


  p5.draw = () => {
    // p5.clear();

    p5.blendMode(p5.MULTIPLY);
    p5.background(255, 30, isDarkMode ? 50 : 80, .1);
    p5.noStroke()

    if (!isReady) return;

    analyser.getByteFrequencyData(dataArray);


    // eslint-disable-next-line no-lone-blocks
    {
      p5.push();
      p5.translate(p5.width / 2, p5.height / 2);

      p5.scale(100)
      p5.blendMode(isDarkMode ? p5.ADD : p5.MULTIPLY);


      const hueOffset =  720 + Math.cos(.003 * p5.millis() * Math.PI) * 250;

      analysers.forEach((analyzer, i) => {
        analyzer.getFloatTimeDomainData(dataArrays);
        let barHeight = 0;
        for (let j = 0; j < analysers[i].fftSize; j++) barHeight += Math.abs(dataArrays[j]);
        barHeight = barHeight / analysers[i].fftSize;
        barHeight = normalize(barHeight, 0, 0.01);


        const star = stars[i];

        p5.fill(hueOffset % 360, 40, star.brightness * 90, .6)
        p5.circle(star.x * 30, star.y * 30, .03 * star.brightness + barHeight * .02);
        star.x *= .99;
        star.y *= .99;
        if (Math.abs(star.x) < .1 && Math.abs(star.y) < .01){
          stars[i] = starSpawn();
        }



        const f = bands[i];
        const angle = 360 * (Math.log2(f)) + 180;
        const octave = angle / 360

        // eslint-disable-next-line no-lone-blocks
        {
          p5.push();
          p5.rotate(angle * Math.PI / 180);

          const h = 1;
          // var bot = h * (angle / 360) - 400;
          // var w = 40 - angle / 360;

          p5.translate(0, h * (octave - 5));
          p5.fill((hueOffset + angle) % 360, 100, isDarkMode ? 100 : 50, Math.log2(barHeight) * .05)
          p5.circle(0, 0, h * (octave ** 2) * barHeight /*Math.pow(barHeight, 2) **/ * .005);



          p5.pop();
        }

      });


      // p5.blendMode(p5.BLEND);
      // p5.fill(255);
      // p5.stroke(0);
      // p5.strokeWeight(4);
      // p5.textAlign(p5.CENTER, p5.CENTER);
      // p5.textSize(h/15)
      // p5.text(n2 ? `${d}:${n}:${n2}` : `${n}:${d}`, w/2, h/2)


    }


    p5.pop();
  }





  /**
   * This needs to be called by a user event handler.
   * @param isPlaying
   */
  p5.toggleAudio = () => {
    p5.setState(prevState => {
      const { isPlaying } = prevState;
      if (!isPlaying && audioCtx.state !== 'running') {
        audioCtx.resume();
      }

      if (isPlaying && audioCtx.state === 'running') {
        audioCtx.suspend();
      }

      return { ...prevState, isPlaying: !prevState.isPlaying };
    });

  }
}
