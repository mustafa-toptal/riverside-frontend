import React from "react";
import { Grid, Typography } from "@mui/material";

import { renderTitle } from "../../../utils/Helpers";
import { useTitleStyles } from "../styles/Styles";

export const WebTitle = (props) => {
  const { title, subtitle, highlightedWordIndex, isTranscription } = props;
  const styles = useTitleStyles();

  return (
    <Grid container className={styles.titleWrapper}>
      <Typography variant="h1" className={styles.webTitle}>
        {renderTitle(title, highlightedWordIndex)}
      </Typography>
      <Typography
        variant="h6"
        className={
          !isTranscription
            ? styles.webSubtitle
            : styles.webTranscriptionSubtitle
        }
      >
        {subtitle}
      </Typography>
    </Grid>
  );
};
