import React, { useState } from "react";
import { Grid } from "@mui/material";
import Lottie from "react-lottie";

import { Title } from "../common/Title";
// import { WavToMp3 } from "../../icons/WavToMp3";
// import { DownloadMp3 } from "../../icons/DownloadMp3";
import { Upload } from "../../icons/Upload";
import { animatedText, delay } from "../../utils/Helpers";
import { convert } from "./partials/Converter";
import { AlertMessage } from "../common/AlertMessage";
import { useResponsiveQuery } from "../../utils/hooks/useResponsiveQuery";
import wavtomp3 from "../../utils/lottie-jsons/wavtomp3.json";
import wavtomp3completed from "../../utils/lottie-jsons/wavtomp3completed.json";

const AudioConverter = () => {
  const [outputUrl, setOutputUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [convertedAudio, setConvertedAudio] = useState({});

  const inputFormat = process.env.REACT_APP_AUDIO_INPUT_FORMAT || "wav";
  const outputFormat = process.env.REACT_APP_AUDIO_OUTPUT_FORMAT || "mp3";

  const isMobile = useResponsiveQuery();
  // const service = new Service();

  const createImportTask = async (uploadedFile) => {
    try {

      const interval = setInterval(() => {
        setProgress((progress) => {
          if (progress < 90) {
            return progress + 5;
          } else {
            clearInterval(interval);
            return progress;
          }
        });
      }, 100);
      const file = uploadedFile;
      let targetAudioFormat = outputFormat;
      let convertedAudioDataObj = await convert(file, targetAudioFormat);
      clearInterval(interval);
      setProgress(100);
      setMessage("File is ready.");
      await delay(1000);
      setMessage("Download your MP3 file.");
      setOutputUrl(convertedAudioDataObj.data);
      setConvertedAudio(convertedAudioDataObj);
      setLoading(false);
    } catch (error) {
      setErrorMessage("Failed to import file");
      setShowErrorMessage(true);
      setMessage("");
      setLoading(false);
    }
  };

  const handleSnackBarClose = () => {
    setErrorMessage("");
    setShowErrorMessage(false);
  };

  const exportFile = () => {
    // window.location.href = outputUrl;
    let elem = document.createElement("a");
    elem.href = convertedAudio.data;
    elem.download = convertedAudio.name + "." + convertedAudio.format;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  };

  const handleFileChange = (file) => {
    const fileExtenstion = file.name.split(".").pop();
    if (fileExtenstion === inputFormat) {
      setLoading(true);
      setMessage(animatedText("Converting file"));
      createImportTask(file);
    } else {
      setShowErrorMessage(true);
      setMessage("");
      setErrorMessage(`please select a ${inputFormat} file`);
    }
  };

  const renderIcon = () => {
    let defaultOptions = {
      loop: true,
      autoplay: true,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };
    if (loading) {
      defaultOptions.animationData = wavtomp3;
      return <Lottie options={defaultOptions} width={150} height={85} />;
      // return <WavToMp3 sx={{ width: "212px", height: "46px" }} />;
    } else if (outputUrl) {
      defaultOptions.loop = false;
      defaultOptions.animationData = wavtomp3completed;
      return <Lottie options={defaultOptions} width={100} height={85} />;
      // return <DownloadMp3 sx={{ width: "71px", height: "49px" }} />;
    } else {
      return <Upload />;
    }
  };

  const cancelTask = () => {
    window.location.reload();
  };

  return (
    <Grid>
      <Title
        title="WAV to MP3"
        subtitle="Easily Convert WAV to MP3 for Free"
        highlightedWordIndex={3}
        isMobile={isMobile}
        inputFormat={`.${inputFormat}`}
        onFileSelect={handleFileChange}
        message={message}
        progress={progress}
        outputUrl={outputUrl}
        exportFile={exportFile}
        icon={renderIcon()}
        cancelTask={cancelTask}
      />
      <AlertMessage
        open={showErrorMessage}
        onClose={handleSnackBarClose}
        message={errorMessage}
      />
    </Grid>
  );
};

export default AudioConverter;
