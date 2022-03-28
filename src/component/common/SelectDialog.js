import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { DownloadButton } from "./partials/DownloadButton";
import { Txt } from "../../icons/Txt";
import { Srt } from "../../icons/Srt";
import { Vtt } from "../../icons/Vtt";
import { Close } from "../../icons/Cross";
import { useDialogStyles } from "./styles/Styles";
import { pxToRem } from "../../utils/Helpers";

const options = [
  { value: "transcript", label: ".txt" },
  { value: "srt", label: ".srt" },
  { value: "vtt", label: ".vtt" },
];

function ConfirmationDialogRaw(props) {
  const { onClose, value: valueProp, open, isMobile, ...other } = props;
  const [value, setValue] = useState(valueProp);
  const styles = useDialogStyles(isMobile)();
  useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (value) => {
    setValue(value);
  };

  return (
    <Dialog className={styles.dialog} maxWidth="xs" open={open} {...other}>
      <DialogContent dividers>
        <Box className={styles.contentWrapper}>
          <Box className={styles.dialogContent} onClick={() => onClose()}>
            <Close className={styles.closeIcon} />
          </Box>
          <Typography variant="h6" className={styles.header}>
            Select File Type
          </Typography>
          <Grid container className={styles.fileTypeContainer}>
            {options.map((option) => {
              return (
                <Box
                  sx={{
                    border:
                      option.value === value
                        ? `${isMobile ? "1.71" : "2"}px solid #9599FF`
                        : `${isMobile ? "0.85" : "2"}px solid #E4E4E4`,
                  }}
                  className={styles.fileTypes}
                  onClick={() => handleChange(option.value)}
                >
                  {option.value === "transcript" && (
                    <Txt className={styles.fileTypeIcon} />
                  )}
                  {option.value === "srt" && (
                    <Srt className={styles.fileTypeIcon} />
                  )}
                  {option.value === "vtt" && (
                    <Vtt className={styles.fileTypeIcon} />
                  )}
                </Box>
              );
            })}
          </Grid>
          <DownloadButton
            customButtonStyles={{ width: `${pxToRem(190)} !important` }}
            customWrapperStyles={{
              width: "60% !important",
              justifyContent: "space-around !important",
            }}
            onClick={handleOk}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};

export default function SelectDialog(props) {
  const { isMobile } = props;

  const [value, setValue] = useState("");

  const handleClose = (newValue) => {
    if (newValue) {
      setValue(newValue);
    }
    props.handleDiaglogSelect(newValue);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 360 }}>
      <List component="div" role="group">
        <ConfirmationDialogRaw
          id="filetype-menu"
          keepMounted
          open={props.open}
          onClose={handleClose}
          value={value}
          isMobile={isMobile}
        />
      </List>
    </Box>
  );
}
