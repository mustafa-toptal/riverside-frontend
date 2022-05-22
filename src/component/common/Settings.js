import React from "react";
import { Box, Typography } from "@mui/material";

import { Close } from "../../icons/Cross";
import Slider from "./Slider";
import { isSafari } from "../../utils/Helpers";

export const Settings = (props) => {
  return (
    <>
      {props.open && (
        <Box
          sx={{
            width: "249px",
            height: "162px",
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            filter: "drop-shadow(0px 4px 14px rgba(0, 0, 0, 0.15))",
            marginBottom: "9px",
            position: "absolute !important",
            overflow: props.isVideo ? "scroll" : "hidden",
            overflowX: "hidden",
            "::-webkit-scrollbar": {
              width: "3px",
            },
            "::-webkit-scrollbar-track": {
              boxShadow: "inset 0 0 5px grey",
              borderRadius: "10px",
            },
            "::-webkit-scrollbar-thumb": {
              background: "#000000",
              borderRadius: "10px",
            },
            left: "65%",
            top: props.audio
              ? "58%"
              : props.isVideo && !isSafari
              ? "64%"
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
          <Box sx={{ display: "flex", flexDirection: "column" }}>
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
                  fontWeight: "400",
                  lineHeight: "16.94px",
                  marginLeft: "15px",
                  marginTop: "9px",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  props.setVideoResolution("720P");
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
                  fontWeight: "400",
                  lineHeight: "16.94px",
                  marginLeft: "15px",
                  marginTop: "9px",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  props.setVideoResolution("1080P");
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
                  fontWeight: "400",
                  lineHeight: "16.94px",
                  marginLeft: "15px",
                  marginTop: "9px",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  props.setVideoResolution("4K");
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
