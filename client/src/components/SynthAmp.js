import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import styled from "styled-components";
import "./App.css";
import OnOffSwitch from "./OnOffSwitch";
import Wood from "../components/light_wood_panel.jpeg";

export default function Keyboard() {
  const pad = useRef(null);

  const [osc, setOsc] = useState(null);
  const filterLowRef = useRef(null);
  const volRef = useRef(null);
  const panRef = useRef(null);
  const [pan, setPan] = useState(null);

  const [isPhaserOn, setIsPhaserOn] = useState(false);
  const [isDelayOn, setIsDelayOn] = useState(false);
  const [isReverbOn, setIsReverbOn] = useState(false);
  const [isDistortionOn, setIsDistortionOn] = useState(false);
  const [isChebyshevOn, setIsChebyshevOn] = useState(false);
  const [isPingPongOn, setIsPingPongOn] = useState(false);

  const [delay, setDelay] = useState(null);
  const delayButton = useRef(null);
  const [reverb, setReverb] = useState(null);
  const reverbButton = useRef(null);
  const [phaser, setPhaser] = useState(null);
  const phaserButton = useRef(null);
  const [disto, setDisto] = useState(null);
  const distButton = useRef(null);
  const [chevyshev, setChebyshev] = useState(null);
  const ChevyshevButton = useRef(null);
  const [pingPong, setPingPong] = useState(null);
  const pingPongButton = useRef(null);

  const [selectPreset, setSelectPreset] = useState("1");

  const initialSettings = {
    lowpass: 50,
    volume: 0,
    pan: 0,
    delay: false,
    phaser: false,
    reverb: false,
    distortion: false,
    chebyshev: false,
    pingpong: false,
  };

  const [settings, setSettings] = useState(initialSettings);
  const [isMicOn, setIsMicOn] = useState(false);

  function handleMic() {
    Tone.start();
    const meter = new Tone.Meter();
    const mic = new Tone.UserMedia().connect(meter).toDestination();
    if (!isMicOn) {
      setIsMicOn(!isMicOn);
      mic
        .open()
        .then(() => {
          // promise resolves when input is available
          console.log("mic open");
          mic.connect(delay).toDestination();
          // print the incoming mic levels in decibels
          setInterval(() => console.log(meter.getValue()), 1000);
        })
        .catch((e) => {
          // promise is rejected when the user doesn't have or allow mic access
          console.log(
            "mic not open, please allow the browser to reach the mic"
          );
        });
    } else {
      setIsMicOn(!isMicOn);
      mic.close();
    }
  }
  //this is for handling the MIC

  //
  /// HANDLE CLICK ---- DELAY

  function handleDelay() {
    if (!isDelayOn) {
      setIsDelayOn(!isDelayOn);
      setDelay(new Tone.FeedbackDelay("8n", 0.5).toDestination());
      delayButton.current.style.backgroundColor = "green";
      setSettings({ ...settings, delay: !isDelayOn });
    } else {
      setIsDelayOn(!isDelayOn);
      delayButton.current.style.backgroundColor = "white";
      setDelay(null);
      setSettings({ ...settings, delay: !isDelayOn });
    }
  }

  /// HANDLE CLICK ---- PHASER

  function handlePhaser() {
    if (!isPhaserOn) {
      setIsPhaserOn(!isPhaserOn);
      setPhaser(
        new Tone.Phaser({
          frequency: 15,
          octaves: 6,
          baseFrequency: 1000,
        }).toDestination()
      );
      phaserButton.current.style.backgroundColor = "purple";
      setSettings({ ...settings, phaser: !isPhaserOn });
    } else if (isPhaserOn) {
      setIsPhaserOn(!isPhaserOn);
      phaserButton.current.style.backgroundColor = "white";
      setPhaser(null);
      setSettings({ ...settings, phaser: !isPhaserOn });
    }
  }

  /// HANDLE CLICK ---- REVERB

  function handleReverb() {
    if (!isReverbOn) {
      setIsReverbOn(!isReverbOn);
      setReverb(new Tone.Chorus(4, 2.5, 10).toDestination().start());
      reverbButton.current.style.backgroundColor = "blue";
      setSettings({ ...settings, reverb: !isReverbOn });
    } else if (isReverbOn) {
      setIsReverbOn(!isReverbOn);
      reverbButton.current.style.backgroundColor = "white";
      setReverb(null);
      setSettings({ ...settings, reverb: !isReverbOn });
    }
  }

  /// HANDLE CLICK ---- DISTORTION

  function handleDistortion() {
    if (!isDistortionOn) {
      setIsDistortionOn(!isDistortionOn);
      setDisto(new Tone.Distortion(1).toDestination());
      distButton.current.style.backgroundColor = "red";
      setSettings({ ...settings, distortion: !isDistortionOn });
    } else if (isDistortionOn) {
      setIsDistortionOn(!isDistortionOn);
      distButton.current.style.backgroundColor = "white";
      setDisto(null);
      setSettings({ ...settings, distortion: !isDistortionOn });
    }
  }
  /// HANDLE CLICK ---- CHEBYSHEV

  function handleChebyshev() {
    if (!isChebyshevOn) {
      setIsChebyshevOn(!isChebyshevOn);
      setChebyshev(new Tone.Chebyshev(50).toDestination());
      ChevyshevButton.current.style.backgroundColor = "orange";
      setSettings({ ...settings, chebyshev: !isChebyshevOn });
    } else if (isChebyshevOn) {
      setIsChebyshevOn(!isChebyshevOn);
      ChevyshevButton.current.style.backgroundColor = "white";
      setChebyshev(null);
      setSettings({ ...settings, chebyshev: !isChebyshevOn });
    }
  }
  /// HANDLE CLICK ---- PING PONG

  function handlePingPong() {
    if (!isPingPongOn) {
      setIsPingPongOn(!isPingPongOn);
      setPingPong(new Tone.PingPongDelay("4n", 0.2).toDestination());
      pingPongButton.current.style.backgroundColor = "gray";
      setSettings({ ...settings, pingpong: !isPingPongOn });
    } else if (isPingPongOn) {
      setIsPingPongOn(!isPingPongOn);
      pingPongButton.current.style.backgroundColor = "white";
      setPingPong(null);
      setSettings({ ...settings, pingpong: !isPingPongOn });
    }
  }

  /// CLIENT INTERACTION WITH THE TOUCH PAD and MOUSE

  const handleTouchStart = (e) => {
    const clientY = e.touches[0].clientY;
    const clientX = e.touches[0].clientX;
    console.log(clientY);

    osc.connect(filterLowRef.current);
    osc.connect(volRef.current);
    osc.connect(pan);

    osc.start();
    osc.frequency.value = clientY;
    filterLowRef.current.frequency.value = clientX + 300;
  };

  function handleMouseStart(e) {
    const clientY = e.clientY;
    const clientX = e.clientX;
    console.log(clientY);

    osc.start();
    osc.connect(filterLowRef.current);
    osc.connect(volRef.current);
    osc.connect(pan);

    osc.frequency.value = clientY;
    filterLowRef.current.frequency.value = clientX + 300;
  }

  const handleTouchEnd = () => {
    osc.stop();
  };

  function handleMouseEnd() {
    osc.stop();
  }

  const handleTouchMove = (e) => {
    const clientY = e.touches[0].clientY;
    const clientX = e.touches[0].clientX;

    osc.frequency.value = clientY;
    filterLowRef.current.frequency.value = clientX + 300;
  };

  function handleMouseMove(e) {
    const clientY = e.clientY;
    const clientX = e.clientX;

    osc.frequency.value = clientY;
    filterLowRef.current.frequency.value = clientX + 300;
  }

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
    // console.log("Pan value", e.target.value);
    pan.pan.value = e.target.value;
    setSettings({ ...settings, pan: Number(e.target.value) });
  }

  /// FUNCTION HANDLE SELECT PRESET
  function handleSelectPreset(e) {
    setSelectPreset(e.target.value);
    console.log(e.target.value);
  }

  //// HANDLE SUBMIT -------- POST

  function handleSubmit() {
    fetch(`/preset/${selectPreset}`, {
      method: "PUT",
      body: JSON.stringify(settings),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 200) {
          console.log(json.data);

          // updateUserReservation(json.data);
          // window.localStorage.setItem("PresetData", JSON.stringify(json.data));
          // history.push("/confirmed");
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
    /////////////-//////////////////////-////////////////-///////////////
    // fetch("/presets", {
    //   method: "POST",
    //   body: JSON.stringify(settings),
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((json) => {
    //     if (json.status === 201) {
    //       console.log(json.data);

    //       // updateUserReservation(json.data);
    //       // window.localStorage.setItem("PresetData", JSON.stringify(json.data));
    //       // history.push("/confirmed");
    //     }
    //   })
    //   .catch((err) => {
    //     console.log("Error:", err);
    //   });
  }
  //// HANDLE LOAD PRESET ------- GET by ID (presets go from 1 to 5)

  function handleLoadPreset() {
    fetch(`/preset/${selectPreset}`)
      .then((res) => res.json())
      .then((data) => {
        const obj1 = data.data;
        console.log("data.data", obj1);
        // const val9 = obj1[Object.keys(obj1)[9]];
        // console.log("VAL9", val9);
        // console.log("VAl9 but dot", data.data.pingpong);

        ///updating settings from Mongo obj
        setSettings({
          ...settings,
          lowpass: data.data.lowpass,
          volume: data.data.volume,
          pan: data.data.pan,
          delay: data.data.delay,
          phaser: data.data.phaser,
          reverb: data.data.reverb,
          distortion: data.data.distortion,
          chebyshev: data.data.chebyshev,
          pingpong: data.data.pingpong,
        });

        ///updating settings from the MongoDb object for sliders
        filterLowRef.current.frequency.value = data.data.lowpass;
        volRef.current.volume.value = data.data.volume;
        osc.volume.value = data.data.volume;
        pan.pan.value = data.data.pan;

        ////////updating settings from the MongoDb object for button
        console.log("pimgpong VALUE", settings.pingpong);
        console.log("delay VALUE", settings.delay);
        console.log(settings);

        setIsDelayOn(data.data.delay);

        setIsPhaserOn(data.data.phaser);

        setIsReverbOn(data.data.reverb);

        setIsDistortionOn(data.data.distortion);

        setIsChebyshevOn(data.data.chebyshev);

        setIsPingPongOn(data.data.pingpong);

        ///////RELOADING THE STATE THAT COMES FRON THE BACK END

        if (data.data.delay) {
          setDelay(new Tone.FeedbackDelay("8n", 0.5).toDestination());
          delayButton.current.style.backgroundColor = "green";
        } else {
          setDelay(null);
          delayButton.current.style.backgroundColor = "white";
        }

        if (data.data.phaser) {
          setPhaser(
            new Tone.Phaser({
              frequency: 15,
              octaves: 6,
              baseFrequency: 1000,
            }).toDestination()
          );
          phaserButton.current.style.backgroundColor = "purple";
        } else {
          setPhaser(null);
          phaserButton.current.style.backgroundColor = "white";
        }

        if (data.data.reverb) {
          setReverb(new Tone.Chorus(4, 2.5, 10).toDestination().start());
          reverbButton.current.style.backgroundColor = "blue";
        } else {
          setReverb(null);
          reverbButton.current.style.backgroundColor = "white";
        }

        if (data.data.distortion) {
          setDisto(new Tone.Distortion(1).toDestination());
          distButton.current.style.backgroundColor = "red";
        } else {
          setDisto(null);
          distButton.current.style.backgroundColor = "white";
        }

        if (data.data.chebyshev) {
          setChebyshev(new Tone.Chebyshev(50).toDestination());
          ChevyshevButton.current.style.backgroundColor = "orange";
        } else {
          setChebyshev(null);
          ChevyshevButton.current.style.backgroundColor = "white";
        }

        if (data.data.pingpong) {
          setPingPong(new Tone.PingPongDelay("4n", 0.2).toDestination());
          pingPongButton.current.style.backgroundColor = "gray";
        } else {
          setPingPong(null);
          pingPongButton.current.style.backgroundColor = "white";
        }
      })

      .catch((err) => {
        console.log("Error", err);
      });
    /////////////-//////////////////////-////////////////-///////////////
    // fetch("/presets")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     const obj1 = data.data;
    //     console.log("data.data", obj1);
    //     //this line is looking for the fist object in MongoDB collection
    //     // const obj2 = obj1[Object.keys(obj1)[0]];
    //     // this line is looking for the last object of the collection. if I implement a PUT method instead of a POST i will rewrite the fetch
    //     const obj2 = obj1[Object.keys(obj1)[Object.keys(obj1).length - 1]];
    //     console.log(obj2);
    //     const val1 = obj2[Object.keys(obj2)[1]];
    //     console.log(val1);
    //     const val2 = obj2[Object.keys(obj2)[2]];
    //     console.log(val2);
    //     const val3 = obj2[Object.keys(obj2)[3]];
    //     console.log(val3);
    //     const val4 = obj2[Object.keys(obj2)[4]];
    //     console.log(val4);
    //     const val5 = obj2[Object.keys(obj2)[5]];
    //     console.log(val5);
    //     const val6 = obj2[Object.keys(obj2)[6]];
    //     console.log(val6);
    //     const val7 = obj2[Object.keys(obj2)[7]];
    //     console.log(val7);
    //     const val8 = obj2[Object.keys(obj2)[8]];
    //     console.log(val8);
    //     const val9 = obj2[Object.keys(obj2)[9]];
    //     console.log(val9);
    //     ///updating settings from Mongo obj
    //     setSettings({
    //       ...settings,
    //       lowpass: val1,
    //       volume: val2,
    //       pan: val3,
    //       delay: val4,
    //       phaser: val5,
    //       reverb: val6,
    //       distortion: val7,
    //       chebyshev: val8,
    //       pingpong: val9,
    //     });
    //     ///updating settings from the MongoDb object for sliders
    //     filterLowRef.current.frequency.value = val1;
    //     volRef.current.volume.value = val2;
    //     osc.volume.value = val2;
    //     pan.pan.value = val3;

    //     ///updating settings from the MongoDb object for buttons
    //     setIsDelayOn(val4);
    //     // handleDelay();
    //     setIsPhaserOn(val5);
    //     // handlePhaser();
    //     setIsReverbOn(val6);
    //     // handleReverb();
    //     setIsDistortionOn(val7);
    //     // handleDistortion();
    //     setIsChebyshevOn(val8);
    //     // handleChebyshev();
    //     setIsPingPongOn(val9);
    //     // handlePingPong();

    //     ///////RELOADING THE STATE THAT COMES FRON THE BACK END

    //     if (val4) {
    //       setDelay(new Tone.FeedbackDelay("8n", 0.5).toDestination());
    //       delayButton.current.style.backgroundColor = "green";
    //     } else {
    //       setDelay(null);
    //       delayButton.current.style.backgroundColor = "white";
    //     }

    //     if (val5) {
    //       setPhaser(
    //         new Tone.Phaser({
    //           frequency: 15,
    //           octaves: 6,
    //           baseFrequency: 1000,
    //         }).toDestination()
    //       );
    //       phaserButton.current.style.backgroundColor = "purple";
    //     } else {
    //       setPhaser(null);
    //       phaserButton.current.style.backgroundColor = "white";
    //     }

    //     if (val6) {
    //       setReverb(new Tone.Chorus(4, 2.5, 10).toDestination().start());
    //       reverbButton.current.style.backgroundColor = "blue";
    //     } else {
    //       setReverb(null);
    //       reverbButton.current.style.backgroundColor = "white";
    //     }

    //     if (val7) {
    //       setDisto(new Tone.Distortion(1).toDestination());
    //       distButton.current.style.backgroundColor = "red";
    //     } else {
    //       setDisto(null);
    //       distButton.current.style.backgroundColor = "white";
    //     }

    //     if (val8) {
    //       setChebyshev(new Tone.Chebyshev(50).toDestination());
    //       ChevyshevButton.current.style.backgroundColor = "orange";
    //     } else {
    //       setChebyshev(null);
    //       ChevyshevButton.current.style.backgroundColor = "white";
    //     }

    //     if (val9) {
    //       setPingPong(new Tone.PingPongDelay("4n", 0.2).toDestination());
    //       pingPongButton.current.style.backgroundColor = "gray";
    //     } else {
    //       setPingPong(null);
    //       pingPongButton.current.style.backgroundColor = "white";
    //     }
    //   })

    //   .catch((err) => {
    //     console.log("Error", err);
    //   });
  }

  ///// USEEFFECT
  useEffect(() => {
    setOsc(new Tone.Oscillator().toDestination());
    filterLowRef.current = new Tone.Filter(50, "lowpass").toDestination();
    volRef.current = new Tone.Volume(-20).toDestination();
    setPan(new Tone.Panner(1).toDestination());
  }, []);

  // useEffect(() => {
  //   if (mic) {
  //     if (phaser) {
  //       mic.connect(phaser).toDestination();
  //     }
  //   }
  // }, []);

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
  ////UseEffect ---- CHEBYSHEV
  useEffect(() => {
    if (osc) {
      if (chevyshev) {
        osc.connect(chevyshev).toDestination();
      } else {
        osc.disconnect(chevyshev);
        setOsc(new Tone.Oscillator().toDestination());
      }
    }
  }, [chevyshev]);

  ////UseEffect ---- PING PONG
  useEffect(() => {
    if (osc) {
      if (pingPong) {
        osc.connect(pingPong).toDestination();
      } else {
        osc.disconnect(pingPong);
        setOsc(new Tone.Oscillator().toDestination());
      }
    }
  }, [pingPong]);

  return (
    <div>
      {/* <WoodBackground
        style={{
          backgroundImage: `url(${Wood})`,
        }}
      ></WoodBackground> */}
      <h1>Stylophone</h1>
      <ButtonDiv>
        <button>MIC MODE</button>
        <OnOffSwitch handleMic={handleMic}></OnOffSwitch>
        <button
          id="div-delay"
          ref={delayButton}
          className="effect-type main-button"
          onClick={() => handleDelay()}
        >
          FB-Delay
        </button>
        <button
          id="div-phase"
          ref={phaserButton}
          className="effect-type main-button"
          onClick={() => handlePhaser()}
        >
          Phaser
        </button>
        <button
          id="div-verb"
          ref={reverbButton}
          className="effect-type main-button"
          onClick={() => handleReverb()}
        >
          Reverb
        </button>
        <button
          id="div-dist"
          ref={distButton}
          className="effect-type main-button"
          onClick={() => handleDistortion()}
        >
          Distortion
        </button>
        <button
          id="div-dist"
          ref={ChevyshevButton}
          className="effect-type main-button"
          onClick={() => handleChebyshev()}
        >
          Chebyshev
        </button>
        <button
          id="div-pingpong"
          ref={pingPongButton}
          className="effect-type main-button"
          onClick={() => handlePingPong()}
        >
          Pingpong Delay
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
          // step="0.01"
          onChange={handlePan}
        />
        {/* <label htmlFor="filter">Bit Crusher</label>
        <input
          type="range"
          id="high"
          min="1"
          max="16"
          // defaultValue="0"
          // value={settings.pan}
          // step="0.01"
          onChange={handleBitCrusher}
        /> */}
      </Params>
      <Pad
        id="pad"
        ref={pad}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseStart}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseEnd}
        className="pad"
      ></Pad>

      <WrapperPreset className="preset-button-wrapper">
        <button onClick={handleSubmit}>Submit Preset</button>
        <button onClick={handleLoadPreset}>Load Preset</button>
        <Button onClick={() => window.location.reload(false)}>
          Reload synth!
        </Button>
        <label htmlFor="filter">Select Preset: </label>
        <input
          type="range"
          id="preset select"
          min="1"
          max="5"
          defaultValue="1"
          // value={settings.pan}
          step="1"
          onChange={handleSelectPreset}
        />
        {selectPreset}
      </WrapperPreset>
    </div>
  );
}

const WoodBackground = styled.img`
  width: 65em;
  height: 40em;
  object-fit: fill;
  border-top-left-radius: 1em;
  border-top-right-radius: 1em;
  border-bottom-left-radius: 1.5em;
  border-bottom-right-radius: 1.5em;
`;

const WrapperPreset = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
  align-items: center;
`;
const Button = styled.button``;

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
