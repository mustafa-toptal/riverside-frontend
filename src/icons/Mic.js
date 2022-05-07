import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export const Mic = (props) => {
  return (
    <SvgIcon
      {...props}
      style={{ fill: props.fill || "transparent" }}
      viewBox={props.viewBox || "0 0 14 22"}
      width="14"
      height="22"
    >
      <path
        d="M3.55273 20.0273H10.3605"
        stroke="#FDFDFD"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.95605 16.6235V20.0274"
        stroke="#FDFDFD"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.95574 1.30615C6.27867 1.30615 5.62932 1.57512 5.15056 2.05388C4.6718 2.53264 4.40283 3.18199 4.40283 3.85906V10.6668C4.40283 11.3439 4.6718 11.9932 5.15056 12.472C5.62932 12.9507 6.27867 13.2197 6.95574 13.2197C7.63281 13.2197 8.28215 12.9507 8.76092 12.472C9.23968 11.9932 9.50864 11.3439 9.50864 10.6668V3.85906C9.50864 3.18199 9.23968 2.53264 8.76092 2.05388C8.28215 1.57512 7.63281 1.30615 6.95574 1.30615V1.30615Z"
        stroke="#FDFDFD"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.9136 8.96484V10.6668C12.9136 12.2466 12.286 13.7618 11.1689 14.8789C10.0517 15.996 8.53662 16.6236 6.95678 16.6236C5.37694 16.6236 3.86181 15.996 2.7447 14.8789C1.62759 13.7618 1 12.2466 1 10.6668V8.96484"
        stroke="#FDFDFD"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};
