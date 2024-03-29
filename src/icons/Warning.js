import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export const Warning = (props) => {
  return (
    <SvgIcon
      {...props}
      style={{ fill: props.fill || "transparent" }}
      viewBox={props.viewBox || "0 0 18 18"}
      width="18"
      height="18"
    >
      <path
        d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
        stroke={props.color || "white"}
        strokeWidth="1.58333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12H9.00875"
        stroke={props.color || "white"}
        strokeWidth="1.58333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 6V9"
        stroke={props.color || "white"}
        strokeWidth="1.58333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};
