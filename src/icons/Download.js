import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export const Download = (props) => {
  return (
    <SvgIcon
      {...props}
      style={{ fill: props.fill || "transparent" }}
      viewBox={props.viewBox || "0 0 13 13"}
      width="13px"
      height="13px"
    >
      <path
        d="M12.125 8.375V10.875C12.125 11.2065 11.9933 11.5245 11.7589 11.7589C11.5245 11.9933 11.2065 12.125 10.875 12.125H2.125C1.79348 12.125 1.47554 11.9933 1.24112 11.7589C1.0067 11.5245 0.875 11.2065 0.875 10.875V8.375"
        stroke="white"
        stroke-width="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3.375 5.25L6.5 8.375L9.625 5.25"
        stroke="white"
        stroke-width="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.5 8.375V0.875"
        stroke="white"
        stroke-width="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgIcon>
  );
};
