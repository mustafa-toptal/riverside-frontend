import { useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import { VideoStreamMerger } from "video-stream-merger";
import VideoActions from "../../common/VideoActions";

export const ScreenVideo = (props) => {
  // const [isLoading, setIsLoading] = useState(true);
  const [recordingAvailable, setRecordingAvailable] = useState(false);
  const [isError, setError] = useState(false);
  const [mediaRecorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  var merger = new VideoStreamMerger();

  // const bottomLeft = {};

  let cameraElem = useRef(null);
  let recordedVideo = useRef(null);

  var recordedChunks = [];
  var videoStream;
  var cameraStream;
  var BLOB;

  useEffect(() => {
    async function onLoad() {
      try {
        //some code
      } catch (e) {
        alert(e);
      }
      // setIsLoading(false);
    }
    onLoad();
  }, []);

  var screenMediaOptions = {
    video: {
      width: 1920,
      height: 1080,
      aspectRatio: 1920 / 1080,
      cursor: "never",
      frameRate: 25,
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

  function roundedImage(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  async function startCapture() {
    try {
      videoStream = await navigator.mediaDevices.getDisplayMedia(
        screenMediaOptions
      );
      cameraStream = await navigator.mediaDevices.getUserMedia(
        cameraMediaOptions
      );
      // Add the screen capture. Position it to fill the whole stream (the default)
      console.log("merger: ", merger.width);
      merger.width = 1920;
      merger.height = 1080;
      merger.addStream(videoStream, {
        x: 0, // position of the topleft corner
        y: 0,
        width: merger.width,
        height: merger.height,
        mute: true, // we don't want sound from the screen (if there is any)
      });

      // Add the webcam stream. Position it on the bottom left and resize it to 100x100.
      merger.addStream(cameraStream, {
        draw: (ctx, frame, done) => {
          const x = 50;
          const y = merger.height - 280;
          const width = 200;
          const height = 250;
          ctx.save();
          roundedImage(ctx, x, y, width, height, 20.5333);
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 8;
          ctx.stroke();
          // ctx.scale(-1, 1);
          ctx.clip();
          ctx.drawImage(frame, x, y, width, height);
          ctx.restore();
          done();
        },
        x: 50,
        y: merger.height - 280,
        width: 100,
        height: 150,
        mute: false,
      });

      // Start the merging. Calling this makes the result available to us
      merger.start();
      // var options = { mimeType: "video/webm; codecs=vp9" };
      // We now have a merged MediaStream!
      // mediaRecorder = new MediaRecorder(merger.result);
      // mediaRecorder.ondataavailable = handleDataAvailable;
      // mediaRecorder.onstop = stopRecording;
      // mediaRecorder.start(300);

      cameraElem.current.srcObject = merger.result;
      cameraElem.current.play();
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

  function createBlob() {
    BLOB = new Blob(recordedChunks, {
      type: "video/mp4",
    });

    recordedVideo.current.src = URL.createObjectURL(BLOB);
    recordedVideo.current.load();

    setRecordingAvailable(true);
  }

  function stopCapture() {
    createBlob();
    let cameraTracks = cameraStream.getTracks();
    cameraTracks.forEach((cameraTracks) => cameraTracks.stop());

    let tracks = videoStream.getTracks();
    tracks.forEach((track) => track.stop());
    mediaRecorder.stop();
  }

  const startRecord = () => {
    setIsRecording(true);
    // Start the merging. Calling this makes the result available to us
    merger.start();
    // We now have a merged MediaStream!
    mediaRecorder = new MediaRecorder(merger.result);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = stopRecording;
    mediaRecorder.start(300);

    setRecorder(mediaRecorder);
    cameraElem.current.srcObject = merger.result;
    cameraElem.current.play();
  };

  function renderPage() {
    return (
      <div className="videoWrapper">
        <Button id="startBtn" onClick={startCapture}>
          Start
        </Button>
        <Button id="stopBtn" onClick={stopCapture}>
          Stop
        </Button>
        <Button id="stopBtn" onClick={startRecord}>
          Record
        </Button>
      </div>
    );
  }

  const pauseScreen = () => {
    // const streamInstance = stream.getTracks();
    // const newState = !streamInstance[0].enabled;
    // streamInstance[0].enabled = newState;
    if (isPaused) {
      mediaRecorder.resume();
      setIsPaused(false);
    } else {
      mediaRecorder.pause();
      setIsPaused(true);
    }
  };

  const muteAudio = () => {
    const audioTrack = cameraStream.getTracks();
    const newState = !audioTrack[0].enabled;
    audioTrack[0].enabled = newState;
    setIsMuted((muted) => !muted);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {!recordingAvailable && (
        <video
          id="camera"
          autoPlay
          muted
          ref={cameraElem}
          width="50%"
          height={"50%"}
        ></video>
      )}

      <video
        className="recorded-video"
        controls
        ref={recordedVideo}
        width={"50%"}
        height="50%"
        style={{
          display: recordingAvailable ? "block" : "none",
          borderRadius: "30px",
        }}
      />
      {isRecording && (
        <VideoActions
          stop={stopRecording}
          mute={muteAudio}
          pause={pauseScreen}
          isPaused={isPaused}
          isMuted={isMuted}
        />
      )}
      {!isRecording && renderPage()}
    </Box>
  );
};
