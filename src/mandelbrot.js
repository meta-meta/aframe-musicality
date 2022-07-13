import CircularSlider from '@fseehawer/react-circular-slider';
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';
import KeyboardArrowLeftOutlinedIcon from '@material-ui/icons/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@material-ui/icons/KeyboardArrowRightOutlined';
import KeyboardArrowUpOutlinedIcon from '@material-ui/icons/KeyboardArrowUpOutlined';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import React, {useEffect, useState} from 'react';
import TuneIcon from '@material-ui/icons/Tune';
import ViewComfyOutlinedIcon from '@material-ui/icons/ViewComfyOutlined';
import ViewModuleOutlinedIcon from '@material-ui/icons/ViewModuleOutlined';
import ZoomInOutlinedIcon from '@material-ui/icons/ZoomInOutlined';
import ZoomOutOutlinedIcon from '@material-ui/icons/ZoomOutOutlined';
import _ from 'lodash';
import useMidiClock from "./useMidiClock";
import useP5 from './useP5';
import { HSVtoHex } from './color';
import { initialState, sketch } from "./mandelbrotP5";
import { makeStyles } from '@material-ui/core/styles';
import {Button, ButtonGroup, Drawer} from '@material-ui/core';

const useStyles = makeStyles({
  paper: {
    background: "rgba(0,0,0,0.7)",
    paddingBottom: 65,
  }
});

const getHandleAction = (sketchInstance) => (action) => () => {
  if (action === 'toggleAudio') {
    sketchInstance.toggleAudio();
    return;
  }

  sketchInstance.setState(prevState => {
    const {
      hilbertN,
      isControlPanelOpen,
      isRegenNeeded,
      panX,
      panY,
      zoom,
    } = prevState;
    const panDelta = 0.1 / zoom;

    const nextState = {
      moveLeft: {panX: panX + panDelta},
      moveRight: {panX: panX - panDelta},
      moveUp: {panY: panY + panDelta},
      moveDown: {panY: panY - panDelta},
      resDec: {hilbertN: Math.pow(2, Math.log2(hilbertN) - 1)},
      resInc: {hilbertN: Math.min(256, Math.pow(2, Math.log2(hilbertN) + 1))},
      toggleControlPanel: {isControlPanelOpen: !isControlPanelOpen, isRegenNeeded},
      zoomIn: {zoom: zoom * (10 / 9)},
      zoomOut: {zoom: zoom * (9 / 10)},
    }[action];

    return {
      ...prevState,
      isRegenNeeded: !_.isEmpty(nextState),
      ...nextState,
    };
  })
};

const handleKeyDown = (handleAction) => (evt) => {
  // console.log(evt);
  const {code, shiftKey, key} = evt;

  if (code === 'Space') {
    handleAction(shiftKey ? 'toggleControlPanel' : 'toggleAudio')();
    return;
  }

  const getAction = {
    'ArrowDown': () => shiftKey ? 'zoomOut' : 'moveDown',
    'ArrowLeft': () => shiftKey ? 'resDec' : 'moveLeft',
    'ArrowRight': () => shiftKey ? 'resInc' : 'moveRight',
    'ArrowUp': () => shiftKey ? 'zoomIn' : 'moveUp',
  }[key];

  if (getAction) handleAction(getAction())();
};

const Mandelbrot = () => {
  const {
    ref,
    sketchInstance,
    sketchState,
    setSketchState,
  } = useP5(sketch, initialState);

  window.sketchInstance = sketchInstance;

  const handleAction = getHandleAction(sketchInstance);

  useEffect(() => {
    document.title = 'Mandelbrot Muse';
    if (sketchInstance) {
      const handler = handleKeyDown(handleAction);
      window.addEventListener('keydown', handler)
      return () => { // cleanup
        window.removeEventListener('keydown', handler);
      };
    }
  }, [sketchInstance]);

  const {midiClockInDevice} = useMidiClock(() => {
    if (sketchInstance) {
      sketchInstance.incrementTick(true);
    }
  });

  return (<>
    <div
      ref={ref}
      style={{
        alignSelf: 'start',
        background: 'radial-gradient(circle, rgba(74,153,117,1) 0%, rgba(188,148,233,0.6943726953672094) 100%)',
        height: '50vw',
        width: '100vw',
      }}
    />

    <div style={{
      bottom: 10,
      right: 10,
      padding: 0,
      position: 'absolute',
      textAlign: 'center',
      zIndex: 1000000,
    }}>
      {!sketchState.isControlPanelOpen && (
        <Button onClick={handleAction('toggleControlPanel')}>
          show
          <TuneIcon/>
          controls
        </Button>
      )}

      <Drawer
        anchor="bottom"
        classes={useStyles()}
        color="transparent"
        open={sketchState.isControlPanelOpen}
        onClose={handleAction('toggleControlPanel')}
        variant="persistent"

        // onMouseEnter={ev => { ev.currentTarget.style.opacity = 1 }}
        // onMouseLeave={ev => { ev.currentTarget.style.opacity = 0.5 }}
      >
        <ButtonGroup fullWidth size="large">
          <Button onClick={handleAction('toggleAudio')}>
            {!sketchState.isPlaying ? <PlayCircleOutlineIcon /> : <PauseCircleOutlineIcon />}
          </Button>

          <Button onClick={handleAction('toggleControlPanel')}>
            hide controls
          </Button>
        </ButtonGroup>

        <ButtonGroup fullWidth size="large">

          <Button onClick={handleAction('resDec')}>
            <ViewModuleOutlinedIcon/>
          </Button>

          <Button onClick={handleAction('moveUp')}>
            <KeyboardArrowUpOutlinedIcon/>
          </Button>

          <Button onClick={handleAction('resInc')}>
            <ViewComfyOutlinedIcon/>
          </Button>

          <Button onClick={handleAction('zoomIn')}>
            <ZoomInOutlinedIcon/>
          </Button>

        </ButtonGroup>

        <ButtonGroup fullWidth size="large">

          <Button onClick={handleAction('moveLeft')}>
            <KeyboardArrowLeftOutlinedIcon/>
          </Button>

          <Button onClick={handleAction('moveDown')}>
            <KeyboardArrowDownOutlinedIcon/>
          </Button>

          <Button onClick={handleAction('moveRight')}>
            <KeyboardArrowRightOutlinedIcon/>
          </Button>

          <Button onClick={handleAction('zoomOut')}>
            <ZoomOutOutlinedIcon/>
          </Button>

        </ButtonGroup>

        <br/>

        <FreqSlider
          initialVal={60}
          isRegenRequired
          label="Fundamental frequency (Hz)"
          stateKey={"fundamentalFreq"}
          sketchState={sketchState}
          setSketchState={setSketchState}
        />


        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
        }}>

          <FreqSlider
            initialVal={16}
            isInt
            isRegenRequired
            label="Number of partials"
            max={1024}
            min={1}
            precision={1}
            setSketchState={setSketchState}
            size={120}
            sketchState={sketchState}
            stateKey={"partialsCountMax"}
          />

          <FreqSlider
            initialVal={4096}
            isInt
            isRegenRequired
            label="Mandelbrot iterations"
            max={8192}
            min={64}
            setSketchState={setSketchState}
            size={120}
            sketchState={sketchState}
            stateKey={"maxIters"}
          />

          {midiClockInDevice ? (
            <FreqSlider // TODO: integers
              min={1}
              max={1024}
              initialVal={24}
              label="MIDI clocks per tick"
              size={120}
              stateKey={"midiClocksPerTick"}
              sketchState={sketchState}
              setSketchState={setSketchState}
            />
          ) : (
            <FreqSlider
              initialVal={100}
              label="Tick duration (ms)"
              size={120}
              stateKey={"tickDuration"}
              sketchState={sketchState}
              setSketchState={setSketchState}
            />
          )}

          <FreqSlider
            initialVal={50}
            label="Excite duration (ms)"
            size={120}
            stateKey={"exciteDuration"}
            sketchState={sketchState}
            setSketchState={setSketchState}
          />
          <FreqSlider
            initialVal={1000}
            label="Decay duration (ms)"
            size={120}
            stateKey={"decayDuration"}
            sketchState={sketchState}
            setSketchState={setSketchState}
          />

          <FreqSlider
            initialVal={0.05}
            label="Excite energy"
            precision={4}
            size={120}
            stateKey={"exciteEnergy"}
            sketchState={sketchState}
            setSketchState={setSketchState}
          />
        </div>

        <ButtonGroup fullWidth size="large">
          <Button onClick={handleAction('toggleAudio')}>
            {!sketchState.isPlaying ? <PlayCircleOutlineIcon /> : <PauseCircleOutlineIcon />}
          </Button>

          <Button onClick={handleAction('toggleControlPanel')}>
            hide controls
          </Button>
        </ButtonGroup>
      </Drawer>


    </div>
   </>);
};

const Slider = ({ sketchState, setSketchState, stateKey, ...props }) => (
    <div>
      {stateKey}: {sketchState[stateKey]}
      <br />
      <input
        type="range"
        style={{width: 400}}
        value={sketchState[stateKey]}
        onChange={ev => {
          const value = Number(ev.target.value);
          setSketchState(state => ({
            ...state,
            [stateKey]: value
          }))
        }}
        {...props}
      />
    </div>
  );


const FreqSlider = ({
  initialVal = 1,
  isInt = false,
  isRegenRequired = false,
  label = '',
  max = Number.MAX_VALUE,
  min = Number.MIN_VALUE,
  precision = 6,
  setSketchState,
  size = 240,
  sketchState,
  stateKey,
}) => {
  const degPerExp = 2048;
  const errMargin = degPerExp / 3;

  const constrainVal = val => {
    const v = Math.min(Math.max(val, min), max);
    return isInt ? Math.round(v) : v;
  }

  const valToState = val => {
    const freq = constrainVal(val);
    const logFreq = Math.log2(freq);
    const exp = Math.floor(logFreq);

    return {
      deg: Math.floor(degPerExp * (logFreq - exp)),
      exp,
      numberInputVal: freq,
    };
  }

  const [state, setState] = useState(() => valToState(initialVal));

  useEffect(() => {  // hack because react-circle-slider invokes the onChange callback when its knob position changes even via props
    _.defer(() => setState(valToState(initialVal)));
  }, []);

  const handleChange = v => {
    const {deg, exp} = state;
    const didCrossUp = v >= 0 && v < errMargin && deg > degPerExp - errMargin;
    const didCrossDn = deg >= 0 && deg < errMargin && v > degPerExp - errMargin;
    const nextExp = didCrossUp
      ? exp + 1
      : didCrossDn
        ? exp - 1
        : exp;

    const freq = constrainVal(Math.pow(2, nextExp + v / degPerExp));
    const nextState = {
      deg: v,
      exp: nextExp,
      numberInputVal: freq
    };
    setState(nextState);
    setSketchState(state => ({
      ...state,
      [stateKey]: freq,
    }));
  }

  return (
    <div style={{
      flex: `0 ${size + 40}px`,
      height: size + 40,
      marginBottom: 40,
    }}>
      <div style={{
        height: '3em',
      }}>
      {label || `${stateKey}: ${sketchState[stateKey]}`}
      </div>

      <div
        style={{
          paddingTop: 10,
          position: 'relative',
        }}
        onPointerUp={() => {
          sketchState.isRegenNeeded = isRegenRequired // TODO: isFreqChanged instead of full regen
        }}
      >
        <CircularSlider
          dataIndex={state.deg}
          min={0}
          max={degPerExp - 1}
          knobColor="#AAA"
          knobSize={60}
          label="Fundamental Frequency"
          renderLabelValue={
            <input
              type="number"
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: `${size / 100}em`,
                left: '50%',
                marginLeft: '-40%',
                marginTop: '-0.5em',
                position: 'absolute',
                textAlign: 'center',
                top: '50%',
                width: '80%',
                zIndex: 3,
              }}
              value={isInt ? state.numberInputVal : state.numberInputVal.toPrecision(precision)}
              onChange={ev => {
                setState({
                  ...state,
                  numberInputVal: Number(ev.target.value),
                });
              }}
              onKeyDown={({ key }) => {
                if (key === 'Enter') {
                  const nextState = valToState(state.numberInputVal);
                  setState(nextState);
                  _.defer(() => { // hack because react-circle-slider invokes the onChange callback when its knob position changes even via props
                    setState(nextState);

                    setSketchState(state => ({
                      ...state,
                      [stateKey]: nextState.numberInputVal,
                      isRegenNeeded: isRegenRequired,
                    }));
                  })

                }
              }}
            />
          }
          onChange={handleChange}
          progressColorFrom={HSVtoHex(state.exp / 15, 1, 1)}
          progressColorTo={HSVtoHex((state.exp + 1) / 15, 1, 1)}
          progressLineCap="flat"
          trackColor="#666"
          height={size}
          width={size}
        />

      </div>
    </div>
  );
}


export default Mandelbrot;
