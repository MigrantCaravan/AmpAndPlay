import React, { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import * as Tone from "tone";
import styled from "styled-components";
import "./App.css";
// import {
//   playC4,
//   playDb4,
//   playD4,
//   playEb4,
//   playE4,
//   playF4,
//   playGb4,
//   playG4,
//   playAb4,
//   playA4,
//   playBb4,
//   playB4,
//   playC5,
//   playNote,
// } from "./Tone.fn.js";

// window.addEventListener("keydown", playNote);

export default function Keyboard() {
  const pad = useRef(null);
  const [osc, setOsc] = useState(null);
  const [filterLow, setFilterLow] = useState(null);
  const [filterHigh, setFilterHigh] = useState(null);
  const [vol, setVol] = useState(null);
  const [disto, setDisto] = useState(null);
  const distButton = useRef(null);
  const [reverb, setReverb] = useState(null);
  const reverbButton = useRef(null);
  const [delay, setDelay] = useState(null);
  const delayButton = useRef(null);
  const [phaser, setPhaser] = useState(null);
  const phaserButton = useRef(null);
  //this is for handling the MIC
  //   const meter = new Tone.Meter();
  //   const mic = new Tone.UserMedia().connect(meter).toDestination();
  //   mic
  //     .open()
  //     .then(() => {
  //       // promise resolves when input is available
  //       console.log("mic open");
  //       // print the incoming mic levels in decibels
  //       //   setInterval(() =>
  //       //   console.log(meter.getValue())
  //       //   , 50000);
  //     })
  //     .catch((e) => {
  //       // promise is rejected when the user doesn't have or allow mic access
  //       console.log("mic not open");
  //     });

  //

  /// Handle Phaser

  function handlePhaser() {
    if (phaser === null) {
      setPhaser(
        new Tone.Phaser({
          frequency: 15,
          octaves: 5,
          baseFrequency: 1000,
        }).toDestination()
      );
      phaserButton.current.style.backgroundColor = "purple";
    } else {
      phaserButton.current.style.backgroundColor = "white";

      setPhaser(null);
    }
  }

  ///Handle Delay

  function handleDelay() {
    if (delay === null) {
      const _delay = new Tone.FeedbackDelay("8n", 0.5).toDestination();
      setDelay(_delay);
      delayButton.current.style.backgroundColor = "green";
    } else {
      delayButton.current.style.backgroundColor = "white";

      setDelay(null);
    }
  }

  /// handle Reverb
  function handleReverb() {
    if (reverb === null) {
      setReverb(new Tone.JCReverb(0.5).toDestination());
      reverbButton.current.style.backgroundColor = "blue";
    } else {
      reverbButton.current.style.backgroundColor = "white";
      setReverb(null);
    }
  }

  ///handle distortion

  function handleDistortion() {
    if (disto === null) {
      setDisto(new Tone.Distortion(0.9).toDestination());
      distButton.current.style.backgroundColor = "red";
    } else {
      distButton.current.style.backgroundColor = "white";
      setDisto(null);
    }
  }

  const handleTouchStart = (e) => {
    const clientY = e.touches[0].clientY;
    const clientX = e.touches[0].clientX;
    console.log(clientX);

    // pointer.current.style.visibility = "visible"
    // pointer.current.style.transform = `translate(${clientX - 205}px, ${clientY - 45}px)`

    // pad.current.style.boxShadow = "inset 0 0 30px #000000";

    osc.connect(filterLow);
    osc.connect(filterHigh);
    // osc.connect(vol);
    osc.start();
    osc.frequency.value = clientY;
    // filterLow.frequency.value = clientX + 300;
  };

  const handleTouchMove = (e) => {
    const clientY = e.touches[0].clientY;
    const clientX = e.touches[0].clientX;
    // console.log(clientX, clientY);
    // console.log(e.target.value);

    // pad.current.style.boxShadow = "inset 0 0 30px #000000"
    // pointer.current.style.transform = `translate(${clientX - 205}px, ${clientY - 45}px)`

    // filterLow.frequency.value = clientX + 300;
    osc.frequency.value = clientY;
  };

  function handleChange(e) {
    // console.log(e.target.value);
    const filter = e.target.value;
    filterLow.frequency.value = filter;
  }

  function handleHighpass(e) {
    // console.log(e.target.value);
    const filterH = e.target.value;
    filterHigh.frequency.value = filterH;
  }

  function handleVol(e) {
    const value = e.target.value;
    console.log(value);
    vol.volume.value = value;
  }

  const handleTouchEnd = () => {
    // pad.current.style.boxShadow = "inset 0 0 20px #000000";
    // pointer.current.style.visibility = "hidden"
    osc.stop();
  };
  ///// USEEFFECT
  useEffect(() => {
    setOsc(new Tone.Oscillator().toDestination());
    setFilterLow(new Tone.Filter(50, "lowpass").toDestination());
    setFilterHigh(new Tone.Filter(1500, "highpass").toDestination());
    setVol(new Tone.Volume(-12).toDestination());
  }, []);
  /// useEffect Volume
  useEffect(() => {
    if (osc) {
      osc.connect(vol);
    }
  }, [vol]);

  ///UseEffect ---- PHASER
  useEffect(() => {
    if (osc) {
      if (phaser) {
        osc.connect(phaser).toDestination();
      } else {
        osc.disconnect(phaser);
        setOsc(new Tone.Oscillator().toDestination());
      }
    }
  }, [phaser]);

  ///UseEffect ---- DELAY
  useEffect(() => {
    if (osc) {
      if (delay) {
        osc.connect(delay).toDestination();
      } else {
        osc.disconnect(delay);
        setOsc(new Tone.Oscillator().toDestination());
      }
    }
  }, [delay]);

  ///UseEffect ---- REVERB
  useEffect(() => {
    if (osc) {
      if (reverb) {
        osc.connect(reverb).toDestination();
        // mic.connect(reverb).toDestination();
      } else {
        setOsc(new Tone.Oscillator().toDestination());
      }
    }
  }, [reverb]);

  ////UseEffect ---- DISTO
  useEffect(() => {
    if (osc) {
      if (disto) {
        osc.connect(disto).toDestination();
      } else {
        osc.disconnect(disto);
        setOsc(new Tone.Oscillator().toDestination());
      }
    }
  }, [disto]);

  return (
    <div>
      <h1>Stylophone</h1>
      <ButtonDiv>
        <button
          id="div-phase"
          ref={phaserButton}
          className="effect-type main-button"
          onClick={() => handlePhaser()}
        >
          Phaser
        </button>
        <button
          id="div-delay"
          ref={delayButton}
          className="effect-type main-button"
          onClick={() => handleDelay()}
        >
          FB-Delay
        </button>
        <button
          id="div-verb"
          ref={reverbButton}
          className="effect-type main-button"
          onClick={() => handleReverb()}
        >
          JC-Reverb
        </button>
        <button
          id="div-dist"
          ref={distButton}
          className="effect-type main-button"
          onClick={() => handleDistortion()}
        >
          Distortion
        </button>
      </ButtonDiv>

      <Params>
        <label htmlFor="filter">Filter Lowpass</label>
        <input
          type="range"
          id="low"
          min="1"
          max="300"
          defaultValue="50"
          onChange={handleChange}
        />
        <label htmlFor="filter">Filter Highpass</label>
        <input
          type="range"
          id="high"
          min="1"
          max="2000"
          defaultValue="1500"
          onChange={handleHighpass}
        />
        <label htmlFor="">Volume</label>
        <input
          onChange={handleVol}
          type="range"
          id="volume"
          min="-100"
          max="30"
          defaultValue="-15"
          step="1"
        />
      </Params>
      <Pad
        id="pad"
        ref={pad}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="pad"
      ></Pad>
      <div className="pianoPage"></div>
    </div>
  );
}

const ButtonDiv = styled.div`
  display: grid;
  /* grid-template-columns: auto min-content; */
  justify-content: center;
  justify-items: start;
  align-items: center;
  gap: 5px 10px;
`;

const Params = styled.div`
  display: grid;
  grid-template-columns: auto min-content;
  justify-content: center;
  justify-items: end;
  align-items: center;
  gap: 5px 10px;
`;

const Pad = styled.div`
  margin-left: 35%;
  /* display: grid; */
  /* grid-template-columns: auto min-content; */
  /* justify-content: center; */
  /* justify-items: end; */
  /* align-items: center; */
  /* gap: 5px 10px; */
`;
