import React, { useState } from "react";
import { Grid } from "@mui/material";
import Lottie from "react-lottie";

import { Title } from "../common/Title";
// import { WavToMp3 } from "../../icons/WavToMp3";
// import { DownloadMp3 } from "../../icons/DownloadMp3";
import { Upload } from "../../icons/Upload";
import { animatedText, delay } from "../../utils/Helpers";
// import { compress } from "./partials/Converter";
import { AlertMessage } from "../common/AlertMessage";
import { useResponsiveQuery } from "../../utils/hooks/useResponsiveQuery";
import wavtomp3 from "../../utils/lottie-jsons/wavtomp3.json";
import wavtomp3completed from "../../utils/lottie-jsons/wavtomp3completed.json";
import { Service } from "../../utils/Service";
import AdvanceOptions from "./AdvanceOptions";

const defaultOptions = {
  codec: "h264",
  method: "percent",
  compressValue: "60%",
  oldDevices: false,
  speed: "veryfast",
};

const Compressor = () => {
  const [outputUrl, setOutputUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [isSettingsApplied, setApplySettings] = useState(false);
  const [options, setOptions] = useState(defaultOptions);
  const [showSettingNotification, setShowSettingNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const isMobile = useResponsiveQuery();
  const service = new Service();

  const createImportTask = async (uploadedFile, fileExtenstion) => {
    try {
      const response = await service.post("import/upload", {}, true);
      const { data } = response;
      const url = data.result.form.url;
      const serverParams = data.result.form.parameters;
      const importId = data.id;
      setProgress((progress) => progress + 5);
      uploadFile(uploadedFile, url, serverParams, importId, fileExtenstion);
    } catch (error) {
      setErrorMessage("Failed to upload file");
      setShowErrorMessage(true);
      setMessage("");
      setLoading(false);
    }
  };

  const sanatizeFileName = (name) => {
    const nameArr = name.split(".");
    const ext = nameArr[nameArr.length - 1];
    return (name.replace(/[^a-zA-Z0-9 ]/g, '') + "." + ext).replaceAll(" ", "");
  }

  const uploadFile = async (
    uploadedFile,
    serverUploadURL,
    serverParams,
    importId,
    fileExtenstion
  ) => {
    try {
      const form = new FormData();
      const { expires, size_limit, max_file_count, signature } = serverParams;
      const file = new File(
        [uploadedFile],
        sanatizeFileName(uploadedFile.name),
        { type: uploadedFile.type, lastModified:uploadedFile.lastModified }
      );
      console.log(file)
      form.append("file", file);
      form.append("expires", expires);
      form.append("size_limit", size_limit);
      form.append("max_file_count", max_file_count);
      form.append("signature", signature);

      const response = await service.post(serverUploadURL, form, false, true);
      const { data } = response;
      if (data && data.msg === "ok") {
        setProgress((progress) => progress + 10);
        createConvertTask(importId, fileExtenstion);
      } else {
        setLoading(false);
        setShowErrorMessage(true);
        setMessage("");
        setErrorMessage("failed to upload file");
      }
    } catch (error) {
      setLoading(false);
      setShowErrorMessage(true);
      setMessage("");
      setErrorMessage("failed to upload file");
    }
  };

  const createConvertTask = async (importId, fileExtenstion) => {
    try {
      let postData = {
        input: importId,
        output_format: fileExtenstion,
        type: "video",
      };
      if (isSettingsApplied) {
        let compressorOptions = {
          video_codec: options.codec,
          isCompatibleWithOldDevices: options.oldDevices,
        };

        if (options.method === "percent") {
          compressorOptions.compress_video = "by_percentage";
          compressorOptions.video_compress_quality_percentage =
            options.compressValue;
        }

        if (options.method === "mb") {
          compressorOptions.compress_video = "by_size";
          compressorOptions.video_compress_max_filesize = options.compressValue;
        }

        if (options.method === "quality") {
          compressorOptions.compress_video = "by_video_quality";
          compressorOptions.video_compress_crf_x264 = options.compressValue;
          compressorOptions.video_compress_speed = options.speed;
        }
        postData.options = compressorOptions;
      } else {
        postData.options = {
          video_codec: "h264",
          compress_video: "by_percentage",
          video_compress_quality_percentage: "60%",
          isCompatibleWithOldDevices: false,
        };
      }
      setMessage(animatedText("Compressing file"));
      const response = await service.post("compress", postData, true);
      const { data } = response;
      if (data && data.id) {
        setProgress((progress) => progress + 5);
        watchTask(data.id);
      } else {
        setLoading(false);
        setShowErrorMessage(true);
        setMessage("");
        setErrorMessage("failed to compress file");
      }
    } catch (error) {
      setShowErrorMessage(true);
      setMessage("");
      setErrorMessage("failed to compress file");
      setLoading(false);
    }
  };

  const watchTask = (taskId) => {
    const interval = setInterval(async () => {
      try {
        const response = await service.get(`tasks/${taskId}`, true);
        const { data } = response;
        let localProgress = progress;
        if (data && data.status === "completed") {
          clearInterval(interval);
          setMessage("Download your compressed file.");
          setOutputUrl(data.result.url);
          setLoading(false);
          setProgress(100);
        } else if (!data || (data && data.status === "failed")) {
          clearInterval(interval);
          setLoading(false);
          setShowErrorMessage(true);
          setMessage("");
          setErrorMessage("failed to compress file");
        } else {
          if (localProgress < 95) {
            localProgress = localProgress + 5
            setProgress((progress) => progress + 5);
          }
        }
      } catch (error) {
        clearInterval(interval);
        setLoading(false);
        setShowErrorMessage(true);
        setMessage("");
        setErrorMessage("failed to compress file");
      }
    }, 5000);
  };

  const handleSnackBarClose = () => {
    setErrorMessage("");
    setShowErrorMessage(false);
    setShowSettingNotification(false);
    setNotificationMessage("");
  };

  const exportFile = () => {
    let elem = document.createElement("a");
    elem.href = outputUrl;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  };

  const handleFileChange = (file) => {
    if (file.type.includes("video/")) {
      const fileExtenstion = file.name.split(".").pop();
      setLoading(true);
      setMessage(animatedText("Compressing file"));
      createImportTask(file, fileExtenstion);
    } else {
      setShowErrorMessage(true);
      setMessage("");
      setErrorMessage(`please select a video file`);
    }
  };

  const renderIcon = () => {
    if (loading || outputUrl) {
      return <></>
    } else {
      return <Upload />;
    }
  };

  const cancelTask = () => {
    window.location.reload();
  };

  const resetOptions = () => {
    setOptions(defaultOptions);
    setShowSettingNotification(true);
    setNotificationMessage("Setting restored");
  };

  const applySettings = () => {
    setApplySettings(true);
    setShowSettingNotification(true);
    setNotificationMessage("Setting applied successfully");
  };

  return (
    <Grid
      sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <style>
        {`
        #root{
          overflow-y: scroll;
          overflow-x: hidden;
        }
        body{
          background-color: #F6F6F6
        }
        `}
      </style>
      <Title
        title="Video Compressor"
        subtitle="Free online video compressor to easily reduce video file size."
        highlightedWordIndex={3}
        isMobile={isMobile}
        onFileSelect={handleFileChange}
        message={message}
        progress={progress}
        outputUrl={outputUrl}
        exportFile={exportFile}
        icon={renderIcon()}
        cancelTask={cancelTask}
        subtitleStyles={{
          fontWeight: `400 !important`,
          fontSize: `${isMobile ? "18px" : "14px"} !important`,
          lineHeight: `${isMobile ? "28px" : "48px"} !important`,
        }}
        isCompressor={true}
      />
      <AdvanceOptions
        options={options}
        setOptions={setOptions}
        resetOptions={resetOptions}
        applySettings={applySettings}
      />
      <AlertMessage
        open={showErrorMessage}
        onClose={handleSnackBarClose}
        message={errorMessage}
      />
      <AlertMessage
        open={showSettingNotification}
        onClose={handleSnackBarClose}
        message={notificationMessage}
        isSuccess
      />
    </Grid>
  );
};

export default Compressor;
