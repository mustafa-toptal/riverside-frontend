import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export const Check = (props) => {
  return (
    <SvgIcon
      {...props}
      style={{ fill: props.fill || "transparent" }}
      viewBox={props.viewBox || "0 0 19 19"}
      width="19"
      height="19"
    >
      <path
        d="M15.8334 4.75L7.12508 13.4583L3.16675 9.5"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgIcon>
  );
};
