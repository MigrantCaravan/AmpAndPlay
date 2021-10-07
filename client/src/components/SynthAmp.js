import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import styled from "styled-components";
import { AiFillWarning } from "react-icons/ai";
import "./App.css";
import OnOffSwitch from "./OnOffSwitch";
import Wood from "../components/light_wood_panel.jpeg";
import { useAuth0 } from "@auth0/auth0-react";

export default function Keyboard() {
  const { user, isAuthenticated } = useAuth0();
  const pad = useRef(null);
  ///States for the sliders
  const [osc, setOsc] = useState(null);
  const [filterLow, setFilterLow] = useState(null);
  const volRef = useRef(null);
  const [pan, setPan] = useState(null);
  ///States for the isOn effects
  const [isPhaserOn, setIsPhaserOn] = useState(false);
  const [isDelayOn, setIsDelayOn] = useState(false);
  const [isReverbOn, setIsReverbOn] = useState(false);
  const [isDistortionOn, setIsDistortionOn] = useState(false);
  const [isChebyshevOn, setIsChebyshevOn] = useState(false);
  const [isPingPongOn, setIsPingPongOn] = useState(false);
  ///States for the effects from Tone.js and Ref for buttons
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
  ///States for the preset selection and message
  const [selectPreset, setSelectPreset] = useState("1");
  const [presetMessage, setPresetMessage] = useState("");

  const [decibel, setDecibel] = useState(0);
  ///Object with inital values for eache effect and slider
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

  //// This function and variables are responsible for Mic Mode
  const [isMicOn, setIsMicOn] = useState(false);
  const meter = new Tone.Meter();
  const mic = new Tone.UserMedia().connect(meter).toDestination();
  function handleMic() {
    Tone.start();
    if (!isMicOn) {
      setIsMicOn(!isMicOn);
      mic
        .open()
        .then(() => {
          // promise resolves when input is available
          setPresetMessage("Mic Mode ON");
          // print the incoming mic levels in decibels
          setInterval(() => setDecibel(meter.getValue()), 1000);
          // setInterval(() => console.log(meter.getValue()), 1000);
        })
        .then(() => {
          if (mic) {
            if (delay) {
              mic.connect(delay).toDestination();
            } else if (phaser) {
              mic.connect(phaser).toDestination();
            } else if (reverb) {
              mic.connect(reverb).toDestination();
            } else if (disto) {
              mic.connect(disto).toDestination();
            } else if (chevyshev) {
              mic.connect(chevyshev).toDestination();
            } else if (pingPong) {
              mic.connect(pingPong).toDestination();
            }
          }
        })
        .catch((e) => {
          // promise is rejected when the user doesn't have or allow mic access
          console.log(
            "mic is not open, please allow the browser to reach the mic"
          );
          setPresetMessage("Allow the browser to reach the mic");
        });
    } else if (isMicOn) {
      setIsMicOn(!isMicOn);
      console.log("Mic switch is OFF");
      mic.disconnect().toDestination();
      mic.close().toDestination();
      window.location.reload(false);
    }
  }

  /// HANDLE CLICK ---- DELAY

  function handleDelay() {
    if (!isDelayOn) {
      setIsDelayOn(!isDelayOn);
      setDelay(new Tone.FeedbackDelay("8n", 0.5).toDestination());
      delayButton.current.style.backgroundColor = "#D9DD6B";
      setSettings({ ...settings, delay: !isDelayOn });
    } else {
      setIsDelayOn(!isDelayOn);
      delayButton.current.style.backgroundColor = "#EFEFEF";
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
      phaserButton.current.style.backgroundColor = "#B24080";
      setSettings({ ...settings, phaser: !isPhaserOn });
    } else if (isPhaserOn) {
      setIsPhaserOn(!isPhaserOn);
      phaserButton.current.style.backgroundColor = "#EFEFEF";
      setPhaser(null);
      setSettings({ ...settings, phaser: !isPhaserOn });
    }
  }

  /// HANDLE CLICK ---- REVERB

  function handleReverb() {
    if (!isReverbOn) {
      setIsReverbOn(!isReverbOn);
      setReverb(new Tone.Chorus(4, 2.5, 10).toDestination().start());
      reverbButton.current.style.backgroundColor = "#1597BB";
      setSettings({ ...settings, reverb: !isReverbOn });
    } else if (isReverbOn) {
      setIsReverbOn(!isReverbOn);
      reverbButton.current.style.backgroundColor = "#EFEFEF";
      setReverb(null);
      setSettings({ ...settings, reverb: !isReverbOn });
    }
  }

  /// HANDLE CLICK ---- DISTORTION

  function handleDistortion() {
    if (!isDistortionOn) {
      setIsDistortionOn(!isDistortionOn);
      setDisto(new Tone.Distortion(1).toDestination());
      distButton.current.style.backgroundColor = "#AC0D0D";
      setSettings({ ...settings, distortion: !isDistortionOn });
    } else if (isDistortionOn) {
      setIsDistortionOn(!isDistortionOn);
      distButton.current.style.backgroundColor = "#EFEFEF";
      setDisto(null);
      setSettings({ ...settings, distortion: !isDistortionOn });
    }
  }
  /// HANDLE CLICK ---- CHEBYSHEV

  function handleChebyshev() {
    if (!isChebyshevOn) {
      setIsChebyshevOn(!isChebyshevOn);
      setChebyshev(new Tone.Chebyshev(50).toDestination());
      ChevyshevButton.current.style.backgroundColor = "#F48B29";
      setSettings({ ...settings, chebyshev: !isChebyshevOn });
    } else if (isChebyshevOn) {
      setIsChebyshevOn(!isChebyshevOn);
      ChevyshevButton.current.style.backgroundColor = "#EFEFEF";
      setChebyshev(null);
      setSettings({ ...settings, chebyshev: !isChebyshevOn });
    }
  }
  /// HANDLE CLICK ---- PING PONG

  function handlePingPong() {
    if (!isPingPongOn) {
      setIsPingPongOn(!isPingPongOn);
      setPingPong(new Tone.PingPongDelay("4n", 0.2).toDestination());
      pingPongButton.current.style.backgroundColor = "#D5DBB3";
      setSettings({ ...settings, pingpong: !isPingPongOn });
    } else if (isPingPongOn) {
      setIsPingPongOn(!isPingPongOn);
      pingPongButton.current.style.backgroundColor = "#EFEFEF";
      setPingPong(null);
      setSettings({ ...settings, pingpong: !isPingPongOn });
    }
  }

  /// CLIENT INTERACTION WITH THE TOUCH PAD and MOUSE

  const handleTouchStart = (e) => {
    const clientY = e.touches[0].clientY;
    const clientX = e.touches[0].clientX;

    osc.connect(filterLow);
    osc.connect(volRef.current);
    osc.connect(pan);

    osc.start();
    osc.frequency.value = clientY;
    filterLow.frequency.value = clientX + 300;
  };

  function handleMouseStart(e) {
    const clientY = e.clientY;
    const clientX = e.clientX;

    osc.start();
    osc.connect(filterLow);
    osc.connect(volRef.current);
    osc.connect(pan);

    osc.frequency.value = clientY;
    filterLow.frequency.value = clientX + 300;

    osc.connect(meter).toDestination();
    setInterval(() => setDecibel(meter.getValue()), 1000);
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
    filterLow.frequency.value = clientX + 300;
  };

  function handleMouseMove(e) {
    const clientY = e.clientY;
    const clientX = e.clientX;

    osc.frequency.value = clientY;
    filterLow.frequency.value = clientX + 300;
  }

  /// FUNCTIONS TO HANDLE SLIDERS

  ///FUNCTION HANDLE LOWPASS ----

  function handleLowpass(e) {
    filterLow.frequency.value = e.target.value;
    setSettings({ ...settings, lowpass: Number(e.target.value) });
  }
  ///FUNCTION HANDLE VOLUME ----

  function handleVol(e) {
    volRef.current.volume.value = e.target.value;
    osc.volume.value = e.target.value;
    setSettings({ ...settings, volume: Number(e.target.value) });
    // console.log(user.sub);
  }

  ///FUNCTION HANDLE PAN ----

  function handlePan(e) {
    pan.pan.value = e.target.value;
    setSettings({ ...settings, pan: Number(e.target.value) });
  }

  /// FUNCTION HANDLE SELECT PRESET

  function handleSelectPreset(e) {
    setSelectPreset(e.target.value);
  }

  /// FUNTIONS THAT HANDLE THE FETCHES POST-PUT-DELETE-GET

  //// HANDLE SUBMIT -------- POST

  function handlePostPreset() {
    fetch("/presets", {
      method: "POST",
      body: JSON.stringify({
        ...settings,
        id: `${selectPreset}${user.sub}`,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 201) {
          // console.log(json.data);
          setPresetMessage(`Preset ${selectPreset} saved in Database`);
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }

  //// HANDLE REPLACE -------- PUT

  function handleSubmit() {
    fetch(`/preset/${selectPreset}${user.sub}`, {
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
          // console.log(json.data);
          setPresetMessage(`Preset ${selectPreset} updated in Database`);
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }

  //// HANDLE LOAD PRESET ------- GET by ID (presets go from 1 to 5)

  function handleLoadPreset() {
    fetch(`/preset/${selectPreset}${user.sub}`)
      .then((res) => res.json())
      .then((data) => {
        setPresetMessage(`Preset ${selectPreset} is loaded`);

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
        filterLow.frequency.value = data.data.lowpass;
        volRef.current.volume.value = data.data.volume;
        osc.volume.value = data.data.volume;
        pan.pan.value = data.data.pan;

        ////////updating settings from the MongoDb object for button

        setIsDelayOn(data.data.delay);

        setIsPhaserOn(data.data.phaser);

        setIsReverbOn(data.data.reverb);

        setIsDistortionOn(data.data.distortion);

        setIsChebyshevOn(data.data.chebyshev);

        setIsPingPongOn(data.data.pingpong);

        ///////RELOADING THE STATE THAT COMES FRON THE BACK END

        if (data.data.delay) {
          setDelay(new Tone.FeedbackDelay("8n", 0.5).toDestination());
          delayButton.current.style.backgroundColor = "#D9DD6B";
        } else {
          setDelay(null);
          delayButton.current.style.backgroundColor = "#EFEFEF";
        }

        if (data.data.phaser) {
          setPhaser(
            new Tone.Phaser({
              frequency: 15,
              octaves: 6,
              baseFrequency: 1000,
            }).toDestination()
          );
          phaserButton.current.style.backgroundColor = "#B24080";
        } else {
          setPhaser(null);
          phaserButton.current.style.backgroundColor = "#EFEFEF";
        }

        if (data.data.reverb) {
          setReverb(new Tone.Chorus(4, 2.5, 10).toDestination().start());
          reverbButton.current.style.backgroundColor = "#1597BB";
        } else {
          setReverb(null);
          reverbButton.current.style.backgroundColor = "#EFEFEF";
        }

        if (data.data.distortion) {
          setDisto(new Tone.Distortion(1).toDestination());
          distButton.current.style.backgroundColor = "#AC0D0D";
        } else {
          setDisto(null);
          distButton.current.style.backgroundColor = "#EFEFEF";
        }

        if (data.data.chebyshev) {
          setChebyshev(new Tone.Chebyshev(50).toDestination());
          ChevyshevButton.current.style.backgroundColor = "#F48B29";
        } else {
          setChebyshev(null);
          ChevyshevButton.current.style.backgroundColor = "#EFEFEF";
        }

        if (data.data.pingpong) {
          setPingPong(new Tone.PingPongDelay("4n", 0.2).toDestination());
          pingPongButton.current.style.backgroundColor = "#D5DBB3";
        } else {
          setPingPong(null);
          pingPongButton.current.style.backgroundColor = "#EFEFEF";
        }
      })

      .catch((err) => {
        console.log("Error", err);
        setPresetMessage("Preset not found");
      });
  }

  //// HANDLE DELETE PRESET ------- GET by ID (presets go from 1 to 5)

  function handleDeletePreset() {
    fetch(`/preset/${selectPreset}${user.sub}`, {
      method: "DELETE",
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
          setPresetMessage(`Preset ${selectPreset} deleted from Database`);
        } else if (json.status === 400) {
          setPresetMessage("Preset not found");
        }
      })
      .catch((err) => {
        setPresetMessage("Preset not found");
        console.log("Error:", err);
      });
  }

  ///// USEEFFECT
  useEffect(() => {
    setOsc(new Tone.Oscillator().toDestination());
    setFilterLow(new Tone.Filter(50, "lowpass").toDestination());
    volRef.current = new Tone.Volume(-20).toDestination();
    setPan(new Tone.Panner(1).toDestination());
  }, []);

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
    <SynthWrapper>
      <WoodBackground
        style={{
          backgroundImage: `url(${Wood})`,
        }}
      ></WoodBackground>
      <LeftPanel>
        <Decibels>DB: {Math.floor(decibel)}</Decibels>
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
        <Warning>
          <AiFillWarning />
          <AiFillWarning />
          <AiFillWarning />
          <AiFillWarning />
          <AiFillWarning />
          <AiFillWarning />
          <AiFillWarning />
          <h3>Warning</h3>
          <p>*Always use headphones</p>
          <p>
            *Mic mode will requiere access to your microphone and only one
            effect can be used at the time
          </p>
        </Warning>
        <PresetMessages>MESSAGE: {presetMessage}</PresetMessages>
        <MicMode>
          MIC MODE:
          <OnOffSwitch handleMic={handleMic}></OnOffSwitch>
        </MicMode>
      </LeftPanel>
      <RightPanel>
        <ButtonDiv>
          <Button
            id="div-delay"
            ref={delayButton}
            className="effect-type main-button"
            onClick={() => handleDelay()}
          >
            Delay
          </Button>
          <Button
            id="div-phase"
            ref={phaserButton}
            className="effect-type main-button"
            onClick={() => handlePhaser()}
          >
            Phaser
          </Button>
          <Button
            id="div-verb"
            ref={reverbButton}
            className="effect-type main-button"
            onClick={() => handleReverb()}
          >
            Reverb
          </Button>
          <Button
            id="div-dist"
            ref={distButton}
            className="effect-type main-button"
            onClick={() => handleDistortion()}
          >
            Distortion
          </Button>
          <Button
            id="div-dist"
            ref={ChevyshevButton}
            className="effect-type main-button"
            onClick={() => handleChebyshev()}
          >
            Chebyshev
          </Button>
          <Button
            id="div-pingpong"
            ref={pingPongButton}
            className="effect-type main-button"
            onClick={() => handlePingPong()}
          >
            Pingpong
          </Button>
          <Button onClick={() => window.location.reload(false)}>
            Reload Synth
            <AiFillWarning />
          </Button>
        </ButtonDiv>
        <Params>
          <Label htmlFor="filter">FILTER</Label>
          <Input
            className="slider"
            type="range"
            name="lowpass"
            value={settings.lowpass}
            onChange={handleLowpass}
            id="low"
            min="1"
            max="300"
          />
          <Label htmlFor="">VOLUME</Label>
          <Input
            className="slider"
            onChange={handleVol}
            type="range"
            value={settings.volume}
            id="volume"
            min="-45"
            max="20"
            step="1"
          />
          <Label htmlFor="filter">PAN</Label>
          <Input
            className="slider"
            type="range"
            id="high"
            min="-1"
            max="1"
            value={settings.pan}
            step="0.01"
            onChange={handlePan}
          />
        </Params>
        {isAuthenticated && (
          <WrapperPreset className="preset-button-wrapper">
            <Button onClick={handlePostPreset}>Send Preset</Button>
            <Button onClick={handleSubmit}>Reaplace Preset</Button>
            <Button onClick={handleLoadPreset}>Load Preset</Button>
            <Button onClick={handleDeletePreset}>Delete Preset</Button>

            <Label htmlFor="filter">SELECT PRESET </Label>
            <Input
              className="slider"
              type="range"
              id="preset select"
              min="1"
              max="5"
              defaultValue="1"
              step="1"
              onChange={handleSelectPreset}
            />
            <PresetNumber>{selectPreset}</PresetNumber>
          </WrapperPreset>
        )}
      </RightPanel>
    </SynthWrapper>
  );
}

const PresetNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: whitesmoke;
  border-radius: 50%;
  width: 18px;
`;

const Warning = styled.div`
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  text-align: center;
  background-color: #a45d5d;
  background-image: url("https://www.transparenttextures.com/patterns/hexellence.png");
  /* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */
  font-size: 15px;
  position: absolute;
  top: 2.5%;
  left: 65%;
  width: 4%;
  height: 4%;
  border: solid 5px;
  border-radius: 8px;
  border-color: #f5eeea;
  /* text-indent: -9999px; */
  color: transparent;

  &:hover {
    /* transition: 0.1s; */
    transition: 0.3s ease-in-out;
    color: black;
    text-indent: 0%;
    height: 32%;
    width: 30%;
  }
`;

const PresetMessages = styled.div`
  background-color: black;
  color: white;
  font-family: "digital-clock-font";
  font-size: 23px;
  position: absolute;
  top: 62%;
  left: 65%;
  width: 30%;
  height: 15%;
  border: solid 5px;
  border-top-left-radius: 0.25em;
  border-bottom-left-radius: 0.25em;
  border-radius: 8px;
  border-color: #f5eeea;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 12px;
  background-color: #efefef;
  border: 1px solid #c8c6c6;
  width: 150px;
  height: fit-content;
  border-radius: 3px;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  /* position: absolute;
left: 50%; */
  width: 350px;
  height: 15px;
  -webkit-appearance: none;
  background: #111;
  outline: none;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 1);
`;

const RightPanel = styled.div`
  position: absolute;
  top: 2.5%;
  left: 53%;

  width: 46%;
  height: 95%;
  border-radius: 0.5em;
  background-color: #2a2a28;
`;

const LeftPanel = styled.div`
  position: absolute;
  top: 2.5%;
  left: 1.5%;

  width: 50%;
  height: 95%;
  border-radius: 0.5em;

  background-color: #2a2a28;
`;
const SynthWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 40em;
  width: 65em;
  border-radius: 1.5em;
  outline: 0;
  box-shadow: 0.5em 0.5em 1.5em 0.5em #000000;
`;

const Pad = styled.div`
  border-radius: 0.5em;
  position: absolute;
  top: 15.5%;
  left: 3.5%;
`;

const Decibels = styled.div`
  font-family: "digital-clock-font";
  font-size: 55px;
  color: white;
  background-color: black;
  width: 300px;
  border-radius: 8px;
  left: 3.5%;
  top: 2.5%;
  position: absolute;
  border: 5px solid #c8c6c6;
`;

const MicMode = styled.div`
  display: flex;
  /* align-items: center; */
  background-color: #ffc069;
  font-family: "digital-clock-font";
  font-size: 15px;
  position: absolute;
  top: 80%;
  left: 65%;
  width: 30%;
  height: 15%;
  border: solid 5px;
  border-top-left-radius: 0.25em;
  border-bottom-left-radius: 0.25em;
  border-radius: 8px;
  border-color: #f5eeea;
`;

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
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 68%;
  left: 3.5%;
  width: 93%;
  height: 30%;
  border: solid 5px;
  border-radius: 8px;
  border-color: #f5eeea;
`;
const Button = styled.button`
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 12.5px;
  position: relative;
  margin: 8px;
  padding: 0px;
  width: 75px;
  height: 50px;

  border: 4px solid #c8c6c6;
  outline: none;
  background-color: #f4f5f6;
  border-radius: 4px;
  box-shadow: -6px -8px 10px #2a2a28, -6px -8px 10px #2a2a28,
    -20px 0px 25px #2a2a28, 6px 20px 25px rgba(0, 0, 0, 0.2);
  transition: 0.16s ease-in-out;
  cursor: pointer;
  &:active {
    box-shadow: none;
    .button__content {
      box-shadow: none;
      .button__text,
      .button__icon {
        transform: translate3d(0px, 0px, 0px);
      }
    }
  }
  &__content {
    position: relative;
    display: grid;

    padding: 20px;
    width: 100%;
    height: 100%;

    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    box-shadow: inset 0px -8px 0px #dddddd, 0px -8px 0px #f4f5f6;
    border-radius: 40px;
    transition: 0.13s ease-in-out;

    z-index: 1;
  }
  &__icon {
    position: relative;
    display: flex;

    transform: translate3d(0px, -4px, 0px);
    grid-column: 4;
    align-self: start;
    justify-self: end;
    width: 32px;
    height: 32px;
    transition: 0.13s ease-in-out;
    svg {
      width: 32px;
      height: 32px;
      fill: #aaaaaa;
    }
  }
  &__text {
    position: relative;

    transform: translate3d(0px, -4px, 0px);
    margin: 0;
    align-self: end;
    grid-column: 1/5;
    grid-row: 2;

    text-align: center;
    font-size: 32px;
    background-color: #888888;
    color: transparent;
    text-shadow: 2px 2px 3px rgba(255, 255, 255, 0.5);
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
    transition: 0.5s ease-in-out;
  }
`;

const ButtonDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 2.5%;
  left: 3.5%;
  width: 93%;
  height: 25%;
  border: solid 5px;
  border-radius: 8px;
  border-color: #f5eeea;
`;

const Params = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 28.75%;
  left: 3.5%;
  width: 93%;
  height: 38%;
  border: solid 5px;
  border-radius: 8px;
  border-color: #f5eeea;
`;
