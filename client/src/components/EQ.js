// import React from "react";
// import { TextButton, Dial } from "react-nexusui";
// import styled from "styled-components";
// import { useState } from "react";
// import { useEffect } from "react";
// // import * as Tone from "tone";

// export default function EQ() {
//   const context = new AudioContext();
//   const [value, setValue] = useState();
//   const gainNode = new GainNode(context, { gain: value });
//   setupContext();

//   function setupEventListeners(e) {
//     const value = parseFloat(e.target.value);
//     setValue(value);
//     gainNode.gain.setTargetAtTime(value, context.currentTime, 0.01);
//     console.log(value);
//   }

//   async function setupContext() {
//     const guitar = await getGuitar();
//     if (context.state === "suspended") {
//       await context.resume();
//     }
//     const source = context.createMediaStreamSource(guitar);
//     source.connect(gainNode).connect(context.destination);
//   }

//   function getGuitar() {
//     return navigator.mediaDevices.getUserMedia({
//       audio: {
//         echoCancellation: false,
//         autoGainControl: false,
//         noiseSuppression: false,
//         latency: 0,
//       },
//     });
//   }

//   useEffect(() => {});

//   function drawVisualiser(params) {}

//   return (
//     <>
//       <div className="EQ">
//         <Grid className="grid">
//           <label htmlFor="">Volume</label>
//           <input
//             onChange={(e) => {
//               setupEventListeners(e);
//             }}
//             type="range"
//             id="volume"
//             min="0"
//             max="1"
//             defaultValue="0.5"
//             step=".01"
//           />
//           {/* <label htmlFor="">Treble</label>
//           <input type="range" id="treble" min="-10" max="10" defaultValue="0" />
//           <label htmlFor="">Mid</label>
//           <input type="range" id="mid" min="-10" max="10" defaultValue="0" />
//           <label htmlFor="">Bass</label>
//           <input type="range" id="bass" min="-10" max="10" defaultValue="0" />
//           <Dial /> */}
//         </Grid>
//       </div>
//     </>
//   );
// }

// const Grid = styled.div`
//   display: grid;
//   grid-template-columns: auto min-content;
//   justify-content: center;
//   justify-items: end;
//   align-items: center;
//   gap: 5px 10px;
// `;
