import React, { useEffect, useState } from "react";
import { Alert, Box, Grid } from "@mui/material";
import { VideoStreamMerger } from "video-stream-merger";

import { ScreenRecorder } from "./screen";
import { VideoRecorder } from "./video";
import { AudioRecorder } from "./audio";
import { ScreenVideo } from "./screen-video";
import { useResponsiveQuery } from "../../utils/hooks/useResponsiveQuery";
import { delay, isMobileBrowser } from "../../utils/Helpers";

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

  const isMobile = useResponsiveQuery();

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
    if (recorderType === "screenVideo") {
      setShowInfo(true);
    } else {
      setShowInfo(false);
    }
  }, [recorderType]);

  async function setupStream(audioDevice) {
    try {
      if (!audioDevice) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        setStrem(stream);
      }
      let audioConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      };
      if (audioDevice) {
        audioConstraints.deviceId = audioDevice;
      }
      const audio = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
      });
      setAudio(audio);
      setRecorderType("screen");
      setError(false);
      setErrorMessage(``);
    } catch (err) {
      setRecorderType("screen");
      setError(true);
      setErrorMessage(`${err}`);
    }
  }

  async function setupScreenAndCamera(videoDevice, audioDevice) {
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

    let cameraMediaOptions = {
      video: {
        width: 300,
        height: 300,
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
    };
    if (videoDevice) {
      cameraMediaOptions.video.deviceId = videoDevice;
    }
    if (audioDevice) {
      cameraMediaOptions.audio.deviceId = audioDevice;
    }
    try {
      let localScreenStream = null;
      if (!audioDevice && !videoDevice) {
        localScreenStream = await navigator.mediaDevices.getDisplayMedia(
          screenMediaOptions
        );
      }
      const cameraStream = await navigator.mediaDevices.getUserMedia(
        cameraMediaOptions
      );
      // Add the screen capture. Position it to fill the whole stream (the default)
      merger.width = 1920;
      merger.height = 1080;
      merger.addStream(localScreenStream ? localScreenStream : screenStream, {
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
      setScreenStream(localScreenStream ? localScreenStream : screenStream);
      setMergedStream(merger.result);
      setRecorderType("screenVideo");
      setError(false);
      setErrorMessage(``);
    } catch (err) {
      setError(true);
      setErrorMessage(`${err}`);
      setRecorderType("screenVideo");
      console.error("Error: " + err);
    }
  }

  const changeDevice = (videoDevice, audioDevice) => {
    setupScreenAndCamera(videoDevice, audioDevice);
  };

  const changeAudioDevice = (audioDevice) => {
    setupStream(audioDevice);
  };

  const renderAlert = (message) => {
    return (
      <Alert
        severity="info"
        sx={{
          display: "flex",
          justifyContent: "center",
          position: "fixed",
          width: "100%",
          padding: 0,
        }}
      >
        {message}
      </Alert>
    );
  };
  const isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(
      !window["safari"] ||
        (typeof safari !== "undefined" && window["safari"].pushNotification)
    );

  const retake = async () => {
    const prevState = recorderType;
    setRecorderType("");
    await delay(200);
    if (prevState === "screenVideo") {
      setupScreenAndCamera();
    } else if (prevState === "screen") {
      setupStream();
    }
    setRecorderType(prevState);
  };
  return (
    <>
      {isSafari &&
        showInfo &&
        renderAlert(
          "While using Safari don't minimize the browser for better user experience."
        )}

      {isMobileBrowser &&
        renderAlert("Some features are not available in Mobile Browsers")}
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
          {!isMobileBrowser && (
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
              onClick={() => (recorderType !== "screen" ? setupStream() : "")}
            >
              Screen
            </Box>
          )}
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
          {!isMobileBrowser && (
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
              onClick={() =>
                recorderType !== "screenVideo" ? setupScreenAndCamera() : ""
              }
            >
              Screen & Video
            </Box>
          )}
        </Box>
      </Grid>
      {recorderType === "screen" && (
        <ScreenRecorder
          audioDevices={audioDevices}
          audio={audio}
          stream={stream}
          isError={isError}
          retake={retake}
          errorMessage={errorMessage}
          changeAudioDevice={changeAudioDevice}
        />
      )}
      {recorderType === "video" && (
        <VideoRecorder
          audioDevices={audioDevices}
          videoDevices={videoDevices}
          retake={retake}
        />
      )}
      {recorderType === "audio" && (
        <AudioRecorder audioDevices={audioDevices} retake={retake} />
      )}
      {recorderType === "screenVideo" && (
        <ScreenVideo
          mergedStream={mergedStream}
          screenStream={screenStream}
          cameraStream={cameraStream}
          isError={isError}
          errorMessage={errorMessage}
          audioDevices={audioDevices}
          videoDevices={videoDevices}
          changeDevice={changeDevice}
          retake={retake}
        />
      )}
    </>
  );
}
