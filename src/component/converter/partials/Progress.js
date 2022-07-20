import React, { useEffect, useRef } from "react";
import { Grid, Typography, LinearProgress } from "@mui/material";

import { pxToRem } from "../../../utils/Helpers";
import { useFileUploadStyles } from "../../common/styles/Styles";
import { Cross } from "../../../icons/Cross";
import { DownloadButton } from "../../common/partials/DownloadButton";

export const Progress = (props) => {
  const {
    isMobile,
    icon,
    text,
    isProgress = false,
    progress,
    outputUrl,
    exportFile,
    cancelTask,
    hideTitle = false,
    dragEvent,
    isTranscription,
    isCompressor,
  } = props;

  const styles = useFileUploadStyles(isCompressor)();

  const dropRef = useRef();

  useEffect(() => {
    if (dragEvent === "enter") {
      dropRef.current.style.backgroundColor = isCompressor ? "rgba(225, 225, 225, 0.6)" :"#EBEEF6";
    } else if (dragEvent === "leave" || dragEvent === "drop") {
      dropRef.current.style.backgroundColor = "inherit";
    }
  }, [dragEvent]);

  const renderChooseFile = () => {
    return (
      <font
        color="#7d7aff"
        id="choose-file"
        style={{
          fontWeight: "bolder",
          cursor: "pointer",
        }}
      >
        Choose Files
      </font>
    );
  };

  const renderWebText = () => {
    return (
      <Grid
        className={styles.webTextWrapper}
        sx={{
          marginTop: !isMobile ? pxToRem(12.8) : 0,
        }}
      >
        <style>{`#choose-file:hover{text-decoration:underline}`}</style>
        <Typography variant="h6" className={styles.webText}>
          {text ? (
            text
          ) : (
            <>
              Upload files by dropping them in this window, OR{" "}
              {renderChooseFile()}
            </>
          )}
        </Typography>
      </Grid>
    );
  };
  const renderPhoneText = () => {
    return (
      <Typography variant="h6" className={styles.phoneText}>
        {text ? (
          text
        ) : (
          <>
            {renderChooseFile()} to{" "}
            {isTranscription
              ? "start uploading"
              : isCompressor
              ? "compress"
              : "convert"}
          </>
        )}
      </Typography>
    );
  };

  const renderUploadContent = () => {
    return (
      <React.Fragment>
        {icon}
        {!hideTitle ? (
          <Typography variant="h1" className={styles.uploadContent}>
            Drop files
          </Typography>
        ) : (
          <></>
        )}
        {isMobile ? renderPhoneText() : renderWebText()}
      </React.Fragment>
    );
  };

  const renderProgressContent = () => {
    return (
      <Grid container className={styles.progressContainer}>
        {icon}
        <Typography variant="h6" className={styles.progressText}>
          {text}
        </Typography>
        {!outputUrl ? (
          <Grid className={styles.rangeWrapper}>
            <LinearProgress
              variant="determinate"
              value={progress}
              className={styles.range}
            />
            <Cross className={styles.cancelIcon} onClick={cancelTask} />
          </Grid>
        ) : (
          <DownloadButton onClick={exportFile} isCompressor={isCompressor} />
        )}
      </Grid>
    );
  };

  return (
    <Grid
      className={!isMobile ? styles.webStyles : styles.mobileStyles}
      ref={dropRef}
    >
      {!isProgress ? renderUploadContent() : renderProgressContent()}
    </Grid>
  );
};
