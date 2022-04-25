import React, { useEffect, useRef, useState } from "react";
import { Alert, AlertTitle, Box, Button } from "@mui/material";

import VideoActions from "../../common/VideoActions";
import { DownloadButton } from "../../common/partials/DownloadButton";

export const ScreenVideo = (props) => {
  const [recordingAvailable, setRecordingAvailabe] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [audioDevideId, setAudioDeviceId] = useState("");
  const [videoDeviceId, setVideoDeviceId] = useState("");
  const [stream, setStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setError] = useState(false);

  let recordedVideo = useRef(null);
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
    if (videoDeviceId !== "" || audioDevideId !== "") {
      props.changeDevice(videoDeviceId, audioDevideId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoDeviceId, audioDevideId]);

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
      recordedVideo.current.src = URL.createObjectURL(blob);
      recordedVideo.current.load();

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
          muted
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
        <Box
          marginY={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <DownloadButton onClick={download} />
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
            onClick={() => props.retake()}
          >
            Retake
          </Button>
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <select
            className="deviceDropDown"
            onChange={(e) => {
              setVideoDeviceId(e.target.value);
            }}
          >
            {props.videoDevices &&
              props.videoDevices.map((device) => {
                return (
                  <option value={device.deviceId} key={device.deviceId}>
                    {device.label}
                  </option>
                );
              })}
          </select>
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
