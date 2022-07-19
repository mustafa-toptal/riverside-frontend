import React from "react";
import { Grid, Typography } from "@mui/material";

import { pxToRem, renderTitle } from "../../../utils/Helpers";
import { useTitleStyles } from "../styles/Styles";

export const MobileTitle = (props) => {
  const { title, subtitle, highlightedWordIndex, isTranscription, subtitleStyles={} , isCompressor = false } = props;
  const styles = useTitleStyles();

  let subStyles = {...subtitleStyles};
  let titleStyles = {};
  if(isCompressor){
    subStyles.width = "inherit !important"
    subStyles.marginTop = "20px !important"
    titleStyles.fontSize= "34px !important"
    titleStyles.fontWeight = "900 !important"
  }
  
  
  return (
    <Grid container className={styles.titleWrapper}>
      <Typography
        variant="h1"
        className={
          isTranscription ? styles.mobileTranscriptionTitle : styles.mobileTitle
        }
        sx = {{...titleStyles}}
      >
        {renderTitle(title, highlightedWordIndex)}
      </Typography>
      <Grid
        className={
          isTranscription
            ? styles.transcriptionSubtitleWrapper
            : styles.subTitleWrapper
        }
        sx = {isCompressor ? {width :"284px !important"} : {}}
      >
        <Typography
          variant="h6"
          className={
            isTranscription
              ? styles.mobileTranscrioptionSubtitle
              : styles.mobileSubtitle
          }
          sx = {{...subStyles}}
        >
          {subtitle}
        </Typography>
      </Grid>
    </Grid>
  );
};
