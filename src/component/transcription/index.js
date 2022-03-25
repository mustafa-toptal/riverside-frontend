/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Grid, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import { Service } from "../../utils/Service";
import { Title } from "../common/Title";
import { TranscriptionIcon } from "../../icons/TranscriptionIcon";
import { TranscriptionUpload } from "../../icons/TranscriptionUpload";
import { DownloadSrt } from "../../icons/DownloadSrt";
import { animatedText } from "../../utils/Helpers";
import { Upload } from "../../icons/Upload";
import SelectDialog from "../common/SelectDialog";

const Transcription = () => {
  const [id, setId] = useState("");
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTranscriptionDone, setIsTranscriptionDone] = useState(false);
  // const [transcriptionData, setTranscriptionData] = useState({});
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [progress, setProgress] = useState(0);
  const [changeProgress, setChangeProgress] = useState(false);
  const [openSelector, setOpenSelector] = useState(false);

  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  const service = new Service();

  useEffect(() => {
    if (id !== "") {
      const interval = setInterval(() => {
        service
          .get("getTranscriptionStatusById/" + id)
          .then((res) => {
            if (res.data.status === "transcribed") {
              clearInterval(interval);
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

  useEffect(() => {
    if (isTranscriptionDone) {
      // service
      //   .get("getTranscriptionById/" + id)
      //   .then((res) => {
      //     setTranscriptionData(res.data);
      //     setLoading(false);
      //     setProgress(100);
      //     setId("");
      //     setIsTranscriptionDone(false);
      //   })
      //   .catch((err) => {
      //     setMessage("");
      //     setShowErrorMessage(true);
      //     setErrorMessage("Failed to generate file");
      //   });
    }
  }, [isTranscriptionDone]);

  const handleFileChange = (file) => {
    setFilename(file.name.split(".").join(""));
    const fileType = file.type;
    console.log("fileType: ", fileType);
    if (fileType.includes("video/") || fileType.includes("audio/")) {
      const form = new FormData();
      setLoading(true);
      setMessage("Uploading files");
      form.append("file", file);
      service
        .post("transcribe", form)
        .then((res) => {
          setId(res.data.id);
          setMessage(animatedText("Generating file"));
          setProgress((prev) => prev + 10);
        })
        .catch((err) => {
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
    // let text = "";
    // transcriptionData.subtitles.map((subtitle, index) => {
    //   text += index + 1;
    //   text += "\n";
    //   text += subtitle.startTime + " --> " + subtitle.endTime;
    //   text += "\n";
    //   text += subtitle.text.trim();
    //   text += "\n";
    //   text += "\n";
    // });
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
    console.log("value: ", value);
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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={showErrorMessage}
        onClose={handleSnackBarClose}
        autoHideDuration={5000}
      >
        <Alert severity="error">{errorMessage}!</Alert>
      </Snackbar>
      <SelectDialog
        open={openSelector}
        isMobile={isMobile}
        handleDiaglogSelect={handleDiaglogSelect}
      />
    </Grid>
  );
};

export default Transcription;
