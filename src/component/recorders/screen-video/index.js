import { useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import { VideoStreamMerger } from "video-stream-merger";

export const ScreenVideo = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [recordingAvailable, setRecordingAvailable] = useState(false);

  var merger = new VideoStreamMerger();

  let cameraElem = useRef(null);
  let recordedVideo = useRef(null);

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

  var screenMediaOptions = {
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
          const x = 20;
          const y = merger.height - 180;
          const width = 100;
          const height = 150;
          ctx.save();
          roundedImage(ctx, x, y, width, height, 10);
          ctx.strokeStyle = "#fff";
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(frame, x, y, width, height);
          ctx.restore();
          done();
        },
        x: 20,
        y: merger.height - 180,
        width: 100,
        height: 150,
        mute: false,
      });

      // Start the merging. Calling this makes the result available to us
      merger.start();
      var options = { mimeType: "video/webm; codecs=vp9" };
      // We now have a merged MediaStream!
      mediaRecorder = new MediaRecorder(merger.result, options);
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.onstop = stopRecording;
      mediaRecorder.start(300);

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
    // var options = { mimeType: "video/webm; codecs=vp9" };
    // if (cameraStream && videoStream) {
    //   combinedStream = new MediaStream([
    //     ...cameraStream.getTracks(),
    //     ...videoStream.getTracks(),
    //   ]);
    //   mediaRecorder = new MediaRecorder(combinedStream, options);
    //   mediaRecorder.ondataavailable = handleDataAvailable;
    //   mediaRecorder.onstop = stopRecording;
    //   mediaRecorder.start(300);
    // }
  }

  function createBlob() {
    BLOB = new Blob(recordedChunks, {
      type: "video/webm",
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

  const startRecord = () => {};

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

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        marginTop: "35px",
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
      {renderPage()}
    </Box>
  );
};
