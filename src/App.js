import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AudioConverter from "./component/converter";
import Transcription from "./component/transcription";

import "./styles/App.css";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// <div>

/* <h1>{status}</h1> */

/* <AudioConverter /> */

/* <Button onClick={startRecording}>Start</Button>
      <Button onClick={stopRecording}>Stop</Button>
      {mediaBlobUrl && <Button onClick={download}>download</Button>} */

/* </div> */
