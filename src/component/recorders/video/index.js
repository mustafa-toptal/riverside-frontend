import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

import Recorder from "../../common/Recorder";
import { Service } from "../../../utils/Service";

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
  const service = new Service();

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
    console.log("Recording stopped");
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
    // createImportTask(blob);
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

  const onRetakeClick = () => {
    props.retake();
    setIsPaused(false);
    setIsMuted(false);
    setIsRecording(false);
    setRecordingAvailabe(false);
    setupStream(videoDeviceId, audioDeviceId, videoResolution);
  };

  //freeconvert methods
  const createImportTask = async (uploadedFile) => {
    try {
      const response = await service.post("import/upload", {}, true);
      const { data } = response;
      const url = data.result.form.url;
      const serverParams = data.result.form.parameters;
      const importId = data.id;
      console.log(url, serverParams, importId);
      // setProgress((progress) => progress + 25);
      uploadedFile.name = `Riverside_${new Date().getTime()}.mp4`;
      uploadFile(uploadedFile, url, serverParams, importId);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const uploadFile = async (
    uploadedFile,
    serverUploadURL,
    serverParams,
    importId
  ) => {
    try {
      const form = new FormData();
      const { expires, size_limit, max_file_count, signature } = serverParams;
      form.append("file", uploadedFile);
      form.append("expires", expires);
      form.append("size_limit", size_limit);
      form.append("max_file_count", max_file_count);
      form.append("signature", signature);

      const response = await service.post(serverUploadURL, form, false, true);
      const { data } = response;
      if (data && data.msg === "ok") {
        console.log("data.msg: ", data.msg);
        // setProgress((progress) => progress + 25);
        createConvertTask(importId);
      } else {
        console.log("data: ", data);
        // setLoading(false);
        // setShowErrorMessage(true);
        // setMessage("");
        // setErrorMessage("failed to upload file");
      }
    } catch (error) {
      console.log("error: ", error);
      // setLoading(false);
      // setShowErrorMessage(true);
      // setMessage("");
      // setErrorMessage("failed to upload file");
    }
  };

  const createConvertTask = async (importId) => {
    try {
      const postData = {
        input: importId,
        input_format: "mp4",
        output_format: "mp4",
        options: {
          quality: 100,
        },
      };
      // setMessage(animatedText("Converting file"));
      const response = await service.post("convert", postData, true);
      const { data } = response;
      if (data && data.id) {
        console.log("data.id: ", data.id);
        // setProgress((progress) => progress + 25);
        watchTask(data.id);
      } else {
        console.log("data: ", data);
        // setLoading(false);
        // setShowErrorMessage(true);
        // setMessage("");
        // setErrorMessage("failed to convert file");
      }
    } catch (error) {
      console.log("error: ", error);
      // setShowErrorMessage(true);
      // setMessage("");
      // setErrorMessage("failed to convert file");
      // setLoading(false);
    }
  };

  const watchTask = (taskId) => {
    const interval = setInterval(async () => {
      try {
        const response = await service.get(`tasks/${taskId}`, true);
        const { data } = response;
        if (data && data.status === "completed") {
          clearInterval(interval);
          // setMessage("Download your MP3 file.");
          // setOutputUrl(data.result.url);
          console.log("data.result.url: ", data.result.url);
          // setLoading(false);
          // setProgress(100);
        } else if (!data) {
          alert("error");
          // clearInterval(interval);
          // setLoading(false);
          // setShowErrorMessage(true);
          // setMessage("");
          // setErrorMessage("failed to convert file");
        } else {
          // if (progress < 95) {
          //   setProgress((progress) => progress + 5);
          // }
        }
      } catch (error) {
        console.log("error: ", error);
        // clearInterval(interval);
        // setLoading(false);
        // setShowErrorMessage(true);
        // setMessage("");
        // setErrorMessage("failed to convert file");
      }
    }, 5000);
  };

  const changeResolution = async (res) => {
    setVideoResolution(res);
    setupStream(videoDeviceId, audioDeviceId, res);
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
        audioDeviceId={audioDeviceId}
        startRecording={startRecording}
        setVideoDeviceId={setVideoDeviceId}
        retake={onRetakeClick}
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
