import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export const Cross = (props) => {
  return (
    <SvgIcon
      {...props}
      style={{ fill: props.fill || "transparent" }}
      viewBox={props.viewBox || "0 0 14 14"}
      width="14"
      height="14"
    >
      <circle cx="7" cy="7" r="7" fill="#E2E2E2" />
      <path
        d="M9.5 4.5L4.5 9.5"
        stroke="#484C56"
        stroke-width="0.935065"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4.5 4.5L9.5 9.5"
        stroke="#484C56"
        stroke-width="0.935065"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgIcon>
  );
};

export const Close = (props) => {
  return (
    <SvgIcon
      {...props}
      style={{ fill: props.fill || "transparent" }}
      viewBox={props.viewBox || "0 0 11 12"}
      width="11"
      height="12"
    >
      <path
        d="M9.60015 1.53003L0.900146 10.23"
        stroke="#161C21"
        stroke-width="1.74"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M0.900146 1.53003L9.60015 10.23"
        stroke="#161C21"
        stroke-width="1.74"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgIcon>
  );
};
