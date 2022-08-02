import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export const DropdownIcon = (props) => {
  return (
    <SvgIcon
      {...props}
      style={{ fill: props.fill || "none" }}
      viewBox={props.viewBox || "0 0 16 6"}
      width="16px"
      height="10px"
      // sx={{width: "12px", marginRight: "10px"}}
    >
      <path
        d="M1 1.5L8 8.5L15 1.5"
        stroke="#484C56"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgIcon>
  );
};
