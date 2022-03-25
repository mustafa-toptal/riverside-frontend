import React, { useState, useEffect, useRef } from "react";
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

const options = [
  { value: "transcript", label: ".txt" },
  { value: "srt", label: ".srt" },
  { value: "vtt", label: ".vtt" },
];

function ConfirmationDialogRaw(props) {
  const { onClose, value: valueProp, open, isMobile, ...other } = props;
  const [value, setValue] = useState(valueProp);

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
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          width: "80%",
          maxHeight: 430,
          borderRadius: "10px",
          height: "320px",
        },
      }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogContent dividers>
        <Box
          sx={{ float: "right", cursor: "pointer" }}
          onClick={() => onClose()}
        >
          <Close sx={{ height: "12px", width: "11px", position: "absolute" }} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: "30px",
              fontWeight: 800,
              lineHeight: "30px",
              alignSelf: "center",
            }}
          >
            Select File Type
          </Typography>
          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: isMobile ? "space-around" : "space-evenly",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            {options.map((option) => {
              return (
                <Box
                  sx={{
                    width: isMobile ? "70px" : "100px",
                    height: isMobile ? "80px" : "100px",
                    border:
                      option.value === value
                        ? `${isMobile ? "1.71" : "2"}px solid #9599FF`
                        : `${isMobile ? "0.85" : "2"}px solid #E4E4E4`,
                    borderRadius: `${isMobile ? "8.55" : "10"}px`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleChange(option.value)}
                >
                  {option.value === "transcript" && (
                    <Txt
                      sx={{
                        width: isMobile ? "40px" : "47px",
                        height: isMobile ? "65px" : "76px",
                      }}
                    />
                  )}
                  {option.value === "srt" && (
                    <Srt
                      sx={{
                        width: isMobile ? "40px" : "47px",
                        height: isMobile ? "65px" : "76px",
                      }}
                    />
                  )}
                  {option.value === "vtt" && (
                    <Vtt
                      sx={{
                        width: isMobile ? "40px" : "47px",
                        height: isMobile ? "65px" : "76px",
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Grid>
          <DownloadButton
            customButtonStyles={{ width: "190px !important" }}
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
          id="ringtone-menu"
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
