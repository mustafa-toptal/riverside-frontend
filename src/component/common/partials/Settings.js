import React from "react";
import { Box } from "@mui/material";

import { Setting } from "../../../icons/Setting";
import { Settings as SettingCommon } from "../Settings";
import { useResponsiveQuery } from "../../../utils/hooks/useResponsiveQuery";

const Settings = (props) => {
  const isMobile = useResponsiveQuery();
  return (
    <Box
      sx={{
        ...(isMobile && {
          position: "fixed",
          top: 0,
          right: "15px",
          marginTop: "10px",
          zIndex: 999999,
        }),
      }}
    >
      <Box
        sx={{
          color: isMobile ? "rgba(0,0,0,0)" : "#000000",
          position: "relative",
        }}
      >
        <SettingCommon
          openSettings={props.setSettings}
          open={props.openSettings}
          audio={props.isAudio}
          checked={props.checked}
          setMirrorChecked={props.setMirrorChecked}
          changeRecordingType={props.changeRecordingType}
          changeScreenRecording={props.retake}
          isVideo={props.isVideo}
          setVideoResolution={props.setVideoResolution}
          isAudio={props.isAudio}
          videoResolution={props.videoResolution}
        />
        <Setting
          sx={{
            width: "40px",
            height: "40px",
            marginLeft: props.marginLeft,
            "&:hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => props.setSettings(!props.openSettings)}
        />
      </Box>
    </Box>
  );
};

export default Settings;
