import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

import Recorder from "../../common/Recorder";

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
  const [audioDevideId, setAudioDeviceId] = useState("");
  const [audioLabelName, setAudioLabelName] = useState("");

  let recordedVideo = useRef(null);
  let videoRef = useRef(null);

  let mixedStream = null,
    chunks = [],
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

  useEffect(() => {
    if (audioDevideId !== "") {
      props.changeAudioDevice(audioDevideId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioDevideId]);

  useEffect(() => {
    if (
      props.audioDevices &&
      props.audioDevices.length &&
      audioLabelName === ""
    ) {
      setAudioLabelName(props.audioDevices[0].label);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.audioDevices, props.videoDevices]);

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
    elem.download = `Riverside_${new Date().getTime()}.mp4`;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  };

  const onRetakeClick = () => {
    props.retake();
    setIsPaused(false);
    setIsMuted(false);
    setIsRecording(false);
    setRecordingAvailabe(false);
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
      <Recorder
        stop={stopRecording}
        mute={muteAudio}
        pause={pauseScreen}
        isPaused={isPaused}
        isMuted={isMuted}
        setAudioDeviceId={setAudioDeviceId}
        startRecording={startRecording}
        retake={onRetakeClick}
        videoDevices={props.videoDevices}
        audioDevices={props.audioDevices}
        isRecording={isRecording}
        recordingAvailable={recordingAvailable}
        videoRef={videoRef}
        recordedVideoRef={recordedVideo}
        downloadVideo={download}
        isError={isError}
        errorMessage={errorMessage}
        isScreenOnly={true}
        audioLabelName={audioLabelName}
        setAudioLabelName={setAudioLabelName}
      />
    </Box>
  );
};
