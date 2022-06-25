import React from "react";
import { Box, Typography } from "@mui/material";

import { Close } from "../../icons/Cross";
import Slider from "./Slider";
import { isSafari } from "../../utils/Helpers";
import { useResponsiveQuery } from "../../utils/hooks/useResponsiveQuery";

export const Settings = (props) => {
  const isMobile = useResponsiveQuery();
  return (
    <>
      {props.open && (
        <Box
          sx={{
            width: "249px",
            maxHeight: props.isVideo ? "230px" : "162px",
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            filter: "drop-shadow(0px 4px 14px rgba(0, 0, 0, 0.15))",
            marginBottom: "9px",
            position: "absolute !important",
            bottom: "40px",
            right: "0",
            paddingBottom: "10px",
            ...(isMobile && {
              top: 0,
              bottom: "initial",
              color: "#000000",
            }),
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
              padding: "4px 16px",
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
                padding: "6px",
                marginTop: props.isVideo ? "8px" : "27px",
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
                padding: "6px",
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: "#d9d9d9",
                  borderRadius: "4px",
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
                padding: "6px",
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: "#d9d9d9",
                  borderRadius: "4px",
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
                  padding: "6px",
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "#d9d9d9",
                    borderRadius: "4px",
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
                  display: "flex",
                  flexDIrection: "row",
                  alignItems: "center",
                  padding: "6px",
                  "&:hover": {
                    backgroundColor: "#d9d9d9",
                    borderRadius: "4px",
                    cursor: "pointer",
                  },
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
                  padding: "6px",
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "#d9d9d9",
                    borderRadius: "4px",
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
                  padding: "6px",
                  fontWeight:
                    props.videoResolution === "1080P" ? "bold" : "400",
                  lineHeight: "16.94px",
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "#d9d9d9",
                    borderRadius: "4px",
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
                  padding: "6px",
                  fontWeight: props.videoResolution === "4K" ? "bold" : "400",
                  lineHeight: "16.94px",
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "#d9d9d9",
                    borderRadius: "4px",
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
