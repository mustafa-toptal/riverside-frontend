import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export const Camera = (props) => {
  return (
    <SvgIcon
      {...props}
      style={{ fill: props.fill || "transparent" }}
      viewBox={props.viewBox || "0 0 21 15"}
      width="21"
      height="15"
    >
      <path
        d="M19.7224 2.83789L13.7656 7.09273L19.7224 11.3476V2.83789Z"
        stroke="#FDFDFD"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.0626 1.13525H2.70194C1.76198 1.13525 1 1.89724 1 2.83719V11.3469C1 12.2868 1.76198 13.0488 2.70194 13.0488H12.0626C13.0025 13.0488 13.7645 12.2868 13.7645 11.3469V2.83719C13.7645 1.89724 13.0025 1.13525 12.0626 1.13525Z"
        stroke="#FDFDFD"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};
