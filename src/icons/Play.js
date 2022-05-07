import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export const Play = (props) => {
  return (
    <SvgIcon
      {...props}
      style={{ fill: props.fill || "transparent" }}
      viewBox={props.viewBox || "0 0 16 18"}
      width="16"
      height="18"
    >
      <path
        d="M0.726562 1.7102L0.726562 16.2914C0.726562 17.4032 1.95227 18.0788 2.8962 17.4736L14.3643 10.183C15.2378 9.63413 15.2378 8.36743 14.3643 7.80445L2.8962 0.527949C1.95227 -0.0772526 0.726562 0.598322 0.726562 1.7102Z"
        fill={props.fill || "#FDFDFD"}
      />
    </SvgIcon>
  );
};
