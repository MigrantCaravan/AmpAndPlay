import React from "react";
import "./OnOffSwitch.css";
import * as Tone from "tone";

export default function OnOffSwitch({ handleMic }) {
  return (
    <div>
      <div className="mid">
        <label className="rocker rocker-small">
          <input
            onChange={() => {
              console.log("start");
            }}
            onClick={handleMic}
            type="checkbox"
          />
          <span className="switch-left">ON</span>
          <span className="switch-right">OFF</span>
        </label>
      </div>
    </div>
  );
}
