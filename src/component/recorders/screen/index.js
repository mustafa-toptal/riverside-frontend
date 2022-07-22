import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

import Recorder from "../../common/Recorder";
import { Service } from "../../../utils/Service";
import { isSafari } from "../../../utils/Helpers";

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
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState("");
  const [isVideoDownloaded, setIsVideoDownlaoded] = useState(false);

  let recordedVideo = useRef(null);
  let videoRef = useRef(null);

  const service = new Service();

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
    const blob = await fetch(recordedVideo.current.src).then((r) => r.blob());
    createImportTask(blob);
  };

  const onRetakeClick = () => {
    props.retake();
    setIsPaused(false);
    setIsMuted(false);
    setIsRecording(false);
    setRecordingAvailabe(false);
  };

   //freeconvert methods
   const createImportTask = async (uploadedFile) => {
    const isSafariBrowser = isSafari;
    if (!isSafariBrowser) {
      if (isVideoDownloaded) {
        downloadVideo(outputUrl);
        return;
      }
      try {
        const response = await service.post(
          "import/upload",
          { filename: `Riverside_${new Date().getTime()}.mp4` },
          true
        );
        const { data } = response;
        const url = data.result.form.url;
        const serverParams = data.result.form.parameters;
        const importId = data.id;
        console.log(url, serverParams, importId);
        setProgress((progress) => progress + 25);

        uploadFile(uploadedFile, url, serverParams, importId);
      } catch (error) {
        downloadVideo();
      }
    } else {
      downloadVideo();
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
      const file = new File(
        [uploadedFile],
        `Riverside_${new Date().getTime()}.mp4`,
        { type: "video/mp4", lastModified: new Date() }
      );
      form.append("file", file);
      form.append("expires", expires);
      form.append("size_limit", size_limit);
      form.append("max_file_count", max_file_count);
      form.append("signature", signature);

      const response = await service.post(serverUploadURL, form, false, true);
      const { data } = response;
      if (data && data.msg === "ok") {
        console.log("data.msg: ", data.msg);
        setProgress((progress) => progress + 25);
        createConvertTask(importId);
      } else {
        console.log("data: ", data);
        downloadVideo();
      }
    } catch (error) {
      console.log("error: ", error);
      downloadVideo();
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
        setProgress((progress) => progress + 25);
        watchTask(data.id);
      } else {
        console.log("data: ", data);
        downloadVideo();
      }
    } catch (error) {
      console.log("error: ", error);
      downloadVideo();
    }
  };

  const watchTask = (taskId) => {
    const interval = setInterval(async () => {
      try {
        const response = await service.get(`tasks/${taskId}`, true);
        const { data } = response;
        if (data && data.status === "completed") {
          clearInterval(interval);
          setOutputUrl(data.result.url);
          setIsVideoDownlaoded(true);
          let elem = document.createElement("a");
          elem.href = data.result.url;
          elem.download = `Riverside_${new Date().getTime()}.mp4`;
          document.body.appendChild(elem);
          elem.click();
          document.body.removeChild(elem);
          // setLoading(false);
          setProgress(100);
        } else if (!data) {
          clearInterval(interval);
          downloadVideo();
        } else {
          if (progress < 95) {
            setProgress((progress) => progress + 5);
          }
        }
      } catch (error) {
        console.log("error: ", error);
        clearInterval(interval);
        downloadVideo();
      }
    }, 5000);
  };

  const downloadVideo = (outputUrl) => {
    setProgress(100);
    let elem = document.createElement("a");
    elem.href = outputUrl ? outputUrl : recordedVideo.current.src;
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
        progress={progress}
        showDownloadProgress={true}
      />
    </Box>
  );
};
