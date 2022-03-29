import React from "react";
import { Box, Snackbar, SnackbarContent } from "@mui/material";

import { Warning } from "../../icons/Warning";
import { useResponsiveQuery } from "../../utils/hooks/useResponsiveQuery";
import { useAlertMessageStyles } from "./styles/Styles";

const AlertContent = (props) => {
  const { message, isMobile } = props;
  const styles = useAlertMessageStyles(isMobile)();

  return (
    <Box className={styles.message}>
      <Warning />
      {message}
    </Box>
  );
};

export const AlertMessage = (props) => {
  const { open, onClose, message } = props;
  const isMobile = useResponsiveQuery();
  const styles = useAlertMessageStyles(isMobile)();
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      onClose={onClose}
      autoHideDuration={5000}
      className={styles.snackbar}
    >
      <SnackbarContent
        className={styles.snackbarContent}
        message={<AlertContent message={message} isMobile={isMobile} />}
      />
    </Snackbar>
  );
};
