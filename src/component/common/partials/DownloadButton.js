import React from "react";
import { Button, Grid, Typography } from "@mui/material";

import { Download } from "../../../icons/Download";
import { useFileUploadStyles } from "../styles/Styles";

export const DownloadButton = (props) => {
  
  const {
    onClick,
    customWrapperStyles = {},
    customButtonStyles = {},
    isCompressor = false,
    ...buttonProps
  } = props;
  const styles = useFileUploadStyles(isCompressor)();
  return (
    <Button
      type="primary"
      className={styles.downloadButton}
      onClick={onClick}
      sx={{ ...customButtonStyles }}
      {...buttonProps}
    >
      <Grid
        className={styles.buttonTextWrapper}
        sx={{ ...customWrapperStyles }}
      >
        <Download className={styles.downloadIcon} />
        <Typography variant="h6" className={styles.buttonText}>
          Download
        </Typography>
      </Grid>
    </Button>
  );
};
