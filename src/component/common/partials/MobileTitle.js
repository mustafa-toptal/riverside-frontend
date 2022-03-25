import React from "react";
import { Grid, Typography } from "@mui/material";

import { renderTitle } from "../../../utils/Helpers";
import { useTitleStyles } from "../styles/Styles";

export const MobileTitle = (props) => {
  const { title, subtitle, highlightedWordIndex, isTranscription } = props;
  const styles = useTitleStyles();

  return (
    <Grid container className={styles.titleWrapper}>
      <Typography
        variant="h1"
        className={
          isTranscription ? styles.mobileTranscriptionTitle : styles.mobileTitle
        }
      >
        {renderTitle(title, highlightedWordIndex)}
      </Typography>
      <Grid
        className={
          isTranscription
            ? styles.transcriptionSubtitleWrapper
            : styles.subTitleWrapper
        }
      >
        <Typography
          variant="h6"
          className={
            isTranscription
              ? styles.mobileTranscrioptionSubtitle
              : styles.mobileSubtitle
          }
        >
          {subtitle}
        </Typography>
      </Grid>
    </Grid>
  );
};
