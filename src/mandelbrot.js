import _ from 'lodash';
import P5 from 'p5';

import KeyboardArrowUpOutlinedIcon from '@material-ui/icons/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';
import KeyboardArrowLeftOutlinedIcon from '@material-ui/icons/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@material-ui/icons/KeyboardArrowRightOutlined';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import ViewComfyOutlinedIcon from '@material-ui/icons/ViewComfyOutlined';
import ViewModuleOutlinedIcon from '@material-ui/icons/ViewModuleOutlined';
import ZoomInOutlinedIcon from '@material-ui/icons/ZoomInOutlined';
import ZoomOutOutlinedIcon from '@material-ui/icons/ZoomOutOutlined';


import React, {useCallback, useEffect, useState} from 'react';
import TuneIcon from '@material-ui/icons/Tune';
import { initialState, sketch } from "./mandelbrotP5";
import { makeStyles } from '@material-ui/core/styles';
import {Button, ButtonGroup, Drawer} from '@material-ui/core';

const useStyles = makeStyles({
  paper: {
    background: "rgba(0,0,0,0.7)",
    paddingBottom: 65,
  }
});

const useP5 = (sketch) => {
  const [sketchState, setSketchState] = useState(initialState);
  const [sketchInstance, setSketchInstance] = useState(null);
  const [resizeObserver, setResizeObserver] = useState(null);

  if (sketchInstance) {
    sketchInstance.setState = setSketchState;
    sketchInstance.state = sketchState;
  }

  const ref = useCallback((el) => {
    if (el) {
      const instance = new P5(sketch, el);
      setSketchInstance(instance);

      instance._height = el.clientHeight;
      instance._width = el.clientWidth;

      const resize = (width, height) => {
        instance.resizeCanvas(width, height);
        setSketchState((prevState) => ({...prevState, isRegenNeeded: true}))
      }

      const resizeObserver = new ResizeObserver(([{contentRect: {height, width}}]) => {
        resize(width, height);
      });

      setResizeObserver(resizeObserver);
      resizeObserver.observe(el);
    } else {
      if (resizeObserver) resizeObserver.disconnect();
    }
  }, []);

  return {
    sketchInstance,
    sketchState,
    setSketchState,
    ref,
  };
}

const getHandleAction = (sketchInstance) => (action) => () => {
  if (action === 'toggleAudio') {
    sketchInstance.toggleAudio();
    return;
  }

  sketchInstance.setState(prevState => {
    const {hilbertN, isControlPanelOpen, panX, panY, zoom} = prevState;
    const panDelta = 0.1 / zoom;

    const nextState = {
      moveLeft: {panX: panX + panDelta},
      moveRight: {panX: panX - panDelta},
      moveUp: {panY: panY + panDelta},
      moveDown: {panY: panY - panDelta},
      resDec: {hilbertN: Math.pow(2, Math.log2(hilbertN) - 1)},
      resInc: {hilbertN: Math.min(256, Math.pow(2, Math.log2(hilbertN) + 1))},
      toggleControlPanel: {isControlPanelOpen: !isControlPanelOpen},
      zoomIn: {zoom: zoom * (10 / 9)},
      zoomOut: {zoom: zoom * (9 / 10)},
    }[action];

    return {
      ...prevState,
      ...nextState,
      isRegenNeeded: !_.isEmpty(nextState),
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
  } = useP5(sketch);

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
      bottom: 0,
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
          <Button onClick={handleAction('moveUp')}>
            <KeyboardArrowUpOutlinedIcon/>
          </Button>

          <Button onClick={handleAction('moveLeft')}>
            <KeyboardArrowLeftOutlinedIcon/>
          </Button>

          <Button onClick={handleAction('moveRight')}>
            <KeyboardArrowRightOutlinedIcon/>
          </Button>

          <Button onClick={handleAction('zoomIn')}>
            <ZoomInOutlinedIcon/>
          </Button>

        </ButtonGroup>

        <ButtonGroup fullWidth size="large">
          <Button onClick={handleAction('moveDown')}>
            <KeyboardArrowDownOutlinedIcon/>
          </Button>

          <Button onClick={handleAction('resDec')}>
            <ViewModuleOutlinedIcon/>
          </Button>

          <Button onClick={handleAction('resInc')}>
            <ViewComfyOutlinedIcon/>
          </Button>

          <Button onClick={handleAction('zoomOut')}>
            <ZoomOutOutlinedIcon/>
          </Button>

        </ButtonGroup>

        <Slider
          min={16}
          max={1000}
          stateKey={"tickDuration"}
          sketchState={sketchState}
          setSketchState={setSketchState}
        />
        <Slider
          min={1}
          max={4000}
          stateKey={"exciteDuration"}
          sketchState={sketchState}
          setSketchState={setSketchState}
        />
        <Slider
          min={10}
          max={8000}
          stateKey={"decayDuration"}
          sketchState={sketchState}
          setSketchState={setSketchState}
        />

        <Slider
          min={0.01}
          max={1}
          step={0.01}
          stateKey={"exciteEnergy"}
          sketchState={sketchState}
          setSketchState={setSketchState}
        />
        <Slider
          min={0.1}
          max={500}
          onPointerUp={() => {
            console.log('onPointerUp');
            sketchState.isRegenNeeded = true // TODO: isFreqChanged instead of full regen
          }}
          step={0.1}
          stateKey={"fundamentalFreq"}
          sketchState={sketchState}
          setSketchState={setSketchState}
        />
        <Slider
          min={1}
          max={1000}
          stateKey={"partialsCountMax"}
          sketchState={sketchState}
          setSketchState={setSketchState}
          // onInput={() => {
          //   console.log('onInput');
          //   sketchState.isRegenNeeded = true
          // // console.log('sketchState.isRegenNeeded:', sketchState.isRegenNeeded)
          // }}
          onPointerUp={() => {
            console.log('onPointerUp');
            sketchState.isRegenNeeded = true
            // console.log('sketchState.isRegenNeeded:', sketchState.isRegenNeeded)
          }}
        />
        <Slider
          min={64}
          max={8000}
          stateKey={"maxIters"}
          sketchState={sketchState}
          setSketchState={setSketchState}
          onPointerUp={() => {
            console.log('onPointerUp');
            sketchState.isRegenNeeded = true
          }}
        />
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

export default Mandelbrot;
