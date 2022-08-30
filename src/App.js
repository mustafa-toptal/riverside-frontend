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
