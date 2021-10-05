import React from "react";

export default function Wave() {
  function showSoundWave() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(function (stream) {
        let audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        let gainNode = audioContext.createGain();
        let src = audioContext.createMediaStreamSource(stream);

        src.connect(gainNode);
        gainNode.connect(audioContext.destination);
        gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0);

        let analyser = audioContext.createAnalyser();

        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");

        src.connect(analyser);
        gainNode.connect(analyser);

        let bufferLength = analyser.frequencyBinCount;
        let dataArray = new Float32Array(bufferLength);
        let WIDTH = canvas.width;
        let HEIGHT = canvas.height;

        function draw() {
          let drawVisual = requestAnimationFrame(draw);
          analyser.getFloatTimeDomainData(dataArray);

          ctx.fillStyle = "#33304a";
          ctx.fillRect(0, 0, WIDTH, HEIGHT);
          ctx.lineWidth = 2;
          ctx.strokeStyle = "rgb(255, 255, 255)";
          ctx.beginPath();

          let sliceWidth = (WIDTH * 1.0) / bufferLength;
          let x = 0;

          for (var i = 0; i < bufferLength; i++) {
            let v = dataArray[i] * 50;
            let y = HEIGHT / 2 + v;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
            x += sliceWidth;
          }
          ctx.lineTo(canvas.width, canvas.height / 2);
          ctx.stroke();
        }
        draw();
      })
      .catch(function (err) {
        console.log("error:");
        console.log(err);
      });
  }

  showSoundWave();

  return (
    <div>
      <canvas className="canvas" id="canvas"></canvas>
    </div>
  );
}
