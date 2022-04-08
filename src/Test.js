import { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import { VideoStreamMerger } from "video-stream-merger";

export default function VideoRecord(props) {
  const [isLoading, setIsLoading] = useState(true);

  var merger = new VideoStreamMerger();

  let cameraElem = useRef(null);
  var mediaRecorder;
  var recordedChunks = [];
  var videoStream;
  var cameraStream;
  var combinedStream;
  var BLOB;

  useEffect(() => {
    async function onLoad() {
      try {
        //some code
      } catch (e) {
        alert(e);
      }
      setIsLoading(false);
    }
    console.log("cameraElem: ", cameraElem);
    onLoad();
  }, []);

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
      // Add the screen capture. Position it to fill the whole stream (the default)
      merger.addStream(videoStream, {
        x: 0, // position of the topleft corner
        y: 0,
        width: merger.width,
        height: merger.height,
        mute: true, // we don't want sound from the screen (if there is any)
      });

      // Add the webcam stream. Position it on the bottom left and resize it to 100x100.
      merger.addStream(cameraStream, {
        x: 20,
        y: merger.height - 180,
        width: 150,
        height: 150,
        mute: false,
      });

      // Start the merging. Calling this makes the result available to us
      merger.start();

      // We now have a merged MediaStream!

      console.log("merger.result: ", merger.result, cameraElem);
      cameraElem.current.srcObject = merger.result;
      cameraElem.current.play();
      // videoElem.srcObject = videoStream;
      startRec();
    } catch (err) {
      console.error("Error: " + err);
    }
  }

  function handleDataAvailable(event) {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  }

  const stopRecording = () => {
    createBlob();
  };

  function startRec() {
    var options = { mimeType: "video/webm; codecs=vp9" };
    if (cameraStream && videoStream) {
      combinedStream = new MediaStream([
        ...cameraStream.getTracks(),
        ...videoStream.getTracks(),
      ]);
      mediaRecorder = new MediaRecorder(combinedStream, options);
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.onstop = stopRecording;
      mediaRecorder.start(300);
    }
  }

  function createBlob() {
    BLOB = new Blob(recordedChunks, {
      type: "video/webm",
    });

    var url = URL.createObjectURL(BLOB);

    // videoElem.srcObject = null;
    // videoElem.src = url;
    // videoElem.muted = false;
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
      <video
        id="camera"
        autoPlay
        muted
        ref={cameraElem}
        width="100%"
        height={"100%"}
      ></video>
      {renderPage()}
    </div>
  );
}
