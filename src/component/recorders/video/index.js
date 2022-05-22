import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

import Recorder from "../../common/Recorder";

const RESOLUTIONS = {
  "720P": {
    width: 1280,
    height: 720,
  },

  "1080P": {
    width: 1920,
    height: 1080,
  },

  "4K": {
    width: 4096,
    height: 2160,
  },
};

export const VideoRecorder = (props) => {
  const [recordingAvailable, setRecordingAvailabe] = useState(false);
  const [stream, setStrem] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoDeviceId, setVideoDeviceId] = useState("");
  const [audioDeviceId, setAudioDeviceId] = useState("");
  const [audioLabelName, setAudioLabelName] = useState("");
  const [videoResolution, setVideoResolution] = useState("720P");
  const [videoLabelName, setVideoLabelName] = useState("");

  let recordedVideo = useRef(null);
  let videoRef = useRef(null);

  let chunks = [];

  useEffect(() => {
    setupStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (videoDeviceId || audioDeviceId) {
      setupStream(videoDeviceId, audioDeviceId);
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

  async function setupStream(videoDeviceId, audioDeviceId, resolution) {
    let constraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
      video: {
        ...RESOLUTIONS[resolution ? resolution : videoResolution],
        deviceId: props.videoDevices[0].deviceId,
        // width: 320,
        // height: 180,
      },
    };
    if (videoDeviceId) {
      constraints.video = {
        ...constraints.video,
        deviceId: videoDeviceId,
      };
    }
    if (audioDeviceId) {
      constraints.audio.deviceId = audioDeviceId;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setStrem(stream);
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

    recordedVideo.current.src = URL.createObjectURL(blob);
    recordedVideo.current.load();
    setRecordingAvailabe(true);

    stream.getTracks().forEach((track) => track.stop());
    stopRecording();
    console.log("Recording stopped");
  }

  const download = async () => {
    let elem = document.createElement("a");
    elem.href = recordedVideo.current.src;
    elem.download = `Riverside_${new Date().getTime()}.mp4`;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  };

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

  const changeResolution = async (res) => {
    setVideoResolution(res);
    setupStream(videoDeviceId, audioDeviceId, res);
  };
  console.log(videoResolution);
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
        audioDeviceId={audioDeviceId}
        startRecording={startRecording}
        setVideoDeviceId={setVideoDeviceId}
        retake={props.retake}
        videoDevices={props.videoDevices}
        audioDevices={props.audioDevices}
        isRecording={isRecording}
        recordingAvailable={recordingAvailable}
        videoRef={videoRef}
        recordedVideoRef={recordedVideo}
        downloadVideo={download}
        addHeight
        audioLabelName={audioLabelName}
        setAudioLabelName={setAudioLabelName}
        videoLabelName={videoLabelName}
        setVideoLabelName={setVideoLabelName}
        isVideo={true}
        videoResolution={videoResolution}
        setVideoResolution={changeResolution}
      />
    </Box>
  );
};
