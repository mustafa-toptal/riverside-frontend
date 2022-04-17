import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";

import { ScreenRecorder } from "./screen";
import { VideoRecorder } from "./video";
import { AudioRecorder } from "./audio";
// import { ScreenVideo } from "./screen-video";

export function Recorders() {
  const [recorderType, setRecorderType] = useState("");
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audio, setAudio] = useState(null);
  const [stream, setStrem] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setError] = useState(false);
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

  async function setupStream() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setStrem(stream);
      const audio = await navigator.mediaDevicdes.getUserMedia({
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

  return (
    <>
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
              textDecoration: "line-through",
            }}
            onClick={() => setRecorderType("screenVideo")}
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
      {/* {recorderType === "screenVideo" && <ScreenVideo />} */}
    </>
  );
}
