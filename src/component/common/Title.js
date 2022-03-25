import React from "react";
import { Grid } from "@mui/material";

import { MobileTitle } from "./partials/MobileTitle";
import { WebTitle } from "./partials/WebTitle";
import { FileUpload } from "./FileUpload";
import { Progress } from "../converter/partials/Progress";
import { useTitleStyles } from "./styles/Styles";

export const Title = (props) => {
  const {
    title,
    subtitle,
    highlightedWordIndex,
    isMobile,
    onFileSelect,
    message,
    inputFormat,
    icon,
    progress,
    exportFile,
    outputUrl,
    cancelTask,
    hideTitle,
    isTranscription = false,
  } = props;

  const styles = useTitleStyles();

  return (
    <Grid container className={styles.titleMain}>
      {isMobile ? (
        <MobileTitle
          title={title}
          subtitle={subtitle}
          highlightedWordIndex={highlightedWordIndex}
          isTranscription={isTranscription}
        />
      ) : (
        <WebTitle
          title={title}
          subtitle={subtitle}
          highlightedWordIndex={highlightedWordIndex}
          isTranscription={isTranscription}
        />
      )}
      {message ? (
        <Progress
          icon={icon}
          isMobile={isMobile}
          text={message}
          isProgress
          progress={progress}
          exportFile={exportFile}
          outputUrl={outputUrl}
          cancelTask={cancelTask}
        />
      ) : (
        <FileUpload
          isMobile={isMobile}
          onFileSelect={onFileSelect}
          text={message}
          inputFormat={inputFormat}
          icon={icon}
          hideTitle={isMobile ? false : hideTitle}
          isTranscription={isTranscription}
        />
      )}
    </Grid>
  );
};
