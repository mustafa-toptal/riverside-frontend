import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";

import { ScreenRecorder } from "./screen";
import { VideoRecorder } from "./video";
import { AudioRecorder } from "./audio";

export function Recorders() {
  const [recorderType, setRecorderType] = useState("");
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
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
            onClick={() => setRecorderType("screen")}
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
          >
            Screen & Video
          </Box>
        </Box>
      </Grid>
      {recorderType === "screen" && (
        <ScreenRecorder audioDevices={audioDevices} />
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
    </>
  );
}
