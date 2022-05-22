import React from "react";
import { Box, Typography } from "@mui/material";

import { Close } from "../../icons/Cross";
import Slider from "./Slider";
import { isSafari } from "../../utils/Helpers";

export const Settings = (props) => {
  console.log("props.videoResolution: ", props.videoResolution);
  return (
    <>
      {props.open && (
        <Box
          sx={{
            width: "249px",
            height: props.isVideo ? "185px" : "162px",
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            filter: "drop-shadow(0px 4px 14px rgba(0, 0, 0, 0.15))",
            marginBottom: "9px",
            position: "absolute !important",

            left: "65%",
            top: props.audio
              ? "58%"
              : props.isVideo && !isSafari
              ? "61%"
              : props.isVideo && isSafari
              ? "50%"
              : "54%",
          }}
        >
          <Close
            sx={{
              height: "8px",
              width: "8px",
              float: "right",
              marginRight: "10px",
              marginTop: "10px",
              "&:hover": {
                cursor: "pointer",
              },
            }}
            onClick={() => props.openSettings(false)}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              overflow: props.isVideo ? "scroll" : "hidden",
              height: "inherit",
              overflowX: "hidden",
              "::-webkit-scrollbar": {
                width: "4px",
                display: "none",
              },
              "::-webkit-scrollbar-track": {
                // boxShadow: "inset 0 0 5px #FFFFFF",
                borderRadius: "10px",
              },
              "::-webkit-scrollbar-thumb": {
                background: "grey",
                borderRadius: "10px",
              },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: "14px",
                fontWeight: "800",
                lineHeight: "16.94px",
                marginTop: props.isVideo ? "8px" : "27px",
                marginLeft: "15px",
              }}
            >
              Settings
            </Typography>
            <Typography
              variant="h12"
              sx={{
                fontSize: "14px",
                fontWeight: "400",
                lineHeight: "16.94px",
                marginLeft: "15px",
                marginTop: "9px",
                "&:hover": {
                  cursor: "pointer",
                },
              }}
              onClick={() => window.location.reload()}
            >
              Change Recording Type
            </Typography>
            <Typography
              variant="h12"
              sx={{
                fontSize: "14px",
                fontWeight: "400",
                lineHeight: "16.94px",
                marginLeft: "15px",
                marginTop: "9px",
                "&:hover": {
                  cursor: "pointer",
                },
              }}
              onClick={props.changeRecordingType}
            >
              Change Microphone
            </Typography>

            {!props.isVideo && !props.isAudio && (
              <Typography
                variant="h12"
                sx={{
                  fontSize: "14px",
                  fontWeight: "400",
                  lineHeight: "16.94px",
                  marginLeft: "15px",
                  marginTop: "9px",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={props.changeScreenRecording}
              >
                Change Screen Recording
              </Typography>
            )}
            {props.isVideo && (
              <Box
                sx={{
                  marginLeft: "15px",
                  marginTop: "9px",
                  display: "flex",
                  flexDIrection: "row",
                  alignItems: "center",
                }}
              >
                <Slider
                  checked={props.checked}
                  onChange={(e) => {
                    props.setMirrorChecked(e.target.checked);
                  }}
                />
                <Typography
                  variant="h12"
                  sx={{
                    fontSize: "14px",
                    fontWeight: "400",
                    lineHeight: "16.94px",
                    marginLeft: "8px",
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                >
                  Mirror Webcam
                </Typography>
              </Box>
            )}
            {props.isVideo && (
              <Typography
                variant="h12"
                sx={{
                  fontSize: "14px",
                  fontWeight: props.videoResolution === "720P" ? "bold" : "400",
                  lineHeight: "16.94px",
                  marginLeft: "15px",
                  marginTop: "9px",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  if (props.videoResolution !== "720P") {
                    props.setVideoResolution("720P");
                  }
                }}
              >
                Change to 720p
              </Typography>
            )}
            {props.isVideo && (
              <Typography
                variant="h12"
                sx={{
                  fontSize: "14px",
                  fontWeight:
                    props.videoResolution === "1080P" ? "bold" : "400",
                  lineHeight: "16.94px",
                  marginLeft: "15px",
                  marginTop: "9px",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  if (props.videoResolution !== "1080P") {
                    props.setVideoResolution("1080P");
                  }
                }}
              >
                Change to 1080p
              </Typography>
            )}
            {props.isVideo && (
              <Typography
                variant="h12"
                sx={{
                  fontSize: "14px",
                  fontWeight: props.videoResolution === "4K" ? "bold" : "400",
                  lineHeight: "16.94px",
                  marginLeft: "15px",
                  marginTop: "9px",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  if (props.videoResolution !== "4K") {
                    props.setVideoResolution("4K");
                  }
                }}
              >
                Change to 4K
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Settings;
