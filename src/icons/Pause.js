import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export const Pause = (props) => {
  return (
    <SvgIcon
      {...props}
      style={{ fill: props.fill || "transparent" }}
      viewBox={props.viewBox || "0 0 40 40"}
      width="40"
      height="40"
    >
      <rect width="40" height="40" rx="10" fill="#232323" />
      <rect x="15" y="15" width="4" height="10" rx="1" fill="#FDFDFD" />
      <rect x="21" y="15" width="4" height="10" rx="1" fill="#FDFDFD" />
    </SvgIcon>
  );
};
