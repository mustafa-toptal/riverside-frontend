import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export const Stop = (props) => {
  return (
    <SvgIcon
      {...props}
      style={{ fill: props.fill || "transparent" }}
      viewBox={props.viewBox || "0 0 40 40"}
      width="40"
      height="40"
    >
      <rect width="40" height="40" rx="10" fill="#232323" />
      <rect
        x="15"
        y="15"
        width="10.2116"
        height="10.2116"
        rx="1"
        fill="#FDFDFD"
      />
    </SvgIcon>
  );
};
