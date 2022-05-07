import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export const Upload = (props) => {
  return (
    <SvgIcon
      {...props}
      style={{ fill: props.fill || "transparent" }}
      viewBox={props.viewBox || "0 0 24 20"}
      width="24"
      height="20"
    >
      <path
        d="M12 10V19"
        stroke="#1D1C21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.39 16.39C21.3653 15.8583 22.1358 15.0169 22.5798 13.9986C23.0239 12.9804 23.1162 11.8432 22.8422 10.7667C22.5682 9.69013 21.9434 8.7355 21.0666 8.05343C20.1898 7.37137 19.1108 7.00072 18 6.99998H16.74C16.4373 5.82923 15.8731 4.74232 15.0899 3.82098C14.3067 2.89964 13.3248 2.16783 12.2181 1.68059C11.1113 1.19335 9.90851 0.963343 8.70008 1.00787C7.49164 1.05239 6.30903 1.37028 5.24114 1.93765C4.17325 2.50501 3.24787 3.30709 2.53458 4.28357C1.82129 5.26004 1.33865 6.38552 1.12294 7.57538C0.90723 8.76524 0.964065 9.98851 1.28917 11.1532C1.61428 12.318 2.1992 13.3938 2.99996 14.3"
        stroke="#1D1C21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 14L12 10L8 14"
        stroke="#1D1C21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};
