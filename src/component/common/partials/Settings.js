import React from "react";
import { Box } from "@mui/material";

import { Setting } from "../../../icons/Setting";
import { Settings as SettingCommon } from "../Settings";

const Settings = (props) => {
  return (
    <Box
      sx={{
        color: "#000000",
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
        onClick={() => props.setSettings(true)}
      />
    </Box>
  );
};

export default Settings;
