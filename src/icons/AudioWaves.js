import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export const AudioWaves = (props) => {
  return (
    <SvgIcon
      {...props}
      style={{ fill: props.fill || "transparent" }}
      viewBox={props.viewBox || "0 0 52 38"}
      width="52"
      height="38"
    >
      <path
        d="M2 17V21"
        stroke="#F3F3F3"
        stroke-width="3"
        stroke-linecap="round"
      />
      <path
        d="M8 12L8 25.6364"
        stroke="#F3F3F3"
        stroke-width="3"
        stroke-linecap="round"
      />
      <path
        d="M14 2L14 36"
        stroke="#F3F3F3"
        stroke-width="3"
        stroke-linecap="round"
      />
      <path
        d="M20 9L20 28.0909"
        stroke="#F3F3F3"
        stroke-width="3"
        stroke-linecap="round"
      />
      <path
        d="M26 16L26 22"
        stroke="#F3F3F3"
        stroke-width="3"
        stroke-linecap="round"
      />
      <path
        d="M32 12L32 26"
        stroke="#F3F3F3"
        stroke-width="3"
        stroke-linecap="round"
      />
      <path
        d="M38 7L38 31"
        stroke="#F3F3F3"
        stroke-width="3"
        stroke-linecap="round"
      />
      <path
        d="M50 17V21"
        stroke="#F3F3F3"
        stroke-width="3"
        stroke-linecap="round"
      />
      <path
        d="M44 9L44 28.0909"
        stroke="#F3F3F3"
        stroke-width="3"
        stroke-linecap="round"
      />
    </SvgIcon>
  );
};
