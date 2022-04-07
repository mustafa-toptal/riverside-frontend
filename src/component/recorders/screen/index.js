import React, { useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";

import VideoActions from "./partials/VideoActions";

export const ScreenRecorder = (porps) => {
  const [recordingAvailable, setRecordingAvailabe] = useState(false);
  const [audio, setAudio] = useState(null);
  const [stream, setStrem] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  let recordedVideo = useRef(null);
  let videoRef = useRef(null);

  let mixedStream = null,
    chunks = [],
    // recorder = null,
    audioTrack = null;

  useEffect(() => {
    setupStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setupVideoFeedback(stream);
    } catch (err) {
      console.error(err);
    }
  }

  function setupVideoFeedback(stream) {
    if (stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } else {
      console.warn("No stream available");
    }
  }

  async function startRecording(e) {
    e.preventDefault();
    if (stream && audio) {
      audioTrack = audio.getTracks();
      mixedStream = new MediaStream([...stream.getTracks(), ...audioTrack]);
      let recorder = new MediaRecorder(mixedStream);
      recorder.ondataavailable = handleDataAvailable;
      recorder.onstop = handleStop;
      recorder.start(1000);
      setRecorder(recorder);
      setIsRecording(true);
      console.log("Recording started");
    } else {
      console.warn("No stream available.");
    }
  }

  function stopRecording() {
    recorder.stop();
    setIsRecording(false);
    // startButton.disabled = false;
    // stopButton.disabled = true;
  }

  function handleDataAvailable(e) {
    chunks.push(e.data);
  }

  function handleStop(e) {
    const blob = new Blob(chunks, { type: "video/mp4" });
    chunks = [];

    // downloadButton.href = URL.createObjectURL(blob);
    // downloadButton.download = "video.mp4";
    // downloadButton.disabled = false;

    recordedVideo.current.src = URL.createObjectURL(blob);
    recordedVideo.current.load();
    // recordedVideo.onloadeddata = function () {
    //   //   const rc = document.querySelector(".recorded-video-wrap");
    //   //   rc.classList.remove("hidden");
    //   //   rc.scrollIntoView({ behavior: "smooth", block: "start" });
    //   recordedVideo.play();
    // };
    setRecordingAvailabe(true);

    stream.getTracks().forEach((track) => track.stop());
    audio.getTracks().forEach((track) => track.stop());
    stopRecording();
    console.log("Recording stopped");
  }

  const muteAudio = () => {
    const audioTrack = audio.getTracks();
    const newState = !audioTrack[0].enabled;
    audioTrack[0].enabled = newState;
    setIsMuted((muted) => !muted);
  };

  const pauseScreen = () => {
    // const streamInstance = stream.getTracks();
    // const newState = !streamInstance[0].enabled;
    // streamInstance[0].enabled = newState;
    if (isPaused) {
      recorder.resume();
      setIsPaused(false);
    } else {
      recorder.pause();
      setIsPaused(true);
    }
  };

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
          className="video-feedback"
          width={"50%"}
          height="50%"
          ref={videoRef}
        />
      )}

      <video
        className="recorded-video"
        controls
        ref={recordedVideo}
        width={"50%"}
        height="50%"
        style={{ display: recordingAvailable ? "block" : "none" }}
      />
      {!isRecording && (
        <Button
          sx={{
            height: "54px",
            width: "54px",
            padding: "0px",
            borderRadius: "50%",
            backgroundColor: "rgb(255, 255, 255)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "all 0.5s ease 0s",
            border: "6px solid rgb(60, 66, 80)",
            pointerEvents: "auto",
            "&:hover": {
              border: "6px solid rgb(255, 84, 84)",
            },
            margin: "15px 15px",
            minWidth: "0",
          }}
          onClick={startRecording}
        >
          <span
            style={{
              height: "20px",
              width: "20px",
              borderRadius: "50%",
              backgroundColor: "rgb(255, 84, 84)",
              borderColor: "rgb(255, 84, 84)",
              transition: "all 0.5s ease 0s",
            }}
          ></span>
        </Button>
      )}
      {isRecording && (
        <VideoActions
          stop={stopRecording}
          mute={muteAudio}
          pause={pauseScreen}
          isPaused={isPaused}
          isMuted={isMuted}
        />
      )}
    </Box>
  );
};
