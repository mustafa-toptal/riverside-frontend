import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export const Retake = (props) => {
  return (
    <SvgIcon
      {...props}
      style={{ fill: props.fill || "transparent" }}
      viewBox={props.viewBox || "0 0 17 17"}
      width="17"
      height="17"
    >
      <path
        d="M14.7228 11.1252C14.1701 12.6454 13.1073 13.927 11.7156 14.7515C10.324 15.5761 8.68944 15.8925 7.09058 15.647C5.49172 15.4015 4.02745 14.6093 2.94726 13.4052C1.86707 12.2011 1.23779 10.6597 1.16665 9.04368C1.09552 7.42765 1.58692 5.83695 2.55713 4.54261C3.52734 3.24827 4.91633 2.33038 6.48743 1.94533C8.05853 1.56029 9.71454 1.73192 11.1733 2.43097C12.632 3.13003 13.8033 4.31326 14.4874 5.77905"
        stroke="#F7F7F7"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M10.0903 5.4563L15.1027 6.43398L15.0766 1.32726"
        stroke="#F7F7F7"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgIcon>
  );
};
