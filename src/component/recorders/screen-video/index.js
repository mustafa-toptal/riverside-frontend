import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

import Recorder from "../../common/Recorder";

export const ScreenVideo = (props) => {
  const [recordingAvailable, setRecordingAvailabe] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [audioDeviceId, setAudioDeviceId] = useState("");
  const [videoDeviceId, setVideoDeviceId] = useState("");
  const [stream, setStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setError] = useState(false);
  const [audioLabelName, setAudioLabelName] = useState("");
  const [videoLabelName, setVideoLabelName] = useState("");

  let recordedVideoRef = useRef(null);
  let videoRef = useRef(null);

  let chunks = [];

  useEffect(() => {
    setStream(props.mergedStream);
    setupVideoFeedback(props.mergedStream);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mergedStream]);

  useEffect(() => {
    setCameraStream(props.cameraStream);
  }, [props.cameraStream]);

  useEffect(() => {
    setScreenStream(props.screenStream);
  }, [props.screenStream]);

  useEffect(() => {
    setError(props.isError);
    setErrorMessage(props.errorMessage);
  }, [props.isError, props.errorMessage]);

  useEffect(() => {
    if (videoDeviceId !== "" || audioDeviceId !== "") {
      props.changeDevice(videoDeviceId, audioDeviceId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoDeviceId, audioDeviceId]);

  useEffect(() => {
    if (
      props.audioDevices &&
      props.audioDevices.length &&
      audioLabelName === ""
    ) {
      setAudioLabelName(props.audioDevices[0].label);
    }

    if (
      props.videoDevices &&
      props.videoDevices.length &&
      videoLabelName === ""
    ) {
      setVideoLabelName(props.videoDevices[0].label);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.audioDevices, props.videoDevices]);

  async function setupVideoFeedback(stream) {
    if (stream) {
      try {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } catch (err) {
        console.error("Error: " + err);
      }
    } else {
      setError(true);
      setErrorMessage("No stream available");
      console.warn("No stream available");
    }
  }

  async function startRecording(e) {
    e.preventDefault();

    if (stream) {
      let recorder = new MediaRecorder(stream);
      recorder.ondataavailable = handleDataAvailable;
      recorder.onstop = handleStop;
      recorder.start(300);
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
    console.log("recorder: ", recorder);
    recorder.stop();
    setIsRecording(false);
  }

  function handleDataAvailable(e) {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  }

  function handleStop(e) {
    try {
      console.log("chunks: ", chunks);
      const blob = new Blob(chunks, { type: "video/mp4" });
      recordedVideoRef.current.src = URL.createObjectURL(blob);
      recordedVideoRef.current.load();

      setRecordingAvailabe(true);

      let cameraTracks = cameraStream.getTracks();
      cameraTracks.forEach((cameraTracks) => cameraTracks.stop());

      let tracks = screenStream.getTracks();
      tracks.forEach((track) => track.stop());
      stopRecording();
      console.log("Recording stopped");
    } catch (err) {
      console.log("err: ", err);
    }
  }

  const muteAudio = () => {
    const audioTrack = cameraStream.getTracks();
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
    elem.href = recordedVideoRef.current.src;
    elem.download = `Riverside_${new Date().getTime()}.mp4`;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
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
        setVideoDeviceId={setVideoDeviceId}
        retake={props.retake}
        videoDevices={props.videoDevices}
        audioDevices={props.audioDevices}
        isRecording={isRecording}
        recordingAvailable={recordingAvailable}
        videoRef={videoRef}
        recordedVideoRef={recordedVideoRef}
        downloadVideo={download}
        isError={isError}
        errorMessage={errorMessage}
        audioLabelName={audioLabelName}
        setAudioLabelName={setAudioLabelName}
        videoLabelName={videoLabelName}
        setVideoLabelName={setVideoLabelName}
      />
    </Box>
  );
};
