import React, { useState } from "react";
import { Grid } from "@mui/material";
import Lottie from "react-lottie";

import { Title } from "../common/Title";
// import { WavToMp3 } from "../../icons/WavToMp3";
// import { DownloadMp3 } from "../../icons/DownloadMp3";
import { Upload } from "../../icons/Upload";
import { animatedText, delay } from "../../utils/Helpers";
// import { convert } from "./partials/Converter";
import { AlertMessage } from "../common/AlertMessage";
import { useResponsiveQuery } from "../../utils/hooks/useResponsiveQuery";
import wavtomp3 from "../../utils/lottie-jsons/wavtomp3.json";
import wavtomp3completed from "../../utils/lottie-jsons/wavtomp3completed.json";

const Compressor = () => {
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
    console.log("uploadedFile: ", uploadedFile);
    try {
      // const response = await service.post("import/upload", {}, true);
      // const { data } = response;
      // const url = data.result.form.url;
      // const serverParams = data.result.form.parameters;
      // const importId = data.id;
      // setProgress((progress) => progress + 25);
      // uploadFile(uploadedFile, url, serverParams, importId);

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
      let convertedAudioDataObj = {};
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

  // const uploadFile = async (
  //   uploadedFile,
  //   serverUploadURL,
  //   serverParams,
  //   importId
  // ) => {
  //   try {
  //     const form = new FormData();
  //     const { expires, size_limit, max_file_count, signature } = serverParams;
  //     form.append("file", uploadedFile);
  //     form.append("expires", expires);
  //     form.append("size_limit", size_limit);
  //     form.append("max_file_count", max_file_count);
  //     form.append("signature", signature);

  //     const response = await service.post(serverUploadURL, form, false, true);
  //     const { data } = response;
  //     if (data && data.msg === "ok") {
  //       setProgress((progress) => progress + 25);
  //       createConvertTask(importId);
  //     } else {
  //       setLoading(false);
  //       setShowErrorMessage(true);
  //       setMessage("");
  //       setErrorMessage("failed to upload file");
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     setShowErrorMessage(true);
  //     setMessage("");
  //     setErrorMessage("failed to upload file");
  //   }
  // };

  // const createConvertTask = async (importId) => {
  //   try {
  //     const postData = {
  //       input: importId,
  //       input_format: inputFormat,
  //       output_format: outputFormat,
  //       options: {
  //         quality: 75,
  //       },
  //     };
  //     setMessage(animatedText("Converting file"));
  //     const response = await service.post("convert", postData, true);
  //     const { data } = response;
  //     if (data && data.id) {
  //       setProgress((progress) => progress + 25);
  //       watchTask(data.id);
  //     } else {
  //       setLoading(false);
  //       setShowErrorMessage(true);
  //       setMessage("");
  //       setErrorMessage("failed to convert file");
  //     }
  //   } catch (error) {
  //     setShowErrorMessage(true);
  //     setMessage("");
  //     setErrorMessage("failed to convert file");
  //     setLoading(false);
  //   }
  // };

  // const watchTask = (taskId) => {
  //   const interval = setInterval(async () => {
  //     try {
  //       const response = await service.get(`tasks/${taskId}`, true);
  //       const { data } = response;
  //       if (data && data.status === "completed") {
  //         clearInterval(interval);
  //         setMessage("Download your MP3 file.");
  //         setOutputUrl(data.result.url);
  //         setLoading(false);
  //         setProgress(100);
  //       } else if (!data) {
  //         clearInterval(interval);
  //         setLoading(false);
  //         setShowErrorMessage(true);
  //         setMessage("");
  //         setErrorMessage("failed to convert file");
  //       } else {
  //         if (progress < 95) {
  //           setProgress((progress) => progress + 5);
  //         }
  //       }
  //     } catch (error) {
  //       clearInterval(interval);
  //       setLoading(false);
  //       setShowErrorMessage(true);
  //       setMessage("");
  //       setErrorMessage("failed to convert file");
  //     }
  //   }, 5000);
  // };

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
        title="Video Compressor"
        subtitle="Free online video compressor to easily reduce the file size"
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

export default Compressor;
