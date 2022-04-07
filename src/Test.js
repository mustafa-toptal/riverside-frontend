import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import $ from "jquery";

export default function VideoRecord(props) {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function onLoad() {
      try {
        //some code
      } catch (e) {
        alert(e);
      }
      setIsLoading(false);
    }

    onLoad();
  }, []);

  var mediaRecorder;
  var recordedChunks = [];
  var videoStream;
  var cameraStream;
  var combinedStream;
  var BLOB;
  var cameraElem;
  var videoElem;

  $(function () {
    cameraElem = document.querySelector("#camera");
    videoElem = document.querySelector("#video");
  });

  var videoMediaOptions = {
    video: {
      width: 720,
      height: 480,
      aspectRatio: 1920 / 1080,
      cursor: "never",
      frameRate: 30,
    },
    audio: false,
  };

  var cameraMediaOptions = {
    video: {
      width: 300,
      height: 300,
    },
    audio: true,
  };

  async function startCapture() {
    try {
      videoStream = await navigator.mediaDevices.getDisplayMedia(
        videoMediaOptions
      );
      cameraStream = await navigator.mediaDevices.getUserMedia(
        cameraMediaOptions
      );
      cameraElem.srcObject = cameraStream;
      videoElem.srcObject = videoStream;
      startRec();
    } catch (err) {
      console.error("Error: " + err);
    }
  }

  function handleDataAvailable(event) {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
      createBlob();
    }
  }

  function startRec() {
    var options = { mimeType: "video/webm; codecs=vp9" };
    combinedStream = new MediaStream([
      ...cameraStream.getTracks(),
      ...videoStream.getTracks(),
    ]);
    mediaRecorder = new MediaRecorder(combinedStream, options);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(300);
  }

  function createBlob() {
    BLOB = new Blob(recordedChunks, {
      type: "video/webm",
    });

    var url = URL.createObjectURL(BLOB);

    videoElem.srcObject = null;
    videoElem.src = url;
    videoElem.muted = false;
  }

  function stopCapture() {
    let cameraTracks = cameraStream.getTracks();
    cameraTracks.forEach((cameraTracks) => cameraTracks.stop());

    let tracks = videoStream.getTracks();
    tracks.forEach((track) => track.stop());
    mediaRecorder.stop();
  }

  function renderPage() {
    return (
      <div className="videoWrapper">
        <video preload="auto" id="video"></video>
        <video id="camera" autoPlay muted></video>
        <Button id="startBtn" onClick={startCapture}>
          Start
        </Button>
        <Button id="stopBtn" onClick={stopCapture}>
          Stop
        </Button>
      </div>
    );
  }

  return (
    <div id="videoRecordID" className="VideoRecord">
      {isLoading && <div>Loading...</div>}
      {!isLoading && renderPage()}
    </div>
  );
}
