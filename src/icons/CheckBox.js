import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export const CheckBoxUnchecked = (props) => {
  return (
    <SvgIcon
      {...props}
      style={{ fill: props.fill || "none" }}
      viewBox={props.viewBox || "0 0 25 25"}
      width="25"
      height="25"
    >
      <rect
        x="0.5"
        y="0.5"
        width="24"
        height="24"
        rx="3.5"
        fill="white"
        stroke="#DBD9D9"
      />
    </SvgIcon>
  );
};

export const CheckBoxChecked = (props) => {
  return (
    <SvgIcon
      {...props}
      style={{ fill: props.fill || "none" }}
      viewBox={props.viewBox || "0 0 25 25"}
      width="25"
      height="25"
    >
      <rect width="25" height="25" rx="4" fill="#9599FF" />
      <path
        d="M18.3332 9L10.9998 16.3333L7.6665 13"
        stroke="white"
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgIcon>
  );
};
