import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export const Txt = (props) => {
  return (
    <SvgIcon
      {...props}
      style={{ fill: props.fill || "transparent" }}
      viewBox={props.viewBox || "0 0 47 75"}
      width="47"
      height="75"
    >
      {" "}
      <path
        d="M-4 3.24046C-4 1.4508 -2.5492 0 -0.759537 0L31.6451 0L37.0459 5.40077L42.4466 10.8015V51.8474C42.4466 53.6371 40.9958 55.0879 39.2062 55.0879H-0.759538C-2.5492 55.0879 -4 53.6371 -4 51.8474L-4 3.24046Z"
        fill="#F7F7F7"
      />
      <g filter="url(#filter0_d_148_1555)">
        <path
          d="M42.4468 10.8017H33.8056C32.6125 10.8017 31.6453 9.83446 31.6453 8.64136V0.00012207L42.4468 10.8017Z"
          fill="white"
        />
      </g>
      <rect
        x="0.320557"
        y="38.28"
        width="37.8054"
        height="10.8015"
        rx="2.16031"
        fill="#1B2127"
      />
      <path
        d="M13.0267 42.233V41.4609H16.6642V42.233H15.3083V45.89H14.3827V42.233H13.0267ZM18.1413 41.4609L19.0345 42.9704H19.0691L19.9666 41.4609H21.0241L19.6725 43.6755L21.0544 45.89H19.9774L19.0691 44.3783H19.0345L18.1262 45.89H17.0535L18.4398 43.6755L17.0795 41.4609H18.1413ZM21.448 42.233V41.4609H25.0856V42.233H23.7296V45.89H22.804V42.233H21.448Z"
        fill="white"
      />
      <path
        d="M2.60531 8.5132V7.39542H7.41842V8.5132H5.69171V13.09H4.3348V8.5132H2.60531ZM9.48367 7.39542L10.5236 9.19443H10.5681L11.6191 7.39542H13.1595L11.4412 10.2427L13.2152 13.09H11.6358L10.5681 11.2715H10.5236L9.45586 13.09H7.88764L9.65328 10.2427L7.93213 7.39542H9.48367ZM13.6851 8.5132V7.39542H18.4982V8.5132H16.7715V13.09H15.4146V8.5132H13.6851Z"
        fill="black"
      />
      <rect
        x="1.59644"
        y="17.3477"
        width="36.3739"
        height="2.23839"
        fill="#E2E2E2"
      />
      <rect
        x="1.59644"
        y="22.384"
        width="36.3739"
        height="2.23839"
        fill="#E2E2E2"
      />
      <rect x="2" y="27" width="36.3739" height="2.23839" fill="#E2E2E2" />
      <rect
        x="1.59644"
        y="32.4568"
        width="36.3739"
        height="2.23839"
        fill="#E2E2E2"
      />
      <path
        d="M7.91282 67.598V66.2727H14.8759V67.598H12.1784V75H10.6103V67.598H7.91282ZM17.5392 66.2727L19.4611 69.4688H19.5293L21.4597 66.2727H23.2623L20.5733 70.6364L23.3049 75H21.4725L19.5293 71.8253H19.4611L17.5179 75H15.6941L18.4512 70.6364L15.7282 66.2727H17.5392ZM24.1199 67.598V66.2727H31.0829V67.598H28.3855V75H26.8173V67.598H24.1199Z"
        fill="#484C56"
      />
      <defs>
        <filter
          id="filter0_d_148_1555"
          x="27.3246"
          y="0.00012207"
          width="19.4427"
          height="19.4427"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4.32062" />
          <feGaussianBlur stdDeviation="2.16031" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_148_1555"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_148_1555"
            result="shape"
          />
        </filter>
      </defs>
    </SvgIcon>
  );
};
