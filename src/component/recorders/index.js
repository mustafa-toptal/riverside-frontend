import React, { useEffect, useState } from "react";
import { Alert, Box, Grid } from "@mui/material";
import { VideoStreamMerger } from "video-stream-merger";

import { ScreenRecorder } from "./screen";
import { VideoRecorder } from "./video";
import { AudioRecorder } from "./audio";
import { ScreenVideo } from "./screen-video";

export function Recorders() {
  const [recorderType, setRecorderType] = useState("");
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audio, setAudio] = useState(null);
  const [stream, setStrem] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setError] = useState(false);
  const [screenStream, setScreenStream] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [mergedStream, setMergedStream] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [audioInput] = useState("audioinput");
  const [videoInput] = useState("videoinput");

  useEffect(() => {
    let audioDevices = [];
    let videoDevices = [];
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(() => {
        navigator.mediaDevices
          .enumerateDevices()
          .then((data) => {
            for (let i = 0; i < data.length; i++) {
              const device = data[i];
              if (device.kind === audioInput) {
                audioDevices.push(device);
              } else if (device.kind === videoInput) {
                videoDevices.push(device);
              }
            }
            setAudioDevices(audioDevices);
            setVideoDevices(videoDevices);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        console.log("err: ", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (recorderType === "ScreenVideo") {
      setShowInfo(true);
    } else {
      setShowInfo(false);
    }
  }, [recorderType]);
  async function setupStream() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setStrem(stream);
      const audio = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });
      setAudio(audio);
      setRecorderType("screen");
    } catch (err) {
      setRecorderType("screen");
      setError(true);
      setErrorMessage(`${err}`);
    }
  }

  async function setupScreenAndCamera() {
    setShowInfo(true);
    function roundedImage(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
      );
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    let merger = new VideoStreamMerger();
    const screenMediaOptions = {
      video: {
        width: 1920,
        height: 1080,
        aspectRatio: 1920 / 1080,
        cursor: "never",
        frameRate: 25,
      },
      audio: false,
    };

    const cameraMediaOptions = {
      video: {
        width: 300,
        height: 300,
      },
      audio: true,
    };
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia(
        screenMediaOptions
      );
      const cameraStream = await navigator.mediaDevices.getUserMedia(
        cameraMediaOptions
      );
      // Add the screen capture. Position it to fill the whole stream (the default)
      merger.width = 1920;
      merger.height = 1080;
      merger.addStream(screenStream, {
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

      setCameraStream(cameraStream);
      setScreenStream(screenStream);
      setMergedStream(merger.result);
      setRecorderType("ScreenVideo");
    } catch (err) {
      setError(true);
      setErrorMessage(`${err}`);
      setRecorderType("ScreenVideo");
      console.error("Error: " + err);
    }
  }

  const isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(
      !window["safari"] ||
        (typeof safari !== "undefined" && window["safari"].pushNotification)
    );

  return (
    <>
      {isSafari && showInfo && (
        <Alert
          severity="info"
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "fixed",
            width: "100%",
          }}
        >
          While using Safari don't minimize the browser for better user
          experience.
        </Alert>
      )}

      <Grid
        container
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            width: "850px",
            marginTop: "80px",
          }}
        >
          <Box
            sx={{
              width: "150px",
              height: "150px",
              borderRadius: "10px",
              border: "0.13452375rem dashed #C6CCD9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                cursor: "pointer",
                backgroundColor: "#afb0b3",
                border: "#FFFFF 5px solid",
              },
            }}
            onClick={() => setupStream()}
          >
            Screen
          </Box>
          <Box
            sx={{
              width: "150px",
              height: "150px",
              borderRadius: "10px",
              border: "0.13452375rem dashed #C6CCD9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                cursor: "pointer",
                backgroundColor: "#afb0b3",
                border: "#FFFFF 5px solid",
              },
            }}
            onClick={() => setRecorderType("audio")}
          >
            Audio
          </Box>
          <Box
            sx={{
              width: "150px",
              height: "150px",
              borderRadius: "10px",
              border: "0.13452375rem dashed #C6CCD9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                cursor: "pointer",
                backgroundColor: "#afb0b3",
                border: "#FFFFF 5px solid",
              },
            }}
            onClick={() => setRecorderType("video")}
          >
            Video
          </Box>
          <Box
            sx={{
              width: "150px",
              height: "150px",
              borderRadius: "10px",
              border: "0.13452375rem dashed #C6CCD9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                cursor: "pointer",
                backgroundColor: "#afb0b3",
                border: "#FFFFF 5px solid",
              },
              // textDecoration: "line-through",
            }}
            onClick={() => setupScreenAndCamera()}
          >
            Screen & Video
          </Box>
        </Box>
      </Grid>
      {recorderType === "screen" && (
        <ScreenRecorder
          audioDevices={audioDevices}
          audio={audio}
          stream={stream}
          isError={isError}
          errorMessage={errorMessage}
        />
      )}
      {recorderType === "video" && (
        <VideoRecorder
          audioDevices={audioDevices}
          videoDevices={videoDevices}
        />
      )}
      {recorderType === "audio" && (
        <AudioRecorder audioDevices={audioDevices} />
      )}
      {recorderType === "ScreenVideo" && (
        <ScreenVideo
          mergedStream={mergedStream}
          screenStream={screenStream}
          cameraStream={cameraStream}
          isError={isError}
          errorMessage={errorMessage}
        />
      )}
    </>
  );
}
