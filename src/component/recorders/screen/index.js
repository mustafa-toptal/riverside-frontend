import React, { useEffect, useRef, useState } from "react";
import { Alert, AlertTitle, Box, Button } from "@mui/material";

import VideoActions from "../../common/VideoActions";
import { DownloadButton } from "../../common/partials/DownloadButton";

export const ScreenRecorder = (props) => {
  const [recordingAvailable, setRecordingAvailabe] = useState(false);
  const [audio, setAudio] = useState(null);
  const [stream, setStrem] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setError] = useState(false);

  let recordedVideo = useRef(null);
  let videoRef = useRef(null);

  let mixedStream = null,
    chunks = [],
    // recorder = null,
    audioTrack = null;

  useEffect(() => {
    setStrem(props.stream);
    setupVideoFeedback(props.stream);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.stream]);

  useEffect(() => {
    setAudio(props.audio);
  }, [props.audio]);

  useEffect(() => {
    setError(props.isError);
    setErrorMessage(props.errorMessage);
  }, [props.isError, props.errorMessage]);

  function setupVideoFeedback(stream) {
    if (stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } else {
      setError(true);
      setErrorMessage("No stream available");
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
      setError(true);
      setErrorMessage("No stream available");
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

  const download = async () => {
    let elem = document.createElement("a");
    elem.href = recordedVideo.current.src;
    elem.download = "Recorded Screen.mp4";
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
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
      {!recordingAvailable && !isError && (
        <video
          className="video-feedback"
          width={"50%"}
          height="50%"
          ref={videoRef}
          style={{ borderRadius: "30px" }}
        />
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
      {recordingAvailable && (
        <Box marginY={2}>
          <DownloadButton onClick={download} />
        </Box>
      )}
      {isError && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {errorMessage}
        </Alert>
      )}

      {isError && (
        <Box>
          <Button
            type="primary"
            sx={{
              left: 0,
              background: "#3c4250",
              marginTop: "10px",
              color: "#f5f7fd",
              "&:hover": {
                background: "#3c4250",
              },
            }}
            onClick={() => window.location.reload()}
          >
            Reload
          </Button>
        </Box>
      )}
      {!isRecording && !recordingAvailable && !isError && (
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
