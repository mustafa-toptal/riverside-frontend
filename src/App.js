import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AudioConverter from "./component/converter";
import Transcription from "./component/transcription";
// import Test from "./Test";

import "./styles/App.css";
import { Recorders } from "./component/recorders";
import Compressor from "./component/compressor";

function App() {
  useEffect(() => {
    window.addEventListener(
      "dragover",
      function (e) {
        e.preventDefault();
      },
      false
    );
    window.addEventListener(
      "drop",
      function (e) {
        e.preventDefault();
      },
      false
    );
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="transcription" element={<Transcription />} />
        <Route path="converter" element={<AudioConverter />} />
        <Route path="recorder" element={<Recorders />} />
        <Route path="audio-recorder" element={<Recorders title={"Audio Recorder Online"} subtitle = "Record high-quality audio with Riverside’s remote audio recording software. Easy, reliable recording from anywhere."/>} />
        {/* <Route path="webcam-recorder" element={<Recorders title={"Webcam Recorder Online"} subtitle = "Record high-quality video with Riverside’s remote video recording software. Easy, reliable recording from anywhere."/>} />
        <Route path="screen-recorder" element={<Recorders title={"Screen Recorder Online"} subtitle = "Record high-quality screen with Riverside’s remote screen recording software. Easy, reliable recording from anywhere."/>} />
        <Route path="screen-webcam-recorder" element={<Recorders title={<>Screen & Webcam <br/> Recorder Online</>} subtitle = "Record high-quality audio with Riverside’s remote audio recording software. Easy, reliable recording from anywhere."/>} /> */}

        <Route path="compressor" element={<Compressor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// const { status, startRecording, stopRecording, mediaBlobUrl } =
// useReactMediaRecorder({ video: true });

// {/* <div> */}
// {/* <h1>{status}</h1>

// <Button onClick={startRecording}>Start</Button>
// <Button onClick={stopRecording}>Stop</Button>
// {mediaBlobUrl && <Button onClick={download}>download</Button>} */}
// {/* </div>  */}

// const download = async () => {
//   let targetAudioFormat = "mp4";
//   let blob = await fetch(mediaBlobUrl).then((r) => r.blob());
//   console.log("blob: ", blob);
//   blob.name = "mustafaa.mp3";
//   let convertedAudio = await convert(blob, targetAudioFormat);
//   let elem = document.createElement("a");
//   elem.href = convertedAudio.data;
//   elem.download = convertedAudio.name + "." + convertedAudio.format;
//   document.body.appendChild(elem);
//   elem.click();
//   document.body.removeChild(elem);
// };
