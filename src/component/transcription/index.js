/* eslint-disable react-hooks/exhaustive-deps */
import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Lottie from "react-lottie";

import { Service } from "../../utils/Service";
import { Title } from "../common/Title";
import { TranscriptionUpload } from "../../icons/TranscriptionUpload";
import {
  animatedText,
  delay,
  uploadFile,
  deleteFile,
} from "../../utils/Helpers";
import { Upload } from "../../icons/Upload";
import SelectDialog from "../common/SelectDialog";
import { AlertMessage } from "../common/AlertMessage";
import { useResponsiveQuery } from "../../utils/hooks/useResponsiveQuery";
import transcriptioncompleted from "../../utils/lottie-jsons/transcriptioncompleted.json";
import transcription from "../../utils/lottie-jsons/transcription.json";

// const S3_BUCKET = "riversidefm-backend";
// const REGION = "eu-west-2";
// const ACCESS_KEY = "AKIAVPGN2AWQAO4PRSES";
// const SECRET_ACCESS_KEY = "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";

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
              handleError("Failed to generate file", interval);
            } else {
              setChangeProgress((prev) => !prev);
            }
          })
          .catch((err) => {
            handleError("Failed to generate file", interval);
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

  const handleError = (errorMessage, uploadingInterval) => {
    if (uploadingInterval) {
      clearInterval(uploadingInterval);
    }
    setShowErrorMessage(true);
    setMessage("");
    setErrorMessage(errorMessage ? errorMessage : "Failed to upload file");
  };

  const handleFileChange = (file) => {
    setFilename(file.name.split(".").join(""));
    const fileType = file.type;

    if (fileType.includes("video/") || fileType.includes("audio/")) {
      setLoading(true);
      setMessage(animatedText("Uploading files"));
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
      service
        .get(`getPostURL/${fileName}`)
        .then((res) => {
          const { headers } = res.data;
          uploadFile(file, headers)
            .then(async () => {
              const {
                data: { url },
              } = await service.get(`getMediaURL/${fileName}`);
              service
                .post("transcribe", { file: url })
                .then(async (res) => {
                  if (res.data.id) {
                    setId(res.data.id);
                    setMessage("File uploaded");
                    await delay(DELAY_IN_MILISECONDS);
                    service.delete(`deleteMediaS3/${fileName}`).then((res) => {
                      deleteFile(res.data.headers);
                    });
                    clearInterval(uploadingInterval);
                    setMessage(animatedText("Generating file"));
                  }
                })
                .catch((err) => {
                  handleError(undefined, uploadingInterval);
                });
            })
            .catch((err) => {
              handleError(undefined, uploadingInterval);
            });
        })
        .catch((err) => {
          handleError(undefined, uploadingInterval);
        });
    } else {
      handleError("Please select a valid file");
    }
  };

  const downloadSrt = () => {
    setOpenSelector(true);
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
      defaultOptions.animationData = transcription;
      return <Lottie options={defaultOptions} width={200} height={85} />;
     } else if (isTranscriptionDone) {
      defaultOptions.loop = false;
      defaultOptions.animationData = transcriptioncompleted;
      return <Lottie options={defaultOptions} width={180} height={85} />;
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
    }
    window.location.reload();
  };

  const handleDiaglogSelect = (value) => {
    if (value) {
      service
        .get("getTranscriptionById/" + id + "?type=" + value)
        .then((res) => {
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
          handleError("Failed to generate file");
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
