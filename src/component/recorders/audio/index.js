import React, { useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";

import VideoActions from "../../common/VideoActions";
import AudioAnalyser from "./partials/AudioAnalyser";

export const AudioRecorder = (props) => {
  const [recordingAvailable, setRecordingAvailabe] = useState(false);
  const [stream, setStrem] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioDevideId, setAudioDeviceId] = useState("");

  let recordedVideo = useRef(null);

  let chunks = [];

  useEffect(() => {
    setupStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (audioDevideId) {
      setupStream(audioDevideId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioDevideId]);

  async function setupStream(audioDevideId) {
    let constraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
    };
    if (audioDevideId) {
      constraints.audio.deviceId = audioDevideId;
    }
    console.log("constraints: ", constraints);
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setStrem(stream);
    } catch (err) {
      console.error(err);
    }
  }

  async function startRecording(e) {
    e.preventDefault();
    if (stream) {
      let recorder = new MediaRecorder(stream);
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
  }

  function handleDataAvailable(e) {
    chunks.push(e.data);
  }

  function handleStop(e) {
    const blob = new Blob(chunks, { type: "video/mp4" });
    chunks = [];
    recordedVideo.current.src = URL.createObjectURL(blob);
    recordedVideo.current.load();
    setRecordingAvailabe(true);

    stream.getTracks().forEach((track) => track.stop());
    stopRecording();
    console.log("Recording stopped");
  }

  const muteAudio = () => {
    const audioTrack = stream.getTracks();
    const newState = !audioTrack[0].enabled;
    audioTrack[0].enabled = newState;
    setIsMuted((muted) => !muted);
  };

  const pauseScreen = () => {
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
      {stream && <AudioAnalyser audio={stream} />}
      <audio
        className="recorded-video"
        controls
        ref={recordedVideo}
        style={{ display: recordingAvailable ? "block" : "none" }}
      />

      {!isRecording && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
          <select
            className="deviceDropDown"
            onChange={(e) => {
              setAudioDeviceId(e.target.value);
            }}
          >
            {props.audioDevices &&
              props.audioDevices.map((device) => {
                return (
                  <option value={device.deviceId} key={device.deviceId}>
                    {device.label}
                  </option>
                );
              })}
          </select>
        </Box>
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