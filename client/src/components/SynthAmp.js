import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import styled from "styled-components";
import "./App.css";
import OnOffSwitch from "./OnOffSwitch";

export default function Keyboard() {
  const pad = useRef(null);

  const [osc, setOsc] = useState(null);
  const filterLowRef = useRef(null);
  const volRef = useRef(null);
  const panRef = useRef(null);
  const bitCrusherRef = useRef(null);

  const [isDelayOn, setIsDelayOn] = useState(false);

  const [filterHigh, setFilterHigh] = useState(null);
  const [vol, setVol] = useState(0);

  const [delay, setDelay] = useState(null);
  const delayButton = useRef(null);
  const [disto, setDisto] = useState(null);
  const distButton = useRef(null);
  const [reverb, setReverb] = useState(null);
  const reverbButton = useRef(null);
  const [phaser, setPhaser] = useState(null);
  const phaserButton = useRef(null);

  const initialSettings = {
    lowpass: 0,
    volume: 0,
    pan: 0,
    delay: false,
  };

  const [settings, setSettings] = useState(initialSettings);

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
          octaves: 6,
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
    if (!isDelayOn) {
      setIsDelayOn(true);
      setDelay(new Tone.FeedbackDelay("8n", 0.5).toDestination());
      delayButton.current.style.backgroundColor = "green";
      setSettings({ ...settings, delay: isDelayOn });
    } else {
      setIsDelayOn(false);
      delayButton.current.style.backgroundColor = "white";
      setDelay(null);
      setSettings({ ...settings, delay: isDelayOn });
    }
  }

  /// handle Reverb
  function handleReverb() {
    if (reverb === null) {
      setReverb(new Tone.Freeverb(0.3).toDestination());
      reverbButton.current.style.backgroundColor = "blue";
    } else {
      reverbButton.current.style.backgroundColor = "white";
      setReverb(null);
    }
  }

  ///handle distortion

  function handleDistortion() {
    if (disto === null) {
      setDisto(new Tone.Distortion(1).toDestination());
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

    osc.connect(filterLowRef.current);
    osc.connect(volRef.current);
    osc.connect(panRef.current);
    osc.start();
    osc.frequency.value = clientY;

    // filterLowRef.current.frequency.value = clientX + 300;
  };

  const handleTouchMove = (e) => {
    const clientY = e.touches[0].clientY;
    const clientX = e.touches[0].clientX;
    // console.log(clientX, clientY);
    // console.log(e.target.value);

    // pad.current.style.boxShadow = "inset 0 0 30px #000000"
    // pointer.current.style.transform = `translate(${clientX - 205}px, ${clientY - 45}px)`

    // filterLowRef.current.frequency.value = clientX + 300;
    osc.frequency.value = clientY;
  };
  ///FUNCTION HANDLE LOWPASS -----
  function handleLowpass(e) {
    console.log("Lowpass value", e.target.value);
    filterLowRef.current.frequency.value = e.target.value;
    setSettings({ ...settings, lowpass: Number(e.target.value) });
  }
  ///FUNCTION HANDLE VOLUME ----
  function handleVol(e) {
    console.log("Volume value", e.target.value);
    volRef.current.volume.value = e.target.value;
    osc.volume.value = e.target.value;
    setSettings({ ...settings, volume: Number(e.target.value) });
  }

  ///FUNCTION HANDLE PAN ----
  function handlePan(e) {
    console.log("Pan value", e.target.value);
    panRef.current.pan.value = e.target.value;
    setSettings({ ...settings, pan: Number(e.target.value) });
  }
  ///FUNCTION HANDLE BIT CRUSHER
  function handleBitCrusher(e) {
    console.log("bitcrusher", e.target.value);
    bitCrusherRef.current.bits.value = e.target.value;
    // new Tone.BitCrusher(4).toDestination()
  }

  const handleTouchEnd = () => {
    // pad.current.style.boxShadow = "inset 0 0 20px #000000";
    osc.stop();
  };
  //// HANDLE SUBMIT -------- POST
  function handleSubmit() {
    fetch("/presets", {
      method: "POST",
      body: JSON.stringify(settings),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 201) {
          console.log(json.data);

          // updateUserReservation(json.data);
          // window.localStorage.setItem("PresetData", JSON.stringify(json.data));
          // history.push("/confirmed");
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }
  //// HANDLE LOAD PRESET ------- GET

  function handleLoadPreset() {
    fetch("/presets")
      .then((res) => res.json())
      .then((data) => {
        const obj1 = data.data;
        console.log("data.data", obj1);
        //this line is looking for the fist object in MongoDB collection
        // const obj2 = obj1[Object.keys(obj1)[0]];
        // this line is looking for the last object of the collection. if I implement a PUT method instead of a POST i will rewrite the fetch
        const obj2 = obj1[Object.keys(obj1)[Object.keys(obj1).length - 1]];
        console.log(obj2);
        const val1 = obj2[Object.keys(obj2)[1]];
        console.log(val1);
        const val2 = obj2[Object.keys(obj2)[2]];
        console.log(val2);
        const val3 = obj2[Object.keys(obj2)[3]];
        console.log(val3);
        const val4 = obj2[Object.keys(obj2)[4]];
        console.log(val4);
        ///updating settings from the MongoDb object for sliders
        setSettings({
          ...settings,
          lowpass: val1,
          volume: val2,
          pan: val3,
          delay: val4,
        });
        filterLowRef.current.frequency.value = val1;
        volRef.current.volume.value = val2;
        osc.volume.value = val2;
        panRef.current.pan.value = val3;
        ///updating settings from the MongoDb object for buttons
        setIsDelayOn(val4);
        handleDelay();
        console.log(delay);
      })

      .catch((err) => {
        console.log("Error", err);
      });
  }

  ///// USEEFFECT
  useEffect(() => {
    setOsc(new Tone.Oscillator().toDestination());
    filterLowRef.current = new Tone.Filter(50, "lowpass").toDestination();
    volRef.current = new Tone.Volume(-20).toDestination();
    panRef.current = new Tone.Panner(1).toDestination();
    bitCrusherRef.current = new Tone.BitCrusher(16).toDestination();
    // setVol(new Tone.Volume(-12).toDestination());
  }, []);

  /// useEffect Volume
  // useEffect(() => {
  //   if (osc) {
  //     // osc.connect(vol);
  //   }
  // }, [vol]);

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
        <OnOffSwitch></OnOffSwitch>
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
          name="lowpass"
          value={settings.lowpass}
          onChange={handleLowpass}
          id="low"
          min="1"
          max="300"
        />
        <label htmlFor="">Volume</label>
        <input
          onChange={handleVol}
          type="range"
          value={settings.volume}
          id="volume"
          min="-45"
          max="20"
          // defaultValue="-20"
          step="1"
        />
        <label htmlFor="filter">Pan</label>
        <input
          type="range"
          id="high"
          min="-1"
          max="1"
          // defaultValue="0"
          value={settings.pan}
          step="0.01"
          onChange={handlePan}
        />
        <label htmlFor="filter">Bit Crusher</label>
        <input
          type="range"
          id="high"
          min="1"
          max="16"
          // defaultValue="0"
          // value={settings.pan}
          // step="0.01"
          onChange={handleBitCrusher}
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
      <div className="preset-button-wrapper">
        <button onClick={handleSubmit}>Submit Preset</button>
        <button onClick={handleLoadPreset}>Load Preset</button>
      </div>
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
