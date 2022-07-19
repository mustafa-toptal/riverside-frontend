import React from "react";
import { Grid, Typography } from "@mui/material";

import { renderTitle } from "../../../utils/Helpers";
import { useTitleStyles } from "../styles/Styles";
import { useResponsiveQuery } from "../../../utils/hooks/useResponsiveQuery";

export const WebTitle = (props) => {
  const {
    title,
    subtitle,
    highlightedWordIndex,
    isTranscription,
    subtitleStyles = {},
    isCompressor = false,
    ...restProps
  } = props;
  const styles = useTitleStyles();
  const isMobile = useResponsiveQuery();
  
  let titleStyles = {};
  if (isCompressor) {
    titleStyles.fontWeight = "900 !important";
  }

  return (
    <Grid container className={styles.titleWrapper} {...restProps}>
      <Typography
        className={isMobile ? styles.mobileTitle : styles.webTitle}
        sx={{ ...titleStyles }}
      >
        {renderTitle(title, highlightedWordIndex)}
      </Typography>
      <Typography
        variant="h6"
        className={
          !isTranscription
            ? styles.webSubtitle
            : styles.webTranscriptionSubtitle
        }
        sx={{ ...subtitleStyles }}
      >
        {subtitle}
      </Typography>
    </Grid>
  );
};
