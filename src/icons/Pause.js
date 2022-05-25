import React, { useState } from "react";
import SvgIcon from "@mui/material/SvgIcon";

export const Pause = (props) => {
  const [fillColor, setFillColor] = useState("#232323");
  return (
    <SvgIcon
      {...props}
      style={{ fill: props.fill || "transparent" }}
      viewBox={props.viewBox || "0 0 40 40"}
      width="40"
      height="40"
      onMouseOver={() => setFillColor("#656565")}
      onMouseLeave={() => setFillColor("#232323")}
    >
      <rect width="40" height="40" rx="10" fill={fillColor} />
      <rect x="15" y="15" width="4" height="10" rx="1" fill="#FDFDFD" />
      <rect x="21" y="15" width="4" height="10" rx="1" fill="#FDFDFD" />
    </SvgIcon>
  );
};
