/* eslint-disable react-hooks/exhaustive-deps */
import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

import { Service } from "../../utils/Service";
import { Title } from "../common/Title";
import { TranscriptionIcon } from "../../icons/TranscriptionIcon";
import { TranscriptionUpload } from "../../icons/TranscriptionUpload";
import { DownloadSrt } from "../../icons/DownloadSrt";
import { animatedText, delay } from "../../utils/Helpers";
import { Upload } from "../../icons/Upload";
import SelectDialog from "../common/SelectDialog";
import { AlertMessage } from "../common/AlertMessage";
import { useResponsiveQuery } from "../../utils/hooks/useResponsiveQuery";
import { deleteFile, uploadFile } from "../../utils/s3/ReactS3";

const S3_BUCKET = "riversidefm-backend";
const REGION = "eu-west-2";
const ACCESS_KEY = "AKIAVPGN2AWQAO4PRSES";
const SECRET_ACCESS_KEY = "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";

const Transcription = () => {
  const [id, setId] = useState("");
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTranscriptionDone, setIsTranscriptionDone] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [progress, setProgress] = useState(0);
  const [changeProgress, setChangeProgress] = useState(false);
  const [openSelector, setOpenSelector] = useState(false);

  const DELAY_IN_MILISECONDS = 1000;
  let uploadingInterval;

  const isMobile = useResponsiveQuery();

  const service = new Service();

  useEffect(() => {
    if (id !== "") {
      const interval = setInterval(() => {
        service
          .get("getTranscriptionStatusById/" + id)
          .then(async (res) => {
            if (res.data.status === "transcribed") {
              clearInterval(interval);
              setProgress(100);
              setMessage("File is ready.");
              await delay(DELAY_IN_MILISECONDS);
              setMessage("Download your podcast transcription.");
              setIsTranscriptionDone(true);
              setLoading(false);
            } else if (res.data.status === "failed") {
              clearInterval(interval);
              setMessage("");
              setShowErrorMessage(true);
              setErrorMessage("Failed to generate file");
            } else {
              setChangeProgress((prev) => !prev);
            }
          })
          .catch((err) => {
            clearInterval(interval);
            setMessage("");
            setShowErrorMessage(true);
            setErrorMessage("Failed to generate file");
          });
      }, 10000);
    }
  }, [id]);

  useEffect(() => {
    if (progress < 50) {
      setProgress((prev) => prev + 5);
    } else if (progress >= 50 && progress <= 75) {
      setProgress((prev) => prev + 3);
    } else if (progress > 75 && progress <= 95) {
      setProgress((prev) => prev + 2);
    }
  }, [changeProgress]);

  // useEffect(() => {
  //   // const socket = io("ws://localhost:8000");
  //   const socket = io(process.env.REACT_APP_SOCKET_CONNECTION);
  //   // const socket = io(
  //   //   "ws://ec2-18-133-197-246.eu-west-2.compute.amazonaws.com:8000"
  //   // );
  //   setSocket(socket);
  // }, []);

  const handleFileChange = (file) => {
    setFilename(file.name.split(".").join(""));
    const fileType = file.type;

    if (fileType.includes("video/") || fileType.includes("audio/")) {
      setLoading(true);
      setMessage("Uploading files");
      let fileUploadLocalProgress = 0;
      uploadingInterval = setInterval(() => {
        if (fileUploadLocalProgress < 50) {
          setProgress((prev) => prev + 5);
          fileUploadLocalProgress += 5;
        }
        if (fileUploadLocalProgress >= 50) {
          clearInterval(uploadingInterval);
        }
      }, 5000);
      const fileName = uuidv4() + file.name;
      const config = {
        bucketName: S3_BUCKET,
        region: REGION,
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY,
        name: fileName,
      };
      uploadFile(file, config)
        .then((data) => {
          const url = data.location;
          service
            .post("transcribe", { file: url })
            .then(async (res) => {
              if (res.data.id) {
                setId(res.data.id);
                setMessage("Files uploaded");
                await delay(DELAY_IN_MILISECONDS);
                deleteFile(fileName, config);
                clearInterval(uploadingInterval);
                setMessage(animatedText("Generating file"));
              }
            })
            .catch((err) => {
              clearInterval(uploadingInterval);
              setShowErrorMessage(true);
              setMessage("");
              setErrorMessage("Failed to upload file");
            });
        })
        .catch((err) => {
          clearInterval(uploadingInterval);
          setShowErrorMessage(true);
          setMessage("");
          setErrorMessage("Failed to upload file");
        });
    } else {
      setShowErrorMessage(true);
      setMessage("");
      setErrorMessage("Please select a valid file");
    }
  };

  const downloadSrt = () => {
    setOpenSelector(true);
  };

  const renderIcon = () => {
    if (loading) {
      return <TranscriptionIcon sx={{ width: "188px", height: "58px" }} />;
    } else if (isTranscriptionDone) {
      return <DownloadSrt sx={{ width: "71px", height: "49px" }} />;
    } else if (isMobile) {
      return <Upload />;
    } else {
      return <TranscriptionUpload sx={{ width: "66px", height: "64px" }} />;
    }
  };

  const handleSnackBarClose = () => {
    setShowErrorMessage(false);
    setErrorMessage("");
    setMessage("");
  };

  const cancelTask = async () => {
    if (id) {
      await service.delete(`deleteJob/${id}`);
      window.location.reload();
    }
  };

  const handleDiaglogSelect = (value) => {
    if (value) {
      service
        .get("getTranscriptionById/" + id + "?type=" + value)
        .then((res) => {
          // setTranscriptionData(res.data);
          const blob = new Blob([res.data], { type: "text/csv" });
          const elem = window.document.createElement("a");
          elem.href = window.URL.createObjectURL(blob);
          elem.download = `${filename}.${
            value === "transcript" ? "txt" : value
          }`;
          document.body.appendChild(elem);
          elem.click();
          document.body.removeChild(elem);
        })
        .catch((err) => {
          setMessage("");
          setShowErrorMessage(true);
          setErrorMessage("Failed to generate file");
        });
    }
    setOpenSelector(false);
  };

  return (
    <Grid>
      <Title
        title="Automatically Generate a Podcast Transcript"
        subtitle="Record studio-quality podcasts from anywhere, and convert the content to podcast transcripts in just one click."
        highlightedWordIndex={1}
        isMobile={isMobile}
        hideTitle
        onFileSelect={handleFileChange}
        inputFormat={"video/*,audio/*"}
        message={message}
        progress={progress}
        outputUrl={isTranscriptionDone}
        exportFile={downloadSrt}
        icon={renderIcon()}
        isTranscription
        cancelTask={cancelTask}
      />
      <AlertMessage
        open={showErrorMessage}
        onClose={handleSnackBarClose}
        message={errorMessage}
      />
      <SelectDialog
        open={openSelector}
        isMobile={isMobile}
        handleDiaglogSelect={handleDiaglogSelect}
      />
    </Grid>
  );
};

export default Transcription;
