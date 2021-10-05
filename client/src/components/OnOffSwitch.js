import React from "react";
import styled from "styled-components";
import "./OnOffSwitch.css";

export default function OnOffSwitch({ handleMic }) {
  return (
    <Wrapper>
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
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding-right: 30px;
`;
